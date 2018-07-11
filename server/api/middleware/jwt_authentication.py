from rest_framework.request import Request
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from ..models import AndelaUserProfile


def jwt_authentication_middleware(get_response):

    def middleware(request):
        try:
            user_jwt = JSONWebTokenAuthentication().authenticate(Request(request))
            user = user_jwt[0]
            andela_user_profile = AndelaUserProfile.objects.get(user=user)
            request.user = andela_user_profile
        except Exception as e:
            pass

        return get_response(request)
    return middleware
