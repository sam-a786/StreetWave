import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SearchCards.css";
import { SearchesService } from "../services/searches.service";
import { Button, Card } from "react-bootstrap";

export interface SavedSearch {
    id: number;
    homeAddress: string;
    workAddress: string;
    station1: string;
    station2: string;
    // contractLength: string;
    // contractPrice: string;
    // contractData: string;
    // contractSuppliers: string;
    datetime: string;
}

export interface IProps {
    handleSetSearch: (savedSearch: SavedSearch) => void;
    searchTrigger: boolean;
}

interface searchCardsProps {
    searchData: IProps;
}

function SearchCards({ searchData }: searchCardsProps) {

    const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
    const [userId, setUserId] = useState<number>(0);

    const accessToken =
        localStorage.getItem("access_token") !== null &&
        JSON.parse(localStorage.getItem("access_token") as string);

    let searchesService = new SearchesService();

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

    useEffect(() => {


        async function getSearches() {
            let data = await searchesService.getSearchesByUser(userId);
            console.log(data)
            if (data) {

                let savedSearches: { id: any; homeAddress: string; workAddress: string; station1: any; station2: any; datetime: any; }[] = [];

                for (let i = 0; i < data.length; i++) {

                    // let contractLength: string[] = [];
                    // let contractPrice: string[] = [];
                    // let contractData: string[] = [];
                    // let contractSuppliers : string[] = [];
                    //
                    // for (let j = 0; j < data[i].filters.length; j++) {
                    //   if (data[i].filters[j].filter_name === "DataMin") {
                    //     contractData.push("Data Min: " + data[i].filters[j].value + " GB ");
                    //   }
                    //   if (data[i].filters[j].filter_name === "DataMax") {
                    //     contractData.push("Data Max: " + data[i].filters[j].value + " GB ");
                    //   }
                    //   if (data[i].filters[j].filter_name === "PriceMin") {
                    //       contractPrice.push("Price Min: £" + data[i].filters[j].value + " ");
                    //   }
                    //   if (data[i].filters[j].filter_name === "PriceMax") {
                    //       contractPrice.push("Price Max: £" + data[i].filters[j].value + " ");
                    //   }
                    //   if (data[i].filters[j].value) {
                    //
                    //       if (data[i].filters[j].filter_name === "1 Month") {
                    //           contractLength.push(data[i].filters[j].value);
                    //       }
                    //
                    //       if (data[i].filters[j].filter_name === "12 Months") {
                    //           contractLength.push(data[i].filters[j].value);
                    //       }
                    //
                    //       if (data[i].filters[j].filter_name === "24 Months") {
                    //           contractLength.push(data[i].filters[j].value);
                    //       }
                    //
                    //       if (data[i].filters[j].filter_name === "O2") {
                    //           contractSuppliers.push(data[i].filters[j].value);
                    //       }
                    //
                    //       if (data[i].filters[j].filter_name === "EE") {
                    //           contractSuppliers.push(data[i].filters[j].value);
                    //       }
                    //
                    //       if (data[i].filters[j].filter_name === "Vodafone") {
                    //           contractSuppliers.push(data[i].filters[j].value);
                    //       }
                    //
                    //       if (data[i].filters[j].filter_name === "Three") {
                    //           contractSuppliers.push(data[i].filters[j].value);
                    //       }
                    //   }
                    // }


                    savedSearches.push({
                        id: data[i].id,
                        homeAddress: data[i].home_addr,
                        workAddress: data[i].work_addr,
                        station1: data[i].first_station,
                        station2: data[i].second_station,
                        datetime: data[i].datetime
                    });

                    // contractLength: contractLength.join(", "),
                    // contractPrice: contractPrice.join(", "),
                    // contractData: contractData.join(", "),
                    // contractSuppliers: contractSuppliers.join(", "),
                }
                console.log(savedSearches);
                setSavedSearches(savedSearches);
            }
        }
        getSearches();
    }, [userId, searchData.searchTrigger]);

    const handleDeleteSearch = (id: number) => {

        searchesService.deleteSearch(id);
        setSavedSearches(savedSearches.filter((savedSearch) => savedSearch.id !== id));

    };

    const handleSetSearch = (savedSearch: SavedSearch) => {
        searchData.handleSetSearch(savedSearch);
    }

    return (
        <div className="card-container">
            {savedSearches.map((savedSearch, index) => (
                <div key={index} className="saved-search-card">
                    <Card>
                        <Card.Body>
                            <Button className="button-top-right" onClick={() => handleDeleteSearch(savedSearch.id)}>X</Button>
                            <div className="saved-search-card-item">
                                <div className="saved-search-card-item-title">Home Address:</div>
                                <div className="saved-search-card-item-value">{savedSearch.homeAddress}</div>
                            </div>
                            <div className="saved-search-card-item">
                                <div className="saved-search-card-item-title">Work Address:</div>
                                <div className="saved-search-card-item-value">{savedSearch.workAddress}</div>
                            </div>
                            <div className="saved-search-card-item">
                                <div className="saved-search-card-item-title">Station 1:</div>
                                <div className="saved-search-card-item-value">{savedSearch.station1}</div>
                            </div>
                            <div className="saved-search-card-item">
                                <div className="saved-search-card-item-title">Station 2:</div>
                                <div className="saved-search-card-item-value">{savedSearch.station2}</div>
                            </div>
                            <div className="saved-search-card-item">
                                <div className="saved-search-card-item-title">Timestamp Of Save</div>
                                <div className="saved-search-card-item-value">{savedSearch.datetime}</div>
                            </div>
                            <Button className="use-button" onClick={() => handleSetSearch(savedSearch)}>Load Search</Button>
                        </Card.Body>
                    </Card>
                </div>
            ))}
        </div>
    );
}

{/*<div className="saved-search-card-item">*/ }
{/*  <div className="saved-search-card-item-title">Contract Length:</div>*/ }
{/*  <div className="saved-search-card-item-value">{savedSearch.contractLength}</div>*/ }
{/*</div>*/ }
{/*<div className="saved-search-card-item">*/ }
{/*  <div className="saved-search-card-item-title">Contract Price:</div>*/ }
{/*  <div className="saved-search-card-item-value">{savedSearch.contractPrice}</div>*/ }
{/*</div>*/ }
{/*<div className="saved-search-card-item">*/ }
{/*  <div className="saved-search-card-item-title">Contract Data:</div>*/ }
{/*  <div className="saved-search-card-item-value">{savedSearch.contractData}</div>*/ }
{/*</div>*/ }
{/*<div className="saved-search-card-item">*/ }
{/*  <div className="saved-search-card-item-title">Contract Suppliers:</div>*/ }
{/*  <div className="saved-search-card-item-value">{savedSearch.contractSuppliers}</div>*/ }
{/*</div>*/ }


export default SearchCards;