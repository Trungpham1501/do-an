import BaseController from './baseController.js'
import Review from '../models/review.js'
import mongoose from 'mongoose'

class ReviewController extends BaseController {
  constructor() {
    super(Review)
  }

  getByProductId = async (req, res) => {
    try {
      const productId = req.params.id
      const query = req.query

      const filter = {
        product: productId,
      }

      if (!query.pageIndex || !query.pageSize) {
        const [reviews, numberReviews] = await Promise.all([
          this.model.find(filter).populate('user').sort({ createdAt: -1 }),
          this.model.countDocuments(filter),
        ])

        return this.success(res, {
          pageData: reviews,
          totalRecords: numberReviews,
        })
      }

      const pageIndex = parseInt(query.pageIndex)
      const pageSize = parseInt(query.pageSize)

      const limit = pageSize
      const skip = (pageIndex - 1) * pageSize

      const [reviews, numberReviews] = await Promise.all([
        this.model.find(filter).populate('user').sort({ createdAt: -1 }).skip(skip).limit(limit),
        this.model.countDocuments(filter),
      ])

      return this.success(res, {
        pageData: reviews,
        totalRecords: numberReviews,
      })
    } catch (error) {
      return this.serverError(res, error)
    }
  }

  get = async (req, res) => {
    try {
      const review = await this.model
        .findOne({ _id: req.params.id })
        .populate('user')
        .populate('product')
      if (!review) {
        return this.notFound(res)
      }
      return this.success(res, review)
    } catch (error) {
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

      if (query.productId) {
        filter['product'] = query.productId
      }

      if (query.searchText) {
        const myRegex = { $regex: `.*${query.searchText}.*`, $options: 'i' }
        filter.$or = [
          {
            userCode: myRegex,
          },
          {
            userFullname: myRegex,
          },
          {
            userEmail: myRegex,
          },
          {
            productCode: myRegex,
          },
          {
            productName: myRegex,
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
        this.model
          .find(filter)
          .populate('product')
          .populate('user')
          .sort(sort)
          .skip(skip)
          .limit(limit),
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

  getRatingResult = async (req, res) => {
    try {
      const productId = req.params.id
      const filter = {
        product: mongoose.Types.ObjectId(productId),
      }
      const result = await this.model.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$score',
            count: { $push: { product: '$product' } },
          },
        },
        {
          $project: {
            numberReviews: { $size: '$count' },
          },
        },
      ])

      return this.success(res, result)
    } catch (error) {
      console.log(error)
      return this.serverError(res, error)
    }
  }
}

const reviewController = new ReviewController()

export default reviewController
