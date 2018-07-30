import os
import time
import dotenv

from slackclient import SlackClient

dotenv.load()

# instantiate Slack & Twilio clients
slack_client = SlackClient(dotenv.get('SLACK_BOT_TOKEN'))


def get_slack_users():
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
    user_name = [member for member in members if member.get('profile').get('email') == user['email']]
    return user_name[0].get('id') if user_name else ''


def notify_channel(message):
    slack_client.api_call(
      "chat.postMessage",
      channel="#andela_socials",
      text=message,
      as_user=True,
      reply_broadcast=True,
    )


def notify_user(message, slack_id):
    return slack_client.api_call(
      "chat.postMessage",
      channel=slack_id,
      text=message,
      as_user=True,
      reply_broadcast=True,
    )
