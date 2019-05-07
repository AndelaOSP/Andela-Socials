import dotenv

from slackclient import SlackClient
from os import getenv
dotenv.load()

# instantiate Slack & Twilio clients
slack_client = SlackClient(dotenv.get('SLACK_BOT_TOKEN'))


def get_slack_users(users=[]):
    """
    Helper function to return all slack users.
    """
    api_call = slack_client.api_call("users.list")
    if api_call.get('ok'):
        # retrieve all users so we can find our bot
        users = api_call.get('members')
    return users


def get_slack_id(user):
    """
    Helper function to get user's slack name.
    """
    members = get_slack_users()
    user_name = [
        member for member in members
        if member.get('profile').get('email') == user['email']
    ]
    return user_name[0].get('id') if user_name else ''


def notify_channel(message):
    """
    Notify the channel with the given message
        :param message:
    """
    slack_client.api_call(
        "chat.postMessage",
        channel="#andela_socials",
        text=message,
        as_user=True,
        reply_broadcast=True,
    )


def notify_user(message, slack_id, **kwargs):
    """
    Notify the user with the given id with the message
        :param message:
        :param slack_id - The slack id of the user:
    """
    return slack_client.api_call(
        "chat.postMessage",
        channel=slack_id,
        blocks=message,
        as_user=True,
        reply_broadcast=True,
        **kwargs,
    )


def get_slack_user_timezone(email):
    """
    Get the users timezone
    """

    users = get_slack_users()
    for member in users:
        if member.get('profile').get('email') == email:
            return member.get('tz')
    return ''


def new_event_message(message, event_url, event_id):
    """
    Return slack message to send when new event is created
    """
    return [{
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": message
        }
    }, {
        "type": "actions",
        "block_id": "event_actions",
        "elements": [
            {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "Attend",
                },
                "action_id": "attend_event",
                "style": "primary",
                "value": event_id
            },
            {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "View Details",
                    "emoji": True
                },
                "url": event_url
            }
        ]
    }]


def generate_simple_message(text):
    """
    Generate message block
    :rtype: list
    :param text:
    :return: list of dictionary containing the slack markdown message structure
    """
    return [{
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": text
        }
    }]


def get_slack_user_token(code):
    """
    Gets the slack user's oauth token in order to make requests
    on their behalf
        :param code - the code returned by slack after authorization :
    """
    response = slack_client.api_call(
        "oauth.token",
        client_id=getenv('SLACK_CLIENT_ID'),
        client_secret=getenv('SLACK_CLIENT_SECRET'),
        code=code)

    return response

