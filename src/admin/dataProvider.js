import { fetchUtils } from 'react-admin';
import restProvider from 'ra-data-simple-rest'

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem('token');
    // Ajouter le token aux en-têtes
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
};

const dataProvider = restProvider('http://localhost:5000/api', httpClient);

export default dataProvider;
