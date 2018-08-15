# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import Snapshot


snapshots = Snapshot()

snapshots['QueryDeclinedEventsTestCase::test_query_declined_events_list 1'] = {
    'data': {
        'declinedEventsList': [
            {
                'event': {
                    'id': 'RXZlbnROb2RlOjEz'
                },
                'id': 'RGVjbGluZU5vZGU6MTA=',
                'user': {
                    'id': 'QW5kZWxhVXNlck5vZGU6Mjk='
                }
            }
        ]
    }
}

snapshots['QueryDeclinedEventsTestCase::test_query_declined_users_list 1'] = {
    'data': {
        'declinedUsersList': [
            {
                'event': {
                    'id': 'RXZlbnROb2RlOjE1'
                },
                'id': 'RGVjbGluZU5vZGU6MTM=',
                'user': {
                    'id': 'QW5kZWxhVXNlck5vZGU6MzE='
                }
            },
            {
                'event': {
                    'id': 'RXZlbnROb2RlOjE1'
                },
                'id': 'RGVjbGluZU5vZGU6MTI=',
                'user': {
                    'id': 'QW5kZWxhVXNlck5vZGU6MzI='
                }
            }
        ]
    }
}
