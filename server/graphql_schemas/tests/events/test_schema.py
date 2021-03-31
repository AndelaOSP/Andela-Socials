from unittest.mock import Mock, patch
from graphql_relay import to_global_id
from .base import BaseEventTestCase
from ..events.base import create_user
from server.graphql_schemas.event.schema import CreateEvent


class CreateRecurrentEventTestCase(BaseEventTestCase):
    """
    Test create recurrent events on event creation

    """
    def test_create_recurrent_event(self):
        """Test that a user can't create an event successfully
        """
        query1 = f'''
        mutation createEvent{{
        createEvent(
            input: {{
            description: "Just be there",
            title:"Wilding",
            venue: "Central park",
            startDate: "2020-08-02T17:00:19.950122+00",
            endDate: "2020-08-02T17:30:19.950122+00"
                featuredImage: "whenTheySeeUs.img",
            categoryId: "{to_global_id("CategoryNode", self.category.id)}",
            timezone: "Africa/Kampala",
            frequency:Monthly,
            recurring:false,
            recurrenceEndDate: "2019-08-23T19:30:19.950122+00",
            addToCalendar: false
        }}
        ){{
            newEvent{{
            id
            title
            }}
        }}
        }}
        '''
        request = self.request
        authorized_calendar_user = create_user('test_user',
                                               calendar_authorized=True)
        request.user = authorized_calendar_user.user
        result = self.client.execute(query1, context_value=self.request)
        self.assertMatchSnapshot(result)
