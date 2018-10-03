""" Development specific settings."""
import sys

from .base import *

ALLOWED_HOSTS = ['*']

TEST_RUNNER = 'snapshottest.django.TestRunner'

# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases
DATABASES = {
 'default': {
      'ENGINE': 'django.db.backends.postgresql_psycopg2',
      'NAME': dotenv.get('DB_NAME'),
      'USER': dotenv.get('DB_USER'),
      'PASSWORD': dotenv.get('DB_PASSWORD'),
      'PORT': dotenv.get('DB_PORT'),
      'HOST': dotenv.get('DB_HOST'),
      'TEST': {
        'CHARSET': None,
        'COLLATION': None,
        'NAME': os.path.join(os.path.dirname(__file__), 'test.db'),
        'MIRROR': None
      }
    }
 }

MEDIA_ROOT = os.path.join(BASE_DIR, 'static/media')
MEDIA_URL = '/media/'

ENVIRONMENT = "development"
