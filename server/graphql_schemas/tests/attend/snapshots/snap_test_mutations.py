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
            'message': "''",
            'path': [
                'attendEvent'
            ]
        }
    ]
}

snapshots['AttendanceTestCase::test_user_can_attend_an_event 1'] = {
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
            'message': "''",
            'path': [
                'attendEvent'
            ]
        }
    ]
}

snapshots['AttendanceTestCase::test_user_can_change_event_status 1'] = {
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
            'message': "''",
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
