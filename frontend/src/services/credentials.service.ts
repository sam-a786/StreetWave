import axios from "axios";

export class CredentialsService {
  public async getCredentials() {
    const response = await axios.get("http://127.0.0.1:8000/credentials");
    return response.data;
  }
}
