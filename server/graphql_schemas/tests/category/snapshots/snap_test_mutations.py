# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import Snapshot


snapshots = Snapshot()

snapshots['CategoryTestCase::test_user_can_create_a_new_category 1'] = {
    'data': {
        'createCategory': {
            'clientMutationId': None,
            'newCategory': {
                'description': 'testCategory is still a test',
                'featuredImage': 'https://github.com',
                'name': 'someCategory'
            }
        }
    }
}

snapshots['CategoryTestCase::test_user_cannnot_create_category_with_existing_name 1'] = {
    'data': {
        'createCategory': None
    },
    'errors': [
        {
            'locations': [
                {
                    'column': 13,
                    'line': 3
                }
            ],
            'message': 'category Swimming Meetup 1 already exists',
            'path': [
                'createCategory'
            ]
        }
    ]
}

snapshots['CategoryTestCase::test_user_cannnot_create_exact_category_twice 1'] = {
    'data': {
        'createCategory': None
    },
    'errors': [
        {
            'locations': [
                {
                    'column': 13,
                    'line': 3
                }
            ],
            'message': 'You cannot create the same category twice',
            'path': [
                'createCategory'
            ]
        }
    ]
}
