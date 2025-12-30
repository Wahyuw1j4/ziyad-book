import { prisma } from "../helper/prisma.js";
import { BaseController } from "./controller.js";
import { throwError } from "../helper/throwable.js";

export class BooksController extends BaseController {

    createBook = async (req, res, next) => {
        try {
            const { title, author, published, genre, stock } = req.body
            const book = await prisma.books.create({
                data: {
                    title,
                    author,
                    published: published ? Number(published) : 0,
                    genre,
                    stock: stock ? Number(stock) : 0,
                },
            })
            this.sendResponse(res, 201, "Book created successfully", book)
        } catch (err) {
            next(err)
        }
    }

    getBooks = async (req, res, next) => {
        try {
            const list = await prisma.books.findMany()
            return this.sendResponse(res, 200, "Books retrieved successfully", list)
        } catch (err) {
            next(err)
        }
    }

    getBookById = async (req, res, next) => {
        try {
            const { id } = req.params
            const book = await prisma.books.findUnique({ where: { id } })
            if (!book) throwError('Book not found', 'ZYD-ERR-004', 404)
            return this.sendResponse(res, 200, "Book retrieved successfully", book)
        } catch (err) {
            next(err)
        }
    }

    updateBook = async (req, res, next) => {
        try {
            const { id } = req.params
            const data = req.body
            if (data.published) data.published = Number(data.published)
            const updated = await prisma.books.update({ where: { id }, data })
            return this.sendResponse(res, 200, "Book updated successfully", updated)
        } catch (err) {
            next(err)
        }
    }

    deleteBook = async (req, res, next) => {
        try {
            const { id } = req.params
            const book = await prisma.books.findUnique({ where: { id } })
            if (!book) throwError('Book not found', 'ZYD-ERR-003', 404)
            await prisma.books.delete({ where: { id } })
            return this.sendResponse(res, 200, "Book deleted successfully", null)
        } catch (err) {
            next(err)
        }
    }
}

export default new BooksController()
