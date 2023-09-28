import request from 'umi-request';
import { TOKEN, HTTP_TOKEN, CURRENT_HTTP } from '../constant';
/* Login */
export async function login() {
  return request(`${CURRENT_HTTP}/login`, {
    method: 'POST',
    data: {
      user: 'admin',
      password: '73@TuGraph',
    },
  });
}
export async function getFlightList(params: any) {
  return request(`${CURRENT_HTTP}/LGraphHttpService/Query/flight-demo`, {
    method: 'POST',
    headers: {
      Authorization: TOKEN,
    },
    data: {
      ...params,
    },
  });
}

/* city */

export async function getCity(params: any) {
  return request(`${CURRENT_HTTP}/cypher`, {
    method: 'POST',
    headers: {
      Authorization: params?.token ? `Bearer ${params?.token}` : HTTP_TOKEN,
    },
    data: {
      ...params,
    },
  });
}
