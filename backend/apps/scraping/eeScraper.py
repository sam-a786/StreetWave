import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
# from .values import VodafoneValues
from bs4 import BeautifulSoup
from datetime import datetime


class eeScraper:

    def getAllContractData(self, updated):

        from .models import Contracts, ContractBonuses, ContractSuppliers
        import re

        class contract:
            def __init__(self, title, price, length, data, min, text, bonus):
                self.title = title
                self.price = price
                self.length = length
                self.data = data
                self.min = min
                self.text = text
                self.bonus = bonus

        contractContainers = []

        contractContainers.append(contract("", 23, 24, 250, "unlimited", "unlimited", ["Gift data to all the family."]))
        contractContainers.append(contract("", 15, 24, 1, "unlimited", "unlimited", ["Gift data to all the family."]))
        contractContainers.append(contract("", 28, 24, "unlimited", "unlimited", "unlimited", ["Gift data to all the family."]))
        contractContainers.append(contract("", 29, 24, 125, "unlimited", "unlimited", ["Includes benefit worth up to £25."]))

        contractContainers.append(contract("", 45, 12, "unlimited", "unlimited", "unlimited", ["Inclusive Extras Included."]))
        contractContainers.append(contract("", 28, 12, 5, "unlimited", "unlimited", ["1 Inclusive Extra Included.", "Stay Connected Data."]))
        contractContainers.append(contract("", 25, 12, 125, "unlimited", "unlimited", ["Stay Connected Data."]))

        contractContainers.append(contract("", 18, 1, 1, "unlimited", "unlimited", ["Stay Connected Data."]))
        contractContainers.append(contract("", 31, 1, "unlimited", "unlimited", "unlimited", ["Gift data to all the family."]))
        contractContainers.append(contract("", 24, 1, 25, "unlimited", "unlimited", ["Stay Connected Data.", "Gift data to all the family."]))

        # Loop through each contract container
        for contractContainer in contractContainers:

            try:

                contractDictionary = {}
                bonusList = []

                contractDictionary["title"] = contractContainer.title

                contractDictionary["price"] = contractContainer.price

                contractDictionary["length"] = contractContainer.length

                if contractContainer.data == "unlimited":
                    contractDictionary["data_allowance"] = "-1"
                else:
                    contractDictionary["data_allowance"] = contractContainer.data

                if contractContainer.min == "unlimited":
                    contractDictionary["min_allowance"] = "-1"
                else:
                    contractDictionary["min_allowance"] = contractContainer.min

                if contractContainer.text == "unlimited":
                    contractDictionary["text_allowance"] = "-1"
                else:
                    contractDictionary["text_allowance"] = contractContainer.text

                for x in contractContainer.bonus:
                    if (x != ""):
                        bonusList.append(x)

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

                newContract = Contracts(supplier=ContractSuppliers.objects.get(supplier_name='EE'),
                                            title = contractDictionary["title"],
                                            data_allowance = contractDictionary["data_allowance"],
                                            minutes = contractDictionary["min_allowance"],
                                            texts = contractDictionary["text_allowance"],
                                            cost = cost_amount,
                                            pay_interval = 1, 
                                            length = contractDictionary["length"],
                                            contract_url = "https://shop.ee.co.uk/sim-only",
                                            streetwave_score = score_calc,
                                            last_update = datetime.now(),
                                            up_to_date = updated)

                newContract.save()
                id = newContract.id

                for bonus in bonusList:
                    newContractBonus = ContractBonuses(contract_id=id, bonus_desc=bonus, bonus_val=0)
                    newContractBonus.save()

            except Exception as e:
                # TODO - Add logging here
                print(e)
                return None













