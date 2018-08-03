from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save

from oauth2client.contrib.django_util.models import CredentialsField

from .slack import get_slack_name
from .utils.backgroundTaskWorker import BackgroundTaskWorker


class BaseInfo(models.Model):
    """Base class containing all models common information."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        """Define Model as abstract."""

        abstract = True


class UserProxy(User):
    """Class defined to create a proxy for the user model.
        Changes made to this model directly affects the User model
        and vice-versa. Model allows methods to be defined on the User model
        without altering the user model itself.
        https://docs.djangoproject.com/en/1.11/topics/db/models/
    """

    class Meta:
        proxy = True
        auto_created = True

    def check_diff(self, idinfo):
        """
        Check for differences between request/idinfo and model data.
            Args:
                idinfo: data passed in from post method.
        """
        data = {
            "username": idinfo['username'],
            "email": idinfo['email'],
            "first_name": idinfo['first_name'],
            "last_name": idinfo['last_name'],
        }

        for field in data:
            if getattr(self, field) != data[field] and data[field] != '':
                setattr(self, field, data[field])
        self.save()

    @classmethod
    def create_user(cls, user_data):
        """It helps to create a new user
        :param user_data: A dictionary containing user data (
            like  first_name, email, username)
        :return:
        """
        user = UserProxy.objects.create(
            email=user_data['email'],
            username=user_data['username'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name'])
        return user

    @classmethod
    def get_user(cls, user_data):
        """It fetches a user by it's username
        :param user_data: it contains user data (
            username is required to fetch the user)
        :return: it returns an existing user if it exist
        """

        user = UserProxy.objects.get(username=user_data['username'])
        return user


class AndelaUserProfile(models.Model):

    """Class that defines Andela user profile model.
    Attributes: user, google_id, user_picture, slack_name
    """

    google_id = models.CharField(max_length=60, unique=True)
    user = models.OneToOneField(
        User, related_name='base_user', on_delete=models.CASCADE)
    user_picture = models.TextField()
    slack_name = models.CharField(max_length=80, blank=True)
    credential = CredentialsField()
    state = models.CharField(max_length=80, blank=True)

    async def check_diff_and_update(self, idinfo):
        """Check for differences between request/idinfo and model data.
                    Args:
                        idinfo: data passed in from post method.
                """
        data = {
            "user_picture": idinfo['picture'],
            "slack_name": get_slack_name({"email": idinfo["email"]}),
        }

        for field in data:
            if getattr(self, field) != data[field] and data[field] != '':
                setattr(self, field, data[field])
        self.save()

    def __str__(self):
        return "@{}".format(self.user.username)

    @classmethod
    def create_user_profile(cls, user_data, user_id):
        """It helps to create a new user profile
        :param user_data: A dictionary containing user data (
            required elements are  email, picture)
        :param user_id: An Existing User ID
        :return: It newly created user_profile data
        """
        user_profile = AndelaUserProfile.objects.create(
            slack_name=get_slack_name({"email": user_data["email"]}),
            user_id=user_id, google_id=user_data['id'],
            user_picture=user_data['picture'])
        # It runs background user profile update.
        BackgroundTaskWorker.start_work(
            user_profile.check_diff_and_update,
            (user_data,))
        return user_profile

    @classmethod
    def get_and_update_user_profile(cls, user_data):
        """It fetches user profile
        :param user_data: it contains andela user google id
        :return:
        """

        user_profile = AndelaUserProfile.objects.get(google_id=user_data['id'])

        if user_profile:
            # It runs background user profile update.
            BackgroundTaskWorker.start_work(user_profile.check_diff_and_update,
                                            (user_data,))
        return user_profile


User.profile = property(
    lambda u: AndelaUserProfile.objects.get_or_create(user=u)[0])


def create_user_profile(sender, instance, created, **kwargs):
    """Creates the user profile for a given User instance.
       Args: sender, instance, created,
       Sender: The model class,
       Instance: The actual instance being saved,
       Created: Boolean that defaults to True if user is created
    """
    if created:
        AndelaUserProfile.objects.create(user=instance)

    post_save.connect(create_user_profile, sender=User,
                      dispatch_uid=create_user_profile)


class Category(BaseInfo):
    """Category model defined."""

    name = models.CharField(max_length=100)
    featured_image = models.URLField()
    description = models.TextField(
        max_length=280, default="For people who want to be happy.")

    class Meta:
        """Define ordering below."""
        ordering = ['name']

    def get_count(self):
        interest_count = Interest.objects.filter(follower_category=self)
        result = interest_count.count()
        return result

    members_count = property(get_count)

    def __str__(self):
        return "Category : {}" .format(self.name)


class Event(BaseInfo):
    """Message model defined."""

    title = models.CharField(max_length=100)
    description = models.TextField()
    venue = models.TextField()
    date = models.CharField(default='September 10, 2017', max_length=200)
    time = models.CharField(default='01:00pm WAT', max_length=200)
    creator = models.ForeignKey(AndelaUserProfile, on_delete=models.CASCADE)
    social_event = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="events")
    featured_image = models.URLField()
    active = models.BooleanField(default=1)

    @property
    def attendees(self):
        attendees = Attend.objects.filter(event=self)
        return attendees

    def get_count(self):
        attendees = Attend.objects.filter(event=self)
        result = attendees.count()
        return result

    attendees_count = property(get_count)

    def __str__(self):
        return "Event: {}" .format(self.title)


class Interest(BaseInfo):
    """User Interest Model defined."""

    follower = models.ForeignKey(AndelaUserProfile, on_delete=models.CASCADE)
    follower_category = models.ForeignKey(Category, on_delete=models.CASCADE)

    class Meta:
        ordering = ('-created_at',)
        unique_together = ('follower', 'follower_category')

    def __str__(self):
        return "@{} is interested in category {}" .format(
            self.follower.slack_name, self.follower_category.name)


class Attend(BaseInfo):
    """User Attendance Model defined."""

    user = models.ForeignKey(AndelaUserProfile, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)

    class Meta:
        ordering = ('-created_at',)
        unique_together = ('user', 'event')

    def __str__(self):
        return "@{} is attending event {}" .format(
            self.user.slack_name, self.event.title)
