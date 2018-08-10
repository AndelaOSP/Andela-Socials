import graphene
from graphene import relay, ObjectType
from graphql_relay import from_global_id
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType
from django.db import IntegrityError
from graphql import GraphQLError
from graphql_relay import from_global_id

from api.models import Attend, Event, AndelaUserProfile, DeclinedInvite


class AttendNode(DjangoObjectType):
    class Meta:
        model = Attend
        filter_fields = {}
        interfaces = (relay.Node,)


class AttendSocialEvent(relay.ClientIDMutation):
    class Input:
        event_id = graphene.ID(required=True)

    new_attendance = graphene.Field(AttendNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        event_id = input.get('event_id')
        db_event_id = from_global_id(event_id)[1]
        event = Event.objects.get(id=db_event_id)
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
        event_id = graphene.ID(required=True)

    unsubscribed_event = graphene.Field(AttendNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        event_id = input.get('event_id')
        db_event_id = from_global_id(event_id)[1]
        user = info.context.user
        andela_user_profile = AndelaUserProfile.objects.get(user_id=user.id)
        event_subscription = Attend.objects.filter(
            event_id=db_event_id,
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


class DeclineNode(DjangoObjectType):
    class Meta:
        model = DeclinedInvite
        filter_fields = {}
        interfaces = (relay.Node,)


class DeclineInvite(relay.ClientIDMutation):
    declined_event = graphene.Field(DeclineNode)

    class Input:
        event_id = graphene.String(required=True)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        event_id = from_global_id(input.get('event_id'))[1]
        user = info.context.user
        andela_user_profile = AndelaUserProfile.objects.get(user_id=user.id)
        event = Event.objects.get(id=event_id)
        try:
            new_declined_invite = DeclinedInvite.objects.create(
                user=andela_user_profile,
                event=event
            )
            return cls(declined_event=new_declined_invite)
        except IntegrityError:
            raise GraphQLError(
                "The User {0}, has already declined this event".format(user))


class DeclineQuery(object):
    # list of all users that declined an event
    declined_users_list = graphene.List(DeclineNode, event_id=graphene.String())
    # list of all events a user declined
    declined_events_list = graphene.List(DeclineNode)

    def resolve_declined_users_list(self, info, event_id):
        return DeclinedInvite.objects.filter(
            event = from_global_id(event_id)[1],
        ).all()
    
    def resolve_declined_events_list(self, info, **kwargs):
        user = info.context.user
        andela_user_profile = AndelaUserProfile.objects.get(user_id=user.id)
        return DeclinedInvite.objects.filter(
            user = andela_user_profile,
        ).all()


class DeclineMutation(ObjectType):
    decline_event = DeclineInvite.Field()
