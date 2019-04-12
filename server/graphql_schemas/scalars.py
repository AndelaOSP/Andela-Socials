from graphene.types import Scalar
from graphql.language import ast

class NonEmptyString(Scalar):
    '''Scalar For non-empty string fields'''

    @staticmethod
    def serialize(value):
        return value

    @staticmethod
    def parse_literal(node):
        if isinstance(node, ast.StringValue):
            return node.value or None

    @staticmethod
    def parse_value(value):
        return value or None
