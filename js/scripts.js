// Global variables
let employees = [];
let currentEmployeeIndex = 0;

/**
 * Fetch data from the Random User Generator API
 * This will get 12 random users with US or GB nationality to ensure English alphabet names
 */
async function fetchData() {
    try {
        // Using fetch API to get 12 random users
        const response = await fetch('https://randomuser.me/api/?results=12&nat=us,gb&format=json');
        const data = await response.json();
        employees = data.results;
        displayEmployees(employees);
    } catch (error) {
        console.error('Error fetching data:', error);
        document.querySelector('.gallery').innerHTML = '<h3>Error loading users. Please refresh the page.</h3>';
    }
}

/**
 * Display the employees in the gallery
 * @param {Array} employeeArray - Array of employee objects
 */
function displayEmployees(employeeArray) {
    const galleryContainer = document.querySelector('.gallery');
    galleryContainer.innerHTML = '';
    
    employeeArray.forEach((employee, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        
        // Using insertAdjacentHTML as specified to avoid DOM rewriting issues
        card.insertAdjacentHTML('beforeend', `
            <div class="card-img-container">
                <img class="card-img" src="${employee.picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="card-text">${employee.email}</p>
                <p class="card-text cap">${employee.location.city}, ${employee.location.country}</p>
            </div>
        `);
        
        // Add click event listener to show modal when card is clicked
        card.addEventListener('click', () => {
            displayModal(index);
        });
        
        galleryContainer.appendChild(card);
    });
}

/**
 * Display a modal with detailed employee information
 * @param {Number} index - Index of the employee in the employees array
 */
function displayModal(index) {
    currentEmployeeIndex = index;
    const employee = employees[index];
    
    // Format the date of birth from ISO string to MM/DD/YYYY
    const dob = new Date(employee.dob.date);
    const formattedDob = `${dob.getMonth() + 1}/${dob.getDate()}/${dob.getFullYear()}`;
    
    // Create the modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    
    // Populate the modal with employee details
    modalContainer.innerHTML = `
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="modal-text">${employee.email}</p>
                <p class="modal-text cap">${employee.location.city}</p>
                <hr>
                <p class="modal-text">${employee.cell}</p>
                <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.state || employee.location.country}, ${employee.location.postcode}</p>
                <p class="modal-text">Birthday: ${formattedDob}</p>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalContainer);
    
    // Add event listeners for the modal buttons
    document.getElementById('modal-close-btn').addEventListener('click', () => {
        document.body.removeChild(modalContainer);
    });
    
    // Previous button functionality with wrapping
    document.getElementById('modal-prev').addEventListener('click', () => {
        document.body.removeChild(modalContainer);
        displayModal(currentEmployeeIndex > 0 ? currentEmployeeIndex - 1 : employees.length - 1);
    });
    
    // Next button functionality with wrapping
    document.getElementById('modal-next').addEventListener('click', () => {
        document.body.removeChild(modalContainer);
        displayModal(currentEmployeeIndex < employees.length - 1 ? currentEmployeeIndex + 1 : 0);
    });
}

/**
 * Add search functionality to the page
 */
function setupSearch() {
    const searchContainer = document.querySelector('.search-container');
    
    // Create and add search form
    searchContainer.innerHTML = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="🔍" id="search-submit" class="search-submit">
        </form>
    `;
    
    // Add event listeners for search functionality
    const searchForm = searchContainer.querySelector('form');
    const searchInput = document.getElementById('search-input');
    
    // Handle form submission
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        performSearch(searchInput.value);
    });
    
    // Add real-time search as user types
    searchInput.addEventListener('keyup', () => {
        performSearch(searchInput.value);
    });
}

/**
 * Filter employees based on search term and display matches
 * @param {String} searchTerm - The term to search for in employee names
 */
function performSearch(searchTerm) {
    const filteredEmployees = employees.filter(employee => {
        const fullName = `${employee.name.first} ${employee.name.last}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });
    
    displayEmployees(filteredEmployees);
}

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', () => {
    setupSearch();
    fetchData();
});