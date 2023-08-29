from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import ContractBonuses, Contracts, ContractSuppliers
from .serializers import ContractBonusesSerializer, ContractSuppliersSerializer, ContractSerializer
from .vodafoneScraper import VodafoneScraper
from .eeScraper import eeScraper
from .o2Scraper import o2Scraper
from .threeScraper import threeScraper
from datetime import datetime, timedelta

# Create your views here.

@api_view(['GET'])
def AllContracts(request):

    if request.method == 'GET':
        latestObject = Contracts.objects.latest('last_update')

        serializer = ContractSerializer(latestObject, many=False)

        current = serializer.data.get("up_to_date")

        lastUpdateTime = serializer.data.get('last_update')

        lastUpdateTime = lastUpdateTime.replace("T", " ")

        lastUpdateTime = lastUpdateTime.replace("Z", "")

        # https://stackoverflow.com/questions/4541629/how-to-create-a-datetime-equal-to-15-minutes-ago
        if datetime.strptime(lastUpdateTime, "%Y-%m-%d %H:%M:%S") > (datetime.now() - timedelta(minutes=5)):
            if current == 1:
                current = 0
            else:
                current = 1

        contractObjects = Contracts.objects.filter(up_to_date=current)
        serializer = ContractSerializer(contractObjects, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def OneContract(request, pk):

    if request.method == 'GET':
        contractObject = Contracts.objects.get(id=pk)
        serializer = ContractSerializer(contractObject, many=False)
        return Response(serializer.data)

@api_view(['GET'])
def DemoContract(request):

    if request.method == 'GET':

        try:
            latestObject = Contracts.objects.latest('last_update')

            serializer = ContractSerializer(latestObject)

            current = serializer.data.get("up_to_date")

            if current == 0:
                current = 1
            else:
                current = 0

            Contracts.objects.filter(up_to_date=current).delete()

        except:
            current = 0

        try:
            scraper = VodafoneScraper()
            driver = scraper.returnDriver()
            contractSourceA = scraper.getContractsSourceViaLength(driver, '24 Months')
            contractSourceB = scraper.getContractsSourceViaLength(driver, '12 Months')
            contractSourceC = scraper.getContractsSourceViaLength(driver, '30 Days')
            scraper.getAllContractData(contractSourceA, '24', current)
            scraper.getAllContractData(contractSourceB, '12', current)
            scraper.getAllContractData(contractSourceC, '1', current)
            driver.close()
        except Exception as e:
            print('Vodafone scraper failed ' + str(e))

        # This is different to Vodafone as individual links for 24/12/1 month contracts are available
        scraper1 = o2Scraper()
        driver24 = scraper1.returnDriver('24')
        driver12 = scraper1.returnDriver('12')
        driver1 = scraper1.returnDriver('1')
        scraper1.getAllContractData(driver24, '24', current)
        scraper1.getAllContractData(driver12, '12', current)
        scraper1.getAllContractData(driver1, '1', current)

        eeScraper().getAllContractData(current)
        threeScraper().getAllContractData(current)




