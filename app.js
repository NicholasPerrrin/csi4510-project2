// Display favorite movies in the Favorites section
function displayFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p>No favorites yet.</p>';
        return;
    }
    favoritesList.innerHTML = favorites.map(movie => `
        <div class="favorite-movie">
            <strong>${movie.Title} (${movie.Year})</strong><br>
            <img src="${movie.Poster}" alt="Poster" style="height:80px"><br>
            <span>Director: ${movie.Director}</span><br>
            <span>IMDB Rating: ${movie.imdbRating}</span>
        </div>
    `).join('');
}
// Save movie to localStorage as favorite
function saveMovieToFavorites(movie) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    // Avoid duplicates
    if (!favorites.some(fav => fav.imdbID === movie.imdbID)) {
        favorites.push({
            imdbID: movie.imdbID,
            Title: movie.Title,
            Year: movie.Year,
            Poster: movie.Poster,
            Director: movie.Director,
            Actors: movie.Actors,
            imdbRating: movie.imdbRating,
            Plot: movie.Plot
        });
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
    }
}
// fetch movie data from OMDb API
async function fetchMovieData(movieTitle) {
    const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(movieTitle)}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.Response === "True") {
            displayMovieDetails(data);
        } else {
            // You can update the UI to show "Movie not found" here
            console.log("Movie not found.");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
// Display movie details
function displayMovieDetails(movie) {
    let stars = '';
    let rating = parseInt(movie.imdbRating);
    for (let i = 0; i < rating; i++) { // calculate number of stars based on IMDB rating
        stars += '⭐';
    }
    // Update the results list with movie details and a button to save to favorites
    let resultsList = document.getElementById('results-list');
    resultsList.innerHTML = `
        <ul>
            <li><strong>${movie.Title} (${movie.Year})</strong></li>
            <li><strong>Director:</strong> ${movie.Director}</li>
            <li><strong>Actors:</strong> ${movie.Actors}</li>
            <li><strong>IMDB Rating:</strong> ${movie.imdbRating} ${stars}</li>
            <li><strong>Plot:</strong> ${movie.Plot}</li>
            <li><strong>Poster:</strong> <img src="${movie.Poster}" alt="Poster"></li>
        </ul>
        <button id="save-favorite-btn">Save to Favorites</button>
    `;
    const saveBtn = document.getElementById('save-favorite-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            saveMovieToFavorites(movie);
        });
    }
    // console.log(`Title: ${movie.Title}`);
    // console.log(`Year: ${movie.Year}`);
    // console.log(`Director: ${movie.Director}`);
    // console.log(`Actors: ${movie.Actors}`);
    // console.log(`IMDB Rating: ${movie.imdbRating}`);
    // console.log(`Plot: ${movie.Plot}`);
    // console.log(`Poster URL: ${movie.Poster}`);
}

const apiKey = "9f3b1434"; // Replace with your actual OMDb API key

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            fetchMovieData(searchTerm);
        }
    });

    displayFavorites();
});