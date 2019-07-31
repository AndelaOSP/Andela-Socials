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


def notify_channel(message, text, channel_id=dotenv.get('DEFAULT_CHANNEL_ID')):
    """
    Notify the channel with the given message
        :param message:
    """
    slack_client.api_call(
        "chat.postMessage",
        channel=channel_id,
        blocks=message,
        text=text,
        as_user=False,
        reply_broadcast=True,
    )


def notify_user(message, slack_id, text, **kwargs):
    """
    Notify the user with the given id with the message
        :param message:
        :param slack_id - The slack id of the user:
    """
    slack_response = slack_client.api_call(
        "chat.postMessage",
        channel=slack_id,
        blocks=message,
        as_user=True,
        reply_broadcast=True,
        text=text,
        **kwargs,
    )
    if slack_response['ok']:
        return slack_response
    else:
        logging.warn(slack_response)


def get_slack_user_timezone(email):
    """
    Get the users timezone
    """

    users = get_slack_users()
    for member in users:
        if member.get('profile').get('email') == email:
            return member.get('tz')
    return ''


def new_event_message(message, event_url, event_id, image_url):
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
        "type": "image",
        "title": {
            "type": "plain_text",
            "text": "Featured Image",
            "emoji": True
        },
        "image_url": image_url,
        "alt_text": "Featured Image"
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
        "oauth.access",
        client_id=getenv('SLACK_CLIENT_ID'),
        client_secret=getenv('SLACK_CLIENT_SECRET'),
        code=code,
        redirect_uri=getenv('SLACK_AUTH_REDIRECT_URI'))

    return response


def get_slack_channels_list(limit=100):
    """
    Helper Function to get list of all slcak conversations
    """
    channels_list = slack_client.api_call(
        "conversations.list",
        exclude_archived=True,
        limit=limit
    )
    if channels_list.get('ok'):
        # retrieve all slack channels
        return channels_list
    return ''


def invite_to_event_channel(user_id, event_channel, channel_creator_token):
    return SlackClient(channel_creator_token).api_call(
            "channels.invite",
            channel=event_channel,
            user=user_id,
        )
