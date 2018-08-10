# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import Snapshot


snapshots = Snapshot()

snapshots['RejectInviteTestCase::test_user_can_decline_invite_to_event 1'] = {
    'data': {
        'declineEvent': {
            'clientMutationId': 'rand',
            'declinedEvent': {
                'event': {
                    'featuredImage': 'https://cdn.elegantthemes.com/',
                    'id': 'RXZlbnROb2RlOjc=',
                    'socialEvent': {
                        'description': 'For people who want to be happy.',
                        'name': 'Swimming Meetup'
                    },
                    'title': 'Test'
                },
                'id': 'RGVjbGluZU5vZGU6Mw==',
                'user': {
                    'googleId': '84754',
                    'id': 'QW5kZWxhVXNlck5vZGU6MjE='
                }
            }
        }
    }
}

snapshots['RejectInviteTestCase::test_user_can_decline_invite_to_multiple_events 1'] = {
    'data': {
        'declineEvent': {
            'clientMutationId': 'rand',
            'declinedEvent': {
                'event': {
                    'featuredImage': 'https://cdn.eleganttes.com/',
                    'id': 'RXZlbnROb2RlOjEw',
                    'socialEvent': {
                        'description': 'For people who want to be happy.',
                        'name': 'Swimming Meetup'
                    },
                    'title': 'Test'
                },
                'id': 'RGVjbGluZU5vZGU6Ng==',
                'user': {
                    'googleId': '84754',
                    'id': 'QW5kZWxhVXNlck5vZGU6MjQ='
                }
            }
        }
    }
}

snapshots['RejectInviteTestCase::test_user_can_not_decline_invite_more_than_once 1'] = {
    'data': {
        'declineEvent': None
    },
    'errors': [
        {
            'locations': [
                {
                    'column': 13,
                    'line': 3
                }
            ],
            'message': 'The User testuser, has already declined this event',
            'path': [
                'declineEvent'
            ]
        }
    ]
}
