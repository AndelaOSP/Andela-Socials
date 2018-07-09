import graphene
from api.models import Event, Category, Attend, GoogleUser
from graphene import relay, InputObjectType, ObjectType
from graphql_relay.node.node import from_global_id
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType


class EventNode(DjangoObjectType):
  class Meta:
    model = Event
    filter_fields = {}
    interfaces = (relay.Node,)

class CreateEvent(relay.ClientIDMutation):
    class Input:
      title = graphene.String(required=True)
      description = graphene.String(required=True)
      venue = graphene.String(required=True)
      date = graphene.String(required=True)
      time = graphene.String(required=False)
      featured_image = graphene.String(required=False)
      social_event_id = graphene.Int(required=False)

    new_event = graphene.Field(EventNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        social_event_id = input.get('social_event_id')
        social_event = Category.objects.get(id=int(social_event_id))
        user = info.context.user
        googleUser = GoogleUser.objects.get(app_user_id=user.id)
        new_event = Event(
          title=input.get('title'),
          description=input.get('description'),
          venue=input.get('venue'),
          date=input.get('date'),
          time=input.get('time'),
          featured_image=input.get('featured_image'),
          creator=googleUser,
          social_event=social_event
        )
        new_event.save()

        return cls(new_event=new_event)

class Query(object):
  event = graphene.Field(EventNode,
                         id=graphene.Int(),
                         title=graphene.String())
  all_events = DjangoFilterConnectionField(EventNode)

  def resolve_event(self, info, **kwargs):
    id = kwargs.get('id')
    if id is not None:
      return Event.objects.get(pk=id)
    return None

class Mutation(ObjectType):
     create_event = CreateEvent.Field()
