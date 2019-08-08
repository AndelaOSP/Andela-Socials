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

snapshots['QueryEventTestCase::test_query_single_event 1'] = {
    'data': {
        'event': {
            'active': True,
            'description': 'test description default',
            'id': 'RXZlbnROb2RlOjU=',
            'title': 'test title default'
        }
    }
}

snapshots['QueryEventTestCase::test_get_event_list 1'] = {
    'data': {
        'eventsList': {
            'edges': [
                {
                    'cursor': 'YXJyYXljb25uZWN0aW9uOjA=',
                    'node': {
                        'description': 'test description default',
                        'id': 'RXZlbnROb2RlOjU=',
                        'socialEvent': {
                            'id': 'Q2F0ZWdvcnlOb2RlOjU5',
                            'name': 'social event'
                        },
                        'startDate': '2018-11-20 20:08:07.127325+00:00',
                        'title': 'test title default',
                        'venue': 'test venue'
                    }
                }
            ]
        }
    }
}

snapshots['QueryEventTestCase::test_filter_event_list 1'] = {
    'data': {
        'eventsList': {
            'edges': [
                {
                    'cursor': 'YXJyYXljb25uZWN0aW9uOjA=',
                    'node': {
                        'description': 'test description default',
                        'id': 'RXZlbnROb2RlOjU=',
                        'socialEvent': {
                            'id': 'Q2F0ZWdvcnlOb2RlOjM1',
                            'name': 'social event'
                        },
                        'startDate': '2018-11-20T20:08:07.127325+00:00',
                        'title': 'test title default',
                        'venue': 'test venue'
                    }
                }
            ]
        }
    }
}

snapshots['QueryEventTestCase::test_filter_event_list_by_non_existing_venue_returns_empty_list 1'] = {
    'data': {
        'eventsList': {
            'edges': [
            ]
        }
    }
}

snapshots['QueryEventTestCase::test_filter_event_list_by_valid_venue_is_successful 1'] = {
    'data': {
        'eventsList': {
            'edges': [
                {
                    'cursor': 'YXJyYXljb25uZWN0aW9uOjA=',
                    'node': {
                        'description': 'test description default',
                        'id': 'RXZlbnROb2RlOjU=',
                        'socialEvent': {
                            'id': 'Q2F0ZWdvcnlOb2RlOjU4',
                            'name': 'social event'
                        },
                        'startDate': '2018-11-20 20:08:07.127325+00:00',
                        'title': 'test title default',
                        'venue': 'test venue'
                    }
                }
            ]
        }
    }
}
