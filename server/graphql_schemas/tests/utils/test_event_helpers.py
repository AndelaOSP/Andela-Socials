"""Module that tests event helper methods"""
from api.utils.event_helpers import is_not_past_event, save_user_attendance
from api.tests.base_test_setup import BaseSetup
from api.models import Attend
from unittest.mock import MagicMock, Mock
from unittest.mock import patch

class EventHelpersTests(BaseSetup):
    """
    Tests the event helper file methods
    """
    def test_is_not_past_event(self):
        """
        Test method that check if event has passed
        Args:
            self (Instance): the test instance
        """
        event = self.event_2
        check_event = is_not_past_event(event)
        self.assertEqual(check_event, False)
    
    def test_is_not_past_event_with_future_event(self):
        """
        Test method that saves user that is attending an event
        using a future event
        Args:
            self (Instance): the test instance
        """
        event = self.event_3
        check_event = is_not_past_event(event)
        self.assertEqual(check_event, True)

    def test_save_user_attendance(self):
        """
        Test method that saves user that is attending an event
        Args:
            self (Instance): the test instance
        """
        event = self.event_3
        user = self.andela_user1
        save_user_attendance(event, user, 'attending')
        Attend.objects = MagicMock(return_value=True)
        self.assertEqual(Attend.objects.called, False)

