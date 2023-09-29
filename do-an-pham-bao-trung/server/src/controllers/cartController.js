import BaseController from "./baseController.js";
import Cart from "../models/cart.js";

class CartController extends BaseController {
  constructor() {
    super(Cart);
  }

  updateByUserId = async (req, res) => {
    try {
      const cart = await this.model.findOne({ user: req.body.userId });
      if (!cart) {
        return this.notFound(res);
      }

      cart.products = req.body.products;
      await this.model.updateOne({ _id: cart._id }, cart);
      return this.success(res);
    } catch (error) {
      return this.serverError(res, error);
    }
  };

  getByUserId = async (req, res) => {
    try {
      const cart = await this.model
        .findOne({ user: req.body.userId })
        .populate("products");
      if (!cart) {
        return this.notFound(res);
      }
      return this.success(res, cart);
    } catch (error) {
      return this.serverError(res, error);
    }
  };
}

const cartController = new CartController();

export default cartController;
