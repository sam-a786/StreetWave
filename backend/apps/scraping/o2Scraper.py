import time
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from .values import O2Values
from bs4 import BeautifulSoup
from datetime import datetime

class o2Scraper:

    def returnDriver(self, type, debug=False):

        try:
            options = Options()

            if debug:
                options.headless = False
            else:
                options.headless = True

            options.add_argument("--window-size=1920,1200")
            driver = webdriver.Firefox(options=options)

            # Sets the driver to the specific web page for 24/12/1 month contracts
            if type == '24':
                driver.get('https://www.o2.co.uk/shop/sim-cards/sim-only-deals?setTTSelectedStack=legacy#deviceType=phone&contractLength=P24M')
            elif type == '12':
                driver.get('https://www.o2.co.uk/shop/sim-cards/sim-only-deals?setTTSelectedStack=legacy#deviceType=phone&contractLength=P12M')
            elif type == '1':
                driver.get('https://www.o2.co.uk/shop/sim-cards/sim-only-deals?setTTSelectedStack=legacy#deviceType=phone&contractLength=P30D')
            else:
                driver.get('https://www.o2.co.uk/shop/sim-cards/sim-only-deals?setTTSelectedStack=legacy#deviceType=phone&contractLength=P30D')
            
            if debug:
                time.sleep(2)

            # wait for page to load
            time.sleep(3)

            return driver.page_source

        except Exception as e:
            # TODO - Add logging here
            print("driver error")
            print(e)

            return None

    def getAllContractData(self, source, sourceInterval, updated):

        from .models import Contracts, ContractBonuses, ContractSuppliers
        import re

        # Create a parser object for beautiful soup
        parserObject = BeautifulSoup(source, "html.parser")

        # On the vodafone site, there is elements containing contracts
        # with the class under CARD_LIST_IDENTIFIER, we want to get all of these
        contractContainers = parserObject.find_all('div', {'class': O2Values().CLASS_CARD_LIST_IDENTIFIER})

        # Loop through each contract container
        for contractContainer in contractContainers:
            # Find all the contract elements in the container
            contracts = contractContainer.find_all('div', {'class': O2Values().CLASS_CARD_IDENTIFIER})

            # Iterate through each contract element
            for contract in contracts:

                try:

                    contractDictionary = {}
                    bonusList = []

                    # No titles for O2 contracts
                    contractDictionary["title"] = ""

                    # Attempt to find the data and minutes/texts elements. If they are not found, this will become a
                    # None object, which will be handled in the if statement below
                    contractDataElement = contract.find('span', {'class': O2Values().CLASS_ITEM_CARD_DATA_ALLOWANCE})
                    contractMinuteTextElement = contract.find('div', {'class': O2Values().CLASS_ITEM_CARD_MIN_TEXT})

                    contractRealPriceElement = contract.find('div', {'class': O2Values().CLASS_ITEM_CARD_PRICE_2})

                    if contractRealPriceElement is not None:
                        contractRealPriceElement.text[10:]
                        stringPrice = str(contractRealPriceElement.text)
                        finalPrice = stringPrice[10:]
                        contractPriceElement = finalPrice
                    else:
                        contractPriceElement = contract.find('span', {'class': O2Values().CLASS_ITEM_CARD_PRICE}).text

                    contractDictionary["price"] = re.sub('\D', '', contractPriceElement)

                    # Below, check if unlimited exists in each field. If it does, give the value -1.

                    if re.search('Unlimited', contractDataElement.text):
                        contractDictionary["data_allowance"] = "-1"
                    else:
                        contractDictionary["data_allowance"] = re.sub('\D', '', contractDataElement.text)

                    if re.sub('\D', '', contractMinuteTextElement.text):
                        contractDictionary["min_allowance"] = re.sub('\D', '', contractMinuteTextElement.text)
                    elif re.search('Unlimited', contractMinuteTextElement.text):
                        contractDictionary["min_allowance"] = "-1"

                    if re.search('Unlimited', contractMinuteTextElement.text):
                        contractDictionary["text_allowance"] = "-1"

                    # Handle bonuses to the contract below. This is done by finding the text containers for bonuses in
                    # the contract element which have special classes just for them

                    contractBonusElements = contract.find_all('div', {'class': O2Values().CLASS_BONUS_DIV})

                    for bonusDiv in contractBonusElements:
                        bonus = bonusDiv.find('p', {'class': O2Values().CLASS_BONUS_DIV_TEXT})
                        bonusList.append(str(bonus.text))

                    # Change URL based on length of contracts

                    if sourceInterval == "24":
                        url = "https://www.o2.co.uk/shop/sim-cards/sim-only-deals?setTTSelectedStack=legacy#deviceType=phone&contractLength=P24M"
                    elif sourceInterval == "12":
                        url = "https://www.o2.co.uk/shop/sim-cards/sim-only-deals?setTTSelectedStack=legacy#deviceType=phone&contractLength=P12M"
                    elif sourceInterval == "30":
                        url = "https://www.o2.co.uk/shop/sim-cards/sim-only-deals?setTTSelectedStack=legacy#deviceType=phone&contractLength=P30D"

                    # Streetwave score calculation

                    score_calc = 0

                    data_amount = int(contractDictionary["data_allowance"])
                    minutes_amount = int(contractDictionary["min_allowance"])
                    texts_amount = int(contractDictionary["text_allowance"])
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

                    newContract = Contracts(supplier=ContractSuppliers.objects.get(supplier_name='O2'),
                                                title = contractDictionary["title"],
                                                data_allowance = contractDictionary["data_allowance"],
                                                minutes = contractDictionary["min_allowance"],
                                                texts = contractDictionary["text_allowance"],
                                                cost = cost_amount,
                                                pay_interval = 1, 
                                                length = sourceInterval,
                                                contract_url = url,
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
                    print("scraping error")
                    print(e)
                    return None


                # Find data and minute text allowance by finding said text, find parent of that text, find span in the parent,
                # get child span of that span then get text

                #Bonuses dont know yet












