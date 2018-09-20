import graphene
from graphene import relay, ObjectType


from graphql_schemas.utils.helpers import upload_image_file


class UploadImage(relay.ClientIDMutation):
    class Input:
        # ***************** Note ********************
        # Todo: change graphene.String() to scalar type
        # ***************** Note ********************
        image_file = graphene.String()
    response_message = graphene.String()
    image_url = graphene.String()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        print(input)
        image_file = input.get('image_file')
        # ***************** Note ********************
        # Todo:filename must be in the image object or formdata from the client
        # ***************** Note ********************
        file_name = image_file.get('file_name')
        image_url = upload_image_file(image_file, file_name)
        return cls(response_message="hello invite delivered",
                   image_url=image_url)


class ImageMutation(ObjectType):
    upload_image = UploadImage.Field()
