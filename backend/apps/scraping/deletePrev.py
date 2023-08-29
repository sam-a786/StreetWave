class DeletePrev:

    def deleteAllContractData(self):

        from .models import Contracts, ContractBonuses

        Contracts.objects.all().delete()
        ContractBonuses.objects.all().delete()