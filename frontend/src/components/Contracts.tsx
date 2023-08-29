import React, { useEffect, useState } from 'react';
import { ContractsService } from "../services/contracts.service";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Contracts.css';
import 'react-tooltip/dist/react-tooltip.css'
import { Card, ListGroup, Row, Col, Table, Button } from 'react-bootstrap';
import Select from 'react-select';
import ShowMoreText from "react-show-more-text";
import { FiExternalLink } from 'react-icons/fi';
import { Tooltip as ReactToolTip } from "react-tooltip";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

export interface IScore {
    ee: number;
    three: number;
    vodafone: number;
    o2: number;
}

interface contractsProps {
    scoreData: IScore[];
    filters: IFilterLength;
    sliders: IFilterSliders;
    custom: ICustom;
    selectedSuppliers: string[];
}

export interface ICustom {
    cost_mod: number;
    text_mod: number;
    min_mod: number;
    data_mod: number;
}

export interface IFilterLength {
    filterLengthOne: boolean;
    filterLengthTwo: boolean;
    filterLengthThree: boolean;
}

export interface IFilterSliders{
    filterPriceValues: number[];
    filterDataValues: number[];
    initialFilterPriceValues: number[];
    initialFilterDataValues: number[];
}

function Contracts({ scoreData, filters, custom, selectedSuppliers, sliders }: contractsProps) {

    // Sets contract as a list of objects containing the below fields
    // Adds a bunch of dummy contracts in order to make the skeleton page

    // TODO: Perhaps we can move the dummy contracts to a separate file? I just dislike scrolling past 200 lines of code
    // TODO: Could we also make it programatic? I.e. create a function that creates a list of dummy contracts with a given length?

    const [contract, setContract] = useState([{
        title: "",
        supplier: "",
        pay_interval: "",
        length: "",
        minutes: "",
        cost: "",
        data_allowance: "",
        texts: "",
        bonus: "",
        contract_url: "",
        streetwave_score: 0,
        show: true
    }, {
        title: "",
        supplier: "",
        pay_interval: "",
        length: "",
        minutes: "",
        cost: "",
        data_allowance: "",
        texts: "",
        bonus: "",
        contract_url: "",
        streetwave_score: 0,
        show: true
    }, {
        title: "",
        supplier: "",
        pay_interval: "",
        length: "",
        minutes: "",
        cost: "",
        data_allowance: "",
        texts: "",
        bonus: "",
        contract_url: "",
        streetwave_score: 0,
        show: true
    }, {
        title: "",
        supplier: "",
        pay_interval: "",
        length: "",
        minutes: "",
        cost: "",
        data_allowance: "",
        texts: "",
        bonus: "",
        contract_url: "",
        streetwave_score: 0,
        show: true
    }, {
        title: "",
        supplier: "",
        pay_interval: "",
        length: "",
        minutes: "",
        cost: "",
        data_allowance: "",
        texts: "",
        bonus: "",
        contract_url: "",
        streetwave_score: 0,
        show: true
    }, {
        title: "",
        supplier: "",
        pay_interval: "",
        length: "",
        minutes: "",
        cost: "",
        data_allowance: "",
        texts: "",
        bonus: "",
        contract_url: "",
        streetwave_score: 0,
        show: true
    }, {
        title: "",
        supplier: "",
        pay_interval: "",
        length: "",
        minutes: "",
        cost: "",
        data_allowance: "",
        texts: "",
        bonus: "",
        contract_url: "",
        streetwave_score: 0,
        show: true
    }, {
        title: "",
        supplier: "",
        pay_interval: "",
        length: "",
        minutes: "",
        cost: "",
        data_allowance: "",
        texts: "",
        bonus: "",
        contract_url: "",
        streetwave_score: 0,
        show: true
    }, {
        title: "",
        supplier: "",
        pay_interval: "",
        length: "",
        minutes: "",
        cost: "",
        data_allowance: "",
        texts: "",
        bonus: "",
        contract_url: "",
        streetwave_score: 0,
        show: true
    }, {
        title: "",
        supplier: "",
        pay_interval: "",
        length: "",
        minutes: "",
        cost: "",
        data_allowance: "",
        texts: "",
        bonus: "",
        contract_url: "",
        streetwave_score: 0,
        show: true
    }, {
        title: "",
        supplier: "",
        pay_interval: "",
        length: "",
        minutes: "",
        cost: "",
        data_allowance: "",
        texts: "",
        bonus: "",
        contract_url: "",
        streetwave_score: 0,
        show: true
    }, {
        title: "",
        supplier: "",
        pay_interval: "",
        length: "",
        minutes: "",
        cost: "",
        data_allowance: "",
        texts: "",
        bonus: "",
        contract_url: "",
        streetwave_score: 0,
        show: true
    }, {
        title: "",
        supplier: "",
        pay_interval: "",
        length: "",
        minutes: "",
        cost: "",
        data_allowance: "",
        texts: "",
        bonus: "",
        contract_url: "",
        streetwave_score: 0,
        show: true
    },]);

    // Sets datetime as the last time the scraped data was updated
    const [dateTime, setDateTime] = useState("");

    // Initialize the contract service
    const contractsService = new ContractsService();

    const [tableChoice, setTableChoice] = useState(false);

    const fTable = (e: any) => {
        e.preventDefault();
        if (tableChoice == true) {
            setTableChoice(false)
        }
        else {
            setTableChoice(true)
        }
    }

    const [filterChoice, setFilterChoice] = useState("Streetwave Score high to low");

    const [noneVisible, setNoneVisible] = useState(false);

    // IF BREAKS, revert to this + look at HTML for setting filter choice.
    // const changeFilterChoice = (e: any) => {
    //     setFilterChoice(e);
    // }


    // Handles all filtering of contracts. This function is called when the user changes the filter values by a
    // useEffect hook below with dependencies of filters, selectedSuppliers, sliders.
    const filterContracts = (contracts: any) => {

        // Set all contracts to show by default
        for (let i = 0; i < contracts.length; i++) {
            contracts[i].show = true;
        }

        // If all the filters are set to false, show all contracts (Filters are not active, the user would
        // expect to see all contracts)
        if (!filters.filterLengthOne && !filters.filterLengthTwo && !filters.filterLengthThree &&
            selectedSuppliers.length == 0 &&

            // If the initial filter values are the same as the current filter values, then the filters have not been changed.
            sliders.initialFilterPriceValues[0] == sliders.filterPriceValues[0] &&
            sliders.initialFilterPriceValues[1] == sliders.filterPriceValues[1] &&
            sliders.initialFilterDataValues[0] == sliders.filterDataValues[0] &&
            sliders.initialFilterDataValues[1] + 1 == sliders.filterDataValues[1]
            // Do nothing.
        ) {}

        else {
            // If the user has changed any filter value, then the filters are active (i.e skip the if)
            if (!filters.filterLengthOne && !filters.filterLengthTwo && !filters.filterLengthThree) {
            }
             else {

             for (let i = 0; i < contracts.length; i++) {

                    // If the contract length is 1 month, and the filter is set to 1 month, show the contract and visa versa
                    if (contracts[i].length == "1 months") {
                        contracts[i].show = filters.filterLengthOne;
                    } else if (contracts[i].length == "12 months") {
                        contracts[i].show = filters.filterLengthTwo;
                    } else if (contracts[i].length == "24 months") {
                        contracts[i].show = filters.filterLengthThree;
                    }
                }
            }

            if (selectedSuppliers.length != 0) {
                for (let i = 0; i < contracts.length; i++) {
                    if (selectedSuppliers.includes(contracts[i].supplier)) {
                    } else {
                        contracts[i].show = false;
                    }
                }
            }

            // If the initial filter values are the same as the current filter values, then the filters have not been changed.
            if (sliders.initialFilterPriceValues[0] != sliders.filterPriceValues[0] ||
                sliders.initialFilterPriceValues[1] != sliders.filterPriceValues[1]) {
                for (let i = 0; i < contracts.length; i++) {

                    // Remove the £ and " " from the cost so that comparison can be made
                    let cost = contracts[i].cost.substring(2);

                    // If the cost is less than the minimum price value, or greater than the maximum price value, then
                    // we want to hide the contract.
                    if (cost >= sliders.filterPriceValues[0] && cost <= sliders.filterPriceValues[1]) {
                    }
                    else {
                        contracts[i].show = false;
                    }
                }
            }

            // If the initial filter values are the same as the current filter values, then the filters have not been changed.
            if (sliders.initialFilterDataValues[0] != sliders.filterDataValues[0] ||
                sliders.initialFilterDataValues[1] + 1 != sliders.filterDataValues[1]) {
                for (let i = 0; i < contracts.length; i++) {

                    // Remove the " GB" from the data allowance so that comparison can be made
                    let data = contracts[i].data_allowance

                    // If the data allowance is unlimited, then we dont want to remove the last 3 characters as direct
                    // comparison is made below
                    if (data == "Unlimited") {
                    }
                    else {
                        data = data.substring(0, data.length - 3);
                    }

                    // If the right hand data value is atleast equal to the max data value (represented as unlimited,
                    // or in terms of the slider scale the initial highest data value + 1), then we want to show it.

                    // E.G as of coding this, max data on contracts is 250GB. The slider goes to 251, so if the right hand
                    // data value is 251, then that represents unlimited data, and we want to show it.

                    if (sliders.filterDataValues[1] == sliders.initialFilterDataValues[1] + 1 && data == "Unlimited") {
                    }
                    else if (data >= sliders.filterDataValues[0] && data <= sliders.filterDataValues[1])
                    {}
                    else {
                        contracts[i].show = false;
                    }
                }
            }
        }

        let count = 0;
        for (let i = 0; i < contracts.length; i++) {
            if (contracts[i].show == false) {
                count++;
            }
        }

        if (count == contracts.length) {
            setNoneVisible(true);
            console.log("count " + count + "length " + contracts.length);
        }
        else {
            setNoneVisible(false);
        }

        // Ahh lovely, react having a lovely bit of fun again not reloading the page without a new list
        // So we have to create a new list and push the new contracts into it... Just like contract ordering.
        // Im literally changing booleans in the list, the list is therefore being updated??

        const filteredList = [];

        for (let i = 0; i < contracts.length; i++) {
            filteredList.push(contracts[i]);
        }

        return filteredList;
    }


    // Use effect that calls the filterContracts function when the filters are changed
    useEffect(() => {

        let filteredContracts = filterContracts(contract);
        setContract(filteredContracts)

    }, [filters.filterLengthOne, filters.filterLengthTwo, filters.filterLengthThree, selectedSuppliers, sliders]);

    useEffect(() => {
        const findScores = async () => {

            // Calculate the Streetwave score
            let homeMultiplier = 0.15;
            let workMultiplier = 0.10;
            let commuteMultiplier = 0.15;

            if ((scoreData[0].ee + scoreData[0].three + scoreData[0].o2 + scoreData[0].vodafone) == 0) {
                homeMultiplier = 0;
            }
            if ((scoreData[1].ee + scoreData[1].three + scoreData[1].o2 + scoreData[1].vodafone) == 0) {
                workMultiplier = 0;
            }
            if ((scoreData[2].ee + scoreData[2].three + scoreData[2].o2 + scoreData[2].vodafone) == 0) {
                commuteMultiplier = 0;
            }

            let totalMultiplier = homeMultiplier + workMultiplier + commuteMultiplier;

            let eeScoreCalc = 100;
            let threeScoreCalc = 100;
            let vodafoneScoreCalc = 100;
            let o2ScoreCalc = 100;

            if (totalMultiplier != 0) {
                eeScoreCalc = (scoreData[0].ee * homeMultiplier + scoreData[1].ee * workMultiplier + scoreData[2].ee * commuteMultiplier) / totalMultiplier;
                threeScoreCalc = (scoreData[0].three * homeMultiplier + scoreData[1].three * workMultiplier + scoreData[2].three * commuteMultiplier) / totalMultiplier;
                vodafoneScoreCalc = (scoreData[0].vodafone * homeMultiplier + scoreData[1].vodafone * workMultiplier + scoreData[2].vodafone * commuteMultiplier) / totalMultiplier;
                o2ScoreCalc = (scoreData[0].o2 * homeMultiplier + scoreData[1].o2 * workMultiplier + scoreData[2].o2 * commuteMultiplier) / totalMultiplier;
            }

            const contractsRes = await contractsService.getContracts();

            let contractList = [];

            // Loop through each contract
            for (let i = 0; i < contractsRes.length; i++) {

                // Setting the streetwave score based on supplier
                let final_score = 0;

                // contract score calculation
                let data_score = 0;
                let minutes_score = 0;
                let texts_score = 0;
                let cost_score = 0;
                let cost_mod = 0.30 * custom.cost_mod / 100;
                let text_mod = 0.05 * custom.text_mod / 100;
                let min_mod = 0.05 * custom.min_mod / 100;
                let data_mod = 0.20 * custom.data_mod / 100;

                if (contractsRes[i]["data_allowance"] == -1) { data_score = 100; }
                else if (contractsRes[i]["data_allowance"] >= 100) { data_score = 80; }
                else if (contractsRes[i]["data_allowance"] >= 30) { data_score = 60; }
                else if (contractsRes[i]["data_allowance"] >= 5) { data_score = 40; }
                else if (contractsRes[i]["data_allowance"] >= 1) { data_score = 20; }
                else { data_score = 0; }

                if (contractsRes[i]["minutes"] == -1) { minutes_score = 100; }
                else if (contractsRes[i]["minutes"] >= 1000) { minutes_score = 80; }
                else if (contractsRes[i]["minutes"] >= 500) { minutes_score = 60; }
                else if (contractsRes[i]["minutes"] >= 200) { minutes_score = 40; }
                else if (contractsRes[i]["minutes"] >= 100) { minutes_score = 20; }
                else { minutes_score = 0; }

                if (contractsRes[i]["texts"] == -1) { texts_score = 100; }
                else if (contractsRes[i]["texts"] >= 1000) { texts_score = 80; }
                else if (contractsRes[i]["texts"] >= 500) { texts_score = 60; }
                else if (contractsRes[i]["texts"] >= 200) { texts_score = 40; }
                else if (contractsRes[i]["texts"] >= 100) { texts_score = 20; }
                else { texts_score = 0; }

                if (contractsRes[i]["cost"] < 7) { cost_score = 100; }
                else if (contractsRes[i]["cost"] < 10) { cost_score = 80; }
                else if (contractsRes[i]["cost"] < 15) { cost_score = 60; }
                else if (contractsRes[i]["cost"] < 25) { cost_score = 40; }
                else if (contractsRes[i]["cost"] < 40) { cost_score = 20; }
                else { cost_score = 0; }

                const mod_calc = cost_mod + text_mod + min_mod + data_mod;

                if (mod_calc == 0.60) {
                    const score_calc = cost_score * 0.30 + texts_score * 0.05 + minutes_score * 0.05 + data_score * 0.20 + 100 * 0.40;
                    contractsRes[i]["streetwave_score"] = score_calc;
                }
                else {
                    const multiplier = 0.60 / mod_calc;
                    const score_calc = cost_score * cost_mod * multiplier + texts_score * text_mod * multiplier + minutes_score * min_mod * multiplier + data_score * data_mod * multiplier + 100 * 0.40;
                    contractsRes[i]["streetwave_score"] = score_calc;
                }

                if (contractsRes[i]["supplier"]["supplier_name"] == "EE") {
                    final_score = Math.round(contractsRes[i]["streetwave_score"] - 40 + (eeScoreCalc * 0.40));
                }
                else if (contractsRes[i]["supplier"]["supplier_name"] == "Three") {
                    final_score = Math.round(contractsRes[i]["streetwave_score"] - 40 + (threeScoreCalc * 0.40));
                }
                else if (contractsRes[i]["supplier"]["supplier_name"] == "Vodafone") {
                    final_score = Math.round(contractsRes[i]["streetwave_score"] - 40 + (vodafoneScoreCalc * 0.40));
                }
                else if (contractsRes[i]["supplier"]["supplier_name"] == "O2") {
                    final_score = Math.round(contractsRes[i]["streetwave_score"] - 40 + (o2ScoreCalc * 0.40));
                }
                else { final_score = 0; console.log("supplier name not matched, check against the database") }


                // Convert from int to "unlimited" text
                if (contractsRes[i]["texts"] == -1) { contractsRes[i]["texts"] = "Unlimited" };
                if (contractsRes[i]["minutes"] == -1) { contractsRes[i]["minutes"] = "Unlimited" };

                // Convert from int to "unlimited" text, if not add GB (gigabytes)
                if (contractsRes[i]["data_allowance"] == -1) { contractsRes[i]["data_allowance"] = "Unlimited" }
                else { contractsRes[i]["data_allowance"] = contractsRes[i]["data_allowance"] + " GB" };

                // Convert from int to "Yearly" "Monthly" text
                if (contractsRes[i]["pay_interval"] == 1) { contractsRes[i]["pay_interval"] = "Monthly" }
                else if (contractsRes[i]["pay_interval"] == 12) { contractsRes[i]["pay_interval"] = "Yearly" };

                // This gets all the bonuses and adds them together into the bonus field
                let bonusData = contractsRes[i]["bonuses"];
                let bonusDesc = "";

                for (let j = 0; j < bonusData.length; j++) {

                    bonusDesc = bonusDesc + bonusData[j]["bonus_desc"];

                    if (bonusData[j]["bonus_val"] != 0) {
                        bonusDesc = bonusDesc + bonusData[j]["bonus_val"] + " "
                    }
                    else {
                        bonusDesc = bonusDesc + " "
                    }

                }

                let finalTitle = ""

                if (contractsRes[i]["title"] == "") {
                    finalTitle = contractsRes[i]["data_allowance"]
                }
                else { finalTitle = contractsRes[i]["title"] }

                // Setting the object's values before being pushed to a list
                const contractData = {
                    title: finalTitle,
                    supplier: contractsRes[i]["supplier"]["supplier_name"],
                    pay_interval: contractsRes[i]["pay_interval"],
                    length: contractsRes[i]["length"] + " months",
                    minutes: contractsRes[i]["minutes"],
                    cost: "£ " + contractsRes[i]["cost"],
                    data_allowance: contractsRes[i]["data_allowance"],
                    texts: contractsRes[i]["texts"],
                    bonus: bonusDesc,
                    contract_url: contractsRes[i]["contract_url"],
                    streetwave_score: final_score,
                    show: true
                };

                contractList.push(contractData);
            }

            // https://stackoverflow.com/questions/3075577/convert-mysql-datetime-stamp-into-javascripts-date-format

            if (contractsRes[0]["last_update"]) {
                const splitDate = contractsRes[0]["last_update"].split(/[T]/);

                const dateFormat = splitDate[0] + " " + splitDate[1];

                const finalDate = dateFormat.slice(0, -1);

                setDateTime(finalDate);
            }

            const sortedContractData = sortContracts(contractList);
            const filteredContracts = filterContracts(sortedContractData);
            setContract(filteredContracts);
        }
        findScores();
    }, [scoreData, custom]);

    useEffect(() => {

        let sortedContractData = sortContracts(contract);
        setContract(sortedContractData);

    }, [filterChoice]);

    const sortContracts = (contractList: typeof contract) => {

        // Sort list of contracts
        // https://stackoverflow.com/questions/21687907/typescript-sorting-an-array

        let sortedContractData = contractList.sort((n1, n2) => {

            if (n1.streetwave_score < n2.streetwave_score) {
                return 1;
            }

            if (n1.streetwave_score > n2.streetwave_score) {
                return -1;
            }

            return 0;
        });


        if (filterChoice === "Cost low to high") {
            sortedContractData = sortedContractData.sort((n1, n2) => {
                const cost1 = Number(n1.cost.slice(2));
                const cost2 = Number(n2.cost.slice(2));

                if (cost1 > cost2) {
                    return 1;
                }

                if (cost1 < cost2) {
                    return -1;
                }

                return 0;
            });
        }

        else if (filterChoice === "Data high to low") {
            sortedContractData = sortedContractData.sort((n1, n2) => {
                let data1 = 0;
                let data2 = 0;

                if (n1.data_allowance === "Unlimited") {
                    data1 = 10000;
                }

                else {
                    data1 = Number(n1.data_allowance.slice(0, -3));
                }

                if (n2.data_allowance === "Unlimited") {
                    data2 = 10000;
                }

                else {
                    data2 = Number(n2.data_allowance.slice(0, -3));
                }

                if (data1 < data2) {
                    return 1;
                }

                if (data1 > data2) {
                    return -1;
                }

                return 0;
            });
        }

        else if (filterChoice === "Minutes high to low") {
            sortedContractData = sortedContractData.sort((n1, n2) => {
                let mins1 = 0;
                let mins2 = 0;

                if (n1.minutes === "Unlimited") {
                    mins1 = 1000000;
                }

                else {
                    mins1 = Number(n1.minutes);
                }

                if (n2.minutes === "Unlimited") {
                    mins2 = 1000000;
                }

                else {
                    mins2 = Number(n2.minutes);
                }

                if (mins1 < mins2) {
                    return 1;
                }

                if (mins1 > mins2) {
                    return -1;
                }

                return 0;
            });
        }

        // One step behind fix, react thinks array hasnt changed when sorted so new array is required.
        const sortedList = [];
        for (let i = 0; i < sortedContractData.length; i++) {
            sortedList.push(sortedContractData[i]);
        }
        return sortedList;
    }

    return (
        <div id="contractContainer">
            {/* https://react-bootstrap.github.io/components/cards/ */}
            <div className='info'>
                <a
                    href="#" onClick={fTable} className="tablebutton">Click here to toggle between table and card view</a>
                <p
                    className='updateinfo'>Contracts up to date as of {dateTime || <Skeleton
                        count={1}
                        inline
                        width={150} />}</p>
            </div>
            <Select className='selectontop'
                options={[
                    { value: "Streetwave Score high to low", label: "Streetwave Score high to low" },
                    { value: "Cost low to high", label: "Cost low to high" },
                    { value: "Data high to low", label: "Data high to low" },
                    { value: "Minutes high to low", label: "Minutes high to low" },
                ]}
                onChange={(e: any) => {
                    setFilterChoice(e.value);
                }}
            />

            <Row xs={1} sm={1} md={1} lg={2} xl={2} xxl={3} className="g-4" data-testid="contract_table">
                {tableChoice && (
                    <Table data-testid="contract_table" striped bordered hover>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Supplier</th>
                                <th>Length</th>
                                <th>Cost</th>
                                <th>Pay Interval</th>
                                <th>Data Allowance</th>
                                <th>Texts</th>
                                <th>Minutes</th>
                                <th>Bonus</th>
                                <th>Link</th>
                                <th>Streetwave Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contract.map((item, index) =>
                                <tr>
                                    <td>{item.title}</td>
                                    <td>{item.supplier}</td>
                                    <td>{item.length}</td>
                                    <td>{item.cost}</td>
                                    <td>{item.pay_interval}</td>
                                    <td>{item.data_allowance}</td>
                                    <td>{item.texts}</td>
                                    <td>{item.minutes}</td>
                                    <td>{item.bonus}</td>
                                    <td><a href={item.contract_url} target="_blank">Link</a></td>
                                    <td>{item.streetwave_score}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}

                {noneVisible && (
                    <div id='warning'>
                    <h3>Uh oh, no contracts match the currently selected filters.</h3>
                    </div>
                )}

                {tableChoice == false && (
                    contract.map((item, index) =>
                        <Col className={`${item.show ? "d-flex align-items-stretch cardcontainer" : "invisiblecontainer"}`}>
                            <Card className={`
                                  ${item.show ? "cardVisible" : "cardInvisible"}
                                  ${item.supplier === "Vodafone" ? "cardVodafone" : ""}
                                  ${item.supplier === "O2" ? "cardO2" : ""}
                                  ${item.supplier === "EE" ? "cardEE" : ""}
                                  ${item.supplier === "Three" ? "cardThree" : ""}
                                `}>
                                <Card.Body>
                                    <Card.Title className="score title">{item.supplier} {item.title || <Skeleton
                                        count={1}
                                        inline
                                        width={250} />}
                                    </Card.Title>
                                    <Card.Title className="score">{item.cost || <Skeleton
                                        count={1}
                                        inline
                                        width={50} />}</Card.Title>
                                    <Card.Link className="righttextlink dmt" href={item.contract_url} target="_blank">
                                        <Button
                                            data-tooltip-id={String(index)}
                                            data-tooltip-content="Go to external website"
                                            data-tooltip-place="bottom"
                                            className="linkbutton">
                                            <FiExternalLink size={30} />
                                        </Button>
                                    </Card.Link>
                                    <ReactToolTip className="tooltipontop" id={String(index)} />
                                </Card.Body>
                                <ListGroup className="list-group-flush">
                                    <ListGroup.Item className='dmt'>{item.length || <Skeleton
                                        count={1}
                                        inline
                                        width={90} />}</ListGroup.Item>
                                    <ListGroup.Item className='dmt'>Data: {item.data_allowance || <Skeleton
                                        count={1}
                                        inline
                                        width={50} />}</ListGroup.Item>
                                    <ListGroup.Item className='dmt'>{item.minutes || <Skeleton
                                        count={1}
                                        inline
                                        width={50} />} minutes & {item.texts || <Skeleton
                                            count={1}
                                            inline
                                            width={50} />} texts</ListGroup.Item>
                                    <ListGroup.Item className='bonus'>
                                        <ShowMoreText
                                            lines={3}
                                            more="Show more"
                                            less="Show less"
                                            className="content-css"
                                            anchorClass="show-more-less-clickable"
                                            expanded={false}
                                            width={0}
                                            truncatedEndingComponent={"... "}
                                        >
                                            Bonus: {item.bonus || <Skeleton
                                                count={1}
                                                inline
                                                width={150} />}
                                        </ShowMoreText>
                                    </ListGroup.Item>
                                </ListGroup>
                                <Card.Body>
                                    <Card.Title className="righttext score">Score: <b>{item.streetwave_score || <Skeleton
                                        count={1}
                                        inline
                                        width={20} />}</b></Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                )}
            </Row>
        </div>
    )
}

export default Contracts;