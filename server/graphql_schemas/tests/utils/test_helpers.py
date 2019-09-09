"""Module that tests helper methods"""

from tempfile import NamedTemporaryFile
from unittest.mock import patch
import datetime

from django.core.exceptions import ValidationError

from graphql_schemas.utils.helpers import (
    update_event_status_on_calendar,
    remove_event_from_all_calendars,
    validate_image,
    add_event_to_calendar,
    normalize_dates
)
from api.tests.base_test_setup import BaseSetup


class HelperTests(BaseSetup):
    """
    Tests the helper functions and methods
    """

    def test_update_event_status_on_calendar(self):
        """
        Test method that update the event status on calendar
        Args:
            self (Instance): HelperTests instance
        """
        mock_build_patcher = patch('graphql_schemas.utils.helpers.build')
        user, event = self.andela_user1, self.event_1
        mock_build = mock_build_patcher.start()
        mock_build.return_value.events.return_value.get.return_value.execute.return_value = {
            'attendees': [
                {'email': user.user.email}
            ]
        }
        mock_build.return_value.events.return_value.patch.return_value.execute.return_value = 'event updated'
        update_event_status_on_calendar(user, event)
        self.assertEqual(mock_build.called, True)
        self.assertEqual(mock_build.return_value.events.return_value.patch.called, True)
        self.assertEqual(mock_build.return_value.events.return_value.get.called, True)
        self.assertEqual(mock_build.call_count, 2)
        mock_build_patcher.stop()

    def test_udpate_event_status_if_there_are_no_attendees(self):
        """
        Test that event status on calendars is updated
        if there are no initial attendees for the event
        """

        mock_build_patcher = patch('graphql_schemas.utils.helpers.build')
        user, event = self.andela_user1, self.event_1
        mock_build = mock_build_patcher.start()
        # the mocked return value does not have the `attendees` list
        mock_build.return_value.events.return_value.get.return_value.execute.return_value = {}
        mock_build.return_value.events.return_value.patch.return_value.execute.return_value = 'event updated'
        update_event_status_on_calendar(user, event)
        self.assertEqual(mock_build.called, True)
        self.assertEqual(mock_build.return_value.events.return_value.patch.called, True)
        self.assertEqual(mock_build.return_value.events.return_value.get.called, True)
        self.assertEqual(mock_build.call_count, 2)
        mock_build_patcher.stop()

    def test_remove_event_from_all_calendar(self):
        """
        Test method that update the event status on calendar
        Args:
            self (Instance): HelperTests instance
        """
        mock_build_patcher = patch('graphql_schemas.utils.helpers.build')
        user, event = self.andela_user1, self.event_1
        mock_build = mock_build_patcher.start()
        mock_build.return_value.events.return_value.delete.return_value.execute.return_value = 'event deleted'
        remove_event_from_all_calendars(user, event)
        self.assertEqual(mock_build.called, True)
        self.assertEqual(mock_build.return_value.events.return_value.delete.called, True)
        self.assertEqual(mock_build.call_count, 1)
        mock_build_patcher.stop()

    def test_add_event_to_calendar(self):
        """
        Test that users can successfully add events to the calendar
        """

        mock_build_patcher = patch('graphql_schemas.utils.helpers.build')
        user, event = self.andela_user1, self.event_1
        mock_build = mock_build_patcher.start()
        mock_build.return_value.events.return_value.insert.return_value.execute.return_value = {
            'id': 1
        }
        add_event_to_calendar(user, event)

        self.assertEqual(mock_build.called, True)
        self.assertEqual(
            mock_build.return_value.events.return_value.insert.called, True)
        self.assertEqual(mock_build.call_count, 1)
        self.assertEqual(event.event_id_in_calendar, 1)
        mock_build_patcher.stop()

    def test_validate_image_passes_for_valid_image(self):
        """
        Test method that validates images are valid before uploading
        """
        valid_image = NamedTemporaryFile(suffix=".jpg")
        valid_image.size = 200  # less than limit of 2.0 MB
        res = validate_image(valid_image)
        # the function returns nothing if the image file is valid
        self.assertEqual(res, None)

    def test_validate_image_fails_for_large_images(self):
        """
        Test that image validation should fail if the file size
        exceeds the set limit
        """
        large_image = NamedTemporaryFile(suffix=".jpg")
        large_image.size = 900000000000000000
        with self.assertRaises(ValidationError) as e:
            validate_image(large_image)

        self.assertEqual(e.exception.message, "Max file size is 2.0MB")

    def test_validate_image_fails_for_invalid_image_formats(self):
        """
        Test that image validation fails if the file extension is
        not supported
        """

        invalid_image = NamedTemporaryFile(suffix=".invalid")
        invalid_image.size = 20
        with self.assertRaises(ValidationError) as e:
            validate_image(invalid_image)

        self.assertEquals(
            e.exception.message, "You can only upload image files")

    def test_normalize_dates_function_success(self):
        """
        Test that dates have to be in the present for them to be accepted
        """
        start_date = datetime.date.today()
        end_date = start_date + datetime.timedelta(days=1)

        result = normalize_dates(end_date, start_date, datetime.date.today())

        self.assertEqual(
            result, {'status': True, 'message': 'Validation successful'})

    def test_normalize_dates_function_if_end_date_invalid(self):
        """
        Test that the event must end in the future, after the event start date
        """
        start_date = datetime.date.today() + datetime.timedelta(days=2)
        end_date = datetime.date.today()

        result = normalize_dates(end_date, start_date, datetime.date.today())

        self.assertEqual(
            result, {
                'status': False,
                'message': 'Sorry, end date must be after start date'})
