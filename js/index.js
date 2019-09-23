document.addEventListener("DOMContentLoaded", function () {

    //server 
    function get(url) {
        return fetch(url).then(
            resp => resp.json()
        )
    }

    function patch(url, id, bookData) {
        return fetch(`${url}${id}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookData)
            }
        ).then(
            resp => resp.json()
        )
    }

    const API = { get, patch }


    //const
    const user = { "id": 1, "username": "pouros" }
    const booksUrl = "http://localhost:3000/books/"
    const listPanel = document.querySelector("#list-panel")
    const showPanel = document.querySelector("#show-panel")



    //client
    function buildBookPreview(book) {
        const bookDiv = document.createElement('div')
        const h2 = document.createElement('h2')
        h2.innerText = book.title
        const img = document.createElement('img')
        img.src = book.img_url

        bookDiv.addEventListener('click', () => bookShow(book))

        bookDiv.append(h2, img)
        listPanel.appendChild(bookDiv)
    }

    function bookShow(book) {
        while (showPanel.firstChild) showPanel.removeChild(showPanel.firstChild)

        const bookDiv = document.createElement('div')

        const h2 = document.createElement('h2')
        h2.innerText = book.title

        const img = document.createElement('img')
        img.src = book.img_url

        const p = document.createElement('p')
        p.innerText = book.description

        const ul = document.createElement('ul')
        book.users.forEach(user => {
            let userLi = document.createElement('li')
            userLi.innerText = user.username
            userLi.id = `user-${user.id}`
            ul.appendChild(userLi)
        }
        )

        const likeBtn = document.createElement('button')
        likeBtn.innerText = "Like"

        likeBtn.addEventListener('click', (e) => {
            e.preventDefault()
            if (!userLikedBookAlready(book)) {
                let userLi = document.createElement('li')
                userLi.innerText = user.username
                userLi.id = `user-${user.id}`
                ul.appendChild(userLi)
                book.users.push(user)
                API.patch(booksUrl, book.id, book).then(likeBtn.innerText = 'unlike')
                
            } else { 
                let userLi = document.querySelector(`#user-${user.id}`)
                ul.removeChild(userLi)
                book.users = book.users.filter(bkUsr => bkUsr.id !== user.id)
                API.patch(booksUrl, book.id, book).then(likeBtn.innerText = 'like')
                
            }
        })

        bookDiv.append(h2, img, p, ul, likeBtn)
        showPanel.appendChild(bookDiv)
    }

    function getAllBooks() {
        API.get(booksUrl).then(books => books.forEach(book => buildBookPreview(book))
        )
    }

    function userLikedBookAlready(book) {
        return book.users.find(bookUser => bookUser.id === user.id)
    }

    getAllBooks()
});
