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
        redirect: 'follow',
        method: 'GET',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8' // 'application/json'
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
  async getAllBooks(field) {
    return this.makeRequest('getAllBooks', { field });
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
  async getNewBooks(field) {
    return this.makeRequest('getNewBooks', {field});
  }

  // Get translations
  async getTranslations() {
    return this.makeRequest('getTranslations');
  }
}

// language constants
const TRANSLATIONS = {
  'en': {
    'search': 'Search',
    'clear': 'Clear',
    'processing': 'Processing...',
    'author': 'Author',
    'searchtext' : 'Book title, author ...',
    'genre': 'Genre',
    'ageGroup': 'Age Group',
    'noResults': 'No books found',
    'newSearch': 'New Search',
    'title': 'ARC Social',
    'browse': "Browse our collection",
    'newBooks': "Newly Added Books",
    'activities': "Upcoming Activities",
    'address': "📍 <a href='https://www.google.com/maps/place/ARC+Social/@18.5553097,73.8034296,17z/data=!3m1!4b1!4m6!3m5!1s0x3bc2bf0056f0363d:0x5b1ce2587e0ab00c!8m2!3d18.5553097!4d73.8060045!16s%2Fg%2F11w7r3hklb?entry=ttu&g_ep=EgoyMDI1MDMyNS4xIKXMDSoASAFQAw%3D%3D' target='_blank'>Shop 1, Building-C, Chintamani Nagar, Sanewadi, Aundh, Pune, Maharashtra</a>",
    'contact': "💬 <a href='https://wa.me/+918468919411' target='_blank' style='color: #2e7d32; text-decoration: none;'>84689 19411</a>",
    'timing': "⏰ Mon-Sat 10am-1pm & 5pm-8pm"
  },
  'mr': {
    'search': 'शोधा',
    'clear': 'पुसा',
    'processing': 'प्रक्रिया सुरू आहे...',
    'author': 'लेखक',
    'searchtext' : 'पुस्तक नाव, लेखक ...',    
    'genre': 'प्रकार',
    'ageGroup': 'वय गट',
    'noResults': 'पुस्तके सापडली नाहीत',
    'newSearch': 'नवीन शोध',
    'title': "ARC Social",
    'browse': "आमचा पुस्तक संग्रह",
    'newBooks': "नवीन पुस्तके",
    'activities': "आगामी उपक्रम",
    'address': "📍 <a href='https://www.google.com/maps/place/ARC+Social/@18.5553097,73.8034296,17z/data=!3m1!4b1!4m6!3m5!1s0x3bc2bf0056f0363d:0x5b1ce2587e0ab00c!8m2!3d18.5553097!4d73.8060045!16s%2Fg%2F11w7r3hklb?entry=ttu&g_ep=EgoyMDI1MDMyNS4xIKXMDSoASAFQAw%3D%3D' target='_blank'>C1, चिंतामणी नगर, सानेवाडी, औंध, पुणे</a>",
    'contact': "💬 <a href='https://wa.me/+918468919411' target='_blank' style='color: #2e7d32; text-decoration: none;'>८४६८९ १९४११</a>",
    'timing': "⏰ सोमवार - शनिवार सकाळी १० - १ & संध्याकाळी 5 - 8"
  }
};

/**
 * Helper function Get translations for a specific language
 */
function getTranslations(language) {
  return TRANSLATIONS[language] || TRANSLATIONS['en'];
}

// Example usage

// Initialize the API client (replace with your deployed Google Apps Script web app URL)
const apiClient = new LibraryAPIClient('https://script.google.com/macros/s/AKfycbx612c2iZzAf5ZKgAII3PG9MZfvWRDPBE2XFtVic5JwvSvew6H9KrLOstivZcj83lQ3mQ/exec');

async function getNewBooks() {
  try {

    const sheet = 'NewBooks';
    // Fetch books from API
    const books = await apiClient.getNewBooks(sheet);
    
  } catch (error) {
    console.error('Error:', error);
    //document.getElementById('book-list').innerHTML = `<p>Error: ${error.message}</p>`;
  }
}
