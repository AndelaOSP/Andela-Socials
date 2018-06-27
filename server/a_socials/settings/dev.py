""" Development related settings."""
import sys

import dotenv

from .base import *

# Load the .env file to get environment variables
dotenv.load()

ALLOWED_HOSTS = ['*']

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

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

# SET WEBPACK_LOADER_CACHE
WEBPACK_LOADER['DEFAULT']['CACHE'] = not DEBUG
