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
    if (favoritesList) {
        favoritesList.addEventListener('click', function(event) {
            const movieElement = event.target.closest('.favorite-movie');
            if (movieElement) {
                const index = Array.from(favoritesList.children).indexOf(movieElement);
                openMovieDetailsModal(favorites[index]);
            }
        });
    }
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
            Plot: movie.Plot,
            Genre: movie.Genre,
            Rated: movie.Rated,
            Language: movie.Language,
            Country: movie.Country,
            Runtime: movie.Runtime,
            Awards: movie.Awards,
            Writer: movie.Writer,
            BoxOffice: movie.BoxOffice,
            Metascore: movie.Metascore
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
         <div class="movie-result" style="cursor:pointer;">
             <ul>
                 <li><strong>${movie.Title} (${movie.Year})</strong></li>
                 <li><strong>Director:</strong> ${movie.Director}</li>
                 <li><strong>Actors:</strong> ${movie.Actors}</li>
                 <li><strong>IMDB Rating:</strong> ${movie.imdbRating} ${stars}</li>
                 <li><strong>Plot:</strong> ${movie.Plot}</li>
                 <li><img src="${movie.Poster}" alt="Poster"></li>
             </ul>
         </div>
         <button id="save-favorite-btn">Save to Favorites</button>
     `;
    const saveBtn = document.getElementById('save-favorite-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            saveMovieToFavorites(movie);
        });
    }
    // Add click event to open modal with full details
    const movieResult = document.querySelector('.movie-result');
    if (movieResult) {
        movieResult.addEventListener('click', function() {
            openMovieDetailsModal(movie);
        });
    }
}
// Open modal and display full movie details
function openMovieDetailsModal(movie) {
    const modal = document.getElementById('modal');
    const modalDetails = document.getElementById('modal-details');
    let stars = '';
    let rating = parseInt(movie.imdbRating);
    for (let i = 0; i < rating; i++) {
        stars += '⭐';
    }
    modalDetails.innerHTML = `
        <h2>${movie.Title} (${movie.Year})</h2>
        <img src="${movie.Poster}" alt="Poster" style="height:200px"><br>
        <strong>Director:</strong> ${movie.Director}  <strong>Writer:</strong> ${movie.Writer}<br>
        <strong>Actors:</strong> ${movie.Actors}<br>
        <strong>IMDB Rating:</strong> ${movie.imdbRating} ${stars}<br>
        <strong>Plot:</strong> ${movie.Plot}<br>
        <strong>Genre:</strong> ${movie.Genre}  <strong>Rating:</strong> ${movie.Rated}<br>
        <strong>Language:</strong> ${movie.Language}  <strong>Country:</strong> ${movie.Country}<br>
        <strong>Awards:</strong> ${movie.Awards}<br>
        <strong>Runtime:</strong> ${movie.Runtime}<br>
        <strong>Box Office:</strong> ${movie.BoxOffice}<br>
        <strong>Metascore:</strong> ${movie.Metascore}
    `;
    modal.style.display = 'block';
}
// Close modal logic
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
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

    // Modal close button event
    const closeButton = document.querySelector('.close-button');
    const modal = document.getElementById('modal');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    // Close modal when clicking outside modal content
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
});