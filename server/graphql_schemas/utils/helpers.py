import os
import datetime
import pytz
import dateutil.parser as parser
from django.core.exceptions import ValidationError
from django.core.files.storage import FileSystemStorage
from django.core import mail
from django.core.exceptions import ObjectDoesNotExist
from django.template.loader import get_template

from api.utils.oauth_helper import get_auth_url
from api.models import Interest, AndelaUserProfile
from googleapiclient.discovery import build
from google.cloud import storage
from graphql_schemas.utils.hasher import Hasher

from django.conf import settings


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
    raise UnauthorizedCalendarError(
        message="Calendar API not authorized", auth_url=auth_url)


async def send_calendar_invites(andela_user, event):
    """
        Send calendar invites asynchronously
         :param andela_user:
         :param event:
    """
    invitees = Interest.objects.filter(follower_category=event.social_event)
    invitee_list = [{'email': invitee.follower.user.email}
                    for invitee in invitees]
    payload = build_event(event, invitee_list)

    calendar = build('calendar', 'v3', credentials=andela_user.credential)

    if settings.ENVIRONMENT == "production":
        calendar.events().insert(calendarId='primary',
            sendNotifications=True, body=payload).execute()
            

def send_event_invite_email(andela_user, event, receiver, info):
    """
        Send single email
         :param andela_user:
         :param event:
         :param receiver
         :param info:
    """
    sender = andela_user
    invite_hash = Hasher.gen_hash([
        event.id, receiver.user.id, sender.user.id])
    invite_url = info.build_absolute_uri(
        f"/invite/{invite_hash}")

    data_values = {
        'title': event.title,
        'imgUrl': event.featured_image,
        'venue': event.venue,
        'startDate': parser.parse(str(
            event.start_date)).strftime("%a, %b %d %Y %H:%M"),
        'url': invite_url,
        'senderName': sender.user.first_name,
        'receiverName': receiver.user.first_name,
    }
    message = get_template('event_email_invite.html').render(data_values)
    msg = mail.EmailMessage(
        f"You have been invited to an event by {sender.user.username}",
        message,
        to=[receiver.user.email]
    )
    msg.content_subtype = 'html'
    sent = msg.send()

    return sent


async def send_event_invite_emails(andela_user, event, info):
    """
        Send mass emails asynchronously
         :param andela_user:
         :param event:
         :param info:
    """
    message_list = []
    sender = andela_user
    invitees = Interest.objects.filter(follower_category=event.social_event)
    invitee_list = [{'email': invitee.follower.user.email}
        for invitee in invitees]

    for invitee in invitee_list:
        receiver = AndelaUserProfile.objects.get(
                user__email=invitee['email'])
        invite_hash = Hasher.gen_hash([
            event.id, receiver.user.id, sender.user.id])
        invite_url = info.build_absolute_uri(
            f"/invite/{invite_hash}")
        data_values = {
            'title': event.title,
            'imgUrl': event.featured_image,
            'venue': event.venue,
            'startDate': parser.parse(str(
                event.start_date)).strftime("%a, %b %d %Y %H:%M"),
            'url': invite_url,
            'senderName': sender.user.first_name,
            'receiverName': receiver.user.first_name,
        }
        message = get_template('event_email_invite.html').render(data_values)
        msg = mail.EmailMessage(
            f"You have been invited to an event by {sender.user.username}",
            message,
            sender.user.email,
            to=[receiver.user.email],
        )
        msg.content_subtype = 'html'
        message_list.append(msg)

    connection = mail.get_connection()
    connection.open()
    connection.send_messages(message_list)
    connection.close()


def build_event(event, invitees):
    """
        Build event payload
         :param event:
         :param invitees:
    """
    start_date = parser.parse(str(event.start_date)).isoformat()
    end_date = parser.parse(str(event.end_date)).isoformat()
    event = {
        'summary': event.title,
        'location': event.venue,
        'description': event.description,
        'start': {
            'dateTime': start_date,
            'timeZone': event.timezone
        },
        'end': {
            'dateTime': end_date,
            'timeZone': event.timezone
        },
        'attendees': invitees,
    }
    return event


def not_valid_timezone(timezone):
    return timezone not in pytz.all_timezones


def _safe_filename(filename):
    """
    Generates a safe filename that is unlikely to collide with existing objects
    in Google Cloud Storage.
    ``filename.ext`` is transformed into ``filename-YYYY-MM-DD-HHMMSS.ext``
    """
    date = datetime.datetime.utcnow().strftime("%Y-%m-%d-%H%M%S")
    basename, extension = filename.rsplit('.', 1)
    return "{0}-{1}.{2}".format(basename, date, extension)


def validate_image(file_obj):
    filesize = file_obj.size
    megabyte_limit = 2.0
    extensions = {".jpg", ".png", ".gif", ".jpeg"}
    if filesize > megabyte_limit*1024*1024:
        raise ValidationError("Max file size is %sMB" % str(megabyte_limit))
    if not any(file_obj.name.lower().endswith(key) for key in extensions):
        raise ValidationError("You can only upload image files")


def upload_image_file(uploaded_file):
    if settings.ENVIRONMENT == "production":
        """
        Uploads a file to a given Cloud Storage bucket and
        returns the public url to the new object.
        """

        # Authenticate storage client
        storage_client = storage.Client.from_service_account_json(
            os.getenv('GOOGLE_CLOUD_CREDENTIALS_PATH')
        )

        filename = _safe_filename(uploaded_file.name)

        bucket = storage_client.get_bucket(
            os.getenv('GOOGLE_CLOUD_BUCKET_NAME'))
        blob = bucket.blob(filename)

        blob.upload_from_file(uploaded_file)
        url = blob.public_url

        return url

    if settings.ENVIRONMENT == "development":
        validate_image(uploaded_file)
        fs = FileSystemStorage()
        safe_filename = _safe_filename(uploaded_file.name)
        filename = fs.save(safe_filename, uploaded_file)
        url = "http://localhost:8000/static{}".format(
            fs.url(filename))
        return url
