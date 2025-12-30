import { prisma, prismaTx } from "../helper/prisma.js";
import { BaseController } from "./controller.js";
import { throwError } from "../helper/throwable.js";

export class BorrowsController extends BaseController {

    createBorrow = async (req, res, next) => {
        try {
            const { userId, bookId } = req.body
            if (!userId || !bookId) throwError('userId and bookId are required', 'ZYD-ERR-007', 422) // validasi jika userId dan bookId ada di body

            const result = await prismaTx(async (tx) => {   // disini menggunakan DB transaction untuk memastikan konsistensi data
                const book = await tx.books.findUnique({ where: { id: bookId } }) // cek apakah buku ada
                if (!book) throwError('Book not found', 'ZYD-ERR-005', 404) // jika tidak ada, lempar error

                const existingBorrow = await tx.borrows.findFirst({ where: { userId, bookId, returnDate: null } }) // cek apakah user sudah meminjam buku ini dan belum mengembalikannya
                if (existingBorrow) throwError('User already borrowed this book', 'ZYD-ERR-010', 409) // jika sudah, lempar error
                if (book.stock <= 0) throwError('Book out of stock', 'ZYD-ERR-006', 409) // cek apakah stok buku tersedia

                const borrow = await tx.borrows.create({ data: { userId, bookId } }) // buat data peminjaman baru
                await tx.books.update({ where: { id: bookId }, data: { stock: book.stock - 1 } }) // kurangi stok buku
                return borrow // kembalikan data peminjaman
            })

            return this.sendResponse(res, 201, "Borrow created successfully", result) // kirim response sukses
        } catch (err) {
            next(err)
        }
    }

    getBorrows = async (req, res, next) => {
        try {
            const list = await prisma.borrows.findMany({ include: { user: true, book: true } })
            return this.sendResponse(res, 200, "Borrows retrieved successfully", list)
        } catch (err) {
            next(err)
        }
    }

    getBorrowById = async (req, res, next) => {
        try {
            const { id } = req.params
            const borrow = await prisma.borrows.findUnique({ where: { id }, include: { user: true, book: true } })
            if (!borrow) throwError('Borrow not found', 'ZYD-ERR-008', 404)
            return this.sendResponse(res, 200, "Borrow retrieved successfully", borrow)
        } catch (err) {
            next(err)
        }
    }

    returnBorrow = async (req, res, next) => {
        try {
            const { id } = req.params
            const result = await prismaTx(async (tx) => {
                const borrow = await tx.borrows.findUnique({ where: { id } })
                if (!borrow) throwError('Borrow not found', 'ZYD-ERR-009', 404)
                if (borrow.returnDate) return borrow

                const updated = await tx.borrows.update({ where: { id }, data: { returnDate: new Date() } })
                const book = await tx.books.findUnique({ where: { id: borrow.bookId } })
                if (book) await tx.books.update({ where: { id: book.id }, data: { stock: book.stock + 1 } })
                return updated
            })

            return this.sendResponse(res, 200, "Borrow returned successfully", result)
        } catch (err) {
            next(err)
        }
    }

    deleteBorrow = async (req, res, next) => {
        try {
            const { id } = req.params
            await prismaTx(async (tx) => {
                const borrow = await tx.borrows.findUnique({ where: { id } })
                if (!borrow) throwError('Borrow not found', 'ZYD-ERR-009', 404)
                if (!borrow.returnDate) {
                    const book = await tx.books.findUnique({ where: { id: borrow.bookId } })
                    if (book) await tx.books.update({ where: { id: book.id }, data: { stock: book.stock + 1 } })
                }
                await tx.borrows.delete({ where: { id } })
            })

            return this.sendResponse(res, 204, "Borrow deleted successfully")
        } catch (err) {
            next(err)
        }
    }
}

export default new BorrowsController()
