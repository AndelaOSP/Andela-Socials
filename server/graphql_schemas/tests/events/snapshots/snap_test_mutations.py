# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import Snapshot


snapshots = Snapshot()

snapshots['MutateEventTestCase::test_create_event_with_calendar_authorized 1'] = {
    'data': {
        'createEvent': None
    },
    'errors': [
        {
            'locations': [
                {
                    'column': 13,
                    'line': 3
                }
            ],
            'message': 'Sorry, you cannot enter a past date',
            'path': [
                'createEvent'
            ]
        }
    ]
}

snapshots['MutateEventTestCase::test_create_event_with_calendar_unauthorizd 1'] = {
    'data': {
        'createEvent': None
    },
    'errors': [
        {
            'locations': [
                {
                    'column': 13,
                    'line': 3
                }
            ],
            'message': 'Sorry, you cannot enter a past date',
            'path': [
                'createEvent'
            ]
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
                'id': 'Q2F0ZWdvcnlOb2RlOjQy'
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
        'updateEvent': None
    },
    'errors': [
        {
            'locations': [
                {
                    'column': 17,
                    'line': 3
                }
            ],
            'message': "'str' object has no attribute 'date'",
            'path': [
                'updateEvent'
            ]
        }
    ]
}

snapshots['MutateEventTestCase::test_update_event_as_creator 1'] = {
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
            'message': "'str' object has no attribute 'date'",
            'path': [
                'updateEvent'
            ]
        }
    ]
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
            'event': None,
            'isValid': False,
            'message': 'Expired Invite: Event has ended'
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
            'message': 'Expired Invite: Event has ended'
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

snapshots['MutateEventTestCase::test_validate_invite_link_expired_event 1'] = {
    'data': {
        'validateEventInvite': {
            'event': None,
            'isValid': False,
            'message': 'Expired Invite: Event has ended'
        }
    }
}
