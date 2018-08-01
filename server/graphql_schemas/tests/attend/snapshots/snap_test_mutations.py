# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import Snapshot


snapshots = Snapshot()

snapshots['AttendanceTestCase::test_nonexisting_user_cannot_subscribe_to_event 1'] = {
    'data': {
        'attendEvent': None
    },
    'errors': [
        {
            'locations': [
                {
                    'column': 13,
                    'line': 3
                }
            ],
            'message': 'AndelaUserProfile matching query does not exist.',
            'path': [
                'attendEvent'
            ]
        }
    ]
}

snapshots['AttendanceTestCase::test_user_can_subcribe_to_event 1'] = {
    'data': {
        'attendEvent': {
            'clientMutationId': 'rand',
            'newAttendance': {
                'event': {
                    'description': 'THis is a test event',
                    'featuredImage': 'https://cdn.elegantthemes.com/',
                    'socialEvent': {
                        'description': 'For people who want to be happy.',
                        'name': 'Swimming Meetup'
                    },
                    'title': 'Test',
                    'venue': 'Epic Tower'
                }
            }
        }
    }
}

snapshots['AttendanceTestCase::test_user_can_unsubscribe_from_event 1'] = {
    'data': {
        'unattendEvent': {
            'clientMutationId': 'rand',
            'unsubscribedEvent': {
                'event': {
                    'description': 'This is a test event',
                    'featuredImage': 'https://cdn.elegantthemes.com/',
                    'socialEvent': {
                        'description': 'For people who want to be happy.',
                        'name': 'Swimming Meetup'
                    },
                    'title': 'Test Event 2',
                    'venue': 'Epic Tower'
                }
            }
        }
    }
}

snapshots['AttendanceTestCase::test_user_cannot_subscribe_to_event_twice 1'] = {
    'data': {
        'attendEvent': None
    },
    'errors': [
        {
            'locations': [
                {
                    'column': 13,
                    'line': 3
                }
            ],
            'message': 'The user is already subscribed to the event',
            'path': [
                'attendEvent'
            ]
        }
    ]
}

snapshots['AttendanceTestCase::test_user_cannot_subscribe_to_nonexisting_event 1'] = {
    'data': {
        'attendEvent': None
    },
    'errors': [
        {
            'locations': [
                {
                    'column': 13,
                    'line': 3
                }
            ],
            'message': 'Event matching query does not exist.',
            'path': [
                'attendEvent'
            ]
        }
    ]
}

snapshots['AttendanceTestCase::test_user_cannot_unsubscribe_from_event_they_did_not_attend 1'] = {
    'data': {
        'unattendEvent': None
    },
    'errors': [
        {
            'locations': [
                {
                    'column': 13,
                    'line': 3
                }
            ],
            'message': 'The User testuser, has not subscribed to this event',
            'path': [
                'unattendEvent'
            ]
        }
    ]
}
