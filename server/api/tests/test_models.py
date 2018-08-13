from contextlib import suppress
from django.core.exceptions import ValidationError


from api.models import (UserCategoryHistory, UserEventHistory)
from api.tests.base_test_setup import BaseSetup


class UserEventHistoryTests(BaseSetup):

    def test_user_create_event_history(self):

        with suppress(ValidationError):
            new_user_event_history = UserEventHistory.objects.create(
                andela_user_profile=self.andela_user1,
                event=self.event_1,
                user_event_action=UserEventHistory.CR
            )
            self.assertEqual(new_user_event_history.user_event_action, UserEventHistory.CR)
            self.assertEqual(new_user_event_history.event.id, self.event_1.id)
            self.assertEqual(new_user_event_history.andela_user_profile.id, self.user1.id)

    def test_user_create_event_history_not_successful_when_user_event_action_value_is_invalid(self):

        with suppress(ValidationError):
            new_user_event_history = UserEventHistory.objects.create(
                andela_user_profile=self.andela_user1,
                event=self.event_1,
                user_event_action='ADD'
            )
            self.assertEqual(new_user_event_history, None)

    def test_user_event_history_can_not_be_updated_with_invalid_user_event_action_value(self):

        with suppress(ValidationError):
            new_user_event_history = UserEventHistory.objects.create(
                andela_user_profile=self.andela_user1,
                event=self.event_1,
                user_event_action=UserEventHistory.CR
            )
            self.assertEqual(new_user_event_history.user_event_action, UserEventHistory.CR)
            self.assertEqual(new_user_event_history.event.id, self.event_1.id)
            self.assertEqual(new_user_event_history.andela_user_profile.id, self.user1.id)
            new_user_event_history.user_event_action = 'ADD'
            new_user_event_history.save()
            self.assertNotEqual(new_user_event_history.user_event_action, 'ADD')


class UserCategoryHistoryTests(BaseSetup):

    def test_user_create_category_history(self):
        with suppress(ValidationError):
            new_user_category_history = UserCategoryHistory.objects.create(
                andela_user_profile=self.andela_user1,
                category=self.category1,
                user_category_action=UserCategoryHistory.CR
            )
            self.assertEqual(new_user_category_history.user_category_action, UserCategoryHistory.CR)
            self.assertEqual(new_user_category_history.category.id, self.category1.id)
            self.assertEqual(new_user_category_history.andela_user_profile.id, self.user1.id)

    def test_user_create_category_history_not_successful_when_user_event_action_value_is_invalid(self):

        with suppress(ValidationError):
            new_user_category_history = UserCategoryHistory.objects.create(
                andela_user_profile=self.andela_user1,
                category=self.category1,
                user_category_action='ADD'
            )
            self.assertEqual(new_user_category_history, None)

    def test_user_category_history_can_not_be_updated_with_invalid_user_category_action_value(self):

        with suppress(ValidationError):
            new_user_category_history = UserCategoryHistory.objects.create(
                andela_user_profile=self.andela_user1,
                category=self.category1,
                user_category_action=UserCategoryHistory.CR
            )
            self.assertEqual(new_user_category_history.user_category_action, UserCategoryHistory.CR)
            self.assertEqual(new_user_category_history.category.id, self.category1.id)
            self.assertEqual(new_user_category_history.andela_user_profile.id, self.user1.id)
            new_user_category_history.user_category_action = 'ADD'
            new_user_category_history.save()
            self.assertNotEqual(new_user_category_history.user_category_action, 'ADD')



