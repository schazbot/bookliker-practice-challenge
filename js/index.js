document.addEventListener("DOMContentLoaded", function () {

    const user = { "id": 1, "username": "pouros" }
    const booksUrl = "http://localhost:3000/books/"

    const listPanel = document.querySelector('#list-panel')
    const showPanel = document.querySelector('#show-panel')

    //SERVER
    function getAllBooks() {
        fetch(booksUrl)
            .then(resp => resp.json())
            .then(data => data.forEach(book => makeBookPreview(book)))
    }

    function updateBook(book) {
        fetch(booksUrl + `${book.id}`,
            {
                method: 'PATCH',
                headers: { "content-type": "application/json" },
                body: JSON.stringify(book)
            }).then(resp => resp.json())
        
    }

    //CLIENT

    function makeBookPreview(book) {
        const bookDiv = document.createElement('div')
        
        const bookTitle = document.createElement('h2')
        bookTitle.innerText= book.title

        const bookImg = document.createElement('img')
        bookImg.src = book.img_url

        bookDiv.append(bookTitle, bookImg)
        listPanel.append(bookDiv)

        bookDiv.addEventListener('click', () => bookShowModal(book))
    }

    function bookShowModal(book) { 

        const bookDiv = document.createElement('div')
        while (showPanel.firstChild) showPanel.removeChild(showPanel.firstChild)

        const bookTitle = document.createElement('h2')
        bookTitle.innerText= book.title

        const bookImg = document.createElement('img')
        bookImg.src = book.img_url

        const bookDesc = document.createElement('p')
        bookDesc.innerText = book.description

        const bookUsers = document.createElement('ul')
        book.users.forEach(user => { 
            let userLi = document.createElement('li')
            userLi.innerText = user.username
            userLi.id = `user-${user.id}`
            bookUsers.appendChild(userLi)
        })

        bookDiv.append(bookTitle, bookImg, bookDesc, bookUsers)
        showPanel.appendChild(bookDiv)

        const likeBtn = document.createElement('button')
        likeBtn.innerText = "Like" 
        bookDiv.appendChild(likeBtn)

        likeBtn.addEventListener('click', (e) => { 
            e.preventDefault()
            if (!userLikedBookAlready(book)) {
                let userLi = document.createElement('li')
                userLi.innerText = user.username
                userLi.id = `user-${user.id}`
                bookUsers.appendChild(userLi)
                book.users.push(user)
                updateBook(book)
                likeBtn.innerText = "Unlike"
            } else { 
                let userLi = document.querySelector(`#user-${user.id}`)
                userLi.remove()
                book.users = book.users.filter(bookUser => bookUser.id !== user.id)
                updateBook(book)
                likeBtn.innerText = "Like Me"
            }
        })
    }


    getAllBooks()

    function userLikedBookAlready(book){ 
        return book.users.find(bookUser => bookUser.id === user.id)
    }
});
