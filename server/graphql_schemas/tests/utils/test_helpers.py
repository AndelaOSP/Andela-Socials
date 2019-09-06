"""Module that tests helper methods"""
from unittest.mock import patch
from graphql_schemas.utils.helpers import (
    update_event_status_on_calendar,
    remove_event_from_all_calendars,
    add_event_to_calendar
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
