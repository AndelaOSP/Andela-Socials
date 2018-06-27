from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save

from .slack import get_slack_name


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
        email_length = len(idinfo['email'])
        hd_length = len(idinfo['hd']) + 1
        data = {
                "username": idinfo['email'][:email_length - hd_length],
                "email": idinfo["email"],
                "first_name": idinfo['given_name'],
                "last_name": idinfo['family_name'],
            }

        for field in data:
            if getattr(self, field) != data[field] and data[field] != '':
                setattr(self, field, data[field])
        self.save()


class GoogleUser(models.Model):
    google_id = models.CharField(max_length=60, unique=True)

    app_user = models.OneToOneField(User, related_name='user',
                                    on_delete=models.CASCADE)
    appuser_picture = models.TextField()
    slack_name = models.CharField(max_length=80, blank=True)

    def check_diff(self, idinfo):
        """Check for differences between request/idinfo and model data.
            Args:
                idinfo: data passed in from post method.
        """
        data = {
                "appuser_picture": idinfo['picture'],
                "slack_name": get_slack_name({"email": idinfo["email"]}),
            }

        for field in data:
            if getattr(self, field) != data[field] and data[field] != '':
                setattr(self, field, data[field])
        self.save()

    def __str__(self):
        return "@{}".format(self.slack_name)


class UserProfile(models.Model):
    """Class that defines user profile model.
    Attributes: user
    """

    # more fields here, not sure for now.
    user = models.OneToOneField(User)


User.profile = property(lambda u: UserProfile.objects.get_or_create(user=u)[0])


def create_user_profile(sender, instance, created, **kwargs):
    """Creates the user profile for a given User instance.

       Args: sender, instance, created,
       Sender: The model class,
       Instance: The actual instance being saved,
       Created: Boolean that defaults to True if user is created
    """
    if created:
        UserProfile.objects.create(user=instance)

    post_save.connect(create_user_profile, sender=User,
                      dispatch_uid=create_user_profile)


class Category(BaseInfo):
    """Category model defined."""

    name = models.CharField(max_length=100)
    featured_image = models.URLField()
    description = models.TextField(max_length=280, default="For people who want to be happy.")

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
    creator = models.ForeignKey(GoogleUser, on_delete=models.CASCADE)
    social_event = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="events")
    featured_image = models.URLField()

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

    follower = models.ForeignKey(GoogleUser, on_delete=models.CASCADE)
    follower_category = models.ForeignKey(Category, on_delete=models.CASCADE)

    class Meta:
        ordering = ('-created_at',)
        unique_together = ('follower', 'follower_category')

    def __str__(self):
        return "@{} is interested in category {}" .format(self.follower.slack_name, self.follower_category.name)


class Attend(BaseInfo):
    """User Attendance Model defined."""

    user = models.ForeignKey(GoogleUser, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)

    class Meta:
        ordering = ('-created_at',)
        unique_together = ('user', 'event')

    def __str__(self):
        return "@{} is attending event {}" .format(self.user.slack_name, self.event.title)
