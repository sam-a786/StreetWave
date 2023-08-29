"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf import settings
from apps.credentials.views import front
from apps.external.views import external
from apps.scraping.views import AllContracts, OneContract, DemoContract
from apps.stations.views import stations, newstations
from apps.credentials import views
from apps.searches import views as search_views

# Routing for the backend to the frontend. Ensure Build is run for node to ensure issues encountered
# here aren't build related. The 'front' view imports the index.html file from the frontend build.
# Basically most of the time you will be using front (until we clean this area up).

from django.contrib import admin
from django.urls import path, include, re_path
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.credentials.urls')),
    path("", front, name="front"),
    path("compare/", front, name="compare"),
    path("signup/", front, name="signup"),
    path("404/", front, name="notfound"),
    path("forgottenpassword/", front, name="forgottenpassword"),
    path("newpassword/", front, name="newpassword"),
    path("success/", front, name="success"),
    path("activate-failed/", front, name="activate-failed"),
    path('activate-user/<uidb64>/<token>/', views.activate_user, name='activate'),
    path('password-reset/<uidb64>/<token>', views.PasswordTokenCheck.as_view(), name='password-reset-confirm'),
    path("resend-email", front, name="resend-email"),
    path("check-email", front, name="check-email"),
    path("activate-success/", front, name="activate-success"),
    path("api/contracts/", AllContracts, name="all_contracts"),
    path("api/contractsdemo/", DemoContract, name="demo_contracts"),
    path("api/contracts/<str:pk>", OneContract, name="one_contract"),
    path("api/scores/", external, name="external"),
    path("api/stations/", stations, name="stations"),
    path("api/updatestations/", newstations, name="newstations"),
    path('api/searches/searchuser/<int:user_id>/', search_views.UserSearch),
    path('api/searches/searchid/<int:search_id>/', search_views.OneSearch),
    path('api/searches/delete/<int:search_id>/', search_views.DelSearch),
    path('api/searches/add/', search_views.AddSearch),
    path('api/searches/getfilter/<str:filter_name>/', search_views.OneFilter),
    path('api/searches/addsearchfilter/', search_views.AddSearchesFilter),

    # Catch-all route to delegate routing to React
    re_path(r'^.*$', serve, {'document_root': settings.STATIC_ROOT, 'path': 'index.html'})
]

handler404 = 'apps.credentials.views.view_404'
