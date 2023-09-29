import BaseController from "./baseController.js";
import productType from "../models/productType.js";
class ProductTypeController extends BaseController {
  constructor() {
    super(productType);
  }

  /**
   * Get entity by it's id
   * @param {Request} req
   * @param {Response} res
   */
  insert = async (req, res) => {
    console.log(req.body);
    const data = await this.model.create(req.body);
    return this.created(res, data);
  };

  updateByUserId = async (req, res) => {};

  getByUserId = async (req, res) => {};
}

const productTypeController = new ProductTypeController();

export default productTypeController;
