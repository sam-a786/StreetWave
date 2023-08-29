from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.sites.shortcuts import get_current_site
from django.contrib import messages
from django.core.mail import EmailMessage
from django.shortcuts import render, redirect, get_object_or_404
from django.template.loader import render_to_string
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.utils.encoding import force_str, force_bytes, smart_str, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.views import APIView
from .utils import generate_token, forgotten_password_token
from .models import User
from .serializers import UserSerializer, UserUpdateSerializer, ResetPasswordEmailRequestSerializer, SetNewPasswordSerializer
import jwt
import datetime

# Video tutorial for login/signup/logout (backend)
# https://www.youtube.com/watch?v=PUzgZrS_piQ&list=PLlameCF3cMEtfyO6H7WXUAqoIJO21bDNp

# Create your views here.

# Front renders the base page layout everywhere.


def front(request):
    context = {}
    return render(request, "index.html", context)

# Creating a function to send an activation email to the user when signing up


def send_activation_email(user, request):
    current_site = get_current_site(request)
    email_subject = 'Activate your account'
    email_body = render_to_string('activate.html', {
        'user': user,
        'domain': current_site,
        'uid': urlsafe_base64_encode(force_bytes(user.pk)),
        'token': generate_token.make_token(user)
    })

    email = EmailMessage(subject=email_subject, body=email_body,
                         from_email=settings.EMAIL_FROM_USER, to=[user.email])

    email.send()

# Creating a function to set the user as verified after they click link in email
def activate_user(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)

    except Exception as e:
        user = None

    if user and generate_token.check_token(user, token):
        user.isVerified = True
        user.save()
        messages.success(request, 'Email verified, you can now login')
        return redirect('/activate-success')
    else:
        return redirect('/activate-failed/')


class ForgottenPasswordView(APIView):
    def post(self, request):
        getEmail = request.data.get('email')
        user = get_object_or_404(User, email=getEmail)
        current_site = get_current_site(request)
        token = PasswordResetTokenGenerator().make_token(user)
        email_subject = 'Your Streetwave password reset request'
        email_body = render_to_string('forgottenPassword.html', {
            'user': user,
            'domain': current_site,
            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            'token': PasswordResetTokenGenerator().make_token(user)
        })

        email = EmailMessage(subject=email_subject, body=email_body, from_email=settings.EMAIL_FROM_USER,
                             to=[user.email])
        email.send()
        return redirect('/check-email/')


class PasswordTokenCheck(APIView):
    def get(self, request, uidb64, token):

        try:
            uid = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=uid)

            if not PasswordResetTokenGenerator().check_token(user, token):
                return redirect('/token-invalid')

            return redirect('/password-reset?token='+token+'&&udidb64='+uidb64)

        except DjangoUnicodeDecodeError as identifier:
            return redirect('/token-invalid')


class SetNewPassword(APIView):
    serializer_class = SetNewPasswordSerializer

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success': True, 'message': 'Password reset successfully!'}, status=status.HTTP_200_OK)


# Below we have the class to sign up a new user
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        send_activation_email(user, request)
        return Response(serializer.data)

# Below we have a class to allow the user to login


class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('User not found!')

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!')

        # If email isn't verified do not let the user login
        if not user.isVerified:
            raise AuthenticationFailed('Email not verified yet!')

        # Below the payload to keep track of the login token and how long it will last
        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256')
        response = Response()

        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'jwt': token
        }
        return response

# This class below checks which user is currently logged in
# it checks by retrieving the cookie


class UserView(APIView):
    # Getting the values/details of the user that is currently logged in
    def get(self, request):
        token = request.META['HTTP_AUTHORIZATION']
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        user = User.objects.get(id=payload['id'])
        serializer = UserSerializer(user)
        return Response(serializer.data)
    # Again here similarly to above this is also token fetching and this is just for updating the user values

    def put(self, request):
        token = request.META['HTTP_AUTHORIZATION']
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        user_instance = User.objects.get(id=payload['id'])
        serializer = UserUpdateSerializer(
            instance=user_instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

# This class is to delete the cookies so the user can then be logged out


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {'message': 'success'}
        return response


def view_404(request, exception=None):
    return HttpResponseRedirect("/404")


class VerifyEmailView(APIView):
    def post(self, request):
        getEmail = request.data.get('email')
        user = get_object_or_404(User, email=getEmail)
        current_site = get_current_site(request)
        email_subject = 'Activate your account'
        email_body = render_to_string('activate.html', {
            'user': user,
            'domain': current_site,
            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            'token': generate_token.make_token(user)
        })
        email = EmailMessage(subject=email_subject, body=email_body, from_email=settings.EMAIL_FROM_USER,
                             to=[user.email])
        email.send()

        return Response({'success': 'Email verification link sent successfully.'}, status=200)