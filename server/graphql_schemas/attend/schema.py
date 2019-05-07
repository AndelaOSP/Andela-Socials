import graphene
from django.db.models import Q
from graphene import relay, ObjectType
from graphql_relay import from_global_id
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType
from graphql import GraphQLError

from api.models import Attend, Event, AndelaUserProfile
from api.utils.event_helpers import is_not_past_event, save_user_attendance


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

        if is_not_past_event(event):
            user_attendance, created = save_user_attendance(event, andela_user_profile, status)
        else:
            raise GraphQLError(
                "The event is no longer available")

        return cls(new_attendance=user_attendance)


class AttendQuery(object):
    event_attendance = relay.Node.Field(AttendNode)
    attenders_list = DjangoFilterConnectionField(AttendNode)
    subscribed_events = graphene.List(AttendNode)

    def resolve_subscribed_events(self, info, **kwargs):
        user = info.context.user
        andela_user_profile = AndelaUserProfile.objects.get(user_id=user.id)
        return Attend.objects.filter(user_id=andela_user_profile.id).all()

    def resolve_attenders_list(self, info, **kwargs):
        return Attend.objects.filter(
            Q(user__user=info.context.user) |
            Q(event__creator__user=info.context.user)
        )


class AttendMutation(ObjectType):
    attend_event = AttendEvent.Field()
