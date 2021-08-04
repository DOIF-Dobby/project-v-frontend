import axios from 'axios';
import jwtDecode from 'jwt-decode';

async function issueAccessToken() {
  if (!isValidAccessToken()) {
    const response = await axios.get('/token/access-token');

    axios.defaults.headers.common['Authorization'] =
      response.headers.authorization;
  }
}

export function isValidAccessToken(): boolean {
  const accessToken = axios.defaults.headers.common['Authorization'];

  if (accessToken) {
    const jwt = accessToken.substring('Bearer '.length);
    const decodedJwt: any = jwtDecode(jwt);

    const expire = new Date(0);
    expire.setUTCSeconds(decodedJwt.exp);

    const now = new Date();

    return now < expire;
  } else {
    return false;
  }
}

export default issueAccessToken;
