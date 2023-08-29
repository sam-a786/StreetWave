from rest_framework import serializers
from .models import ContractBonuses, Contracts, ContractSuppliers


class ContractBonusesSerializer(serializers.ModelSerializer):

    class Meta:
        model = ContractBonuses
        fields = '__all__'


class ContractSuppliersSerializer(serializers.ModelSerializer):


    class Meta:
        model = ContractSuppliers
        fields = '__all__'


class ContractSerializer(serializers.ModelSerializer):

    bonuses = ContractBonusesSerializer(
        source='contractbonuses_set',
        many=True,
        read_only=True)

    supplier = ContractSuppliersSerializer(
        many=False,
        read_only=True
    )

    # TODO: Connect serializers to eachother via relationships. Nested preferably.
    # TODO: https://www.django-rest-framework.org/api-guide/relations/
    # TODO: https://stackoverflow.com/questions/14663523/foreign-key-django-model
    # TODO: https://www.django-rest-framework.org/api-guide/serializers/#modelserializer

    class Meta:
        model = Contracts
        fields = ['id', 'title', 'bonuses', 'supplier', 'data_allowance', 'minutes', 'texts', 'cost',
                  'pay_interval', 'length', 'contract_url', 'streetwave_score', 'last_update', 'up_to_date']

