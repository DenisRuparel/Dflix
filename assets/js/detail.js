'use strict';

import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const movieId = window.localStorage.getItem("movieId");
const pageContent = document.querySelector("[page-content]");

sidebar();

search();

const getGenres = function(genreList){
    const newGenreList = [];

    for(const { name } of genreList) newGenreList.push(name);
    return newGenreList.join(", ");
}

const getCasts = function(castList){
    const newCastList = [];

    for(let i = 0, len = castList.length; i < len && i < 10; i++){
        const { name } = castList[i];
        newCastList.push(name);
    }
    return newCastList.join(", "); 
}

const getDirectors = function(crewList){
    const directors = crewList.filter(({ job }) => job === "Director");

    const directorList = [];
    for(const { name } of directors) directorList.push(name);
    return directorList.join(", ");
}

const filterVideos = function(videoList){
    return videoList.filter(({ type, site }) => (type === "Trailer" || type === "Teaser" || type === "News") && site === "YouTube");
}

fetchDataFromServer(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&language=hi-in&region=IN&with_original_language=hi&append_to_response=casts,videos,images,releases`, function(movie){
    const {
        backdrop_path,
        poster_path, 
        title,
        release_date,
        runtime,
        vote_average,
        releases,
        genres,
        overview,
        casts,
        videos: { results: videos }
    } = movie;

    // Check for the presence of countries array in releases
    const certification = releases && releases.countries && releases.countries.length > 0
        ? releases.countries[0].certification
        : 'NR'; // Use 'NR' (Not Rated) as default if not found

    // Check for the presence of cast and crew in casts
    const cast = casts && casts.cast ? casts.cast : [];
    const crew = casts && casts.crew ? casts.crew : [];

    document.title = `${title} - Dflix`;

    const movieDetail = document.createElement("div");
    movieDetail.classList.add("movie-detail");

    movieDetail.innerHTML = `
        <div class="backdrop-image" style="background-image: url('${imageBaseURL}${"w1280" || "original"}${backdrop_path || poster_path}')"></div>
        
        <figure class="poster-box movie-poster">
            <img src="${imageBaseURL}w342${poster_path}" alt="${title}" class="img-cover-control"/>
        </figure>

        <div class="detail-box">
            <div class="detail-content">
                <h1 class="heading">${title}</h1>

                <div class="meta-list">
                    <div class="meta-item">
                        <img src="./assets/images/star.png" width="20" height="20" alt="rating"/>
                        <span class="span">${vote_average.toFixed(1)}</span>
                    </div>

                    <div class="seprator"></div>

                    <div class="meta-item">${runtime}m</div>

                    <div class="seprator"></div>

                    <div class="meta-item">${release_date.split("-")[0]}</div>

                    <div class="meta-item card-badge">${certification}</div>
                </div>

                <p class="genre">${getGenres(genres)}</p>

                <p class="overview">${overview}</p>

                <ul class="detail-list">
                    <div class="list-item">
                        <p class="list-name">Starring</p>
                        <p>${getCasts(cast)}</p>
                    </div>

                    <div class="list-item">
                        <p class="list-name">Directed By</p>
                        <p>${getDirectors(crew)}</p>
                    </div>
                </ul>

            </div>

            <div class="title-wrapper">
                <div class="title-large">Trailers and Clips</div>
            </div>

            <div class="slider-list">
                <div class="slider-inner"></div>
            </div>
        </div>
    `;

    for(const { key, name } of filterVideos(videos)){
        const videoCard = document.createElement("div");
        videoCard.classList.add("video-card");
        videoCard.innerHTML = `
            <iframe width="500" height="294" src="https://www.youtube.com/embed/${key}?theme=dark&color=white&rel=0" frameborder="0" allowfullscreen="1" title="${name}" class="img-cover-control" loading="lazy"></iframe>
        `;

        movieDetail.querySelector(".slider-inner").appendChild(videoCard);
    }

    pageContent.appendChild(movieDetail);

    fetchDataFromServer(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&language=hi-in&region=IN&with_original_language=hi`, addSuggestedMovies);
});

const addSuggestedMovies = function({results: movieList}, title){
    const movieListElem = document.createElement("section");
    movieListElem.classList.add("movie-list");
    movieListElem.ariaLabel = "You May Also Like";

    movieListElem.innerHTML = `
        <div class="title-wrapper">
            <h3 class="title-large">You May Also Like</h3>
        </div>

        <div class="slider-list">
            <div class="slider-inner"></div>
        </div>
    `;

    if (movieList !== undefined) {
        for(const movie of movieList){
            const movieCard = createMovieCard(movie);
            movieListElem.querySelector(".slider-inner").appendChild(movieCard);
        }
        pageContent.appendChild(movieListElem);
    }
}