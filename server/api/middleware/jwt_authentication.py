from rest_framework.request import Request
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from ..models import GoogleUser


def jwt_authentication_middleware(get_response):

    def middleware(request):
        try:
            user_jwt = JSONWebTokenAuthentication().authenticate(Request(request))
            user = user_jwt[0]
            google_user = GoogleUser.objects.get(app_user=user)
            request.user = request.cached_user = google_user
        except Exception as e:
            pass

        return get_response(request)
    return middleware
