//Selectors
const modalContainer = document.getElementById('modal');
const openModal = document.getElementById('show-modal');
const closeModal = document.getElementById('close-modal');
const modalForm = document.getElementById('bookmark-form');
const hints = document.querySelectorAll('.hint-container');
const websiteName = document.getElementById('website-name');
const websiteUrl = document.getElementById('website-url');
const bookmarkContainer = document.getElementById('bookmarks-container');
const staticContainer = document.querySelector('.static-content');

//Global
let bookmarks = []


//Modal handler (show/hide)
const modalState = () => {
    if (modalContainer.classList.contains('show-modal')) {
        showStatic()
        modalContainer.classList.remove('show-modal')
    } else {
        hideStatic()
        modalContainer.classList.add('show-modal');
    }

}


//Render bookmark
const renderBookmark = (url, name, id) => {
    bookmarkContainer.insertAdjacentHTML('beforeend', `<div class="item">
        <i class="fas fa-times" id="delete-bookmark" title="Delete Bookmark" data-id=${id}></i>
        <div class="name">
            <img src="https://s2.googleusercontent.com/s2/favicons?domain=${url}" alt="Favicon">
            <a href=${url} target="_blank">${name}</a>
        </div>
    </div>`)
    hideStatic()
    const deleteBtn = bookmarkContainer.querySelectorAll('.fa-times')
    for (const btn of deleteBtn) {
        btn.addEventListener('click', deleteBookmark)
    }

}

//Add Bookmark
const addBookmark = (e) => {
    e.preventDefault();
    if (checkReqFields()) {
        const id = Date.now()
        renderBookmark(websiteUrl.value, websiteName.value, id)
        let bookmark = {
            id,
            url: websiteUrl.value,
            name: websiteName.value
        }
        bookmarks.push(bookmark)
        saveLocalStorage(bookmarks)
        modalForm.reset()
    }
}


//Save localStorage
const saveLocalStorage = (obj) => {
    localStorage.setItem('bookmark', JSON.stringify(obj))
}

//Check localStorage
const checkLocalStorage = () => {
    const data = JSON.parse(localStorage.getItem('bookmark'))
    if (data) {
        return bookmarks.push(...data)
    }
}

//Check if there are any bookmarks
const checkBookmark = () => {
    if (bookmarks.length > 0) {
        bookmarks.map(bookmark => renderBookmark(bookmark.url, bookmark.name, bookmark.id))
    } else {
        renderStaticContent()
    }
}


//Load placeHolder content
const renderStaticContent = () => {
    staticContainer.insertAdjacentHTML('beforeend', `<div class="wave">
   <span style="--i:1">W</span>
   <span style="--i:2">o</span>
   <span style="--i:3">w</span>
   <span style="--i:4">,</span>
   <span style="--i:5">s</span>
   <span style="--i:6">U</span>
   <span style="--i:7">c</span>
   <span style="--i:8">h</span>
   <span style="--i:9"> </span>
   <span style="--i:10">e</span>
   <span style="--i:11">m</span>
      <span style="--i:12">p</span>
            <span style="--i:13">t</span>
   <span style="--i:14">y</span>
   <span style="--i:15">!</span>
  </div>
    <img class="img-dodge" src="./giphy-downsized-large.gif" alt="empty">
`)
}

//delete Bookmark
const deleteBookmark = (e) => {
    const identifier = +e.target.dataset.id
    for (const bookmark of bookmarks) {
        if (bookmark.id === identifier) {
            let index = bookmarks.indexOf(bookmark)
            bookmarks.splice(index, 1)
        }
        e.target.parentElement.remove()
        saveLocalStorage(bookmarks)
        emptyBookmarks()
    }
}

//Fields/form validation
const checkReqFields = () => {
    const regex = /(:?(?:https?:\/\/)?(?:www\.)?)?[-a-z\d]+\.(?:com|gov|org|net|edu|biz)/
    if (!websiteName.value && !websiteUrl.value) {
        createHints(2, 'hint')
        return false
    }
    if (!websiteName.value) {
        createHints(0, 'websiteNameMissing')
        return false
    }
    if (!websiteUrl.value) {
        createHints(1, 'websiteUrlMissing')
        return false
    }
    if (!regex.test(websiteUrl.value)) {
        createHints(1, 'websiteUrlInvalid')
        return false
    }
    if (hints[0].hasChildNodes()) {
        hints[0].removeChild(hints[0].childNodes[0])
    }
    if (hints[1].hasChildNodes()) {
        hints[1].removeChild(hints[1].childNodes[0])
    }
    const protocolRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/
    if (!protocolRegex.test(websiteUrl.value)) {
        websiteUrl.value = "https://" + websiteUrl.value;
    }
    modalState()
    return true
}


//Create hints for the fields
const createHints = (num, name) => {
    const hint = document.querySelectorAll('.requiredHint')
    if (num === 2) {
        for (let i = 0; i < num; i++) {
            name = document.createElement('span')
            name.classList.add('requiredHint')
            name.textContent = '**This is a required field.**'
            hints[i].appendChild(name)
        }
    }
    if (name === 'websiteUrlInvalid') {
        name = document.createElement('span')
        name.classList.add('requiredHint')
        name.textContent = '**The website URL is invalid.**'
        hints[num].appendChild(name)
    }
    if (name === 'websiteNameMissing') {
        name = document.createElement('span')
        name.classList.add('requiredHint')
        name.textContent = '**This is a required field.**'
        hints[num].appendChild(name)
    }
    if (name === 'websiteUrlMissing') {
        name = document.createElement('span')
        name.classList.add('requiredHint')
        name.textContent = '**This is a required field.**'
        hints[num].appendChild(name)
    }
    if (hint) {
        hint.forEach((item) => {
            item.remove()
        })
    }
}

//Static content handler (show/hide)
const showStatic = () => staticContainer.classList.remove('hide')
const hideStatic = () => staticContainer.classList.add('hide')

//Check if bookmarks is empty
const emptyBookmarks = () => bookmarks.length === 0 ? showStatic() : hideStatic()

//listeners
openModal.addEventListener('click', modalState);
closeModal.addEventListener('click', modalState);
modalForm.addEventListener('submit', addBookmark);


//onload
window.addEventListener('DOMContentLoaded', () => {
    checkLocalStorage()
    checkBookmark()
})
