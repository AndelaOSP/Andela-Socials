import base64
from google_auth_oauthlib.flow import Flow
from django.conf import settings
from Crypto.Cipher import AES

from Crypto import Random
IV = Random.new().read(AES.block_size)
KEY = bytes(settings.CRYPTOGRAPHIC_KEY, 'utf-8')
CIPHER = AES.new(KEY, AES.MODE_CFB, IV)

GOOGLE_CREDENTIALS = {
    "web": {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "project_id": "hini-1530850449245",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://accounts.google.com/o/oauth2/token",
        "auth_provider_x509_cert_url":
            "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uris": [
            "http://proton-dev.com:5000/authorize",
            "http://localhost:5000/authorize"
        ],
        "javascript_origins":
            [
                "http://localhost:5000",
                "http://proton-dev.com:5000"
            ]
    }
}


FLOW = Flow.from_client_config(GOOGLE_CREDENTIALS,
                               scopes=['https://www.googleapis.com/auth/calendar'],
                               redirect_uri='http://localhost:8000/api/v1/oauthcallback')


def get_auth_url(andela_user):
    """
        Returns authorization URL using Flow instance
            :param andela_user:
    """
    user_email = andela_user.user.email
    auth_url, state = FLOW.authorization_url(prompt='consent',
                                             included_granted_scopes='true',
                                             login_hint=user_email)
    andela_user.state = state
    andela_user.save()
    return auth_url


def save_credentials(code, andela_user):
    """
        Fetches token and Encrypts it for Andela User
            :param code:
            :param andela_user:
    """
    FLOW.fetch_token(code=code)
    credentials = FLOW.credentials
    token = encrypt_encode_item(credentials.token)
    print(token)

    andela_user.token = token
    andela_user.save()


def encrypt_encode_item(item):
    """
        Encrypt and encode Item using the Crypto package cipher instance
            :param item:
    """
    encrypted_item = IV + CIPHER.encrypt(item)
    encoded_item = base64.b64encode(encrypted_item)
    return encoded_item


def decode_decrypt_item(encrypted_item):
    """
        Decode and decrypt item using the Crypto package cipher instance
            :param encrypted_item:
    """
    decoded_item = base64.b64decode(encrypted_item)
    item = CIPHER.decrypt(decoded_item)
    item = item[16:].decode('utf-8')
    return item
