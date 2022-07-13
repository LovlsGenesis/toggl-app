import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.track.toggl.com/api',
});

export default api;
