from rest_framework import serializers
from .models import StationsModel

# Serializer has to exist to convert model data types to JSON
# A good tutorial on serialization: https://www.django-rest-framework.org/tutorial/1-serialization/
# In a nutshell, we need a way to convert data for the REST API to JSON format so React can read it.
# The serializer is the way to do that.

class StationsSerializer(serializers.ModelSerializer):

    # Class name doesn't matter here, likely best to describe the data as a whole being sent/recieved.
    class StationsInfo:
        model = StationsModel
        fields = '__all__'

    # This wouldnt work without the 'Meta' class.
    class Meta:
        model = StationsModel
        fields = '__all__'

        # Quick note here that the __all__ selector is for selecting all fields in the model. This
        # includes Email and Password. If you want to select specific fields, you can do so by listing them out like this:
        # fields = ['email', 'password']