import graphene
from api.models import Attend, Event, GoogleUser
from graphene import relay, ObjectType
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType
from graphql import GraphQLError

class AttendNode(DjangoObjectType):
  class Meta:
    model = Attend
    filter_fields = {}
    interfaces = (relay.Node,)

class AttendSocialEvent(relay.ClientIDMutation):
    class Input:
      event_id = graphene.String(required=True)

    new_attendance = graphene.Field(AttendNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        event_id = input.get('event_id')
        event = Event.objects.get(id=event_id)
        user = info.context.user
        googleUser = GoogleUser.objects.get(app_user_id=user.id)
        # Resolve error for users that already signified interest here
        user_attendance = Attend(
            user=googleUser,
            event=event
        )
        user_attendance.save()

        return cls(new_attendance=user_attendance)

class UnsubscribeEvent(relay.ClientIDMutation):

    class Input:
      event_id = graphene.String(required=True)

    unsubscribed_event = graphene.Field(AttendNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        event_id = input.get('event_id')
        user = info.context.user
        googleUser = GoogleUser.objects.get(app_user_id=user.id)
        subscribedEvent = Attend.objects.filter(event_id=event_id, user_id=googleUser.id).first()
        if not subscribedEvent:
          raise GraphQLError("The User {0}, has not subscribed to this event".format(user))
        subscribedEvent.delete()
        return cls(unsubscribed_event=subscribedEvent)

class Query(object):
  ####
  attending = relay.Node.Field(AttendNode)
  all_attenders = DjangoFilterConnectionField(AttendNode)
  subscribed_events = graphene.List(AttendNode)

  def resolve_subscribed_events(self, info, **kwargs):
    user = info.context.user
    return Attend.objects.filter(user_id=user.id).all()

class Mutation(ObjectType):
    attend_event = AttendSocialEvent.Field()
    unattend_event = UnsubscribeEvent.Field()
