from rest_framework import serializers
from .models import Filter, Search, SearchFilter

class PlainSearchFilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchFilter
        fields = ['search_id', 'filter_id', 'value']

class FilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filter
        fields = ['id', 'filter_name', 'isBool']

class SearchFilterSerializer(serializers.ModelSerializer):
    filters = FilterSerializer()

    class Meta:
        model = SearchFilter
        fields = ['id', 'filters', 'value']


class SearchSerializer(serializers.ModelSerializer):
    filters = serializers.SerializerMethodField()

    class Meta:
        model = Search
        fields = ['id', 'filters', 'user_id', 'home_addr', 'work_addr', 'first_station', 'second_station', 'datetime']

    # This is how the serializer can be formatted as is.
    def get_filters(self, obj):
        return [
            {
                "id": SearchFilterSerializer(search_filter).data['id'],
                "filter_name": SearchFilterSerializer(search_filter).data['filters']['filter_name'],
                "value": search_filter.value,
            }
            for search_filter in obj.searchfilter_set.all()
        ]