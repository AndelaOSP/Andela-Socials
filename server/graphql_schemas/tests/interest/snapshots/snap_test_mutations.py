# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import Snapshot


snapshots = Snapshot()

snapshots['InterestTestCase::test_user_can_join_and_unjoin_social_club 1'] = {
    'data': {
        'joinSocialClub': {
            'joinedSocialClub': {
                'followerCategory': {
                    'description': 'For people who want to be happy.',
                    'id': 'Q2F0ZWdvcnlOb2RlOjI=',
                    'name': 'Python Meetup'
                },
                'id': 'SW50ZXJlc3ROb2RlOjQ='
            }
        }
    }
}

snapshots['InterestTestCase::test_user_can_join_and_unjoin_social_club 2'] = {
    'data': {
        'unJoinSocialClub': {
            'unjoinedSocialClub': {
                'followerCategory': {
                    'description': 'For people who want to be happy.',
                    'id': 'Q2F0ZWdvcnlOb2RlOjI=',
                    'name': 'Python Meetup'
                },
                'id': 'SW50ZXJlc3ROb2RlOk5vbmU='
            }
        }
    }
}

snapshots['InterestTestCase::test_user_cannot_unjoin_social_club_they_do_not_belong_to 1'] = {
    'data': {
        'unJoinSocialClub': None
    },
    'errors': [
        {
            'locations': [
                {
                    'column': 13,
                    'line': 3
                }
            ],
            'message': 'The User @testuser2, has not joined Category : Python Meetup. ',
            'path': [
                'unJoinSocialClub'
            ]
        }
    ]
}
