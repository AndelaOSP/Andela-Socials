from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.core.exceptions import ValidationError

from oauth2client.contrib.django_util.models import CredentialsField

from .slack import get_slack_id, get_slack_user_timezone
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
    Attributes: user, google_id, user_picture, slack_id
    """

    google_id = models.CharField(max_length=60, unique=True)
    user = models.OneToOneField(
        User, related_name='base_user', on_delete=models.CASCADE)
    user_picture = models.TextField()
    credential = CredentialsField()
    state = models.CharField(max_length=80, blank=True)
    slack_id = models.CharField(max_length=80, blank=True)
    timezone = models.CharField(max_length=80, blank=True)

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
            user_id=user_id, google_id=user_data['id'],
            user_picture=user_data['picture'])

        if user_profile:
            #  It runs background user profile update.
            BackgroundTaskWorker.start_work(user_profile.check_diff_and_update,
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
            #  It runs background user profile update.
            BackgroundTaskWorker.start_work(user_profile.check_diff_and_update,
                                            (user_data,))
        return user_profile

    async def check_diff_and_update(self, idinfo):
        """Check for differences between request/idinfo and model data.
                    Args:
                        idinfo: data passed in from post method.
                """
        data = {
            "user_picture": idinfo['picture'],
            "slack_id": get_slack_id({"email": idinfo["email"]}),
            "timezone": get_slack_user_timezone(idinfo["email"])
        }

        for field in data:
            if getattr(self, field) != data[field] and \
                    data[field] != '':
                setattr(self, field, data[field])
        self.save()


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
    start_date = models.CharField(max_length=50)
    end_date = models.CharField(max_length=50)
    creator = models.ForeignKey(AndelaUserProfile, on_delete=models.CASCADE)
    social_event = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="events")
    featured_image = models.URLField()
    active = models.BooleanField(default=1)
    timezone = models.CharField(max_length=80, blank=True)

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
            self.follower.slack_id, self.follower_category.name)


class Attend(BaseInfo):
    """User Attendance Model defined."""

    ATT = 'attending'
    DEC = 'declined'
    PEN = 'pending'
    STATUSCHOICE = (
        (ATT, 'attending'),
        (DEC, 'declined'),
        (PEN, 'pending'),
    )
    user = models.ForeignKey(AndelaUserProfile, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUSCHOICE, default=PEN)

    class Meta:
        ordering = ('-created_at',)
        unique_together = ('user', 'event', 'status')

    def __str__(self):
        return "@{}'s status on the event {} is {}".format(
            self.user.slack_id, self.event.title, self.status)

    def save(self, *args, **kwargs):
        """This method is modified to check if status value is
        valid before user attendance is registered

        :param args: Tuple of arguments
        :param kwargs: key word arguments
        :return: None
        """
        if self.status not in (self.ATT, self.DEC, self.PEN):
            raise ValidationError(
                f'{self.status} is not a valid status'
            )
        super(Attend, self).save(*args, **kwargs)


class UserEventHistory(models.Model):
    """User Event History Model definition"""

    CR = 'CREATE'
    DE = 'DEACTIVATE'
    UP = 'UPDATE'
    AT = 'ATTEND'
    RE = 'REJECT'

    USER_EVENT_ACTIONS = ((CR, 'CREATE'), (DE, 'DEACTIVATE'),
                          (UP, 'UPDATE'), (AT, 'ATTEND'), (RE, 'REJECT'))

    andela_user_profile = models.ForeignKey(AndelaUserProfile,
                                            on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    user_event_action = models.CharField(max_length=10, default=CR,
                                         choices=USER_EVENT_ACTIONS)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-timestamp',)

    def __str__(self):

        return f'{self.andela_user_profile.slack_id}  \
               {self.user_event_action} \
               {self.event.title} {self.timestamp}'

    def save(self, *args, **kwargs):
        """This method is modified to check if user_event_action value is
        valid before user event history is created

        :param args: Tuple of arguments
        :param kwargs: key word arguments
        :return: None
        """
        if self.user_event_action not in (self.CR, self.DE,
                                          self.RE, self.AT, self.UP):
            raise ValidationError(
                '%(value)s is not a valid user event action',
                params={'value': self.user_event_action.lower()},
            )


class UserCategoryHistory(models.Model):

    CR = 'CREATE'
    SU = 'SUBSCRIBE'
    UN = 'UNSUBSCRIBE'
    AR = 'ARCHIVE'
    UP = 'UPDATE'

    USER_CATEGORY_ACTIONS = ((CR, 'CREATE'), (SU, 'SUBSCRIBE'),
                             (UN, 'UNSUBSCRIBE'), (AR, 'ARCHIVE'),
                             (UP, 'UPDATE'))

    andela_user_profile = models.ForeignKey(AndelaUserProfile,
                                            on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    user_category_action = models.CharField(max_length=11, default=CR,
                                            choices=USER_CATEGORY_ACTIONS)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-timestamp',)

    def __str__(self):

        return f'{self.andela_user_profile.slack_id} \
               {self.user_category_action} \
               {self.category.name} {self.timestamp}'

    def save(self, *args, **kwargs):
        """This method is modified to check if user_category_action
         value is valid before user category history is created


        :param args: Tuple of arguments
        :param kwargs: key word arguments
        :return: None
        """
        if self.user_category_action not in (self.CR, self.SU,
                                             self.UN, self.AR, self.UP):
            raise ValidationError(
                '%(value)s is not a valid user category action',
                params={'value': self.user_category_action.lower()},
            )
