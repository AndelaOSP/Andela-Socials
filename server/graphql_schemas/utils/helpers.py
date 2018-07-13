def is_not_admin(user):
    """
    This function checks if a user is not an admin user.
        :param user
    """
    return not user.is_superuser
