# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import Snapshot


snapshots = Snapshot()

snapshots['QueryAndelaUserTestCase::test_query_users_by_id 1'] = {
    'data': {
        'user': {
            'googleId': '344445',
            'id': 'QW5kZWxhVXNlck5vZGU6MTAw',
            'userPicture': 'https://lh5.googleusercontent.com'
        }
    }
}

snapshots['QueryAndelaUserTestCase::test_query_users_list 1'] = {
    'data': {
        'usersList': {
            'edges': [
                {
                    'node': {
                        'googleId': '123233',
                        'id': 'QW5kZWxhVXNlck5vZGU6MTAx',
                        'userPicture': 'https://lh5.googleusercontent.com'
                    }
                },
                {
                    'node': {
                        'googleId': '344445',
                        'id': 'QW5kZWxhVXNlck5vZGU6MTAy',
                        'userPicture': 'https://lh5.googleusercontent.com'
                    }
                }
            ]
        }
    }
}
