from api.utils.oauth_helper import get_auth_url


def is_not_admin(user):
    """
    This function checks if a user is not an admin user.
        :param user
    """
    return not user.is_superuser


def update_instance(instance, args, exceptions=['id']):
    """
        This function was created to help clean up input to be used for
        updatingobjects. Typically the input from the graphql endpoint comes
        with unwanted extras such as uniqueids that are not required or will
        cause an error when updating an object hence the exceptionparameter.
            :param instance:
            :param args:
            :param exceptions=['id']:
    """
    if instance:
        [setattr(instance, key, value)
            for key, value in args.items() if key not in exceptions]
        instance.save()
    return instance


class UnauthorizedCalendarError(Exception):
    """
        Calendar Error class for unauthorized calendar.
    """
    def __init__(self, message='', auth_url=''):
        super().__init__(message)
        self.message = message
        self.auth_url = auth_url


def raise_calendar_error(user_profile):
    """
        Raise calendar error for Users with no access tokens
            :param user_profile:
    """
    auth_url = get_auth_url(user_profile)
    raise UnauthorizedCalendarError(message="Calendar API not authorized",
                                    auth_url=auth_url)
