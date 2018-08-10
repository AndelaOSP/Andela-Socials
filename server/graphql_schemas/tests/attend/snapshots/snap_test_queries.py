# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import Snapshot


snapshots = Snapshot()

snapshots['AttendanceTestCase::test_can_fetch_all_attendance 1'] = {
    'data': {
        'attendersList': {
            'edges': [
                {
                    'node': {
                        'event': {
                            'active': True,
                            'date': 'September 10, 2017',
                            'id': 'RXZlbnROb2RlOjI=',
                            'title': 'Test Event 2'
                        },
                        'id': 'QXR0ZW5kTm9kZTo5'
                    }
                }
            ]
        }
    }
}

snapshots['AttendanceTestCase::test_can_fetch_user_subscribed_event 1'] = {
    'data': {
        'subscribedEvents': [
            {
                'event': {
                    'date': 'September 10, 2017',
                    'id': 'RXZlbnROb2RlOjI=',
                    'time': '01:00pm WAT'
                },
                'id': 'QXR0ZW5kTm9kZToxMQ=='
            }
        ]
    }
}

snapshots['QueryEventTestCase::test_query_declined_users_list 1'] = {
    'data': {
        'declinedUsersList': [
            {
                'event': {
                    'id': 'RXZlbnROb2RlOjE='
                },
                'id': 'RGVjbGluZU5vZGU6MjE=',
                'user': {
                    'id': 'QW5kZWxhVXNlck5vZGU6MzU='
                }
            },
            {
                'event': {
                    'id': 'RXZlbnROb2RlOjE='
                },
                'id': 'RGVjbGluZU5vZGU6MjA=',
                'user': {
                    'id': 'QW5kZWxhVXNlck5vZGU6MzQ='
                }
            }
        ]
    }
}

snapshots['AttendanceTestCase::test_can_fetch_single_event 1'] = {
    'data': {
        'eventAttendance': {
            'event': {
                'date': 'September 10, 2017',
                'id': 'RXZlbnROb2RlOjI=',
                'time': '01:00pm WAT'
            },
            'id': 'QXR0ZW5kTm9kZToxMA=='
        }
    }
}

snapshots['QueryEventTestCase::test_query_declined_events_list 1'] = {
    'data': {
        'declinedEventsList': [
            {
                'event': {
                    'id': 'RXZlbnROb2RlOjE='
                },
                'id': 'RGVjbGluZU5vZGU6MTg=',
                'user': {
                    'id': 'QW5kZWxhVXNlck5vZGU6MzA='
                }
            }
        ]
    }
}
