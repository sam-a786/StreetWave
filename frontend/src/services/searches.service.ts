import axios from 'axios';

export class SearchesService {
    public async getSearchesByUser(user_id: number) {
        const response = await axios.get(`http://127.0.0.1:8000/api/searches/searchuser/` + user_id + '/');
        const data = JSON.parse(JSON.stringify(response.data))
        return data;
    }

    public async getSearchesById(search_id: string) {

        const response = await axios.get('http://127.0.0.1:8000/api/searches/searchid/' + search_id  + '/');
        const data = JSON.parse(JSON.stringify(response.data));
        return data;
    }

    public async deleteSearch(search_id: number) {

        const response = await axios.delete('http://127.0.0.1:8000/api/searches/delete/' + search_id + '/');
        const data = JSON.parse(JSON.stringify(response.data));
        return data;
    }

    public async addSearch(search: any) {
        const response = await axios.post('http://127.0.0.1:8000/api/searches/add/', { search }, {headers: {'Content-Type': 'application/json'}});
        const data = JSON.parse(JSON.stringify(response.data));
        return data;
    }

    public async getFilter(filter_name: string) {
        const response = await axios.get('http://127.0.0.1:8000/api/searches/getfilter/' + filter_name + '/');
        const data = JSON.parse(JSON.stringify(response.data));
        return data;

    }

    public async addSearchFilter(searchFilter: any) {
        const response = await axios.post('http://127.0.0.1:8000/api/searches/addsearchfilter/', { searchFilter }, {headers: {'Content-Type': 'application/json'}});
        const data = JSON.parse(JSON.stringify(response.data));
        return data;
    }

}