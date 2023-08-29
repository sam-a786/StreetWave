import React from 'react';
import { render, screen } from '@testing-library/react';
import SideAccordion from '../components/SideAccordion';
import axios from 'axios';

const resp = {
    "data": [
      {
        "id": 1,
        "bonuses": [
          {
            "id": 1,
            "bonus_desc": "Movies",
            "bonus_val": 0,
            "contract": 1
          }
        ],
        "supplier": {
          "id": 1,
          "supplier_name": "Vodafone"
        },
        "data_allowance": "60 GB",
        "minutes": 5000,
        "texts": 5000,
        "cost": 13,
        "pay_interval": "Monthly",
        "length": 12
      },
      {
        "id": 2,
        "bonuses": [
          {
            "id": 2,
            "bonus_desc": "5G",
            "bonus_val": 0,
            "contract": 2
          },
          {
            "id": 3,
            "bonus_desc": "Movies",
            "bonus_val": 0,
            "contract": 2
          }
        ],
        "supplier": {
          "id": 1,
          "supplier_name": "Vodafone"
        },
        "data_allowance": "unlimited",
        "minutes": 10000,
        "texts": "unlimited",
        "cost": 20,
        "pay_interval": "Monthly",
        "length": 12
      },
      {
        "id": 3,
        "bonuses": [
          {
            "id": 4,
            "bonus_desc": "Three Gift Vouchers In £",
            "bonus_val": 90,
            "contract": 3
          }
        ],
        "supplier": {
          "id": 2,
          "supplier_name": "Three"
        },
        "data_allowance": "60 GB",
        "minutes": "unlimited",
        "texts": "unlimited",
        "cost": 18,
        "pay_interval": "Yearly",
        "length": 24
      }
    ],
    "status": 200,
    "statusText": "OK",
    "headers": {
      "allow": "GET, OPTIONS",
      "content-length": "707",
      "content-type": "application/json",
      "cross-origin-opener-policy": "same-origin",
      "date": "Tue, 28 Feb 2023 13:01:24 GMT",
      "referrer-policy": "same-origin",
      "server": "WSGIServer/0.2 CPython/3.11.0",
      "vary": "Accept, Cookie, Origin",
      "x-content-type-options": "nosniff",
      "x-frame-options": "DENY"
    },
    "config": {
      "transitional": {
        "silentJSONParsing": true,
        "forcedJSONParsing": true,
        "clarifyTimeoutError": false
      },
      "adapter": [
        "xhr",
        "http"
      ],
      "transformRequest": [
        null
      ],
      "transformResponse": [
        null
      ],
      "timeout": 0,
      "xsrfCookieName": "XSRF-TOKEN",
      "xsrfHeaderName": "X-XSRF-TOKEN",
      "maxContentLength": -1,
      "maxBodyLength": -1,
      "env": {},
      "headers": {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": null
      },
      "method": "get",
      "url": "http://127.0.0.1:8000/api/contracts/"
    },
    "request": {}
  };

test('renders outer input row', () => {

    (axios.get as jest.Mock).mockResolvedValue(resp);

    render(<SideAccordion />);

    const rowElement = screen.getByTestId("inputRow");

    expect(rowElement).toBeInTheDocument();
});

test('renders form elements', () => {

    (axios.get as jest.Mock).mockResolvedValue(resp);

    render(<SideAccordion />);

    const homeinputElement = screen.getByTestId('homeinput');
    const workinputElement = screen.getByTestId('workinput');
    const stationinputElement = screen.getByTestId('stationinput');

    expect(homeinputElement).toBeInTheDocument();
    expect(workinputElement).toBeInTheDocument();
    expect(stationinputElement).toBeInTheDocument();
});