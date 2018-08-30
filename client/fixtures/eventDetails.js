import featuredImage from '../assets/img/event_details_banner.jpeg';

const eventDetails = {
  active: true,
  description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent in mollis sem, nec convallis ante. Proin sit amet arcu eu nulla commodo sagittis eu nec metus. Aliquam erat volutpat. Vestibulum ut arcu in mi aliquam blandit a vitae nisl. Suspendisse viverra varius cursus. Vivamus quis vehicula magna. Cras accumsan justo viverra metus vestibulum ultrices.

  Aliquam erat volutpat. Etiam dolor elit, euismod vitae nibh ut, luctus viverra metus. Fusce non consectetur nisl. Integer ultricies euismod eleifend. Suspendisse lobortis, tellus sit amet cursus consectetur, nisl nulla luctus nisi, sit amet dignissim eros sapien in eros. Cras vitae mattis felis. Vivamus egestas enim a lectus mattis eleifend.`,
  endDate: '2018-08-14T13:29:05.622047+00:00',
  id: 'RXZlbnROb2RlOjI=',
  startDate: '2018-08-14T13:29:12.950122+00:00',
  title: 'Birthday Party',
  venue: '235 Ikorodu road, Ilupeju, Lagos, LA',
  featuredImage,
  timezone: 'UTC',
  socialEvent: { name: 'Parties' },
  attendSet: {
    edges: [
      {
        node: {
          user: {
            slackId: 'Tosin',
            state: '',
          },
        },
      },
      {
        node: {
          user: {
            slackId: 'Mayowa',
            state: '',
          },
        },
      },
    ],
  },

};

export default eventDetails;
