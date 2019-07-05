import graphene
from django.db.models import Q
from graphene import relay, ObjectType
from graphql_relay import from_global_id
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType
from graphql import GraphQLError

from api.models import Attend, Event, AndelaUserProfile
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> ft(channel-invite): user should be added to the event's channel when they perform attend action (#203)
from api.slack import invite_to_event_channel
from api.utils.backgroundTaskWorker import BackgroundTaskWorker
from api.utils.event_helpers import is_not_past_event, save_user_attendance
<<<<<<< HEAD
<<<<<<< HEAD
from graphql_schemas.utils.helpers import update_event_status_on_calendar
=======
from api.utils.event_helpers import is_not_past_event, save_user_attendance
>>>>>>> ft(slack-attend-event): User should be able to attend event from slack) (#181)
=======
from graphql_schemas.utils.helpers import add_event_to_calendar
>>>>>>> feat(calendar): add event to attendee's calendar (#199)
=======
from graphql_schemas.utils.helpers import update_event_status_on_calendar
>>>>>>> bug(calendar-invite): fix calendar invite flow (#229)


class AttendNode(DjangoObjectType):
    class Meta:
        model = Attend
        filter_fields = {}
        interfaces = (relay.Node,)


class AttendEvent(relay.ClientIDMutation):
    class Input:
        event_id = graphene.ID(required=True)
        status = graphene.String(required=True)

    new_attendance = graphene.Field(AttendNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        event_id = input.get('event_id')
        status = input.get('status')
        db_event_id = from_global_id(event_id)[1]
        event = Event.objects.get(id=db_event_id)
        user = info.context.user
        andela_user_profile = AndelaUserProfile.objects.get(
            user_id=user.id)
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        BackgroundTaskWorker.start_work(update_event_status_on_calendar,
            (andela_user_profile, event))
        if is_not_past_event(event):
            user_attendance, created = save_user_attendance(event, andela_user_profile, status)
            if event.slack_channel and andela_user_profile.slack_id and event.creator.slack_token:
                BackgroundTaskWorker.start_work(invite_to_event_channel,
                                                (andela_user_profile.slack_id, event.slack_channel, event.creator.slack_token))

=======

=======
        add_event_to_calendar(andela_user_profile, event)
>>>>>>> feat(calendar): add event to attendee's calendar (#199)
=======
        BackgroundTaskWorker.start_work(update_event_status_on_calendar,
            (andela_user_profile, event))
>>>>>>> bug(calendar-invite): fix calendar invite flow (#229)
        if is_not_past_event(event):
            user_attendance, created = save_user_attendance(event, andela_user_profile, status)
<<<<<<< HEAD
>>>>>>> ft(slack-attend-event): User should be able to attend event from slack) (#181)
=======
            if event.slack_channel and andela_user_profile.slack_id and event.creator.slack_token:
                BackgroundTaskWorker.start_work(invite_to_event_channel,
                                                (andela_user_profile.slack_id, event.slack_channel, event.creator.slack_token))

>>>>>>> ft(channel-invite): user should be added to the event's channel when they perform attend action (#203)
        else:
            raise GraphQLError(
                "The event is no longer available")

        return cls(new_attendance=user_attendance)


class AttendQuery(object):
    event_attendance = relay.Node.Field(AttendNode)
    attenders_list = DjangoFilterConnectionField(AttendNode)
    subscribed_events = graphene.List(AttendNode)
    attending_list = DjangoFilterConnectionField(AttendNode)

    def resolve_subscribed_events(self, info, **kwargs):
        user = info.context.user
        andela_user_profile = AndelaUserProfile.objects.get(user_id=user.id)
        return Attend.objects.filter(user_id=andela_user_profile.id).all()

    def resolve_attenders_list(self, info, **kwargs):
        return Attend.objects.filter(
            Q(user__user=info.context.user) |
            Q(event__creator__user=info.context.user)
        )

    def resolve_attending_list(self, info, **kwargs):
        return Attend.objects.filter(user__user=info.context.user,
                                     status="attending")


class AttendMutation(ObjectType):
    attend_event = AttendEvent.Field()
