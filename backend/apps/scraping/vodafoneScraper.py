import time
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from .values import VodafoneValues
from bs4 import BeautifulSoup
from datetime import datetime

class VodafoneScraper:

    def returnDriver(self, debug=False):

        try:
            options = Options()

            if debug:
                options.headless = False
            else:
                options.headless = True

            options.add_argument("--window-size=1920,1200")
            driver = webdriver.Firefox(options=options)
            driver.get('https://www.vodafone.co.uk/mobile/best-sim-only-deals')

            if debug:
                time.sleep(2)

            # TODO: Move locators to values.py

            # Getting selenium to use explicit wait for the page to load -
            # https://www.browserstack.com/guide/selenium-wait-for-page-to-load
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//button[contains(text(), 'Accept all cookies')]")))

            # Click the cookies button (Accept all)
            driver.find_element(By.XPATH, "//button[contains(text(), 'Accept all cookies')]").click()

            return driver

        except Exception as e:
            # TODO - Add logging here
            print(e)
            print("error")
            return None


    def getContractsSourceViaLength(self, driver, type, debug=False):

        try:

            # Get the contract length list and click the type of contract length we want

            contract_len_list = driver.find_element(By.XPATH, "//ul[@class='" + VodafoneValues().CONTRACT_LENGTH_CLASS_LIST_UL + "']")

            if debug:
                contract_len_list.find_element(By.XPATH, "//label[contains(text(), '24 Months')]").click()
                time.sleep(3)
                contract_len_list.find_element(By.XPATH, "//label[contains(text(), '12 Months')]").click()
                time.sleep(3)
                contract_len_list.find_element(By.XPATH, "//label[contains(text(), '30 Days')]").click()

            if type == '24 Months':
                contract_len_list.find_element(By.XPATH, "//label[contains(text(), '24 Months')]").click()
            elif type == '12 Months':
                contract_len_list.find_element(By.XPATH, "//label[contains(text(), '12 Months')]").click()
            elif type == '30 Days':
                contract_len_list.find_element(By.XPATH, "//label[contains(text(), '30 Days')]").click()

            # Sleep here to allow page data to render
            time.sleep(2)

            self.source = driver.page_source
            return self.source

        except Exception as e:
            # TODO - Add logging here
            print(e)
            return None

    def getAllContractData(self, source, sourceInterval, updated):

        from .models import Contracts, ContractBonuses, ContractSuppliers
        import re

        # Create a parser object for beautiful soup
        parserObject = BeautifulSoup(source, "html.parser")

        # On the vodafone site, there is elements containing contracts
        # with the class under CARD_LIST_IDENTIFIER, we want to get all of these
        contractContainers = parserObject.find_all('div', {'class': VodafoneValues().CLASS_CARD_LIST_IDENTIFIER})

        # Loop through each contract container
        for contractContainer in contractContainers:
            # Find all the contract elements in the container
            contracts = contractContainer.find_all('div', {'class': VodafoneValues().CLASS_CARD_IDENTIFIER})

            # Iterate through each contract element
            for contract in contracts:

                try:

                    contractDictionary = {}
                    bonusList = []

                    # Get the contract title
                    titleHolder = contract.find('div', {'class': VodafoneValues().CLASS_ITEM_CARD_TITLE})

                    # Title holder is usually none when the item card is an advertisment (i.e not a contract)
                    # This forces the loop to start at the next index
                    if titleHolder is None:
                        titleHolder = contract.find('div', {'class': VodafoneValues().CLASS_ITEM_CARD_TITLE1})

                        if titleHolder is None:
                            continue

                    # Only one text item in a contract card is under a h2, which is the title
                    # TODO: Not comfortable searching by h2, find a better way to do this
                    title = titleHolder.find('h2')
                    contractDictionary["title"] = title.text

                    # Item card features class has all contract details relating to data, minutes, texts
                    contractDetailHolders = contract.find_all('div', {'class': VodafoneValues().CLASS_ITEM_CARD_FEATURES})

                    for contractDetailHolder in contractDetailHolders:

                        # Attempt to find the data and minuites/texts elements. If they are not found, this will become a
                        # None object, which will be handled in the if statement below
                        contractDataElement = contractDetailHolder.find('span', {'class': VodafoneValues().CLASS_ITEM_CARD_DATA_ALLOWANCE})
                        contractMinuteTextElement = contractDetailHolder.find('span', {'class': VodafoneValues().CLASS_ITEM_CARD_MIN_TEXT})

                        if contractDataElement is None or contractMinuteTextElement is None:

                            contractPriceElement = contractDetailHolder.find('span', {'class': VodafoneValues().CLASS_ITEM_CARD_PRICE})

                            # TODO: Reformat the way re.sub does this, solution found at
                            # https://stackoverflow.com/questions/1450897/remove-characters-except-digits-from-string-using-python
                            contractDictionary["price"] = re.sub('\D', '', contractPriceElement.text)
                            continue

                        # Below, check if unlimited exists in each field. If it does, give the value -1.

                        if re.search('Unlimited', contractDataElement.text):
                            contractDictionary["data_allowance"] = "-1"
                        else:
                            contractDictionary["data_allowance"] = re.sub('\D', '', contractDataElement.text)

                        if re.search('Unlimited', contractMinuteTextElement.text):
                            contractDictionary["min_text_allowance"] = "-1"
                        else:
                            contractDictionary["min_text_allowance"] = re.sub('\D', '', contractDataElement.text)
                            # TODO: Log this, this shouldnt be possible
                            raise Exception("WARNING! Non unlimited text/minute allowance found on vodafone contract. "
                                            "Please check this contract manually and update the code to handle this case")

                        # Handle bonuses to the contract below. This is done by finding the text containers for bonuses in
                        # the contract element which have special classes just for them

                    contractBonusElements = contract.find_all('div', {'class': VodafoneValues().CLASS_BONUS_DIV_TEXT_CONTAINER})
                    if contractBonusElements is not None:
                        for bonus in contractBonusElements:
                            if bonus is not None:

                                try:
                                    bonus = re.sub('oror', '', bonus.text)
                                except Exception as e:
                                    # TODO - Add logging here
                                    print(e)
                                    pass

                                bonusList.append(bonus + ".")

                    # Streetwave score calculation

                    score_calc = 0

                    data_amount = int(contractDictionary["data_allowance"])
                    minutes_amount = int(contractDictionary["min_text_allowance"])
                    texts_amount = int(contractDictionary["min_text_allowance"])
                    cost_amount = int(contractDictionary["price"])
                    data_score = 0
                    minutes_score = 0
                    texts_score = 0
                    cost_score = 0

                    if data_amount == -1:
                        data_score = 100
                    elif data_amount >= 100:
                        data_score = 80
                    elif data_amount >= 30:
                        data_score = 60
                    elif data_amount >= 5:
                        data_score = 40
                    elif data_amount >= 1:
                        data_score = 20
                    else:
                        data_score = 0

                    if minutes_amount == -1:
                        minutes_score = 100
                    elif minutes_amount >= 1000:
                        minutes_score = 80
                    elif minutes_amount >= 500:
                        minutes_score = 60
                    elif minutes_amount >= 200:
                        minutes_score = 40
                    elif minutes_amount >= 100:
                        minutes_score = 20
                    else:
                        minutes_score = 0
                    
                    if texts_amount == -1:
                        texts_score = 100
                    elif texts_amount >= 1000:
                        texts_score = 80
                    elif texts_amount >= 500:
                        texts_score = 60
                    elif texts_amount >= 200:
                        texts_score = 40
                    elif texts_amount >= 100:
                        texts_score = 20
                    else:
                        texts_score = 0

                    if cost_amount < 7:
                        cost_score = 100
                    elif cost_amount < 10:
                        cost_score = 80
                    elif cost_amount < 15:
                        cost_score = 60
                    elif cost_amount < 25:
                        cost_score = 40
                    elif cost_amount < 40:
                        cost_score = 20
                    else:
                        cost_score = 0

                    score_calc = cost_score * 0.30 + texts_score * 0.05 + minutes_score * 0.05 + data_score * 0.20 + 100 * 0.40

                    newContract = Contracts(supplier=ContractSuppliers.objects.get(supplier_name='Vodafone'),
                                                title = contractDictionary["title"],
                                                data_allowance = contractDictionary["data_allowance"],
                                                minutes = contractDictionary["min_text_allowance"],
                                                texts = contractDictionary["min_text_allowance"],
                                                cost = cost_amount,
                                                pay_interval = 1, 
                                                length = sourceInterval,
                                                contract_url = "https://www.vodafone.co.uk/mobile/best-sim-only-deals",
                                                streetwave_score = score_calc,
                                                last_update = datetime.now(),
                                                up_to_date = updated
                                                )

                    newContract.save()
                    id = newContract.id

                    for bonus in bonusList:
                        newContractBonus = ContractBonuses(contract_id=id, bonus_desc=bonus, bonus_val=0)
                        newContractBonus.save()

                except Exception as e:
                    # TODO - Add logging here
                    print(e)
                    return None

                # Find data and minute text allowance by finding said text, find parent of that text, find span in the parent,
                # get child span of that span then get text

                #Bonuses dont know yet