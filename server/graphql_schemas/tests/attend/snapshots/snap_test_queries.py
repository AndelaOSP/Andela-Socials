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
