import orderController from '../controllers/orderController.js'
import authValidation from '../validations/authValidation.js'
import { Router } from 'express'

const orderRouter = Router()

// orderRouter.post('/getByUserId', authValidation, orderController.getByUserId)

// orderRouter.post('/updateByUserId', authValidation, orderController.updateByUserId)

orderRouter.post('/', authValidation, orderController.create)

orderRouter.get('/query', orderController.getPaging)

orderRouter.get('/getTotalRevenue', orderController.getTotalRevenue)

orderRouter.get('/:id', orderController.get)

orderRouter.delete('/:id', orderController.delete)

orderRouter.put('/:id', orderController.update)

export default orderRouter
