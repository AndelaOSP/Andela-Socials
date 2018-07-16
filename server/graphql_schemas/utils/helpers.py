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
