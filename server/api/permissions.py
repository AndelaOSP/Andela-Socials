from rest_framework import permissions


class IsTokenAuthenticated(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.user is not None:
            return True
        return False
