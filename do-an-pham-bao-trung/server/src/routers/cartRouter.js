import cartController from '../controllers/cartController.js'
import authValidation from '../validations/authValidation.js'
import { Router } from 'express'

const cartRouter = Router()

cartRouter.post('/getByUserId', authValidation, cartController.getByUserId)

cartRouter.post('/updateByUserId', authValidation, cartController.updateByUserId)

export default cartRouter
