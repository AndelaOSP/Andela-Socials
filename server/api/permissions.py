from rest_framework import permissions


class IsTokenAuthenticated(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.user.is_authenticated():
            return True
        return False
