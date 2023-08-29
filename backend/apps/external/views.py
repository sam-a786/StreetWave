from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
import requests
import json
from decouple import config
# Create your views here.

# API code


@api_view(['POST'])
def external(request):

    access_token = config('ACCESS_TOKEN')
    google_token = config('GOOGLE_TOKEN')

    if request.method == 'POST':

        # This returns the address data
        data = JSONParser().parse(request)

        # Google API to convert above address data to lat/long
        # If data from frontend is length one, then there's an address
        if len(data) == 1:

            googleResponse = requests.get(
                "https://maps.googleapis.com/maps/api/geocode/json?address="+data["address"]+"&key="+google_token)

            # Convert response
            jsonGoogleResponse = json.loads(googleResponse.text)

            if jsonGoogleResponse["results"] != []:

                address_components = jsonGoogleResponse["results"][0]["address_components"]

                address_string = ""

                response_list = []

                # Get the string of the address found by Google
                for i in address_components:
                    address_string = address_string + i["short_name"] + " "

                response_list.append(address_string)

                lat = str(jsonGoogleResponse["results"]
                          [0]["geometry"]["location"]["lat"])
                lon = str(jsonGoogleResponse["results"]
                          [0]["geometry"]["location"]["lng"])

                response = requests.get(
                    "https://dev.streetwave.co/api/nsa/location?token="+access_token+"&lat="+lat+"&lon="+lon)

                response_list.append(response.text)

                return Response(response_list)

            # Error handling if Google's API returns nothing
            else:
                return Response("Address Not Found")

        # If data from frontend is length two, then there's a commute
        elif len(data) == 2:

            response = requests.get("https://dev.streetwave.co/api/nsa/commute?token=" +
                                    access_token+"&start="+data["station1"]+"&end="+data["station2"])

            return Response(response.text)

        return Response("Error")
