from django.db import models

# Create your models here.
# TODO: Expand how the database tables interact

class Contracts(models.Model):

    supplier = models.ForeignKey('ContractSuppliers',
                                    on_delete=models.CASCADE)
    title = models.CharField(max_length=100, default='')
    data_allowance = models.IntegerField(max_length=11, default='')
    minutes = models.IntegerField(max_length=11, default='')
    texts = models.IntegerField(max_length=11, default='')
    cost = models.IntegerField(max_length=11, default='')
    pay_interval = models.IntegerField(max_length=11, default='')
    length = models.IntegerField(max_length=11, default='')
    contract_url = models.CharField(max_length=200, default='')
    streetwave_score = models.IntegerField(max_length=11, default='')
    last_update = models.DateTimeField()
    up_to_date = models.IntegerField(max_length=1, default=0)

    class Meta:
        db_table = "contracts"

    def __str__(self):
        return self.id

class ContractSuppliers(models.Model):

    supplier_name = models.CharField(max_length=50, default='')

    class Meta:
        db_table = "contracts_suppliers"

    def __str__(self):
        return self.id

class ContractBonuses(models.Model):

    contract = models.ForeignKey('Contracts',
                                    on_delete=models.CASCADE)

    bonus_desc = models.CharField(max_length=100, default='')
    bonus_val = models.IntegerField(max_length=11, default='')

    class Meta:
        db_table = "contracts_bonuses"

    def __str__(self):
        return self.id