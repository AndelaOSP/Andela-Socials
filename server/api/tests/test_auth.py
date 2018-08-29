import jwt

from os import environ
from base64 import b64decode


from django.test import TestCase


def generate_token(payload):

    private_key64 = environ.get('TEST_PUBLIC_KEY')
    private_key = b64decode(private_key64).decode('utf-8')

    token = jwt.encode(payload, private_key, algorithm='RS256',)
    return token


class AndelaTokenAuthenticationTestCase(TestCase):

    payload = dict(
      UserInfo=dict(
        id='-FFGHtid',
        email='test.test@andela.com',
        first_name='test',
        last_name='test',
        picture='https://test.pictuegvbjkjnj',
      ),
      aud='andela.com'
    )

    def setUp(self):
        self.token = generate_token(self.payload)

    def test_successful_authentication(self):

        header = {'HTTP_TOKEN': self.token}

        self.response = self.client.get('/', format="json", **header)
        self.assertEqual(self.response.status_code, 200)

    def test_authentication_failed_if_token_is_not_set(self):

        header = {'HTTP_TOKEN': ''}

        self.response = self.client.get('/graphql', format="json", **header)
        self.assertEqual(self.response.data['detail'], 'Authorization token is required')
        self.assertEqual(self.response.status_code, 401)

    def test_authentication_failed_when_token_is_invalid(self):

        header = {'HTTP_TOKEN': 'vcbnm.kmnjbvcvbnmlnbvbcvnmmkjhgf6hvbnmjk.njb'}

        self.response = self.client.get('/graphql', format="json", **header)
        self.assertEqual(self.response.data['detail'],
                         'Authorization failed due to an Invalid token.')
        self.assertEqual(self.response.status_code, 401)
