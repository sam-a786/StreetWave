import { Form, Row, Container, Button, Accordion } from 'react-bootstrap';
import './SideAccordion.css';
import axios from "axios";
import { useEffect, useState, createContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapAlert from './BootstrapAlert';
import { ScoreService } from "../services/scores.service";
import { StationsService } from "../services/stations.service";
import { ContractsService } from "../services/contracts.service";
import { SearchesService } from "../services/searches.service";
import Contracts, { IScore } from './Contracts';
import {IProps, SavedSearch} from "./SearchCards";
import SearchCards from "./SearchCards";
import Select from 'react-select';
import { TbLayoutSidebarLeftCollapse } from 'react-icons/tb';
import { TbLayoutSidebarLeftExpand } from 'react-icons/tb';
import { Tooltip as ReactToolTip } from "react-tooltip";
import ImageSelection from './ImageSelection';
import { IFilterLength } from "./Contracts";
import { IFilterSliders } from "./Contracts";
import { ICustom } from "./Contracts"

// Slider imports. CSS is necessary otherwise slider does a runner.
import React from 'react';
import Slider from 'rc-slider';
import 'rc-tooltip/assets/bootstrap.css';
import 'rc-slider/assets/index.css'

// Code has to be run before function here to ensure that the slider is created.
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

export default function SideAccordion() {


    // Filter length controls.
    // UseStates for length of contracts. These are controlled by checkboxes on the page and represent a boolean value.
    const [filterLengthOne, setFilterLengthOne] = useState(false);
    const [filterLengthTwo, setFilterLengthTwo] = useState(false);
    const [filterLengthThree, setFilterLengthThree] = useState(false);

    // Handlers for checkboxes. When a checkbox is clicked, set it to the opposite of what it was.
    const handleFilterLengthOne = () => {
        setFilterLengthOne(!filterLengthOne);
    }

    const handleFilterLengthTwo = () => {
        setFilterLengthTwo(!filterLengthTwo);
    }

    const handleFilterLengthThree = () => {
        setFilterLengthThree(!filterLengthThree);
    }

    // UseState for passing contract lengths to the Contracts component.
    const [filterLength, setFilterLength] = useState<IFilterLength>({
        filterLengthOne: false,
        filterLengthTwo: false,
        filterLengthThree: false,
        }
    );

    // UseState for passing slider values to the Contracts component.
    const [filterSliders, setFilterSliders] = useState<IFilterSliders>({
        filterPriceValues: [1, 2],
        filterDataValues: [1, 3],
        initialFilterPriceValues: [1, 2],
        initialFilterDataValues: [1, 2],
    });

    // Filter price controls
    // TODO: Move this to a separate component, this would be wise to do if rc-slider needs to be updated. Ideally it
    // TODO: means that the slider component can be reused in other places + testability + separation of concerns.

    // Contracts service for dynamically getting min and max values for sliders.
    const contractsService = new ContractsService();

    // UseStates for sliders.
    const [initialFilterPriceValues, setInitialFilterPriceValues] = useState([4, 49]);
    const [initialFilterDataValues, setInitialFilterDataValues] = useState([0, 1000]);
    const [filterPriceValues, setFilterPriceValues] = useState([4, 49]);
    const [filterDataValues, setFilterDataValues] = useState([0, 1000]);

    // RC-Slider documentation was never updated in terms of the API usage -
    // https://github.com/react-component/slider/issues/825#issuecomment-1084416952
    // https://stackoverflow.com/questions/71455681/error-createsliderwithtooltip-is-not-a-function
    // I downgraded to 9.6.5

    // Handlers for sliders.
    const handlePriceChange = (values: number[]) => {
        setFilterPriceValues([values[0], values[1]]);
    };

    const handleDataChange = (values: number[]) => {
        setFilterDataValues([values[0], values[1]]);
    }

    const [custom, setCustom] = useState<ICustom>({
        cost_mod: 100,
        text_mod: 100,
        min_mod: 100,
        data_mod: 100,
    });

    const [costMod, setCostMod] = useState(100);
    const [textMod, setTextMod] = useState(100);
    const [minMod, setMinMod] = useState(100);
    const [dataMod, setDataMod] = useState(100);

    // Set web page title - Should be on every page
    useEffect(() => {
        document.title = 'Compare Sim Plans';
      }, []);


    // Get min and max values for price and data sliders - dynamically adjusts when new contracts are added.
    useEffect(() => {
        const getContractsMinAndMax = async () => {

            const contractsRes = await contractsService.getContracts();

            // Use the first item in the contracts array as the min and max, and as contracts are iterated through,
            // update the min and max values.

            let contractMinPrice = contractsRes[0]["cost"];
            let contractMaxPrice = contractsRes[0]["cost"];
            let contractMinData = contractsRes[0]["data_allowance"];
            let contractMaxData = contractsRes[0]["data_allowance"];

            for (let i = 0; i < contractsRes.length; i++) {
                if (contractsRes[i]["cost"] < contractMinPrice) {
                    contractMinPrice = contractsRes[i]["cost"];
                }
                if (contractsRes[i]["cost"] > contractMaxPrice) {
                    contractMaxPrice = contractsRes[i]["cost"];
                }
                if (contractsRes[i]["data_allowance"] < contractMinData) {
                    if (contractsRes[i]["data_allowance"] != "-1") {
                        contractMinData = contractsRes[i]["data_allowance"];
                    }
                }
                if (contractsRes[i]["data_allowance"] > contractMaxData) {
                    contractMaxData = contractsRes[i]["data_allowance"];
                }
            }

            setInitialFilterPriceValues([contractMinPrice, contractMaxPrice])
            setInitialFilterDataValues([contractMinData, contractMaxData]);
        }

        getContractsMinAndMax();
    }, []);

    let searchService = new SearchesService();


    const [userId, setUserId] = useState<number>(0);
    const accessToken =
        localStorage.getItem("access_token") !== null &&
        JSON.parse(localStorage.getItem("access_token") as string);

    const getUserInfo = async () => {

          axios.defaults.headers.common['Authorization'] = accessToken
          const response = await axios.get("http://localhost:8000/api/user", {
                withCredentials: true
          });
          const content = await response.data;
          setUserId(content.id)
        }

    useEffect(
    () => {

        getUserInfo();

    }, []);

    const [searchGet, setSearchGet] = useState<SavedSearch>({
        id: 0,
        homeAddress: "",
        workAddress: "",
        station1: "",
        station2: "",
        datetime: "",
    });

    useEffect(() => {
        setHomeAddress(searchGet.homeAddress);
        setWorkAddress(searchGet.workAddress);
        setStation1(searchGet.station1);
        setStation2(searchGet.station2);
        setCompareData(
            {
                homeAddress: searchGet.homeAddress,
                workAddress: searchGet.workAddress,
                station1: searchGet.station1,
                station2: searchGet.station2
            }
        )

        if (searchGet.station1 != "" && searchGet.station2 != "") {
            setStationCheck(true);
        }
    }, [searchGet]);


    const handleSetSearch = (savedSearch: SavedSearch) => {
        setSearchGet(savedSearch);
    }

    const [searchTrigger, setSearchTrigger] = useState<boolean>(false);

    const [searchCardProps, setSearchCardProps] = useState<IProps>({
        handleSetSearch: handleSetSearch,
        searchTrigger: searchTrigger,
    });

    useEffect(() => {
        setSearchCardProps({
            handleSetSearch: handleSetSearch,
            searchTrigger: searchTrigger,
        })
    }, [searchTrigger])

    const addSearch = async () => {

        setSearchTrigger(!searchTrigger);

        let datetime = new Date().toISOString().slice(0, 19).replace('T', ' ')
        let searchResponse = await searchService.addSearch({
            "user_id": userId,
            "home_addr": homeAddress,
            "work_addr": workAddress,
            "first_station": station1,
            "second_station": station2,
            "datetime": datetime
        })



        // let searchId = searchResponse.id;

        // let filtersList = ["1 Month", "12 Months", "24 Months", "O2", "EE", "Vodafone", "Three", "DataMin", "DataMax", "PriceMin", "PriceMax"]
        // let filtersListIds = []
        // for (let i = 0; i < filtersList.length; i++) {
        //     let filterResponse = await searchService.getFilter(filtersList[i])
        //     filtersListIds.push(filterResponse.id)
        // }
        //
        // let lengthFilters = [filterLengthOne, filterLengthTwo, filterLengthThree]
        // let priceFilters = [filterPriceValues[0], filterPriceValues[1]]
        // let dataFilters = [filterDataValues[0], filterDataValues[1]]
        //
        // for (let i = 0; i < lengthFilters.length; i++) {
        //     await searchService.addSearchFilter({
        //         "searches_id": searchId,
        //         "filters_id": filtersListIds[i],
        //         "value": lengthFilters[i]
        //     });
        // }
        //
        // for (let i = 0; i < selectedSuppliers.length; i++) {
        //
        //     let selectedSupplierId = filtersListIds.indexOf(selectedSuppliers[i])
        //     await searchService.addSearchFilter({
        //         "searches_id": searchId,
        //         "filters_id": selectedSupplierId,
        //         "value": 1
        //     });
        // }
        //
        // for (let i = 0; i < dataFilters.length; i++) {
        //     await searchService.addSearchFilter({
        //         "searches_id": searchId,
        //         "filters_id": filtersListIds[i + 7],
        //         "value": dataFilters[i]
        //     });
        // }
        //
        // for (let i = 0; i < priceFilters.length; i++) {
        //     await searchService.addSearchFilter({
        //         "searches_id": searchId,
        //         "filters_id": filtersListIds[i + 9],
        //         "value": priceFilters[i]
        //     });
        // }

    }

    const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
    const [homeAddress, setHomeAddress] = useState("");
    const [workAddress, setWorkAddress] = useState("");
    const [station1, setStation1] = useState("");
    const [station2, setStation2] = useState("");
    const [homeError, setHomeError] = useState(false);
    const [workError, setWorkError] = useState(false);

    // Sets the error if address is not found
    const homeState = (state: boolean) => {
        setHomeError(state);
    }

    // Sets the error if address is not found
    const workState = (state: boolean) => {
        setWorkError(state);
    }

    // UseStates for setting the scores of each
    const [homeAdd, setHomeAdd] = useState("");
    const [homeScore, setHomeScore] = useState({
        ee: 0,
        three: 0,
        vodafone: 0,
        o2: 0
    });

    const [workAdd, setWorkAdd] = useState("");
    const [workScore, setWorkScore] = useState({
        ee: 0,
        three: 0,
        vodafone: 0,
        o2: 0
    });

    const [commuteScore, setCommuteScore] = useState({
        ee: 0,
        three: 0,
        vodafone: 0,
        o2: 0
    });

    // Props that contain the scores that are outputted by Streetwave's API
    const [inputScoreData, setInputScoreData] = useState<IScore[]>([
        {
            ee: 0,
            three: 0,
            vodafone: 0,
            o2: 0
        },
        {
            ee: 0,
            three: 0,
            vodafone: 0,
            o2: 0
        },
        {
            ee: 0,
            three: 0,
            vodafone: 0,
            o2: 0
        }
    ]);

    interface ICompare {
        homeAddress: string;
        workAddress: string;
        station1: string;
        station2: string;
    }

    const [compareData, setCompareData] = useState<ICompare>({
        homeAddress: "",
        workAddress: "",
        station1: "",
        station2: "",
    });

    const [stationCheck, setStationCheck] = useState(
        false
    );

    // Runs when the user presses submit
    // Code only sets the input data, which the compare component's useEffect sees and updates
    const submit = async (e: any) => {
        e.preventDefault();

        setCompareData(
            {
                homeAddress: homeAddress,
                workAddress: workAddress,
                station1: station1,
                station2: station2,
            }
        )

        if (station1 != "" && station2 != "") {
            setStationCheck(true);
        }

    }

    const scoreService = new ScoreService();
    const stationsService = new StationsService();

    interface stationOption {
        value: string;
        label: string;
    }

    const [stations, setStations] = useState<stationOption[]>();

    const [menu, setMenu] = useState("open");

    const menuToggle = () => {
        if (menu == "open") {
            setMenu("close");
        }
        else {
            setMenu("open");
        }
    }

    useEffect(() => {
        const getStations = async () => {
            const stationRes = await stationsService.getStations();

            let stationList = [];

            for (let i = 1; i < stationRes.length; i++) {
                const stationName = stationRes[i]["station_name"];

                stationList.push(
                    {
                        value: stationName,
                        label: stationName
                    }
                )
            }

            setStations(stationList);
        }
        getStations();
    }, []);

    useEffect(() => {
        const getScores = async () => {
            // When homeaddress is inputted, run below code
            if (compareData.homeAddress) {
                const scoreRes = await scoreService.getScores(compareData.homeAddress);

                if (scoreRes === "Address Not Found") {
                    homeState(true);
                }
                else {
                    homeState(false);
                    const homeRes = JSON.parse(scoreRes[1]);
                    const homeAdd = scoreRes[0];
                    setHomeAdd(homeAdd);
                    setHomeScore({
                        ee: Math.round(homeRes["ee"]),
                        three: Math.round(homeRes["three"]),
                        vodafone: Math.round(homeRes["vodafone"]),
                        o2: Math.round(homeRes["o2"])
                    });
                }
            }
            // When workaddress is inputted, run below code
            if (compareData.workAddress) {
                const scoreRes = await scoreService.getScores(compareData.workAddress);
                if (scoreRes === "Address Not Found") {
                    workState(true);
                }
                else {
                    workState(false);
                    const workRes = JSON.parse(scoreRes[1]);
                    const workAdd = scoreRes[0];
                    setWorkAdd(workAdd);
                    setWorkScore({
                        ee: Math.round(workRes["ee"]),
                        three: Math.round(workRes["three"]),
                        vodafone: Math.round(workRes["vodafone"]),
                        o2: Math.round(workRes["o2"])
                    })
                }
            }
            // When commute is inputted, run below code
            if (compareData.station1 && compareData.station2) {
                const scoreRes = await scoreService.getScoresCommute(compareData.station1, compareData.station2);
                const commuteRes = JSON.parse(scoreRes);
                setCommuteScore({
                    ee: Math.round(commuteRes["ee"]),
                    three: Math.round(commuteRes["three"]),
                    vodafone: Math.round(commuteRes["vodafone"]),
                    o2: Math.round(commuteRes["o2"])
                });
            }
        }
        getScores();
        // compareData below means that this useEffect will run everytime compareData changes
    }, [compareData]);



    // useEffects below that set the states of the interfaces being imported

    useEffect(() => {
        setInputScoreData([homeScore, workScore, commuteScore])
    }, [homeScore, workScore, commuteScore]);

    useEffect(() => {
        setFilterLength({filterLengthOne, filterLengthTwo, filterLengthThree});
    }, [filterLengthOne, filterLengthTwo, filterLengthThree]);

    useEffect(() => {
        setFilterSliders({filterPriceValues, filterDataValues, initialFilterPriceValues, initialFilterDataValues})
    }, [filterPriceValues, filterDataValues, initialFilterPriceValues, initialFilterDataValues]);

    useEffect(() => {
        setCustom({cost_mod: costMod, text_mod: textMod, min_mod: minMod, data_mod: dataMod})
    }, [costMod, textMod, minMod, dataMod])

    return (
        <Container fluid className="d-flex flex-row" id="maincontainer">
            <div className={menu}>
            <Row className='p-2 flex-shrink-1' id='addressinputcontainer' data-testid='inputRow'>
                    {/* https://react-bootstrap.github.io/forms/overview/ */}
                    <Form id='form'>
                        <Accordion flush alwaysOpen id='accordion' defaultActiveKey={['0', '1']}>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header className='header'>Address Input</Accordion.Header>
                                <Accordion.Body className='body'>
                                    <br></br>
                                    <Form.Group>
                                        <Form.Label >Home Address</Form.Label>
                                        <Form.Control
                                            data-testid='homeinput'
                                            className='small'
                                            placeholder="Home Address"
                                            onChange={(e: any) => {
                                                setHomeAddress(e.target.value);
                                            }}
                                            data-tooltip-id="homeinput"
                                            data-tooltip-content="Enter your address and submit and we'll find it"
                                            data-tooltip-place="bottom"
                                        >
                                        </Form.Control>
                                        <ReactToolTip className="tooltipontop" id="homeinput"/>
                                        {homeError === true && (
                                            <BootstrapAlert message='Please enter a valid address'></BootstrapAlert>
                                        )}
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Work Address</Form.Label>
                                        <Form.Control
                                            data-testid='workinput'
                                            className='small'
                                            placeholder="Work Address"
                                            onChange={(e: any) => {
                                                setWorkAddress(e.target.value);
                                            }}
                                            data-tooltip-id="workinput"
                                            data-tooltip-content="Enter your address and submit and we'll find it"
                                            data-tooltip-place="bottom"
                                        >
                                        </Form.Control>
                                        <ReactToolTip className="tooltipontop" id="workinput"/>
                                        {workError === true && (
                                            <BootstrapAlert message='Please enter a valid address'></BootstrapAlert>
                                        )}
                                    </Form.Group>
                                    <Form.Group data-testid='stationinput'>
                                        <Form.Label>Train Route</Form.Label>
                                        <Select
                                            options={stations}
                                            onChange={(e: any) => {
                                                setStation1(e.value);
                                            }}
                                        ></Select>
                                        <br></br>
                                        <Select
                                            options={stations}
                                            onChange={(e: any) => {
                                                setStation2(e.value);
                                            }}
                                        ></Select>
                                    </Form.Group>
                                    <div className="d-grid gap-2 mt-3">
                                        <Button size="sm" type="submit" onClick={submit}>
                                            Submit
                                        </Button>
                                        <Button size="sm" variant="info" onClick={addSearch}>Add Search</Button>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header className='header'>Coverage Results</Accordion.Header>
                                <Accordion.Body className='body'>
                                    <br></br>
                                    <div className='results medium'>
                                        {station2 == "" && (station1 == "") && (homeAdd == "") && (workAdd == "") && (
                                            <Container className="coverage">
                                                <p>Enter in an address or train route above to see your coverage results</p>
                                            </Container>
                                        )}
                                        {homeAdd != "" && (
                                            <div>
                                                <b>{homeAdd}</b>
                                                <br></br>
                                                <p>EE: {homeScore.ee}<br></br>
                                                    THREE: {homeScore.three}<br></br>
                                                    Vodafone: {homeScore.vodafone}<br></br>
                                                    O2: {homeScore.o2}</p>
                                            </div>)}
                                        {workAdd != "" && (
                                            <div>
                                                <b>{workAdd}</b>
                                                <br></br>
                                                <p>EE: {workScore.ee}</p>
                                                <p>THREE: {workScore.three}</p>
                                                <p>Vodafone: {workScore.vodafone}</p>
                                                <p>O2: {workScore.o2}</p>
                                            </div>
                                        )}
                                        {stationCheck && (
                                            <div>
                                                <b>{compareData.station1}</b>
                                                <b>   </b>
                                                <b>{compareData.station2}</b>
                                                <br></br>
                                                <p>EE: {commuteScore.ee}</p>
                                                <p>THREE: {commuteScore.three}</p>
                                                <p>Vodafone: {commuteScore.vodafone}</p>
                                                <p>O2: {commuteScore.o2}</p>
                                            </div>
                                        )}
                                    </div></Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2">
                                <Accordion.Header className='header'>Filters</Accordion.Header>
                                <Accordion.Body className='body'>
                                    <br></br>
                                    <div className="form-group">
                                        <legend className="legend-small">Contract Length:</legend>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="filterLengthOne"
                                                   checked={filterLengthOne} onChange={handleFilterLengthOne}/>
                                            <label className="form-check-label" htmlFor="filterLengthOne">
                                                1 Month
                                            </label>
                                        </div>

                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="filterLengthTwo"
                                                   checked={filterLengthTwo} onChange={handleFilterLengthTwo}/>
                                            <label className="form-check-label" htmlFor="filterLengthTwo">
                                                12 Months
                                            </label>
                                        </div>

                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="filterLengthThree"
                                               checked={filterLengthThree} onChange={handleFilterLengthThree}/>
                                        <label className="form-check-label" htmlFor="filterLengthThree">
                                            24 Months
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <br></br>
                                    <legend className="legend-small">Price Range Slider:</legend>

                                    {/* Worth noting here that this uses an earlier version of rc-slider, see thread in
                                    comments above for reasoning */}
                                    {/* //TODO: These sliders aren't perfect, ideally we would use a logarithmic slider to have greater
                                    control over the smaller numbers (2GB, 5GB, 10GB). Currently the majority of the slider is taken up by
                                    a small amount of contracts that have high data allowances.*/}
                                    <Range
                                        min={initialFilterPriceValues[0]}
                                        max={initialFilterPriceValues[1]}
                                        step={1}
                                        defaultValue={[initialFilterPriceValues[0], initialFilterPriceValues[1]]}
                                        onChange={(values: number[]) => {
                                            handlePriceChange(values);
                                        }}
                                        tipFormatter={(value: any) => `${value}£`}
                                        allowCross={false}
                                    />

                                    <br></br>
                                    <legend className="legend-small">Data Range Slider:</legend>

                                    <Range
                                        // also +1 on the max value as the value after the max number would be
                                        // the unlimited value

                                        min={initialFilterDataValues[0]}
                                        max={initialFilterDataValues[1] + 1}
                                        step={1}
                                        defaultValue={[initialFilterDataValues[0], initialFilterDataValues[1] + 1]}
                                        onChange={(values: number[]) => {
                                            handleDataChange(values);
                                        }}
                                        tipFormatter={(value: any) => {
                                          if (value > initialFilterDataValues[1]) {
                                            return "Unlimited";
                                          } else {
                                            return `${value}GB`;
                                          }
                                        }}
                                        allowCross={false}
                                    />

                                    <br></br>

                                    <div>
                                        {/* ImageSelection displays a list of images and allows the user to select and deselect them */}
                                        <ImageSelection selectedImages={selectedSuppliers} setSelectedImages={setSelectedSuppliers} />
                                    </div>

                                </div>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="3">
                                <Accordion.Header className='header'>Customize Algorithm</Accordion.Header>
                                <Accordion.Body className='body'>
                                    <br></br>
                                    <div className="form-group">
                                        <legend className="legend-small">How much do you care about cost?</legend>
                                        <div key="radio" className="mb-3">
                                        <Form.Check type={'radio'} label="Doesn't matter" name="cost" id="cost-1" onChange={(item) => {setCostMod(0)}}>
                                        </Form.Check>
                                        <Form.Check type={'radio'} label="Matters a little" name="cost" id="cost-2" onChange={(item) => {setCostMod(50)}}>
                                        </Form.Check>
                                        <Form.Check type={'radio'} label="Average importance" name="cost" id="cost-3" onChange={(item) => {setCostMod(100)}}>
                                        </Form.Check>
                                        <Form.Check type={'radio'} label="Important" name="cost" id="cost-4" onChange={(item) => {setCostMod(150)}}>
                                        </Form.Check>
                                        <Form.Check type={'radio'} label="Very important" name="cost" id="cost-5" onChange={(item) => {setCostMod(200)}}>
                                        </Form.Check>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <legend className="legend-small">How much do you care about data allowance?</legend>
                                        <div key="radio" className="mb-3">
                                        <Form.Check type={'radio'} label="Doesn't matter" name="Data" id="Data-1" onChange={(item) => {setDataMod(0)}}>
                                        </Form.Check>
                                        <Form.Check type={'radio'} label="Matters a little" name="Data" id="Data-2" onChange={(item) => {setDataMod(50)}}>
                                        </Form.Check>
                                        <Form.Check type={'radio'} label="Average importance" name="Data" id="Data-3" onChange={(item) => {setDataMod(100)}}>
                                        </Form.Check>
                                        <Form.Check type={'radio'} label="Important" name="Data" id="Data-4" onChange={(item) => {setDataMod(150)}}>
                                        </Form.Check>
                                        <Form.Check type={'radio'} label="Very important" name="Data" id="Data-5" onChange={(item) => {setDataMod(200)}}>
                                        </Form.Check>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <legend className="legend-small">How much do you care about minute allowance?</legend>
                                        <div key="radio" className="mb-3">
                                        <Form.Check type={'radio'} label="Doesn't matter" name="Min" id="Min-1" onChange={(item) => {setMinMod(0)}}>
                                        </Form.Check>
                                        <Form.Check type={'radio'} label="Matters a little" name="Min" id="Min-2" onChange={(item) => {setMinMod(50)}}>
                                        </Form.Check>
                                        <Form.Check type={'radio'} label="Average importance" name="Min" id="Min-3" onChange={(item) => {setMinMod(100)}}>
                                        </Form.Check>
                                        <Form.Check type={'radio'} label="Important" name="Min" id="Min-4" onChange={(item) => {setMinMod(150)}}>
                                        </Form.Check>
                                        <Form.Check type={'radio'} label="Very important" name="Min" id="Min-5" onChange={(item) => {setMinMod(200)}}>
                                        </Form.Check>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <legend className="legend-small">How much do you care about text allowance?</legend>
                                        <div key="radio" className="mb-3">
                                        <Form.Check type={'radio'} label="Doesn't matter" name="Text" id="Text-1" onChange={(item) => {setTextMod(0)}}>
                                        </Form.Check>
                                        <Form.Check type={'radio'} label="Matters a little" name="Text" id="Text-2" onChange={(item) => {setTextMod(50)}}>
                                        </Form.Check>
                                        <Form.Check type={'radio'} label="Average importance" name="Text" id="Text-3" onChange={(item) => {setTextMod(100)}}>
                                        </Form.Check>
                                        <Form.Check type={'radio'} label="Important" name="Text" id="Text-4" onChange={(item) => {setTextMod(150)}}>
                                        </Form.Check>
                                        <Form.Check type={'radio'} label="Very important" name="Text" id="Text-5" onChange={(item) => {setTextMod(200)}}>
                                        </Form.Check>
                                        </div>
                                    </div>

                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="4">
                                <Accordion.Header className='header'>Search History</Accordion.Header>
                                <div>
                                    <Accordion.Body className='body'>
                                    <br></br>
                                        <legend className="legend-small">Search Cards:</legend>
                                        <SearchCards searchData={searchCardProps}/>
                                    </Accordion.Body>
                                </div>
                            </Accordion.Item>
                        </Accordion>
                    </Form>
            </Row>
            </div>
            <a href="#" className="underline" onClick={menuToggle}>
            {menu == "open" && (<TbLayoutSidebarLeftCollapse size={40}/>)}
            {menu == "close" && (<TbLayoutSidebarLeftExpand size={40}/>)}

                </a>
            <Row className='p-2' id='scoreresultscontainer'>
                {station2 == "" && (station1 == "") && (homeAdd == "") && (workAdd == "") && (
                    <div className="enteraddress">
                        <p id="banner">Enter in your address on the left to see your coverage score and which plan is best for you.</p>
                    </div>
                )}
                <Contracts scoreData={inputScoreData} filters={filterLength} custom={custom} selectedSuppliers={selectedSuppliers} sliders={filterSliders}></Contracts>
            </Row>
        </Container >
    );
}
