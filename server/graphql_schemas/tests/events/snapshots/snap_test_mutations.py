# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import Snapshot


snapshots = Snapshot()

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
