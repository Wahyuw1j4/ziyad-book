import { prisma } from "../helper/prisma.js";
import { BaseController } from "./controller.js";
import { throwError } from "../helper/throwable.js";

export class UsersController extends BaseController {

    createUser = async (req, res, next) => {
        try {
            const { email, name, password } = req.body
            if (!email || !password) {
                throwError('Email and password are required', 'ZYD-ERR-001', 422)
            }

            const normalizedEmail = email.toLowerCase().trim()
            const existing = await prisma.users.findUnique({ where: { email: normalizedEmail } })
            if (existing) throwError('User with this email already exists', 'ZYD-ERR-002', 409)

            const user = await prisma.users.create({ data: { email: normalizedEmail, name, password } })
            return this.sendResponse(res, 201, "User created successfully", user)
        } catch (err) {
            next(err)
        }
    }

    getUsers = async (req, res, next) => {
        try {
            const list = await prisma.users.findMany()
            return this.sendResponse(res, 200, "Users retrieved successfully", list)
        } catch (err) {
            next(err)
        }
    }

    getUserById = async (req, res, next) => {
        try {
            const { id } = req.params
            const user = await prisma.users.findUnique({ where: { id } })
            if (!user) return res.status(404).json({ error: 'User not found' })
            return this.sendResponse(res, 200, "User retrieved successfully", user)
        } catch (err) {
            next(err)
        }
    }

    updateUser = async (req, res, next) => {
        try {
            const { id } = req.params
            const data = req.body
            const updated = await prisma.users.update({ where: { id }, data })
            return this.sendResponse(res, 200, "User updated successfully", updated)
        } catch (err) {
            next(err)
        }
    }

    deleteUser = async (req, res, next) => {
        try {
            const { id } = req.params
            await prisma.users.delete({ where: { id } })
            return this.sendResponse(res, 204, "User deleted successfully", null)
        } catch (err) {
            next(err)
        }
    }
}

export default new UsersController()
