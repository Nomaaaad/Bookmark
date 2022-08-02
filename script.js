const modal = document.querySelector('.modal-container');
const modalShow = document.querySelector('.show-modal');
const modalClose = document.querySelector('.close-modal');
const bookmarkForm = document.querySelector('.bookmark-form');
const websiteNameEl = document.querySelector('#website-name');
const websiteURLEl = document.querySelector('#website-url');
const bookmarkContainer = document.querySelector('.bookmarks-container');

let bookmarks = [];

function showAndCloseModal() {
    modal.classList.toggle('show-modal');
}


modalShow.addEventListener('click', showAndCloseModal);
modalClose.addEventListener('click', showAndCloseModal);
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false))


function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%.\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
        alert('Please submit values for both fields')
        return false;
    }

    if (!urlValue.match(regex)) {
        alert('Please provide a valid web adress')
        return false;
    }

    return true;
}

// Build Bookmarks DOM
function buildBookmarks() {
    // Remove all bookmark elements
    bookmarkContainer.textContent = '';
    // Build Items
    bookmarks.forEach(bookmark => {
        const { name, url } = bookmark
        // Item
        const item = document.createElement('div');
        item.classList.add('item');
        // Close Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        // Link Container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        // Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        // Append to Bookmarks Container
        linkInfo.append(link);
        item.append(closeIcon, linkInfo);
        bookmarkContainer.appendChild(item);
    });
}

// Fetch Bookmarks
function fetchBookmarks() {
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        bookmarks = [
            {
                name: 'google',
                url: 'https://www.google.com/',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// Delete Bookmark
function deleteBookmark(url){
    bookmarks.forEach((bookmark, i) => {
        if(bookmark.url === url){
            bookmarks.splice(i, 1);
        }
    });
    // Update Bookmarks array in localStorage, re-populate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}


function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteURLEl.value;
    if (!urlValue.includes('http://', 'https://')) {
        urlValue = `https://${urlValue}`;
    }
    if (!validate(nameValue, urlValue)) {
        return false;
    }

    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
}

bookmarkForm.addEventListener('submit', storeBookmark);

fetchBookmarks();