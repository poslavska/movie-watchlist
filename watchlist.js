const moviesSection = document.getElementById("movies-section")
const main = document.querySelector("main")

centerContainers()
moviesSection.addEventListener("click", function(e) {
    const button = e.target.closest(".remove-watchlist") //check if the clicked element has the 'remove-watchlist' class
    if (button) {
        const imdbID = button.dataset.remove
        removeFromWatchlist(imdbID)
    }
})

function centerContainers() {
    main.classList.add("full-height")
    moviesSection.classList.add("center-container")
}

function renderWatchlistMovies() {
    if (localStorage.length > 0) {
        main.classList.remove("full-height")
        moviesSection.classList.remove("center-container")

        let html = ""
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            const watchlistArray = JSON.parse(localStorage.getItem(key)) //get the values at the given key (string value) and turn them into an array
            if (Array.isArray(watchlistArray)) {
                watchlistArray.forEach(movie => {
                    html += `
                    <div class="movie">
                        <img src="${movie.Poster}" class="movie-poster" alt="Poster for ${movie.Title}">
                        <div class="details-container">
                            <div class="movie-main">
                                <p class="movie-title">${movie.Title}</p>
                                <div class="rating-container">
                                    <i class="fa-solid fa-star"></i>
                                    <p class="movie-rating">${movie.imdbRating}</p>
                                </div>
                            </div>
                            <div class="movie-details">
                                <div class="movie-details-wrapper">
                                    <p class="movie-year">${movie.Year}</p>
                                    <i class="fa-solid fa-circle circle"></i>
                                    <p class="movie-runtime">${movie.Runtime}</p>
                                    <p class="movie-genre">${movie.Genre}</p>
                                </div>
                                <div class="watchlist-container">
                                    <button class="remove-watchlist" data-remove="${movie.imdbID}"><i class="fa-solid fa-circle-minus"></i></button>
                                    <p class="watchlist-label">Remove</p>
                                </div>
                            </div>
                            <div class="movie-description">
                                <p class="description-text">${movie.Plot}</p>
                            </div>
                        </div>
                    </div>
                    `
                })
            }
        }
        moviesSection.innerHTML = html
        addMovieBorder()
    } else if (localStorage.length === 0) {
        moviesSection.innerHTML = `
        <div class="initial-container">
            <p class="no-data">Your watchlist is looking a little empty...</p>
            <div class="button-holder">
                <a href="index.html" class="index-link">
                    <button class="new-movies-btn"><i class="fa-solid fa-circle-plus" id="watchlist-circle"></i></button>
                    <p class="add-movies-p">Let's add some movies!</p>
                </a>
            </div>
        </div>
        `
        centerContainers()
    }
}

function removeFromWatchlist(imdbID) {
    localStorage.removeItem(imdbID)
    renderWatchlistMovies()
}

function addMovieBorder() {
    const children = moviesSection.children
    if (children.length > 1) {
        for (let i = 0; i < children.length - 1; i++) {
            children[i].classList.add("border-bottom")
        }
    } 
}

renderWatchlistMovies()