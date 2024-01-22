import axios from 'axios';

export function post(host: string, endpoint: string, params: any) {
  return new Promise((resolve, reject) => {
    axios.post(host + endpoint, params, { headers: { 'Content-Type': 'application/json' } })
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  })
}

export function sendGroupMsg(host: string, msg:MessageSegment[], group_id: number) {
  return post(host, '/send_group_msg', { group_id, message: msg })
}