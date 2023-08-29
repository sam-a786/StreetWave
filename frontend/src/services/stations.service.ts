import axios from 'axios';

export class StationsService {
    public async getStations() {
        const response = await axios.get('http://127.0.0.1:8000/api/stations/');

        return response.data;
    }
}