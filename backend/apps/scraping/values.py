class O2Values(object):
    # Below is a list of classes on the O2 Sim Only website

    NEED_HELP_CLOSE_ID = "ni_imp_prim_close"

    CLASS_CARD_LIST_IDENTIFIER = "tairff-tiles-wrapper"

    CLASS_CARD_IDENTIFIER = "col-md-12 col-sm-6 gutterPad"

    CLASS_ITEM_CARD_DATA_ALLOWANCE = "capacity"

    CLASS_ITEM_CARD_MIN_TEXT = "time"

    CLASS_BONUS_DIV_CONTAINER = "offer-section-wrapper"

    CLASS_BONUS_DIV = "device-level-offer"

    CLASS_BONUS_DIV_TEXT = "offer-text"

    CLASS_ITEM_CARD_PRICE = "total-cost-price-int"

    CLASS_ITEM_CARD_PRICE_2 = "newBotText1104B"

class VodafoneValues(object):
    # Classes that lead to the contract length selector. May be useful at later point

    # CONTRACT_LENGTH_CLASS_L1 = "vfuk-Section__section bg-light2"
    # CONTRACT_LENGTH_CLASS_L2 = "vfuk-Section__content vfuk-Section__spring"
    # CONTRACT_LENGTH_CLASS_L3 = "vfuk-SimoPlansTemplate__planFilterContainer"
    # CONTRACT_LENGTH_CLASS_L4 = "vfuk-planFilterWrapper__flaggedFilters"
    # CONTRACT_LENGTH_CLASS_LIST_CONTAINER = "vfuk-planFilterWrapper__radioButtonListContainer"
    # Note there is an empty class after class container

    # Class that identifies the contract length list - NOTE it is UL
    CONTRACT_LENGTH_CLASS_LIST_UL = "vfuk-RadioButtonList__radio-list vfuk-RadioButtonList__stack-horizontal vfuk-RadioButtonList__inline-labels"

    # Class that identifies the list a set of cards is in
    CLASS_CARD_LIST_IDENTIFIER = "vfuk-PlanCardList__planCardsList"

    # CARD_LIST_CONTAINER = "vfuk-PlanCardList__planCardsContainer"
    # Class that identifies each card in the list

    CLASS_CARD_IDENTIFIER = "vfuk-PlanCardList__planCardsItemCard"
    # Class assigned to 1st layer of a vodafone card IF card is promoted
    # LAYER_1 = "vfuk-PlanCard__slotWrapper vfuk-PlanCard__isPromoted"
    
    # Class assigned to each induvidual card title, would be equivalent of
    CLASS_ITEM_CARD_TITLE = "sc-ksBlkl dETJIN"

    # Different card title class for when there are extra lines in title.
    CLASS_ITEM_CARD_TITLE1 = "sc-ksBlkl cTVdVs"

    # Class assigned to features of that sim - additional regex will be needed here
    CLASS_ITEM_CARD_FEATURES = "sc-hLBbgP cNpbgE"
    # Class assigned to the top level price of the sim
    ITEM_CARD_PRICE_L1 = "sc-eDvSVe iBlonx"

    ITEM_CARD_PRICE_L2 = "sc-jSUZER isjWnb"

    CLASS_ITEM_CARD_DATA_ALLOWANCE = "sc-jSUZER eYumtI"
    CLASS_ITEM_CARD_MIN_TEXT = "sc-jSUZER gVxJKE"
    CLASS_ITEM_CARD_PRICE = "sc-jSUZER isjWnb"

    CLASS_BONUS_DIV_TEXT_CONTAINER = "sc-jrcTuL iAFhPa"
