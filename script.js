// API base URL
const API_BASE = 'http://localhost:5000/api/movies';

// DOM elements (must be defined before any function uses them)
const movieGrid = document.getElementById('movieGrid');
const pageNumbers = document.getElementById('pageNumbers');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');

// Home button logic
const homeNav = document.querySelector('nav ul li:first-child');
if (homeNav) {
    homeNav.addEventListener('click', function(e) {
        e.preventDefault();
        // Remove filters and show all movies
        searchInput.value = '';
        currentPage = 1;
        document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('nav ul li').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        fetchAndDisplayMovies();
    });
}

// Add active class to navigation items (except Home)
document.querySelectorAll('nav ul li:not(:first-child)').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('nav ul li').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

// Search functionality
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
        fetchAndDisplayMovies({ search: searchTerm });
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});

// Category card hover effects
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        const category = this.querySelector('h3').textContent;
        fetchAndDisplayMovies({ genre: category });
    });
});

// Helper: Show loading
function showLoading() {
    movieGrid.innerHTML = '<div class="loading">Loading...</div>';
}

// Helper: Show error
function showError(message) {
    movieGrid.innerHTML = `<div class="error-message">${message}</div>`;
}

// Make goToPage function globally accessible
window.goToPage = function(page) {
    currentPage = page;
    fetchAndDisplayMovies();
};

// Pagination settings
const moviesPerPage = 6;
let currentPage = 1;
let currentMovies = [];
let totalPages = 1;

console.log('DOM elements:', { movieGrid, pageNumbers, prevPageBtn, nextPageBtn }); // Debug log

// Function to create movie card
function createMovieCard(movie) {
    return `
        <div class="movie-card" onclick="window.location.href='movie.html?id=${movie._id}'">
            <div class="movie-poster">
                <img src="${movie.poster}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'">
                <div class="movie-rating">${movie.rating}</div>
                <div class="movie-overlay">
                    <button class="btn-watch"><i class="fas fa-play"></i> Watch Trailer</button>
                </div>
            </div>
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p class="movie-year">${movie.year}</p>
                <p class="movie-genre">${movie.genre}</p>
                <p class="movie-description">${movie.description}</p>
            </div>
        </div>
    `;
}

// Fetch movies from backend
async function fetchAndDisplayMovies({ search = '', genre = '' } = {}) {
    showLoading();
    let url = `${API_BASE}?page=${currentPage}&limit=${moviesPerPage}`;
    if (search) {
        url = `${API_BASE}/search/${encodeURIComponent(search)}`;
    } else if (genre) {
        url = `${API_BASE}/genre/${encodeURIComponent(genre)}`;
    }
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch movies');
        const data = await res.json();
        if (search || genre) {
            currentMovies = data.movies || data; // search/genre endpoints return array
            totalPages = 1;
        } else {
            currentMovies = data.movies;
            totalPages = data.totalPages;
        }
        displayMovies();
    } catch (err) {
        showError('Could not load movies. Please try again later.');
    }
}

// Function to display movies for current page
function displayMovies() {
    if (!currentMovies.length) {
        showError('No movies found.');
        updatePagination();
        return;
    }
    const moviesToShow = currentMovies.slice(0, moviesPerPage);
    movieGrid.innerHTML = moviesToShow.map(createMovieCard).join('');
    updatePagination();
}

// Function to update pagination controls
function updatePagination() {
    let pageNumbersHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        pageNumbersHTML += `
            <span class="page-number ${i === currentPage ? 'active' : ''}" 
                  onclick="goToPage(${i})">${i}</span>
        `;
    }
    pageNumbers.innerHTML = pageNumbersHTML;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
}

// Event listeners
prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchAndDisplayMovies();
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        fetchAndDisplayMovies();
    }
});

// Initialize the display (show all movies by default)
fetchAndDisplayMovies();

// Authentication state handling
function checkAuthState() {
    const token = localStorage.getItem('token');
    const loginLink = document.getElementById('loginLink');
    const signupLink = document.getElementById('signupLink');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (token) {
        loginLink.style.display = 'none';
        signupLink.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
    } else {
        loginLink.style.display = 'inline-block';
        signupLink.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
    }
}

document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    checkAuthState();
    window.location.reload();
});

checkAuthState();

