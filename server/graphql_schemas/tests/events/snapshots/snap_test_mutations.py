# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import Snapshot


snapshots = Snapshot()

snapshots['MutateEventTestCase::test_create_event_with_calendar_authorized 1'] = {
    'data': {
        'createEvent': {
            'newEvent': {
                'description': 'test description',
                'title': 'test title'
            }
        }
    }
}

snapshots['MutateEventTestCase::test_create_event_with_calendar_unauthorizd 1'] = {
    'data': {
        'createEvent': None
    },
    'errors': [
        {
            'AuthUrl': 'https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=1023621061664-1b7grp47bee4qu0k0a5114dvm1icl65k.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fapi%2Fv1%2Foauthcallback&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar&state=3BidNiT8qjMlJg9b1MRH39DVQEPMh6&prompt=consent&included_granted_scopes=true&login_hint=testemailcreatorId%40email.com&access_type=offline',
            'message': 'Calendar API not authorized'
        }
    ]
}

snapshots['MutateEventTestCase::test_deactivate_event_as_admin 1'] = {
    'data': {
        'deactivateEvent': {
            'actionMessage': 'Event deactivated'
        }
    }
}

snapshots['MutateEventTestCase::test_deactivate_event_as_creator 1'] = {
    'data': {
        'deactivateEvent': {
            'actionMessage': 'Event deactivated'
        }
    }
}

snapshots['MutateEventTestCase::test_deactivate_event_as_non_creator 1'] = {
    'data': {
        'deactivateEvent': None
    },
    'errors': [
        {
            'locations': [
                {
                    'column': 17,
                    'line': 3
                }
            ],
            'message': "You aren't authorised to deactivate the event",
            'path': [
                'deactivateEvent'
            ]
        }
    ]
}

snapshots['MutateEventTestCase::test_query_updated_event 1'] = {
    'data': {
        'event': {
            'description': 'test description default',
            'id': 'RXZlbnROb2RlOjU=',
            'socialEvent': {
                'id': 'Q2F0ZWdvcnlOb2RlOjI5'
            },
            'title': 'test title default'
        }
    }
}

snapshots['MutateEventTestCase::test_send_event_invite 1'] = {
    'data': {
        'sendEventInvite': {
            'message': 'Event invite delivered'
        }
    }
}

snapshots['MutateEventTestCase::test_send_invite_for_invalid_event 1'] = {
    'data': {
        'sendEventInvite': None
    },
    'errors': [
        {
            'locations': [
                {
                    'column': 17,
                    'line': 3
                }
            ],
            'message': 'Event does not exist',
            'path': [
                'sendEventInvite'
            ]
        }
    ]
}

snapshots['MutateEventTestCase::test_send_invite_to_invalid_user 1'] = {
    'data': {
        'sendEventInvite': None
    },
    'errors': [
        {
            'locations': [
                {
                    'column': 17,
                    'line': 3
                }
            ],
            'message': 'Recipient User does not exist',
            'path': [
                'sendEventInvite'
            ]
        }
    ]
}

snapshots['MutateEventTestCase::test_send_invite_to_self 1'] = {
    'data': {
        'sendEventInvite': None
    },
    'errors': [
        {
            'locations': [
                {
                    'column': 17,
                    'line': 3
                }
            ],
            'message': 'User cannot invite self',
            'path': [
                'sendEventInvite'
            ]
        }
    ]
}

snapshots['MutateEventTestCase::test_update_event_as_admin 1'] = {
    'data': {
        'updateEvent': {
            'actionMessage': 'Event Update is successful.',
            'updatedEvent': {
                'id': 'RXZlbnROb2RlOjU=',
                'title': "This is a test don't panic."
            }
        }
    }
}

snapshots['MutateEventTestCase::test_update_event_as_creator 1'] = {
    'data': {
        'updateEvent': {
            'actionMessage': 'Event Update is successful.',
            'updatedEvent': {
                'id': 'RXZlbnROb2RlOjU=',
                'title': 'Not really a party'
            }
        }
    }
}

snapshots['MutateEventTestCase::test_update_event_as_non_creator 1'] = {
    'data': {
        'updateEvent': None
    },
    'errors': [
        {
            'locations': [
                {
                    'column': 13,
                    'line': 3
                }
            ],
            'message': 'You are not authorized to edit this event.',
            'path': [
                'updateEvent'
            ]
        }
    ]
}

snapshots['MutateEventTestCase::test_validate_invite_link 1'] = {
    'data': {
        'validateEventInvite': {
            'event': {
                'active': True,
                'description': 'test description default',
                'endDate': '2018-11-20T20:08:07.127325+00:00',
                'startDate': '2018-11-20T20:08:07.127325+00:00',
                'title': 'test title default',
                'venue': 'test venue'
            },
            'isValid': True,
            'message': 'OK: Event invite is valid'
        }
    }
}

snapshots['MutateEventTestCase::test_validate_invite_link_invalid_event 1'] = {
    'data': {
        'validateEventInvite': {
            'event': None,
            'isValid': False,
            'message': 'Not Found: Invalid event/user in invite'
        }
    }
}

snapshots['MutateEventTestCase::test_validate_invite_link_invalid_hash 1'] = {
    'data': {
        'validateEventInvite': {
            'event': None,
            'isValid': False,
            'message': 'Bad Request: Invalid invite URL'
        }
    }
}

snapshots['MutateEventTestCase::test_validate_invite_link_invalid_sender 1'] = {
    'data': {
        'validateEventInvite': {
            'event': None,
            'isValid': False,
            'message': 'Not Found: Invalid event/user in invite'
        }
    }
}

snapshots['MutateEventTestCase::test_validate_invite_link_unauthorized_user 1'] = {
    'data': {
        'validateEventInvite': {
            'event': None,
            'isValid': False,
            'message': 'Forbidden: Unauthorized access'
        }
    }
}
