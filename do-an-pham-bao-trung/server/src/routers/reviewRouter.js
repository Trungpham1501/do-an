import reviewController from '../controllers/reviewController.js'
import authValidation from '../validations/authValidation.js'
import { Router } from 'express'

const reviewRouter = Router()

reviewRouter.get('/getByProductId/:id', reviewController.getByProductId)

reviewRouter.get('/getRatingResult/:id', reviewController.getRatingResult)

reviewRouter.get('/query', authValidation, reviewController.getPaging)

reviewRouter.get('/total', reviewController.getTotal)

reviewRouter.get('/:id', authValidation, reviewController.get)

reviewRouter.post('/', authValidation, reviewController.create)

reviewRouter.delete('/:id', authValidation, reviewController.delete)

export default reviewRouter
