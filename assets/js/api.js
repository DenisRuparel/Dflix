'use strict';

const api_key = 'eeb91e7e7881aaf1b14d82b7b79d960b';
const imageBaseURL = 'https://image.tmdb.org/t/p/';

/**
 * fetch data from a server using the url and passes
 * the results in JSON data to a 'callback' function,
 * along with an optional parameter if has 'optionalParam'
 */

const fetchDataFromServer = function (url, callback, optionalParam) {
    fetch(url)
    .then(response => response.json())
    .then(data => callback(data, optionalParam));
}

export { imageBaseURL, api_key, fetchDataFromServer };