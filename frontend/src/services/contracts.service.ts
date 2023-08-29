import axios from 'axios';

export class ContractsService {
    public async getContracts() {
        const response = await axios.get('http://127.0.0.1:8000/api/contracts/');

        return response.data;
    }
}