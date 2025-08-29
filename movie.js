// Initialize variables
let movieId = null;
let movieDetailsElement = null;
let reviewList = null;
let modalMessage = null;
let successModal = null;

// API base URL
const API_BASE = 'http://localhost:5000/api/movies';

// Helper function to display error messages
function displayErrorMessage(element, message) {
    if (element) {
        element.innerHTML = `<p class="error-message">${message}</p>`;
    }
}

// Function to fetch and display 


async function fetchReviews(movieId) {
    try {
        const response = await fetch(`${API_BASE}/${movieId}/review`);
        if (!response.ok) {
            throw new Error('Failed to fetch reviews');
        }
        
        const data = await response.json();
        const reviewListElement = document.getElementById('review-list');
        if (reviewListElement) {
            if (data.reviews && data.reviews.length > 0) {
               reviewListElement.innerHTML = data.reviews.map((review, index) => {
    return `<div class="review-item" onclick='openReviewModal(${JSON.stringify(review)})'>` +

                        '<div class="review-header">' +
                            '<span class="review-username">' + review.username + '</span>' +
                            '<span class="review-rating">' + review.rating + '/10</span>' +
                        '</div>' +
                        '<p class="review-text">' + review.text + '</p>' +
                        '<hr />' +
                    '</div>';
                }).join('');
            } else {
                reviewListElement.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to review!</p>';
            }
        }
    } catch (error) {
        console.error('Error fetching reviews:', error);
        displayErrorMessage(document.getElementById('review-list'), 'Failed to load reviews. Please try again later.');
    }
}

// Function to load movie details and initialize review form
async function loadMovieDetails() {
    if (!movieDetailsElement) return;

    movieDetailsElement.innerHTML = '<div class="loading">Loading movie details...</div>';
    
    try {
        const res = await fetch(`${API_BASE}/${movieId}`);
        if (!res.ok) throw new Error('Movie not found');
        
        const movie = await res.json();
        movieDetailsElement.innerHTML = createMovieDetails(movie);
        document.title = `${movie.title} - Movie Explorer`;

        // Initialize review form after movie details are loaded
        const reviewForm = document.getElementById('review-form');
        if (reviewForm) {
            reviewForm.addEventListener('submit', handleReviewSubmit);
        }
    } catch (err) {
        console.error('Error loading movie details:', err);
        movieDetailsElement.innerHTML = '<div class="error-message">Error loading movie. Please try again later.</div>';
    }
}

// Function to create movie details HTML
function createMovieDetails(movie) {
    if (!movie) return '';
    
    return '<div class="movie-details-container">' +
        '<div class="movie-poster-large">' +
            '<img src="' + movie.poster + '" alt="' + movie.title + '" onerror="this.src=\'https://via.placeholder.com/500x750?text=No+Image\'" />' +
        '</div>' +
        '<div class="movie-info-detailed">' +
            '<h1>' + movie.title + '</h1>' +
            '<div class="movie-meta">' +
                '<span class="movie-year"><i class="fas fa-calendar"></i> ' + movie.year + '</span>' +
                '<span class="movie-rating"><i class="fas fa-star"></i> ' + movie.rating + '</span>' +
                '<span class="movie-genre"><i class="fas fa-film"></i> ' + movie.genre + '</span>' +
            '</div>' +
            '<div class="movie-description-full">' +
                '<h2>Overview</h2>' +
                '<p>' + movie.description + '</p>' +
            '</div>' +
            '<div class="movie-actions">' +
                '<button class="btn-watch"><i class="fas fa-play"></i> Watch Trailer</button>' +
            '</div>' +
            '<div class="reviews-section">' +
                '<h2>Reviews</h2>' +
                '<div class="review-list" id="review-list">' +
                    (movie.reviews && movie.reviews.length > 0 ? movie.reviews.map(review => {
                        return '<div class="review-item">' +
                            '<div class="review-header">' +
                                '<span class="review-username">' + review.username + '</span>' +
                                '<span class="review-rating">' + review.rating + '/10</span>' +
                            '</div>' +
                            '<p class="review-text">' + review.text + '</p>' +
                            '<hr />' +
                        '</div>';
                    }).join('') : '<p class="no-reviews">No reviews yet. Be the first to review!</p>') +
                '</div>' +
                '<div class="review-form-container">' +
                    '<form id="review-form">' +
                        '<div class="form-group">' +
                            '<label for="username">Name:</label>' +
                            '<input type="text" id="username" placeholder="Your name" required>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label for="rating">Rating:</label>' +
                            '<input type="number" id="rating" min="1" max="10" placeholder="1-10" required>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label for="review-input">Review:</label>' +
                            '<textarea id="review-input" placeholder="Write your review here..." required></textarea>' +
                        '</div>' +
                        '<button type="submit" class="submit-review">Submit Review</button>' +
                    '</form>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>';
}

// Handle review form submission
async function handleReviewSubmit(event) {
    event.preventDefault();
    
    const username = document.getElementById('username')?.value.trim();
    const rating = document.getElementById('rating')?.value;
    const reviewText = document.getElementById('review-input')?.value.trim();
    
    if (!username || !rating || !reviewText) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/${movieId}/review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                rating: parseInt(rating),
                text: reviewText
            })
        });

        if (!response.ok) {
            throw new Error('Failed to submit review');
        }

        // Clear form
        event.target.reset();
        
        // Refresh reviews
        await fetchReviews(movieId);

        // Show success message
        document.getElementById('modalMessage').innerHTML = 'Thank you for your review!<br>Submit successful.';
        document.getElementById('successModal').style.display = 'flex';
        setTimeout(() => {
            document.getElementById('successModal').style.display = 'none';
        }, 2000);
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('Failed to submit review. Please try again.');
    }
}
function openReviewModal(review) {
    document.getElementById('modalUsername').textContent = review.username;
    document.getElementById('modalRating').textContent = review.rating + "/10";
    document.getElementById('modalText').textContent = review.text;
    
    // Example: basic sentiment analysis simulation
    const sentiment = getSentiment(review.text);
    document.getElementById('modalSentiment').textContent = sentiment;

    document.getElementById('reviewDetailModal').style.display = 'flex';
}

function closeReviewModal() {
    document.getElementById('reviewDetailModal').style.display = 'none';
}

// Basic sentiment logic (replace with real ML later)
function getSentiment(text) {
    const lower = text.toLowerCase();
    if (lower.includes('good') || lower.includes('great') || lower.includes('awesome')) return "Positive";
    if (lower.includes('bad') || lower.includes('poor') || lower.includes('terrible')) return "Negative";
    return "Neutral";
}

// Wait for the DOM to be fully loaded
window.addEventListener('DOMContentLoaded', () => {
    // Get movie ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    movieId = urlParams.get('id');
    
    // Get DOM elements
    movieDetailsElement = document.getElementById('movieDetails');
    reviewList = document.getElementById('review-list');
    modalMessage = document.getElementById('modalMessage');
    successModal = document.getElementById('successModal');
    
    if (!movieId || !movieDetailsElement) {
        console.error('Missing required elements');
        return;
    }
    
    // Load movie details and reviews
    loadMovieDetails();
    fetchReviews(movieId);
});
        
        // Refresh reviews