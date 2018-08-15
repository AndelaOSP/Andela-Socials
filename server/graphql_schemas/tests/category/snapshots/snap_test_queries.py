# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import Snapshot


snapshots = Snapshot()

snapshots['CategoryTestCase::test_can_fetch_all_categories 1'] = {
    'data': {
        'categoryList': {
            'edges': [
                {
                    'node': {
                        'description': 'For people who want to be happy.',
                        'featuredImage': 'https://cdn.elegantthemes.com/',
                        'id': 'Q2F0ZWdvcnlOb2RlOjE1',
                        'name': 'Swimming Meetup 1'
                    }
                },
                {
                    'node': {
                        'description': 'For people who want to be happy.',
                        'featuredImage': 'https://cdn.elegantthemes.com/',
                        'id': 'Q2F0ZWdvcnlOb2RlOjE2',
                        'name': 'Swimming Meetup 2'
                    }
                },
                {
                    'node': {
                        'description': 'For people who want to be happy.',
                        'featuredImage': 'https://cdn.elegantthemes.com/',
                        'id': 'Q2F0ZWdvcnlOb2RlOjE3',
                        'name': 'Swimming Meetup 3'
                    }
                },
                {
                    'node': {
                        'description': 'For people who want to be happy.',
                        'featuredImage': 'https://cdn.elegantthemes.com/',
                        'id': 'Q2F0ZWdvcnlOb2RlOjE4',
                        'name': 'Swimming Meetup 4'
                    }
                },
                {
                    'node': {
                        'description': 'For people who want to be happy.',
                        'featuredImage': 'https://cdn.elegantthemes.com/',
                        'id': 'Q2F0ZWdvcnlOb2RlOjE5',
                        'name': 'Swimming Meetup 5'
                    }
                }
            ]
        }
    }
}

snapshots['CategoryTestCase::test_can_fetch_single_category 1'] = {
    'data': {
        'category': {
            'description': 'For people who want to be happy.',
            'featuredImage': 'https://cdn.elegantthemes.com/',
            'id': 'Q2F0ZWdvcnlOb2RlOjI0',
            'name': 'Swimming Meetup 5'
        }
    }
}
