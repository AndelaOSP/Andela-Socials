# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import Snapshot


snapshots = Snapshot()

snapshots['MutateEventTestCase::test_deactivate_event_as_admin 1'] = {
    'data': {
        'deactivateEvent': {
            'actionMessage': 'Event deactivated'
        }
    }
}

snapshots['MutateEventTestCase::test_deactivate_event_as_creator 1'] = {
    'data': {
        'deactivateEvent': {
            'actionMessage': 'Event deactivated'
        }
    }
}

snapshots['MutateEventTestCase::test_deactivate_event_as_non_creator 1'] = {
    'data': {
        'deactivateEvent': None
    },
    'errors': [
        {
            'locations': [
                {
                    'column': 17,
                    'line': 3
                }
            ],
            'message': "You aren't authorised to deactivate the event",
            'path': [
                'deactivateEvent'
            ]
        }
    ]
}

snapshots['MutateEventTestCase::test_query_updated_event 1'] = {
    'data': {
        'event': {
            'description': 'test description',
            'id': 'RXZlbnROb2RlOjE=',
            'title': 'test title'
        }
    }
}

snapshots['MutateEventTestCase::test_update_event_as_admin 1'] = {
    'data': {
        'updateEvent': {
            'actionMessage': 'Event Update is successful.',
            'updatedEvent': {
                'id': 'RXZlbnROb2RlOjE=',
                'time': '3PM',
                'title': "This is a test don't panic."
            }
        }
    }
}

snapshots['MutateEventTestCase::test_update_event_as_creator 1'] = {
    'data': {
        'updateEvent': {
            'actionMessage': 'Event Update is successful.',
            'updatedEvent': {
                'id': 'RXZlbnROb2RlOjE=',
                'time': '3PM',
                'title': 'Not really a party'
            }
        }
    }
}

snapshots['MutateEventTestCase::test_update_event_as_non_creator 1'] = {
    'data': {
        'updateEvent': None
    },
    'errors': [
        {
            'locations': [
                {
                    'column': 13,
                    'line': 3
                }
            ],
            'message': 'You are not authorized to edit this event.',
            'path': [
                'updateEvent'
            ]
        }
    ]
}
