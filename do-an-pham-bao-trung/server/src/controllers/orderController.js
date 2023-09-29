import BaseController from './baseController.js'
import Order from '../models/order.js'
import Cart from '../models/cart.js'
import Product from '../models/product.js'

class OrderController extends BaseController {
  constructor(product) {
    super(Order)
    this.product = product
  }

  create = async (req, res) => {
    try {
      const orders = await this.model.find().sort({ code: -1 }).limit(1)

      if (orders.length > 0) {
        const newestOrder = orders[0]
        const newestOrderCode = newestOrder.code

        const codeArr = newestOrderCode.split('.')
        const codeNumber = parseInt(codeArr[1])

        const newCodeNumber = codeNumber + 1
        const newCode = `O.${newCodeNumber.toString().padStart(4, '0')}`
        req.body.code = newCode
      } else {
        req.body.code = 'O.0001'
      }

      const totalMoney = req.body.cars.reduce((prev, cur) => {
        return (prev += cur.price * cur.number)
      }, 0)

      const newOrder = new this.model({
        code: req.body.code,
        user: req.body.user,
        cars: req.body.cars,
        note: req.body.note,
        totalMoney,
      })

      const savedOrder = await newOrder.save()

      await Cart.updateOne({ user: req.body.userId }, { products: [] })

      return this.created(res, savedOrder)
    } catch (error) {
      console.log(error)
      return this.serverError(res, error)
    }
  }

  getPaging = async (req, res) => {
    try {
      const query = req.query
      const filter = {}
      const sort = {}
      if (query.sort) {
        const sortArr = query.sort.split('|')
        const key = sortArr[0]
        const direction = sortArr[1]
        sort[key] = parseInt(direction)
      }

      if (query.status) {
        filter.status = query.status
      }

      if (query.userId) {
        filter['user._id'] = query.userId
      }

      if (query.searchText) {
        const myRegex = { $regex: `.*${query.searchText}.*`, $options: 'i' }
        filter.$or = [
          {
            code: myRegex,
          },
          {
            'user.code': myRegex,
          },
          {
            'user.name': myRegex,
          },
          {
            'user.email': myRegex,
          },
          {
            'user.phoneNumber': myRegex,
          },
        ]
      }

      if (!query.pageIndex || !query.pageSize) {
        const [orders, numberOrders] = await Promise.all([
          this.model.find(filter).sort(sort),
          this.model.countDocuments(filter),
        ])

        return this.success(res, {
          pageData: orders,
          totalRecords: numberOrders,
        })
      }

      const pageIndex = parseInt(query.pageIndex)
      const pageSize = parseInt(query.pageSize)

      const limit = pageSize
      const skip = (pageIndex - 1) * pageSize

      const [orders, numberOrders] = await Promise.all([
        this.model.find(filter).sort(sort).skip(skip).limit(limit),
        this.model.countDocuments(filter),
      ])

      return this.success(res, {
        pageData: orders,
        totalRecords: numberOrders,
      })
    } catch (error) {
      console.log(error)
      return this.serverError(res, error)
    }
  }

  getTotalRevenue = async (req, res) => {
    const query = req.query

    const aggregate = [
      { $match: { status: 3 } },
      {
        $group: {
          _id: '$status',
          totalRevenue: { $sum: '$totalMoney' },
        },
      },
    ]

    if (query.month) {
      const date = new Date()
      const currentYear = date.getFullYear()
      const start = new Date(currentYear, 0, 1)
      const end = new Date(currentYear, 11, 30)
      aggregate[0] = {
        $match: { status: 3, createdAt: { $gte: start, $lte: end } },
      }
      aggregate[1] = {
        $group: {
          _id: { status: '$status', month: { $month: '$createdAt' } },
          totalRevenue: { $sum: '$totalMoney' },
        },
      }
    } else if (query.year) {
      const date = new Date()
      const currentYear = date.getFullYear()
      const start = new Date(currentYear - 5, 0, 1)
      const end = new Date(currentYear, 11, 30)
      aggregate[0] = {
        $match: { status: 3, createdAt: { $gte: start, $lte: end } },
      }
      aggregate[1] = {
        $group: {
          _id: { status: '$status', year: { $year: '$createdAt' } },
          totalRevenue: { $sum: '$totalMoney' },
        },
      }
    }

    try {
      const totalRevenue = await this.model.aggregate(aggregate)
      return this.success(res, totalRevenue)
    } catch (error) {
      return this.serverError(res, error)
    }
  }

  update = async (req, res) => {
    try {
      const { id } = req.params
      let foundEntity = await this.model.findOne({ _id: id })
      if (!foundEntity) {
        return this.notFound(res)
      }

      let entityData = { ...req.body }
      const { paths } = this.model.schema
      for (const key in paths) {
        if (
          !this.expectPropertyName.includes(key) &&
          foundEntity[key] !== undefined &&
          entityData[key] !== undefined
        ) {
          foundEntity[key] = entityData[key]
        }
      }

      const carIds = foundEntity.cars.map((car) => car._id)
      const funcList = []
      if (entityData.status === 2) {
        const cars = await this.product.find({ _id: { $in: carIds } })

        const carCount = cars.length
        for (let index = 0; index < carCount; index++) {
          const car = JSON.parse(JSON.stringify(cars[index]))
          const carInOrder = foundEntity.cars.find((c) => c._id.toString() === car._id)
          car.number -= carInOrder.number
          if (car.number < 0) {
            return this.clientError(res, [
              {
                param: 'number',
                msg: `Chỉ còn ${cars[index].number} sản phẩm <${car.code}>`,
              },
            ])
          }
        }
      } else if (entityData.status === 3) {
        const cars = await this.product.find({ _id: { $in: carIds } })

        const carCount = cars.length
        for (let index = 0; index < carCount; index++) {
          const car = JSON.parse(JSON.stringify(cars[index]))
          const carInOrder = foundEntity.cars.find((c) => c._id.toString() === car._id)
          car.number -= carInOrder.number

          if (car.number < 0) {
            return this.clientError(res, [
              {
                param: 'number',
                msg: `Chỉ còn ${cars[index].number} sản phẩm <${car.code}>`,
              },
            ])
          }
          funcList.push(this.product.updateOne({ _id: car._id }, car))
        }
      }

      funcList.push(this.model.updateOne({ _id: id }, foundEntity))
      await Promise.all([...funcList])

      return this.success(res, foundEntity)
    } catch (error) {
      console.log(error)
      return this.serverError(res, error)
    }
  }
}

const orderController = new OrderController(Product)

export default orderController
