
import express from 'express'
import { fileURLToPath } from 'url'
import { Controller } from './controllers/controller.js'

import booksController from './controllers/booksController.js'
import usersController from './controllers/usersController.js'
import borrowsController from './controllers/borrowsController.js'
import generateErrorId from './helper/generateErrorId.js'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const port = process.env.PORT || 3000

app.use(express.json())

// Books routes
app.get('/books', booksController.getBooks)
app.post('/books', booksController.createBook)
app.get('/books/:id', booksController.getBookById)
app.put('/books/:id', booksController.updateBook)
app.delete('/books/:id', booksController.deleteBook)

// Users routes
app.get('/users', usersController.getUsers)
app.post('/users', usersController.createUser)
app.get('/users/:id', usersController.getUserById)
app.put('/users/:id', usersController.updateUser)
app.delete('/users/:id', usersController.deleteUser)

// Borrows routes
app.get('/borrows', borrowsController.getBorrows)
app.post('/borrows', borrowsController.createBorrow)
app.get('/borrows/:id', borrowsController.getBorrowById)
app.put('/borrows/:id/return', borrowsController.returnBorrow)
app.delete('/borrows/:id', borrowsController.deleteBorrow)

app.use((err, req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        console.error(err); // log ke console / logger
    }

    const status = err.status || err.statusCode || 500
    const errorCode = err.errorCode || err.code || err.ziyad_error_code || 'INTERNAL_SERVER_ERROR'
    return Controller.sendError(res, status, err.message || 'Internal Server Error', errorCode)
})

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})