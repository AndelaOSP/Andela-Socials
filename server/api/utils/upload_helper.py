import uuid

from google.cloud import storage
from django.conf import settings

# Authenticate storage client
storage_client = storage.Client.from_service_account_json('/Users/jeanabayo/Work/Andela-Socials/server/api/utils/creds.json')


def file_uploader(metadata):
    """
        Upload file to Google cloud Bucket
            :param metadata:
    """
    # Identify the storage bucket
    bucket = storage_client.get_bucket('andela-social-uploads')
    # Name the uplaoded file is going to take
    destination_blob_name = 'images/' + metadata.get('file_name') + str(uuid.uuid4())
    blob = bucket.blob(destination_blob_name)
    # The actual file to be uploaded
    source_file_name = "/Users/jeanabayo/Work/user.jpg"
    blob.upload_from_filename(source_file_name)

    print('File {} uploaded to {}.'.format(source_file_name, destination_blob_name))
