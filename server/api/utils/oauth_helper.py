from google_auth_oauthlib.flow import Flow
from django.conf import settings


GOOGLE_CREDENTIALS = {
    "web": {
        "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
        "project_id": settings.GOOGLE_PROJECT_ID,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://accounts.google.com/o/oauth2/token",
        "auth_provider_x509_cert_url":
            "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET,
    }
}


scopes = ['https://www.googleapis.com/auth/calendar']
FLOW = Flow.from_client_config(GOOGLE_CREDENTIALS,
                               scopes=scopes,
                               redirect_uri=settings.GOOGLE_REDIRECT_URI)


def get_auth_url(andela_user):
    """
        Returns authorization URL using Flow instance
            :param andela_user:
    """
    user_email = andela_user.user.email
    auth_url, state = FLOW.authorization_url(prompt='consent',
                                             included_granted_scopes='true',
                                             login_hint=user_email,
                                             access_type='offline')

    andela_user.state = state
    andela_user.save()

    return auth_url


def save_credentials(access_code, andela_user):
    """
        Fetches token and Encrypts it for Andela User
            :param code:
            :param andela_user:
    """
    FLOW.fetch_token(code=access_code)
    credentials = FLOW.credentials

    andela_user.credential = credentials
    andela_user.save()
