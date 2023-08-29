from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from .vodafoneScraper import VodafoneScraper
from .eeScraper import eeScraper
from .o2Scraper import o2Scraper
from .threeScraper import threeScraper
from .deletePrev import DeletePrev
from .models import ContractBonuses, Contracts, ContractSuppliers
from .serializers import ContractBonusesSerializer, ContractSuppliersSerializer, ContractSerializer

class ContractUpdater:

    def getContracts(self):
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

    def start(self):

        scheduler = BackgroundScheduler()

        scheduler.add_job(self.getContracts, 'interval', minutes=60)

        scheduler.start()
