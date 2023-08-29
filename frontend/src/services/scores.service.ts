import axios from 'axios';

export class ScoreService {
    public async getScores(address: string) {
        const response = await axios.post(`http://127.0.0.1:8000/api/scores/`, { address },);

        const data = JSON.parse(JSON.stringify(response.data))

        return data;
    }

    public async getScoresCommute(station1: string, station2: string) {

        const response = await axios.post('http://127.0.0.1:8000/api/scores/', {station1, station2},);

        const data = JSON.parse(JSON.stringify(response.data))

        return data;
    }
}