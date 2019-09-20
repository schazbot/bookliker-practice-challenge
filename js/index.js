document.addEventListener("DOMContentLoaded", function () {

    const user = { "id": 1, "username": "pouros" }
    const booksUrl = "http://localhost:3000/books/"

    const bookList = document.querySelector('#list-panel')
    const bookShowPanel = document.querySelector('#show-panel')


    ///server things

    function getAllBooks() {
        fetch(booksUrl)
            .then(resp => resp.json())
            .then(data =>
                data.forEach(book => buildOneBook(book)))
    }

    function updateBook(book) {
        fetch(booksUrl + `${book.id}`,
            {
                method: 'PATCH',
                headers: { "content-type": "application/json" },
                body: JSON.stringify(book)
            }).then(resp => resp.json())
    }

    ///client things


    function buildOneBook(book) {
        const bookDiv = document.createElement('div')
        const bookTitle = document.createElement('h2')
        const bookImage = document.createElement('img')

        bookImage.src = book.img_url
        bookTitle.innerText = book.title
        bookDiv.append(bookTitle, bookImage)
        bookList.appendChild(bookDiv)
        bookDiv.addEventListener('click', () => showBook(book))
    }


    function showBook(book) {
        while (bookShowPanel.firstChild) bookShowPanel.removeChild(bookShowPanel.firstChild)
        const bookDiv = document.createElement('div')
        const bookTitle = document.createElement('h2')
        const bookImage = document.createElement('img')
        const bookDesc = document.createElement('p')
        const bookUsers = document.createElement('ul')
        bookUsers.id = "users-ul"

        const likeButton = document.createElement('button')
        likeButton.className = "like-btn"
        likeButton.innerText = userLikedBookAlready(book) ? "Unlike" : "Like Me"


        bookImage.src = book.img_url
        bookDesc.innerText = book.description
        bookTitle.innerText = book.title
        book.users.forEach(user => {
            let bookUserLi = document.createElement('li')
            bookUserLi.innerText = user.username
            bookUserLi.id = `user-${user.id}`
            bookUsers.appendChild(bookUserLi)
        }

        )
        bookDiv.append(bookTitle, bookImage, bookDesc, bookUsers, likeButton)
        bookShowPanel.appendChild(bookDiv)

        likeButton.addEventListener('click', (e) => {
            e.preventDefault()
            if (!userLikedBookAlready(book)) {
                likeButton.innerText = "Like Me"
                let bookUserLi = document.createElement('li')
                bookUserLi.innerText = user.username
                bookUserLi.id = `user-${user.id}`
                bookUsers.appendChild(bookUserLi)
                book.users.push(user)
                updateBook(book)
                likeButton.innerText = "Unlike Me"
            } else {
                userLi = document.querySelector(`#user-${user.id}`)
                bookUsers.removeChild(userLi)
                book.users = book.users.filter(usr => usr.id !== user.id)
                updateBook(book)
                    likeButton.innerText = "Like Me"
            }
        })
    }

function userLikedBookAlready(book) {
    return book.users.find(bookUser => bookUser.id == user.id)
}

getAllBooks()

});
