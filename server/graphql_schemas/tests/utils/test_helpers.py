"""Module that tests helper methods"""
from unittest.mock import patch
from graphql_schemas.utils.helpers import update_event_status_on_calendar, remove_event_from_all_calendars
from api.models import AndelaUserProfile
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
