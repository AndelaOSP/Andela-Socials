# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import Snapshot


snapshots = Snapshot()

snapshots['AttendanceTestCase::test_can_fetch_single_attendance 1'] = {
    'data': {
        'eventAttendance': {
            'event': {
                'id': 'RXZlbnROb2RlOjE2',
                'title': 'Test Event 2'
            },
            'id': 'QXR0ZW5kTm9kZTo1',
            'status': 'PENDING'
        }
    }
}

snapshots['AttendanceTestCase::test_can_fetch_user_events 1'] = {
    'data': {
        'subscribedEvents': [
            {
                'event': {
                    'id': 'RXZlbnROb2RlOjE4',
                    'title': 'Test Event 2'
                },
                'id': 'QXR0ZW5kTm9kZTo4',
                'status': 'PENDING'
            }
        ]
    }
}

snapshots['AttendanceTestCase::test_user_attend_model_is_populated_with_new_event 1'] = {
    'data': {
        'attendersList': {
            'edges': [
                {
                    'node': {
                        'event': {
                            'id': 'RXZlbnROb2RlOjIz',
                            'title': 'test title'
                        },
                        'id': 'QXR0ZW5kTm9kZToxMQ==',
                        'status': 'PENDING'
                    }
                },
                {
                    'node': {
                        'event': {
                            'id': 'RXZlbnROb2RlOjIy',
                            'title': 'Test Event 2'
                        },
                        'id': 'QXR0ZW5kTm9kZTo4',
                        'status': 'PENDING'
                    }
                }
            ]
        }
    }
}

snapshots['AttendanceTestCase::test_can_fetch_attendance 1'] = {
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

snapshots['AttendanceTestCase::test_cannot_fetch_attendance_if_user_is_not_owner_or_attendee 1'] = {
    'data': {
        'attendersList': {
            'edges': [
            ]
        }
    }
}

snapshots['AttendanceTestCase::test_can_fetch_user_event 1'] = {
    'data': {
        'subscribedEvents': [
            {
                'event': {
                    'id': 'RXZlbnROb2RlOjE4',
                    'title': 'Test Event 2'
                },
                'id': 'QXR0ZW5kTm9kZTo2',
                'status': 'PENDING'
            }
        ]
    }
}
