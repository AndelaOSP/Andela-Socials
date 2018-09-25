import graphene
from graphene import relay, ObjectType
from graphene_file_upload.scalars import Upload


from graphql_schemas.utils.helpers import upload_image_file


class UploadImage(relay.ClientIDMutation):
    class Input:
        # Use Upload to make graphene understand multipart/form-data
        featured_image = Upload(required=True)
    response_message = graphene.String()
    image_url = graphene.String()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        image_file = input['featured_image']
        image_url = upload_image_file(image_file)
        return cls(response_message=True,
                   image_url=image_url)


class ImageMutation(ObjectType):
    upload_image = UploadImage.Field()
