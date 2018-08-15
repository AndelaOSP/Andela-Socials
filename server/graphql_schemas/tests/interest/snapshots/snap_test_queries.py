# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import Snapshot


snapshots = Snapshot()

snapshots['CategoryTestCase::test_can_fetch_all_interests 1'] = {
    'data': {
        'interestsList': {
            'edges': [
                {
                    'node': {
                        'followerCategory': {
                            'id': 'Q2F0ZWdvcnlOb2RlOjE=',
                            'name': 'Gaming Meetup'
                        },
                        'id': 'SW50ZXJlc3ROb2RlOjM0'
                    }
                },
                {
                    'node': {
                        'followerCategory': {
                            'id': 'Q2F0ZWdvcnlOb2RlOjI=',
                            'name': 'Python Meetup'
                        },
                        'id': 'SW50ZXJlc3ROb2RlOjMz'
                    }
                },
                {
                    'node': {
                        'followerCategory': {
                            'id': 'Q2F0ZWdvcnlOb2RlOjE=',
                            'name': 'Gaming Meetup'
                        },
                        'id': 'SW50ZXJlc3ROb2RlOjMy'
                    }
                }
            ]
        }
    }
}
