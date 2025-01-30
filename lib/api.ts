import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
});

export const fetchDailyData = () => api.post(`/api/v2/daily`);
export const fetchWeeklyData = () => api.post(`/api/v2/weekly`);
export const fetchTotalData = () => api.post(`/api/v2/total`);
export const fetchSessionStats = () => api.post(`/api/v2/sessionStats`);
export const fetchFrequentUsers = () => api.post(`/api/v2/frequently`);

