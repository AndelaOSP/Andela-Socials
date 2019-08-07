from rest_framework.request import Request
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from ..models import AndelaUserProfile


def jwt_authentication_middleware(get_response):
    """Handle jwt authentication"""

    def middleware(request):
        """
        validates if the user is authenticated
        Params:
            request (dict): the request sent by the user
        Returns:
            get_response (func): returns the response
        """
        try:
            user_jwt = JSONWebTokenAuthentication().authenticate(Request(request))
            user = user_jwt[0]
            andela_user_profile = AndelaUserProfile.objects.get(user=user)
            request.user = andela_user_profile
        except Exception:
            pass

        return get_response(request)
    return middleware
