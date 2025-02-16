const moviesSection = document.getElementById("movies-section")
const main = document.querySelector("main")

const searchInput = document.getElementById("search-input")
const searchBtn = document.getElementById("search-btn")

document.addEventListener("DOMContentLoaded", function() {
    main.classList.add("full-height")
    moviesSection.classList.add("center-container")

    if (searchBtn && searchInput) {
        searchBtn.addEventListener("click", function(e){
            e.preventDefault()
            searchBtn.disabled = true //disable button when clicked
            searchBtn.classList.add("disable-btn")
            getMovie().then(() => {
                searchBtn.disabled = false //re-enable button after fetching completes
                searchBtn.classList.remove("disable-btn")
            })
        })
        searchInput.addEventListener("keydown", function(e){
            if (e.code === "Enter") {
                e.preventDefault()
                searchBtn.disabled = true
                searchBtn.classList.add("disable-btn")
                getMovie().then(() => {
                    searchBtn.disabled = false
                    searchBtn.classList.remove("disable-btn")
                })
            }
        }) //allow the user to submit the search input by pressing the "Enter" key
    }
})

function getMovie() {
    const apiKey = 'e5d7e93b'
    const movieName = searchInput.value

    return fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${movieName}&type=movie`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            return response.json()
        })
        .then(data => {
            if (data.Response === "True" && data.Search && data.Search.length > 0) {
                main.classList.remove("full-height")
                moviesSection.classList.remove("center-container")

                const movieResults = data.Search.slice(0, 10)
                const moviesDetailsPromises = movieResults.map(movie => {
                    return fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}&plot=short`)
                        .then(response => response.json())
                })
                    
                return Promise.all(moviesDetailsPromises) //wait for all the fetch calls to resolve
                    .then(moviesDetails => {
                        renderMovies(moviesDetails)
                    })
            } else {
                moviesSection.innerHTML = `
                <div class="no-data-container">
                    <p class="no-data">Unable to find what you're looking for. Please try another search.</p>
                </div>
                `
                return Promise.resolve()
            } 
        })
}

function renderMovies(moviesDetails) {
    const uniqueTitles = []
    
    const uniqueMovies = moviesDetails.filter(movie => {
        //check if the film is already in the uniqueTitles array
        if (uniqueTitles.includes(movie.imdbID)) {
            return false //skip this movie if it's already in the array
        } else {
            uniqueTitles.push(movie.imdbID)
            return true
        }
    })
    getMovieResultsHtml(uniqueMovies)
    addMovieBorder()
    
    document.addEventListener("click", function(e){
        const button = e.target.closest(".add-watchlist") //check if the clicked element has the 'add-watchlist' class
        if (button) {
            const foundMovie = uniqueMovies.find(element => button.dataset.add === element.imdbID)
            
            if (foundMovie) {
                const watchlist = JSON.parse(localStorage.getItem(`${button.dataset.add}`)) || []

                if (!watchlist.some(movie => movie.imdbID === foundMovie.imdbID)) {
                    watchlist.push(foundMovie)
                    localStorage.setItem(`${button.dataset.add}`, JSON.stringify(watchlist))
                }
                button.outerHTML = `<i class="fa-solid fa-circle-check"></i>` //change the button tag to a check icon
            }
        }
    })
}

function getMovieResultsHtml(uniqueMovies) {
    let html = ""
    uniqueMovies.forEach(movie => {
        let isInWatchlist = localStorage.getItem(movie.imdbID) 
            ? `<i class="fa-solid fa-circle-check"></i>`
            : `<button class="add-watchlist" data-add="${movie.imdbID}"><i class="fa-solid fa-circle-plus"></i></button>`
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
                        ${isInWatchlist}
                        <p>Watchlist</p>
                    </div>
                </div>
                <div class="movie-description">
                    <p class="description-text">${movie.Plot}</p>
                </div>
            </div>
        </div>
    `
    })
    moviesSection.innerHTML = html
}

function addMovieBorder() {
    const children = moviesSection.children
    if (children.length > 1) {
        for (let i = 0; i < children.length - 1; i++) {
            children[i].classList.add("border-bottom")
        }
    } 
}