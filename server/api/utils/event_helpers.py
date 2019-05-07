from datetime import datetime
from pytz import timezone
from dateutil.parser import parse

from api.models import Attend


def is_not_past_event(event):
    """
    This function checks if an event is not a past event
    :param event:
    :return bool:
    """
    event_start_date = parse(event.start_date)
    event_tz = timezone(event.timezone)
    if event_start_date.tzinfo is None:
        event_start_date = event_start_date.replace(tzinfo=event_tz)
    today = datetime.now(event_tz)
    return today < event_start_date


def save_user_attendance(event, user_profile, status):
    return Attend.objects.get_or_create(
        user=user_profile, event=event, status="attending")
