from django.db import models

# Create your models here.
class StationsModel(models.Model):

    station_name = models.CharField(max_length=50)
    lat = models.CharField(max_length=50)
    long = models.CharField(max_length=50)
    crsCode = models.CharField(max_length=3)

    class Meta:
        db_table = "stations"

    def __str__(self):
        return self.id