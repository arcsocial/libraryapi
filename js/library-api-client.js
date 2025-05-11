
// start main JS handling
let currentLanguage = 'en'; // Default language
let currentPage = 'home';

// Library API Client
class LibraryAPIClient {
  constructor(apiUrl) {
    this.apiUrl = apiUrl; // URL to your deployed Google Apps Script web app
    this.language = currentLanguage; // Default language
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
  async getNewBooks(sheetname) {
    return this.makeRequest('getNewBooks', {sheetname});
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
const apiClient = new LibraryAPIClient('https://script.google.com/macros/s/AKfycbwzbqTijTdpMjc-9ZRcOf_twDJ3xxxVu_-VCd9CEZArRaymCpefupk9OXHPw-IB4m71/exec');

async function showNewBooks() {
  try {

    const sheetname = 'NewBooks';
    // Fetch books from API
    const books = await apiClient.getNewBooks(sheetname);

    console.error('Done getNewBooks');
    console.error('Error:', books.length);   

    // display the data here
    displayNewBooks(books);
    
  } catch (error) {
    console.error('Error:', error);
    //document.getElementById('book-list').innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

async function showEvents() {
  try {

    const sheetname = 'Events';
    // Fetch events from API
    const items = await apiClient.getNewBooks(sheetname);

    console.error('Done get events');
    console.error('Error:', items.length);   

    // display the data here
    displayEvents(items);
    
  } catch (error) {
    console.error('Error:', error);
    //document.getElementById('book-list').innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

function displayEvents(items) {
  const itemList = document.getElementById('activitiesList');

  if (!items.length) {
    return;
  }

  // Generate book list HTML
  let html = '';
  itemList.innerHTML = '';

  items.forEach(item => {
    html += `<li>
              <strong>${item.Date}</strong> - ${item.Event}
            </li>`;
  });

  itemList.innerHTML += html;
}

// initialize - call at start and populate home page data
function initialize() {
  
  setLanguage(currentLanguage);

  showNewBooks('NewBooks');
  showEvents();

  document.getElementById('searchContainer').style.display = 'none';
}

// set language for all UI elements
function setLanguage(lang) {
  currentLanguage = lang;
  
  apiClient.setLanguage(currentLanguage); // update language used by API client
  
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.id === `lang${lang.toUpperCase()}`);
  });

  updateTranslations(getTranslations(lang));

  if ( currentPage != 'home' ) { 
    updateFilters(); // filter contents change for language
    searchBooks();   // get the book list for the language
  }
}

function updateTranslations(trans) {
  translations = trans;
  document.getElementById('searchBtn').textContent = translations.search;
  document.getElementById('searchTextBtn').textContent = translations.search;
  document.getElementById('clearBtn').textContent = translations.clear;
  document.getElementById('authorSearch').value = '';
  document.getElementById('authorSearch').placeholder = translations.searchtext;
  document.getElementById('processingMsg').textContent = translations.processing;

  document.getElementById("title").textContent = translations.title;
  document.getElementById("label-genre").textContent = translations.genre;
  document.getElementById("label-author").textContent = translations.author;
  document.getElementById("label-ageGroup").textContent = translations.ageGroup;

  document.getElementById('searchBox').value = '';
  document.getElementById("searchBox").placeholder = translations.searchtext;
  document.getElementById("searchButton").innerText = translations.search;
  document.getElementById("browseButton").innerText = translations.browse;
  document.getElementById("newBooksTitle").innerText = translations.newBooks;
  document.getElementById("activitiesTitle").innerText = translations.activities;

  document.getElementById("timing").innerText = translations.timing;

  document.getElementById("address").innerHTML = translations.address;
  document.getElementById("contact").innerHTML = translations.contact;      
}

async function updateFilters() {
  showProcessing();

  try {
    
    const genres = await apiClient.getDistinctValues('Genre');
    updateSelect('genreSelect', genres);

    const ageGroups = await apiClient.getDistinctValues('AgeGroup');
    updateSelect('ageGroupSelect', ageGroups);
      
    const authors = await apiClient.getAuthors();
    updateSelect('authorSelect', authors);    
  } catch (error) {
    console.error('Error populating filters:', error);
  }

  hideProcessing();
}

async function searchBooksText() {
  let searchText = '';

  try {
    if ( currentPage != 'search') {
      showSearch();
      searchText = document.getElementById('searchBox').value;
      document.getElementById('authorSearch').value = searchText;
      updateFilters();        
    }
    else {
      searchText = document.getElementById('authorSearch').value;
    }
  
    showProcessing();
    
    const filters = {
      language: currentLanguage,
      query: searchText
    };
    
    // Fetch filtered books from API
    const books = await apiClient.getFilteredBooks(filters);

    displayBooks(books);  

  } catch (error) {
    handleError(error);
  }
}

async function searchBooks() {
  try {
    clearResults();      
    showProcessing();
    const filters = {
      language: currentLanguage,
      genre: document.getElementById('genreSelect').value,
      ageGroup: document.getElementById('ageGroupSelect').value,
      author: document.getElementById('authorSelect').value,
      query: document.getElementById('authorSearch').value
    };
  
    // Fetch filtered books from API
    const books = await apiClient.getFilteredBooks(filters);

    displayBooks(books);
    
  } catch (error) {
    handleError(error);
  }
}

function updateSelect(selectId, values) {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="">All</option>' +
      values.map(value => `<option value="${value}">${value}</option>`).join('')
}

function displayBooks(books) {
  const bookList = document.getElementById('bookList');
  const alphabetNav = document.getElementById('alphabetNav');

  if (!books.length) {
    bookList.innerHTML = `<div class="no-results">${translations.noResults}</div>`;
    alphabetNav.style.display = 'none';
    hideProcessing();
    return;
  }
 
  // Get unique first letters of author last names
  const uniqueLetters = [...new Set(
    books.map(book => book.AuthorLastName.charAt(0).toUpperCase())
  )].sort();

  // Generate book list HTML
  let currentLetter = '';
  let html = '';
  let count = 0;
  bookList.innerHTML = '';

  books.forEach(book => {
    const letterHeader = book.AuthorLastName.charAt(0).toUpperCase();
    if (letterHeader !== currentLetter) {
      if (currentLetter !== '') {
        html += '</div>'; // Close previous letter-section
        bookList.innerHTML += html;
        html = '';
      }
      currentLetter = letterHeader;
      html += `<div id="section${currentLetter}" class="letter-section">
                <div class="letter-header">${currentLetter}</div>`;
    }
    html += `<div class="book-item">
              <strong>${book.Title}</strong> - ${book.Author} - <strong>${book.Genre}</strong>
            </div>`;
    count++;      
  });

  if (currentLetter !== '') {
    html += '</div>'; // Close last letter-section
  }

  bookList.innerHTML += html;

  // Update alphabet navigation
  if (books.length >= 10 && uniqueLetters.length >=3 ) {
    alphabetNav.innerHTML = uniqueLetters
      .map(letter => `<div class="letter" onclick="scrollToLetter('${letter}')">${letter}</div>`)
      .join('');
    alphabetNav.style.display = 'flex';
  } else {
    alphabetNav.style.display = 'none';
  }

  document.getElementById("bookList").addEventListener("click", function(event) {      
      if (event.target) {
        if (event.target.nodeName === "STRONG" ) {        
          showBookDetails(event.target.parentNode.textContent);
        } else {
          showBookDetails(event.target.textContent);
        }
      }
  });

  hideProcessing();
}

async function showBookDetails(bookString) {

  console.log('ShowBookDetails:', bookString);      

  let title = '';
  let author = '';
  
  const parts = bookString.split("-");
  
  if (parts.length > 3 ) {
    title = parts[0] + ' ' + parts[1];
    author = parts[parts.length - 2];
  } 
  if (parts.length === 3) {
    title = parts[0];
    author = parts[1];
  } 

  console.log('Title ', title, ' Author :', author );    
  const bookInfo = await getBookInfo(title, author);
  
  if (bookInfo.success) {

    document.getElementById('searchContainer').style.display = 'none';
    document.getElementById('bookdetails').style.display = 'block';
    
    document.getElementById('bookTitle').textContent = bookInfo.title;
    document.getElementById('bookSynopsis').textContent = bookInfo.synopsis;
    
    if (bookInfo.coverImage) {
      document.getElementById('bookCover').src = bookInfo.coverImage;
      document.getElementById('bookCover').style.display = 'block';
      //document.getElementById('bookCover').style.justifyContent = 'center';
    } else {
      document.getElementById('bookCover').style.display = 'none';
    }
  } else {
    alert(bookInfo.message);
  }  
}

// function to get book details
async function getBookInfo(title, author) {
  // Format the search query
  const query = encodeURIComponent(`intitle:${title} inauthor:${author}`);
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`;
  
  try {
    // Make the API request
    const response = await fetch(url);
    const data = await response.json();
    
    // Check if we got results
    if (data.totalItems > 0) {
      const book = data.items[0].volumeInfo;
      const gtitle = book.title;

      console.log('Book retrieved from google:', gtitle);
      // Google API - did it return the right book?
      const comStr = (s1, s2) => s1.toLowerCase() === s2.toLowerCase();
      
      if ( comStr(gtitle, title )) {          
        const description = book.description ? 
          book.description.substring(0, 450) + "..." : 
          "No description available.";
        const imageUrl = book.imageLinks ? book.imageLinks.thumbnail : null;
        
        return {
          success: true,
          title: title,
          synopsis: description,
          coverImage: imageUrl
        };
      }
      console.log('GetBook details titles did not match', gtitle, title);
      return {
        success: false,
        message: "No books found matching that title and author."
      };            
    } else {
      return {
        success: false,
        message: "No books found matching that title and author."
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Error fetching book information: " + error.toString()
    };
  }
}

function backfromdetails() {
  document.getElementById('searchContainer').style.display = 'block';
  document.getElementById('bookdetails').style.display = 'none';
}


function displayNewBooks(items) {
  const itemList = document.getElementById('newBooksList');

  if (!items.length) {
    return;
  }

  // Generate book list HTML
  let html = '';
  itemList.innerHTML = '';

  items.forEach(book => {
    html += `<li>
              <strong>${book.Title}</strong> - ${book.Author} - <strong>${book.Genre}</strong>
            </li>`;
  });

  itemList.innerHTML += html;
}

function clearFilters() {
  document.getElementById('genreSelect').value = '';
  document.getElementById('ageGroupSelect').value = '';
  document.getElementById('authorSelect').value = '';
  document.getElementById('authorSearch').value = '';

  clearResults();
}

function clearResults() {
  document.getElementById("bookList").innerHTML = ""; // Clears displayed books
  alphabetNav.style.display = 'none';
}

function scrollToLetter(letter) {
  const section = document.getElementById(`section${letter}`);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

function browseBooks() {
  showSearch();
  updateFilters();    
  searchBooks();
}

function homePage() {
  hideSearch();
}

function showProcessing() {
  document.getElementById('processingMsg').style.display = 'block';
}

function hideProcessing() {
  document.getElementById('processingMsg').style.display = 'none';
}

function showSearch() {
  currentPage = 'search';
  document.getElementById('homePage').style.display = 'none';      
  document.getElementById('searchContainer').style.display = 'block';
  document.getElementById('searchContainer').style.width = '95%';
  //document.getElementById('searchContainer').style.padding-right = '40px';
}

function hideSearch() {
  currentPage = 'home';
  clearResults();      
  document.getElementById('searchContainer').style.display = 'none';
  document.getElementById('homePage').style.display = 'initial';         
}

function handleError(error) {
  console.error('Error:', error);
  hideProcessing();
  alert('An error occurred. Please try again.');
}

document.getElementById('searchBtn').onclick = searchBooks;
document.getElementById('clearBtn').onclick = clearFilters;
document.getElementById('searchTextBtn').onclick = searchBooksText;
document.getElementById('searchButton').onclick = searchBooksText;
document.getElementById('browseButton').onclick = browseBooks;
document.getElementById('logoHome').onclick = homePage;    
document.getElementById('title').onclick = homePage;
document.getElementById('bookdetail-back').onclick = backfromdetails;

//window.onload = initialize;

initialize();
