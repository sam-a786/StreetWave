from django.urls import path
from . import views
from .views import RegisterView, LoginView, UserView, LogoutView, VerifyEmailView, PasswordTokenCheck, PasswordTokenCheck, \
    SetNewPassword, ForgottenPasswordView

# Below we have the urls that point to the correct views so when "register" is called upon it points
# to the register view
urlpatterns = [
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('user', UserView.as_view()),
    path('logout', LogoutView.as_view()),
    path('activate-user/<uidb64>/<token>', views.activate_user, name='activate'),
    path('request-email-verification', VerifyEmailView.as_view(), name='request-email-verification'),
    path('request-reset-email', ForgottenPasswordView.as_view(), name='request-reset-email'),
    path('password-reset/<uidb64>/<token>', views.PasswordTokenCheck.as_view(), name='password-reset-confirm'),
    path('password-reset-complete', views.SetNewPassword.as_view(), name='password-reset-complete')
]
