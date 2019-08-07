import jwt
import os

from base64 import b64decode

from django.conf import settings

from rest_framework import (authentication, exceptions)

from ..models import AndelaUserProfile, UserProxy


class TokenAuth(authentication.BaseAuthentication):

    """A custom token authentication class
    It helps to verify and authenticate a token sent by an Andela user.
    It subclass BaseAuthentication and override the authenticate(self, request) method.
    """

    def decodeJWT(self, token, andela_public_key):
        """
        decode jwt token and check if user is authenticated
        Params:
            token (string): the request sent by the user
            andela_public_key (string): the andela public key
        Returns:
            user_payload (func): the user payload if authenticated
        """
        try:
            user_payload = jwt.decode(
                token,
                andela_public_key,
                algorithms='RS256',
                audience='andela.com',
                options={
                    'verify_signature': True,
                    'verify_exp': True
                }
            )
            return user_payload

        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired')
        except jwt.InvalidAlgorithmError as error:
            if str(error):
                raise exceptions.AuthenticationFailed('User Authorization'
                                                      ' failed. Enter a valid token.')
        except jwt.DecodeError as error:
            if str(error) == 'Signature verification failed':
                raise exceptions.AuthenticationFailed(
                    'Token Signature verification failed.')
            else:
                raise exceptions.AuthenticationFailed('Authorization failed'
                                                      ' due to an Invalid token.')

    def authenticate(self, request, user_payload=None):
        """This method override the authenticate(self, request) method.
        This method returns a tuple of user if authentication succeeds,
        or raise authentication failed otherwise.
        :param request: rest framework request
        :param user_payload: should contain user data
        :return: a tuple of user
        """

        # This should be set in the request header
        token = request.META.get('HTTP_TOKEN') or request.META.get('Token')

        # This should be set as part of environment variables
        andela_public_key64 = os.getenv('ANDELA_PUBLIC_KEY') if not settings.TESTING \
            else os.getenv('TEST_PUBLIC_KEY')

        if not token:
            raise exceptions.AuthenticationFailed(
                'Authorization token is required')

        if not andela_public_key64:
            raise exceptions.AuthenticationFailed(
                'Authorization failed! public key is required ')
        andela_public_key = b64decode(andela_public_key64).decode('utf-8')

        user_payload = self.decodeJWT(token, andela_public_key)

        if not user_payload:
            return None
        user_data = user_payload['UserInfo']
        email_split = user_data['email'].split('@')
        user_data['username'] = email_split[0]
        try:
            user = UserProxy.get_user(user_data)
        except UserProxy.DoesNotExist:
            user = UserProxy.create_user(user_data)
        try:
            AndelaUserProfile.get_and_update_user_profile(user_data)
        except AndelaUserProfile.DoesNotExist:
            AndelaUserProfile.create_user_profile(user_data, user.id)
        return user, None
