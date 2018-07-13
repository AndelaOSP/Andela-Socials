import graphene
from graphene import relay, ObjectType
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType
from graphql import GraphQLError

from api.models import Attend, Event, AndelaUserProfile


class AttendNode(DjangoObjectType):
    class Meta:
        model = Attend
        filter_fields = {}
        interfaces = (relay.Node,)


class AttendSocialEvent(relay.ClientIDMutation):
    class Input:
        event_id = graphene.Int(required=True)

    new_attendance = graphene.Field(AttendNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        event_id = input.get('event_id')
        event = Event.objects.get(id=event_id)
        user = info.context.user
        andela_user_profile = AndelaUserProfile.objects.get(
            user_id=user.id)
        user_attendance, created = Attend.objects.get_or_create(
            user=andela_user_profile,
            event=event)

        if user_attendance and not created:
            raise GraphQLError(
                "The user is already subscribed to the event")

        return cls(new_attendance=user_attendance)


class UnsubscribeEvent(relay.ClientIDMutation):
    class Input:
        event_id = graphene.String(required=True)

    unsubscribed_event = graphene.Field(AttendNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        event_id = input.get('event_id')
        user = info.context.user
        andela_user_profile = AndelaUserProfile.objects.get(user_id=user.id)
        event_subscription = Attend.objects.filter(
            event_id=event_id,
            user_id=andela_user_profile.id).first()
        if not event_subscription:
            raise GraphQLError(
                "The User {0}, has not subscribed to this event".format(user))
        event_subscription.delete()
        return cls(unsubscribed_event=event_subscription)


class AttendQuery(object):
    event_attendance = relay.Node.Field(AttendNode)
    attenders_list = DjangoFilterConnectionField(AttendNode)
    subscribed_events = graphene.List(AttendNode)

    def resolve_subscribed_events(self, info, **kwargs):
        user = info.context.user
        return Attend.objects.filter(user_id=user.id).all()


class AttendMutation(ObjectType):
    attend_event = AttendSocialEvent.Field()
    unattend_event = UnsubscribeEvent.Field()
