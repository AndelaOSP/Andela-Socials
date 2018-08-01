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

snapshots['AttendanceTestCase::test_can_fetch_single_event 1'] = {
    'data': {
        'eventAttendance': {
            'event': {
                'id': 'RXZlbnROb2RlOjI='
            },
            'id': 'QXR0ZW5kTm9kZToxMA=='
        }
    }
}

snapshots['AttendanceTestCase::test_can_fetch_user_subscribed_event 1'] = {
    'data': {
        'subscribedEvents': [
            {
                'event': {
                    'id': 'RXZlbnROb2RlOjI='
                },
                'id': 'QXR0ZW5kTm9kZToxMQ=='
            }
        ]
    }
}
