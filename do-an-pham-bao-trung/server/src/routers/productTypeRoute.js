import { Router } from "express";
import productType from "../controllers/productTypeController.js";
const productTypeRoute = Router();
productTypeRoute.post("/", productType.insert);
productTypeRoute.get("/", productType.getAll);
productTypeRoute.delete("/:id", productType.delete);
productTypeRoute.put("/:id", productType.update);

export default productTypeRoute;
