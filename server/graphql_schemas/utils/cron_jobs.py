import datetime

from api.models import Interest, Category
from api.slack import notify_user


def check_and_notify_members():
    """
    This function gets all categories created, the various users interested
    in them and sends notifications to older members on newer users that that
     have joined the category.
    """
    categories = Category.objects.all()
    for category in categories:
        users_in_category = Interest.objects.filter(
            follower_category_id=category.id).filter(
                created_at__lt=datetime.date.today()
        )
        new_users_in_category = Interest.objects.filter(
            follower_category_id=category.id).filter(
                created_at__gte=datetime.date.today()
        )
        new_users = ' '.join(
            ['<@' + str(user.follower.slack_id) +
             '>' for user in new_users_in_category if not None]
        )
        if new_users:
            message = new_users + ' joined ' + str(category.name) + ' today.'
            [notify_user(
                message,
                user.follower.slack_id,
                'New member joined Andela Socials'
                ) for user in users_in_category]
