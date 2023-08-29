from django.db import models

# Create your models here.
class Filter(models.Model):

    filter_name = models.CharField(max_length=50, null=True)
    isBool = models.IntegerField(null=True)

    class Meta:
        db_table = 'filters'

class Search(models.Model):

    user_id = models.IntegerField(default=0)
    home_addr = models.CharField(max_length=50, default='0')
    work_addr= models.CharField(max_length=50, default='0')
    first_station = models.CharField(max_length=50, default='0')
    second_station = models.CharField(max_length=50, default='0')
    datetime = models.DateTimeField()

    class Meta:
        db_table = 'searches'

class SearchFilter(models.Model):

    searches = models.ForeignKey(Search, on_delete=models.CASCADE)
    filters = models.ForeignKey(Filter, on_delete=models.CASCADE)
    value = models.IntegerField(null=True)

    class Meta:
        db_table = 'searches_filters'

    def __str__(self):
        return self.id


# Below is a models.py file from Django that describes some database tables. I want you to generate a serializers file and views file that contain the following functions: A function to get all matching searches (and associated filter information with the columns filter_name and isBool) by user ID, a function to get one search (and associated filter information with the columns filter_name and isBool) just by the search ID and a function to delete a search and associated filter information by search id.