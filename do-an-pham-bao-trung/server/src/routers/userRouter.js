import { Router } from 'express'
import authValidation from '../validations/authValidation.js'
import {
  getUsers,
  createUser,
  getUser,
  signIn,
  getCurrentUser,
  signOut,
  update,
  getPaging,
  deleteUser,
  getTotal,
} from '../controllers/userController.js'

const userRouter = Router()

userRouter.get('/query', authValidation, getPaging)

userRouter.get('/total', getTotal)

userRouter.get('/currentUser', authValidation, getCurrentUser)

userRouter.get('/sign-out', signOut)

userRouter.get('/:userId', authValidation, getUser)

userRouter.get('/', getUsers)

userRouter.post('/sign-in', signIn)

userRouter.post('/', createUser)

userRouter.put('/:id', update)

userRouter.delete('/:id', deleteUser)

export default userRouter
