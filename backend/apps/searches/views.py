from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Filter, Search, SearchFilter
from .serializers import FilterSerializer, SearchSerializer, SearchFilterSerializer, PlainSearchFilterSerializer
from rest_framework.parsers import JSONParser

# View for searching the searches by user. Returns all searches for a user.
@api_view(['GET'])
def UserSearch(request, user_id):
    try:
        searches = Search.objects.filter(user_id=user_id)
        serializer = SearchSerializer(searches, many=True)
        return Response(serializer.data)
    except Search.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

# View for searching searches by id. Returns one search.`
@api_view(['GET'])
def OneSearch(request, search_id):
    try:
        search = Search.objects.get(id=search_id)
        serializer = SearchSerializer(search)
        return Response(serializer.data)
    except Search.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

# View for deleting a search. Deletes the search and all filters connected to it (This will occur due to cascade delete).
@api_view(['DELETE'])
def DelSearch(request, search_id):
    try:
        search = Search.objects.get(id=search_id)
        SearchFilter.objects.filter(searches=search_id).delete()
        search.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Search.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

# View for adding a search. Adds a search and all filters connected to it.
@api_view(['POST'])
def AddSearch(request):

    data = JSONParser().parse(request)
    data = data["search"]
    serializer = SearchSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View for adding a filter-search relationship. Adds a filter-search relationship.
@api_view(['GET'])
def AddSearchesFilter(request):

    data = JSONParser().parse(request)
    data = data["searchFilter"]
    serializer = PlainSearchFilterSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View for searching filters by filter name. Returns one filter.
@api_view(['GET'])
def OneFilter(request, filter_name):
    try:
        filter = Filter.get(filter_name=filter_name)
        serializer = FilterSerializer(filter)
        return Response(serializer.data)
    except Search.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
