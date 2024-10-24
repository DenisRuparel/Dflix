'use strict';

import { api_key, fetchDataFromServer } from "./api.js";

export function sidebar() {

    const genreList = {};

    fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, function ({ genres }) {
        for (const { id, name } of genres) {
            genreList[id] = name;
        }

        // Check if genre links have already been appended to avoid duplication
        if (!document.querySelector(".genre-links-appended")) {
            genreLink();
        }
    });

    const sidebarInner = document.createElement("div");
    sidebarInner.classList.add("sidebar-inner");

    const year = new Date().getFullYear();

    sidebarInner.innerHTML = `
        <div class="sidebar-list genre-list">
            <p class="title">Genre</p>
        </div>

        <div class="sidebar-list">

            <p class="title">Language</p>

            <a href="./movie-list.html" menu-close class="sidebar-link" onclick='getMovieList("with_original_language=hi", "Hindi")'>Hindi</a>
            <a href="./movie-list.html" menu-close class="sidebar-link" onclick='getMovieList("with_original_language=en", "English")'>English</a>
            <a href="./movie-list.html" menu-close class="sidebar-link" onclick='getMovieList("with_original_language=bn", "Bengali")'>Bengali</a>
        </div>

        <div class="sidebar-footer">
            <p class="copyright">
                Copyright &copy; ${year} by<br>
                <a href="https://github.com/DenisRuparel">Denis Ruparel</a><br>
                All Rights Reserved
            </p>
        </div>
        `;

    const genreLink = function () {
        for(const [genreId, genreName] of Object.entries(genreList)){
            const link = document.createElement("a");
            link.classList.add("sidebar-link");
            link.setAttribute("href", "./movie-list.html");
            link.setAttribute("menu-close", "");
            link.setAttribute("onclick", `getMovieList("with_genres=${genreId}", "${genreName}")`);
            link.textContent = genreName;
            sidebarInner.querySelector(".genre-list").appendChild(link);
        }
        
        // Mark that genre links have been appended
        const genreListElement = sidebarInner.querySelector(".genre-list");
        genreListElement.classList.add("genre-links-appended");
        
        const sidebar = document.querySelector(".sidebar");
        sidebar.appendChild(sidebarInner);
        toggleSidebar(sidebar);
    };

    const toggleSidebar = function(sidebar){
        /**
         * Toggle sidebar in mobile screen
         */

        const sidebarBtn = document.querySelector("[menu-btn]");
        const sidebarTogglers = document.querySelectorAll("[menu-toggler]");
        const sidebarClose = document.querySelectorAll("[menu-close]");
        const overlay = document.querySelector("[overlay]");

        addEventOnElements(sidebarTogglers, "click", function(){
            sidebar.classList.toggle("active");
            sidebarBtn.classList.toggle("active");
            overlay.classList.toggle("active");
        });

        addEventOnElements(sidebarClose, "click", function(){
            sidebar.classList.remove("active");
            sidebarBtn.classList.remove("active");
            overlay.classList.remove("active");
        });
    };
}