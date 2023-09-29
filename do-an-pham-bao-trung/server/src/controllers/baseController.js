import mongoose from "mongoose";
import { validationResult } from "express-validator";

class BaseController {
  /**
   * Constructor
   * @param {mongoose.Model} model
   */
  constructor(model) {
    this.model = model;
    this.expectPropertyName = ["_id", "updatedAt", "createdAt", "__v"];
  }

  /**
   * Get all entities
   * @param {Request} req
   * @param {Response} res
   */
  getAll = async (req, res) => {
    try {
      const entities = await this.model.find();
      return this.success(res, entities);
    } catch (error) {
      return this.serverError(res, error);
    }
  };

  /**
   * Get entity by it's id
   * @param {Request} req
   * @param {Response} res
   */
  get = async (req, res) => {
    try {
      const id = req.params.id;
      const entity = await this.model.findOne({ _id: id });
      if (!entity) {
        return this.notFound(res);
      }
      return this.success(res, entity);
    } catch (error) {
      return this.serverError(res, error);
    }
  };

  create = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return this.clientError(res, errors);
      }

      const customErrors = await this.customValidate(req);
      if (customErrors.length > 0) {
        return this.clientError(res, customErrors);
      }
      let entityData = this.generateCustomModel(req);
      if (!entityData) {
        entityData = {};
        const { paths } = this.model.schema;
        for (const key in paths) {
          const formattedKey = key.split(".")[0];
          if (
            !this.expectPropertyName.includes(formattedKey) &&
            entityData !== undefined &&
            req.body[formattedKey] !== undefined
          ) {
            entityData[formattedKey] = req.body[formattedKey];
          }
        }
      }

      const newModel = new this.model({
        ...entityData,
      });

      const savedModel = await newModel.save();
      return this.created(res, savedModel);
    } catch (error) {
      return this.serverError(res, error);
    }
  };

  delete = async (req, res) => {
    try {
      const { id: idListStr } = req.params;
      const idList = idListStr.split(";");
      const filterList = [];
      const idListCount = idList.length;
      for (let index = 0; index < idListCount; index++) {
        const id = idList[index];
        filterList.push({
          _id: id,
        });
      }
      const foundEntities = await this.model
        .find({ $or: filterList })
        .select({ _id: 1 });
      if (foundEntities.length !== idList.length) {
        return res.sendStatus(404);
      }
      await this.model.deleteMany({ $or: filterList });
      return this.success(res);
    } catch (error) {
      return this.serverError(res, error);
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      let foundEntity = await this.model.findOne({ _id: id });
      if (!foundEntity) {
        return this.notFound(res);
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return this.clientError(res, errors);
      }

      const customErrors = await this.customValidate(req);
      if (customErrors.length > 0) {
        return this.clientError(res, customErrors);
      }

      let entityData = this.generateCustomModel(req);
      if (!entityData) {
        entityData = { ...req.body };
      }
      const { paths } = this.model.schema;
      for (const key in paths) {
        if (
          !this.expectPropertyName.includes(key) &&
          foundEntity[key] !== undefined &&
          entityData[key] !== undefined
        ) {
          foundEntity[key] = entityData[key];
        }
      }

      await this.model.updateOne({ _id: id }, foundEntity);

      return this.success(res, foundEntity);
    } catch (error) {
      return this.serverError(res, error);
    }
  };

  getTotal = async (req, res) => {
    try {
      const total = await this.model.countDocuments({});
      return this.success(res, total);
    } catch (error) {
      return this.serverError(res, error);
    }
  };

  /**
   * Custom validate
   * @param { Request }
   * @returns errors
   */
  customValidate = async (req) => {
    return [];
  };

  /**
   * Generate custom model
   * @param { Request }
   * @returns custom model
   */
  generateCustomModel = (req) => {
    return null;
  };

  serverError = (res, error, status = 500) => {
    return res.status(status).json({
      success: false,
      errors: [
        {
          param: "server",
          msg: "Server Error",
          value: error,
        },
      ],
    });
  };

  clientError = (res, errors, status = 400) => {
    return res.status(status).json({
      success: false,
      errors,
    });
  };

  success = (res, data = null, status = 200) => {
    if (data) {
      return res.status(status).json({
        success: true,
        data,
      });
    }
    return res.sendStatus(status);
  };

  notFound = (res) => {
    return res.sendStatus(404);
  };

  created = (res, data) => {
    return res.status(201).json({
      success: true,
      data,
    });
  };

  unauthorize = (res, data = null, status = 401) => {
    if (data) {
      return res.status(status).json({
        success: false,
        data,
      });
    }
    return res.sendStatus(401);
  };
}

export default BaseController;
