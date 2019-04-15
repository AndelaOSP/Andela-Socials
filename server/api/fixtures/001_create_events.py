from datetime import datetime, timedelta
from random import choice
from dynamic_fixtures.fixtures import BaseFixture
from faker import Faker

from api.models import Event, AndelaUserProfile, Category

class Fixture(BaseFixture):
  def load(self):
    eventObjects = []
    creators = list(AndelaUserProfile.objects.all())
    categories = list(Category.objects.all())
    timezones = ['Africa/Lagos', 'Africa/Nairobi']
    venues = ['Lagos', 'Nairobi']
    fake = Faker()
    event_start_date = datetime.today()
    # generate 10 fixtures at a time
    for _ in range(10):
      creator = choice(creators)
      category = choice(categories)
      eventInstance = Event(
          title=fake.sentence(nb_words=4, variable_nb_words=True, ext_word_list=None),
          description=fake.text(max_nb_chars=400, ext_word_list=None),
          venue=choice(venues),
          start_date=event_start_date,
          end_date=event_start_date + timedelta(hours=2),
          creator=creator,
          social_event=category,
          featured_image='https://lorempixel.com/800/800',
          active=True,
          timezone=choice(timezones)
      )
      eventObjects.append(eventInstance)

    Event.objects.bulk_create(eventObjects)
