
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

      // console.log('Making URL request:', url);
      
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

  // Get filtered books
  async getFilteredBooks(filters = {}) {
    return this.makeRequest('getFilteredBooks', filters);
  }

  // Get book details for title and author
  async getBookDetails(title, author) {
    return this.makeRequest('getBookDetails', { title, author });
  }
  // Get distinct values for a field
  async getDistinctValues(field) {
    return this.makeRequest('getDistinctValues', { field });
  }

  // Get list of authors
  async getAuthors() {
    return this.makeRequest('getAuthors');
  }

  // Get all data from the sheetname
  async getSheetData(sheetname) {
    return this.makeRequest('getSheetData', {sheetname});
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
// ARC Social const apiClient = new LibraryAPIClient('https://script.google.com/macros/s/AKfycbwzbqTijTdpMjc-9ZRcOf_twDJ3xxxVu_-VCd9CEZArRaymCpefupk9OXHPw-IB4m71/exec');
const apiClient = new LibraryAPIClient('https://script.google.com/macros/s/AKfycbyxhudNo_qV1we_4WzXLXwQnnlo_Zrw_cUodKBbT9oFt6P2GLQNALbyuBRYhrP5yWYs9A/exec');

async function showNewBooks() {
  try {

    /*
    // OLD CODE for showing new books from Google sheets
    const sheetname = 'NewBooks';
    // Fetch books from API
    const books = await apiClient.getSheetData(sheetname);
    */

    const books = await getCSVData('newbooks.csv');
    
    console.log('Loaded new books:', books.length);   

    // display the data here
    displayNewBooks(books);
    
  } catch (error) {
    console.error('Error:', error);
    //document.getElementById('book-list').innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// read CSV data from a 'data folder in GIT - will use this to load non-static data on home page
async function getCSVData(filename) {
  try {
    const response = await fetch('data/' + filename);
    const data = await response.text();
    
    const rows = data.split('\n');
    const headers = rows[0].split('|');
    const items = rows.slice(1)
      .filter(row => row !== '')
      .map(row => {
      const values = row.split('|');
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index];
          return obj;
        }, {});
    });
    
    return items; // Now this returns to the caller properly
  } catch (error) {
    console.error('Error fetching CSV:', error, ' filename', filename);
    return []; // Return empty array in case of error
  }
}

async function showEvents() {
  try {

    /* OLD CODE
    const sheetname = 'Events';
    
    // Fetch events from API
    const items = await apiClient.getSheetData(sheetname);

    console.error('Done get events');
    */

    const items = await getCSVData('events.csv');
    console.log('Events:', items.length);   

    // display the data here
    displayEvents(items);
    
  } catch (error) {
    console.error('Error:', error);
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
    /*
    const genres = await apiClient.getDistinctValues('Genre');
    updateSelect('genreSelect', genres);

    const ageGroups = await apiClient.getDistinctValues('AgeGroup');
    updateSelect('ageGroupSelect', ageGroups);
      
    const authors = await apiClient.getAuthors();
    updateSelect('authorSelect', authors);   
    */
    const lov = await apiClient.getDistinctValues('All');
    updateSelect('genreSelect', lov.genre);
    updateSelect('ageGroupSelect', lov.age);
    updateSelect('authorSelect', lov.authors);   
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

    if (currentLanguage === 'mr' && isEnglish(searchText) ) {
      console.log('Calling transliterate for ', searchText);
      searchText = await transliterate(searchText);
      console.log('Transliterated to ', searchText);
    }
    
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

    let searchText = document.getElementById('authorSearch').value;
    if (currentLanguage === 'mr' && isEnglish(searchText) ) {
      console.log('Calling transliterate for ', searchText);
      searchText = await transliterate(searchText);
      console.log('Transliterated to ', searchText);
    }
    
    const filters = {
      language: currentLanguage,
      genre: document.getElementById('genreSelect').value,
      ageGroup: document.getElementById('ageGroupSelect').value,
      author: document.getElementById('authorSelect').value,
      query: searchText
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
              <strong>${book.Title}</strong> | ${book.Author} | <strong>${book.Genre}</strong>
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

  hideProcessing();
}

// show book details based on the book selected by user in the list
// will use the data from the spread sheet for basic info and Google Book APIs for other info if available
async function showBookDetails(event) {

  let bookString = '';
  
  if (event.target) {
    if (event.target.nodeName === "STRONG" ) {        
      bookString = event.target.parentNode.textContent;
    } else {
      bookString = event.target.textContent;
    }
  }

  console.log('ShowBookDetails:', bookString);      

  let title = '';
  let author = '';
  
  const parts = bookString.split("|");
  
  if (parts.length > 3 ) {
    title = parts[0].trim() + ' ' + parts[1].trim();
    author = parts[parts.length - 2].trim();
  } 
  if (parts.length === 3) {
    title = parts[0].trim();
    author = parts[1].trim();
  } 

  // clear old content as a precaution
  document.getElementById('bookAge').textContent = '';
  document.getElementById('bookGenre').textContent = '';
  document.getElementById('bookNumber').textContent = '';
  document.getElementById('bookSynopsis').textContent = '';
  document.getElementById('bookCover').src = '';

  // make the right screen visible
  document.getElementById('searchContainer').style.display = 'none';
  document.getElementById('bookdetails').style.display = 'block';

  // diplay data
  document.getElementById('bookTitle').textContent = title;
  document.getElementById('bookAuthor').textContent = "Author: " + author;
  
  // getBookDetails from our spreadsheet

  try {
        const books = await apiClient.getBookDetails(title, author);
  
        console.log('getBookDetails returned ', books);
      
        if (!books.length) {
            console.log('No book info for:', title, author);
          } else {
            document.getElementById('bookAge').textContent = "Age: " + books[0].AgeGroup;
            document.getElementById('bookGenre').textContent = "Genre: " + books[0].Genre;
            document.getElementById('bookNumber').textContent = "ID Number: " + books[0].Number;
          }
      } catch (error) {
    handleError(error);
  }
  
  // Get additional book info from Google Book APIs
  console.log('Get additional infor for: ', title, author);
  const bookInfo = await getBookInfo(title, author);
  
  if (bookInfo.success) {
    document.getElementById('bookSynopsis').textContent = bookInfo.synopsis;
    
    if (bookInfo.coverImage) {
      document.getElementById('bookCover').src = bookInfo.coverImage;
      document.getElementById('bookCover').style.display = 'block';
    } else {
      document.getElementById('bookCover').style.display = 'none';
    }
  } 
}

// function to get book details from Google Book API
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
      testTitleParts = title.split('-');
      if ( testTitleParts.length > 1 ) title = testTitleParts[1];
      if ( gtitle.trim().toLowerCase().includes(title.trim().toLowerCase() ) ) {          
        const description = book.description ? 
          book.description.substring(0, 450) + "..." : 
          "No description available.";
        const imageUrl = book.imageLinks ? book.imageLinks.thumbnail : null;
        console.log('GetBookInfo Matched', gtitle, title);
        return {
          success: true,
          title: title,
          synopsis: description,
          coverImage: imageUrl
        };
      } else {
        console.log('GetBookInfo titles did not match', gtitle, title);
        return {
          success: false,
          message: "No books found matching that title and author."
        };            
      } 
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
  hideBookDetails();
  document.getElementById('searchContainer').style.display = 'block';
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
  if ( currentPage === 'search' ) {
    currentPage = 'home'; 
    hideSearch();
    hideBookDetails();
  } else {
    location.reload();
  }
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
}

function hideSearch() {
  clearResults();      
  document.getElementById('searchContainer').style.display = 'none';
  document.getElementById('homePage').style.display = 'initial';         
}

function hideBookDetails() {   
  document.getElementById('bookAge').textContent = '';
  document.getElementById('bookGenre').textContent = '';
  document.getElementById('bookNumber').textContent = '';
  document.getElementById('bookSynopsis').textContent = '';
  document.getElementById('bookCover').src = '';

  document.getElementById('bookdetails').style.display = 'none';      
}

function handleError(error) {
  console.error('Error:', error);
  hideProcessing();
  alert('An error occurred. Please try again.');
}

// Function to check if text is primarily English
function isEnglish(text) {
  // Simple check: if more than 60% of characters are ASCII letters, assume English
  const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
  const totalChars = text.replace(/\s/g, '').length; // Remove spaces
  
  return totalChars > 0 && (letterCount / totalChars) > 0.6;
}

// using Google transliterate 
async function transliterate(text) {
  const response = await fetch('https://inputtools.google.com/request?text=' + 
    encodeURIComponent(text) + '&itc=mr-t-i0-und&num=5&cp=0&cs=1&ie=utf-8&oe=utf-8', {
    method: 'GET'
  });
  
  const data = await response.json();
  if (data[0] === 'SUCCESS') {
    return data[1][0][1][0]; // Get the first transliteration suggestion
  } else {
    return text; // Return original if failed
  }
}

function showPMBookList () {
  currentPage = 'pmbooklist';
  window.location.href = 'punemarathibooks.html';
}

document.getElementById('searchBtn').onclick = searchBooks;
document.getElementById('clearBtn').onclick = clearFilters;
document.getElementById('searchTextBtn').onclick = searchBooksText;
document.getElementById('searchButton').onclick = searchBooksText;
document.getElementById('browseButton').onclick = browseBooks;
document.getElementById('logoHome').onclick = homePage;    
document.getElementById('title').onclick = homePage;
document.getElementById('bookdetail-back').onclick = backfromdetails;
document.getElementById("bookList").onclick = showBookDetails;
document.getElementById("pmbookList").onclick = showPMBookList;  

//window.onload = initialize;

initialize();
