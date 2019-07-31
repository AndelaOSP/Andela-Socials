from os import makedirs

import dotenv

if dotenv.get('ENVIRONMENT') == 'development':
    makedirs('/tmp/log/andela_socials', mode=0o777, exist_ok=True)


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format':
            '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'filters': {
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'filters': ['require_debug_true'],
            'class': 'logging.StreamHandler',
            'formatter': 'simple'
        },
        'file': {
            'level': 'WARNING',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': dotenv.get(
                'LOG_DIR', '/var/log/andela_socials/a_social.log'
            ),
            'maxBytes': 15728640,  # 1024 * 1024 * 15B = 15MB
            'backupCount': 10,
            'formatter': 'verbose',
        }
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'propagate': True,
        },
        'django.request': {  # Stop SQL debug from logging to main logger
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        }
    }
}
