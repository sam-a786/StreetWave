from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

# Using abstract user to create a model for the sign-up issue below


class User(AbstractUser):

    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    username = None
    isVerified = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
