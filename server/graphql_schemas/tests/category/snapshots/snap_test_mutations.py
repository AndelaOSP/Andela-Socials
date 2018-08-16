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

