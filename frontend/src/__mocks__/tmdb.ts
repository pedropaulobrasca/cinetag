import axios from 'axios';

export const tmdbClient = axios.create({ baseURL: 'https://api.themoviedb.org/3' });
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
