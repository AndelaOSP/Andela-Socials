# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import Snapshot


snapshots = Snapshot()

snapshots['QueryEventTestCase::test_query_deactivated_event 1'] = {
    'data': {
        'eventsList': {
            'edges': [
                {
                    'node': {
                        'active': True,
                        'description': 'test description default',
                        'id': 'RXZlbnROb2RlOjU=',
                        'title': 'test title default'
                    }
                }
            ]
        }
    }
}
