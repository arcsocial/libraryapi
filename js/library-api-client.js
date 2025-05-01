// Library API Client
class LibraryAPIClient {
  constructor(apiUrl) {
    this.apiUrl = apiUrl; // URL to your deployed Google Apps Script web app
    this.language = 'en'; // Default language
  }

  // Set the current language
  setLanguage(language) {
    this.language = language;
  }

  // Make API request with proper error handling
  async makeRequest(action, params = {}) {
    try {
      // Add language to all requests by default
      params.language = this.language;
      params.action = action;
      
      // Build URL with query parameters
      const url = new URL(this.apiUrl);
      Object.keys(params).forEach(key => {
        if (params[key]) url.searchParams.append(key, params[key]);
      });

      // Make the request
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      if (result.status === 'error') {
        throw new Error(`API returned error: ${result.message}`);
      }

      return result.data;
    } catch (error) {
      console.error(`Error in ${action} request:`, error);
      throw error;
    }
  }

  // API endpoints
  
  // Get all books
  async getAllBooks() {
    return this.makeRequest('getAllBooks');
  }

  // Get filtered books
  async getFilteredBooks(filters = {}) {
    return this.makeRequest('getFilteredBooks', filters);
  }

  // Get distinct values for a field
  async getDistinctValues(field) {
    return this.makeRequest('getDistinctValues', { field });
  }

  // Get list of authors
  async getAuthors() {
    return this.makeRequest('getAuthors');
  }

  // Get new books
  async getNewBooks() {
    return this.makeRequest('getNewBooks');
  }

  // Get translations
  async getTranslations() {
    return this.makeRequest('getTranslations');
  }
}

// Example usage

// Initialize the API client (replace with your deployed Google Apps Script web app URL)
const apiClient = new LibraryAPIClient('https://script.google.com/macros/s/AKfycbx612c2iZzAf5ZKgAII3PG9MZfvWRDPBE2XFtVic5JwvSvew6H9KrLOstivZcj83lQ3mQ/exec');

// Example: Load and display all books
async function loadAllBooks() {
  try {
    // Show loading indicator
    document.getElementById('book-list').innerHTML = '<p>Loading books...</p>';
    
    // Fetch books from API
    const books = await apiClient.getAllBooks();
    
    // Display books
    renderBooks(books);
  } catch (error) {
    document.getElementById('book-list').innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Example: Apply filters
async function searchBooks() {
  try {
    // Get filter values from form
    const genre = document.getElementById('genre-filter').value;
    const ageGroup = document.getElementById('age-group-filter').value;
    const author = document.getElementById('author-filter').value;
    const query = document.getElementById('search-input').value;
    
    // Show loading indicator
    document.getElementById('book-list').innerHTML = '<p>Searching books...</p>';
    
    // Fetch filtered books from API
    const books = await apiClient.getFilteredBooks({
      genre,
      ageGroup,
      author,
      query
    });
    
    // Display filtered books
    renderBooks(books);
  } catch (error) {
    document.getElementById('book-list').innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Example: Populate filter dropdowns
async function populateFilters() {
  try {
    // Get translations
    const translations = await apiClient.getTranslations();
    updateUITranslations(translations);
    
    // Populate genre dropdown
    const genres = await apiClient.getDistinctValues('Genre');
    populateDropdown('genre-filter', genres);
    
    // Populate age group dropdown
    const ageGroups = await apiClient.getDistinctValues('AgeGroup');
    populateDropdown('age-group-filter', ageGroups);
    
    // Populate author dropdown
    const authors = await apiClient.getAuthors();
    populateDropdown('author-filter', authors);
  } catch (error) {
    console.error('Error populating filters:', error);
  }
}

// Helper function to populate dropdown options
function populateDropdown(elementId, options) {
  const dropdown = document.getElementById(elementId);
  dropdown.innerHTML = '<option value="">All</option>';
  
  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    dropdown.appendChild(optionElement);
  });
}

// Helper function to render books to the page
function renderBooks(books) {
  const bookListElement = document.getElementById('book-list');
  
  if (books.length === 0) {
    bookListElement.innerHTML = '<p>No books found</p>';
    return;
  }
  
  let html = '<div class="book-grid">';
  
  books.forEach(book => {
    html += `
      <div class="book-card">
        <h3>${book.Title}</h3>
        <p>Author: ${book.Author}</p>
        <p>Genre: ${book.Genre}</p>
        <p>Age Group: ${book.AgeGroup}</p>
      </div>
    `;
  });
  
  html += '</div>';
  bookListElement.innerHTML = html;
}

// Helper function to update UI with correct translations
function updateUITranslations(translations) {
  // Update all text elements with translations
  document.getElementById('search-button').textContent = translations.search;
  document.getElementById('clear-button').textContent = translations.clear;
  document.getElementById('search-input').placeholder = translations.searchtext;
  // Add more elements as needed
}

// Set language and reload data
function setLanguage(language) {
  apiClient.setLanguage(language);
  populateFilters();
  loadAllBooks();
}

// Initialize the page when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set up event listeners
  document.getElementById('search-button').addEventListener('click', searchBooks);
  document.getElementById('clear-button').addEventListener('click', function() {
    // Clear all filters
    document.getElementById('genre-filter').value = '';
    document.getElementById('age-group-filter').value = '';
    document.getElementById('author-filter').value = '';
    document.getElementById('search-input').value = '';
    
    // Reload all books
    loadAllBooks();
  });
  
  // Language switcher
  document.getElementById('language-en').addEventListener('click', function() {
    setLanguage('en');
  });
  document.getElementById('language-mr').addEventListener('click', function() {
    setLanguage('mr');
  });
  
  // Initial load
  populateFilters();
  loadAllBooks();
});
