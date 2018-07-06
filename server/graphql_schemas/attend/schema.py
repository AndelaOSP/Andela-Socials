import graphene
from api.models import Attend, Event
from graphene import relay, ObjectType
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType


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
    def mutate_and_get_payload(cls, args, context, info):
        event_id = args.get('event_id')
        event = Event.objects.get(id=event_id)
        user_attendance = Attend(
            user=info.context.user,
            event=event
        )
        user_attendance.save()

        return cls(new_attendance=user_attendance)

class UnsubscribeEvent(relay.ClientIDMutation):

    class Input:
      event_id = graphene.String(required=True)

    unsubscribed_event = graphene.Field(AttendNode)

    @classmethod
    def mutate_and_get_payload(cls, args, context, info):
        event_id = args.get('event_id')
        user = info.context.user
        unsubscribe = Attend.objects.filter(event_id=event_id, user_id=user.id).delete()
        return cls(unsubscribed_event=unsubscribe)

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
