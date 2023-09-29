import { Router } from "express";
import productController from "../controllers/productController.js";
import { body } from "express-validator";

const validators = [
  body("name")
    .trim()
    .isLength({ max: 256, min: 1 })
    .withMessage("Bắt buộc nhập tên sản phẩm, tối đa 256 ký tự")
    .escape(),
  body("price")
    .isLength({ min: 1 })
    .withMessage("Bắt buộc nhập giá sản phẩm")
    .isNumeric()
    .withMessage("Số tiền phải là số")
    .escape(),
];

const carRouter = Router();

carRouter.get("/q", productController.getCarsByManufacturer);

carRouter.get("/total", productController.getTotal);

carRouter.get("/query", productController.getPaging);

carRouter.get("/newCode", productController.getNewCode);

carRouter.get("/:id", productController.get);

carRouter.get("/", productController.getAll);

carRouter.post("/", validators, productController.create);

carRouter.put("/:id", validators, productController.update);

carRouter.delete("/:id", productController.delete);

export default carRouter;
