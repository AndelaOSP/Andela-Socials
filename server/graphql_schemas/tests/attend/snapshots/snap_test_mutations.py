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
            'message': 'AndelaUserProfile matching query does not exist.',
            'path': [
                'attendEvent'
            ]
        }
    ]
}

snapshots['AttendanceTestCase::test_user_can_subcribe_to_event 1'] = {
    'data': {
        'attendEvent': {
            'clientMutationId': 'rand',
            'newAttendance': {
                'event': {
                    'date': 'September 10, 2017',
                    'description': 'THis is a test event',
                    'featuredImage': 'https://cdn.elegantthemes.com/',
                    'socialEvent': {
                        'description': 'For people who want to be happy.',
                        'name': 'Swimming Meetup'
                    },
                    'time': '01:00pm WAT',
                    'title': 'Test',
                    'venue': 'Epic Tower'
                }
            }
        }
    }
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

snapshots['AttendanceTestCase::test_user_cannot_subscribe_to_event_twice 1'] = {
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
            'message': 'The user is already subscribed to the event',
            'path': [
                'attendEvent'
            ]
        }
    ]
}

snapshots['AttendanceTestCase::test_user_can_unsubscribe_from_event 1'] = {
    'data': {
        'unattendEvent': {
            'clientMutationId': 'rand',
            'unsubscribedEvent': {
                'event': {
                    'date': 'September 10, 2017',
                    'description': 'This is a test event',
                    'featuredImage': 'https://cdn.elegantthemes.com/',
                }
            }
        }
    }
}

snapshots['RejectInviteTestCase::test_user_can_decline_invite_to_event 1'] = {
    'data': {
        'declineEvent': {
            'clientMutationId': 'rand',
            'declinedEvent': {
                'event': {
                    'featuredImage': 'https://cdn.eleganttes.com/',
                    'id': 'RXZlbnROb2RlOjI=',
                    'socialEvent': {
                        'description': 'For people who want to be happy.',
                        'name': 'Swimming Meetup'
                    },
                    'title': 'Test'
                },
                'id': 'RGVjbGluZU5vZGU6MTE=',
                'user': {
                    'googleId': '45444',
                    'id': 'QW5kZWxhVXNlck5vZGU6MjA='
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
                    'featuredImage': 'https://cdn.elegantthemes.com/',
                    'id': 'RXZlbnROb2RlOjE=',
                    'socialEvent': {
                        'description': 'For people who want to be happy.',
                        'name': 'Swimming Meetup'
                    },
                    'title': 'Test'
                },
                'id': 'RGVjbGluZU5vZGU6MTQ=',
                'user': {
                    'googleId': '45444',
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
            'message': 'The User thirdUser, has already declined this event',
            'path': [
                'declineEvent'
            ]
        }
    ]
}
