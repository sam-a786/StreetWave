import re
from django.test import TestCase as DjangoTestCase
from unittest import TestCase as UnitTestCase
from .vodafoneScraper import VodafoneScraper
from .o2Scraper import o2Scraper
from .values import VodafoneValues
from .values import O2Values


class VodafoneScraperTests(UnitTestCase):

    def setUp(self):
        self.scraper = VodafoneScraper()
        self.values = VodafoneValues()
        self.driver = self.scraper.returnDriver()
        self.source = self.driver.page_source
        from bs4 import BeautifulSoup
        self.soupParser = BeautifulSoup(self.source, 'html.parser')

    def test_vodafone_alive(self):

        from requests import get
        response = get('https://www.vodafone.co.uk/mobile/best-sim-only-deals')
        self.assertEqual(response.status_code, 200)

    def test_contract_length_exists(self):

        # Parse source data into bs4 object and find the contract length options on the page. Assert that they exist

        self.assertIsNotNone(self.soupParser.find('ul', {"class" : self.values.CONTRACT_LENGTH_CLASS_LIST_UL}))

    def test_contract_lengths_with_regex(self):

        # Parse source data into bs4 object and find the contract length options on the page. Assert that each contract
        # length exists

        with self.subTest():
            self.assertIsNotNone(re.findall('24 Months',
                                            self.soupParser.find('ul',
                                            {"class" : self.values.CONTRACT_LENGTH_CLASS_LIST_UL}).text), '24 Months not found')
        with self.subTest():
            self.assertIsNotNone(re.findall('12 Months',
                                            self.soupParser.find('ul',
                                            {"class" : self.values.CONTRACT_LENGTH_CLASS_LIST_UL}).text), '12 Months not found')
        with self.subTest():
            self.assertIsNotNone(re.findall('30 Days',
                                            self.soupParser.find('ul',
                                            {"class" : self.values.CONTRACT_LENGTH_CLASS_LIST_UL}).text), '30 Days not found')


    def test_contract_length_click(self):

        # Parse source data into bs4 object and find the contract length options on the page. Assert that the contract
        # length we want exists and then click it
        with self.subTest():
            self.assertIsNotNone(self.scraper.getContractsSourceViaLength(self.driver, '24 Months'))
        with self.subTest():
            self.assertIsNotNone(self.scraper.getContractsSourceViaLength(self.driver, '12 Months'))
        with self.subTest():
            self.assertIsNotNone(self.scraper.getContractsSourceViaLength(self.driver, '30 Days'))

    def tearDown(self):
        self.driver.close()


class O2ScraperTests(UnitTestCase):

    def setUp(self):
        self.scraper = o2Scraper()
        self.values = O2Values()
        self.driver = self.scraper.returnDriver(24)
        self.source = self.driver
        from bs4 import BeautifulSoup
        self.soupParser = BeautifulSoup(self.source, 'html.parser')

    def test_o2_alive(self):

        from requests import get
        response = get('https://www.o2.co.uk/shop/sim-cards/sim-only-deals?setTTSelectedStack=legacy#deviceType=phone&contractLength=P24M')
        self.assertEqual(response.status_code, 200)

    def test_run_scrape_object(self):

        # Set source to None to overrite previous values in setup, then run the scrape object

        self.source = None
        self.source = self.scraper.returnDriver(24)
        self.assertIsNotNone(self.source)

    def test_contract_containers_exist(self):

        # Parse source data into bs4 object and find the contract length options on the page. Assert that they exist

        self.assertIsNotNone(self.soupParser.find_all('div', {'class': O2Values().CLASS_CARD_LIST_IDENTIFIER}))

    # Source is gotten instead of driver so no teardown