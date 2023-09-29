import User from "../models/user.js";
import Cart from "../models/cart.js";
import Review from "../models/review.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Server error",
      errors: error,
    });
  }
};

export const createUser = [
  body("email")
    .trim()
    .isLength({ max: 256, min: 1 })
    .withMessage("Bắt buộc nhập email, không quá 256 ký tự")
    .isEmail()
    .withMessage("Sai định dạng email")
    .escape(),
  body("password")
    .isLength({ max: 32, min: 6 })
    .withMessage("Bắt buộc nhập mật khẩu, ít nhất 6 và không quá 32 ký tự")
    .escape(),
  body("confirmPassword")
    .isLength({ max: 32, min: 6 })
    .withMessage("Bắt buộc nhập xác nhận mật khẩu")
    .escape(),
  async (req, res) => {
    console.log(req);
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.errors,
        });
      }

      const { email, password, confirmPassword } = req.body;

      const foundUserByEmail = await User.findOne({ email });
      if (foundUserByEmail) {
        return res.status(400).json({
          success: false,
          errors: [{ param: "email", msg: "Email đã tồn tại trong hệ thống" }],
        });
      }

      const passwordRegex = /^[a-zA-Z](?=.*?[0-9])/i;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          success: false,
          errors: [
            {
              param: "password",
              msg: "Mật khẩu phải có it nhất 1 số không đứng đầu",
            },
          ],
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          errors: [
            { param: "confirmPassword", msg: "Mật khẩu không trùng nhau" },
          ],
        });
      }

      const userList = await User.find()
        .select({ code: 1 })
        .sort({ code: -1 })
        .limit(1);
      let userCode = "";
      if (userList.length > 0) {
        const newestUser = userList[0];
        const newestUserCode = newestUser.code;

        const codeArr = newestUserCode.split(".");
        const codeNumber = parseInt(codeArr[1]);

        const newCodeNumber = codeNumber + 1;
        userCode = `U.${newCodeNumber.toString().padStart(4, "0")}`;
      } else {
        userCode = "U.0001";
      }

      // encode password
      const salt = await bcrypt.genSalt(10);
      const encodedPassword = await bcrypt.hash(password, salt);

      const fullName = email.split("@")[0];
      const newUser = new User({
        code: userCode,
        fullName,
        email,
        password: encodedPassword,
      });

      const savedUser = await newUser.save();

      const token = jwt.sign(
        { userId: savedUser._id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );
      res.cookie("token", token, {
        expires: new Date(Date.now() + 86400000),
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });

      const cart = new Cart({
        user: savedUser._id,
        cars: [],
      });

      await cart.save();

      const { password: userPassword, ...info } = savedUser.toJSON();
      return res.json({ success: true, data: info });
    } catch (error) {
      return res.status(500).json({
        success: false,
        msg: "Server error",
        errors: error,
      });
    }
  },
];

export const getUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const foundUser = await User.findOne({ _id: userId });
    if (!foundUser) {
      return res.status(404).json({
        success: false,
        msg: "Không tìm thấy người dùng",
      });
    }
    const { password, ...info } = foundUser.toJSON();

    const cart = await Cart.findOne({ user: info._id });
    let products = [];
    if (cart) {
      products = cart.cars;
    }

    return res.json({
      success: true,
      data: { ...info, products },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Server error",
      errors: error,
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(401).json({
        success: false,
        errors: [
          { param: "email;password", msg: "Email hoặc mật khẩu không đúng" },
        ],
      });
    }

    const isSuccess = await bcrypt.compare(password, foundUser.password);
    if (!isSuccess) {
      return res.status(401).json({
        success: false,
        errors: [
          { param: "email;password", msg: "Email hoặc mật khẩu không đúng" },
        ],
      });
    }

    const token = jwt.sign(
      { userId: foundUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );
    res.cookie("token", token, {
      maxAge: 86400000,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    const { password: userPassword, ...info } = foundUser.toJSON();

    const cart = await Cart.findOne({ user: info._id });
    let products = [];
    if (cart) {
      products = cart.products;
    }

    return res.json({
      success: true,
      data: { ...info, products },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Server error",
      errors: error,
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.sendStatus(401);
    }

    const { password, ...info } = user.toJSON();

    const cart = await Cart.findOne({ user: info._id }).populate("products");
    let products = [];
    if (cart) {
      products = cart.products;
    }
    console.log(products);
    return res.json({
      success: true,
      data: { ...info, products },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Server error",
      errors: error,
    });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.json({
      success: true,
      data: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Server error",
      errors: error,
    });
  }
};

export const getTotal = async (req, res) => {
  try {
    const total = await User.countDocuments({});
    return res.json({
      success: true,
      data: total,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: [
        {
          param: "server",
          msg: "Server Error",
          value: error,
        },
      ],
    });
  }
};

export const update = async (req, res) => {
  try {
    const foundedUser = await User.findOne({ _id: req.params.id });
    if (!foundedUser) {
      return res.sendStatus(404);
    }

    foundedUser.fullName = req.body.fullName;
    foundedUser.avatar = req.body.avatar;
    foundedUser.email = req.body.email;
    foundedUser.address = req.body.address;
    foundedUser.phoneNumber = req.body.phoneNumber;

    await User.updateOne({ _id: foundedUser._id }, foundedUser);

    const { password, ...info } = foundedUser.toJSON();

    return res.json({
      data: info,
    });
  } catch (error) {
    return res.status(500).json([
      {
        param: "server",
        msg: "Server Error",
        value: error,
      },
    ]);
  }
};

export const getPaging = async (req, res) => {
  try {
    const query = req.query;
    const filter = {};
    const sort = {};
    if (query.sort) {
      const sortArr = query.sort.split("|");
      const key = sortArr[0];
      const direction = sortArr[1];
      sort[key] = parseInt(direction);
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.searchText) {
      const myRegex = { $regex: `.*${query.searchText}.*`, $options: "i" };
      filter.$or = [
        {
          code: myRegex,
        },
        {
          name: myRegex,
        },
        {
          email: myRegex,
        },
        {
          phoneNumber: myRegex,
        },
      ];
    }

    if (!query.pageIndex || !query.pageSize) {
      const [orders, numberOrders] = await Promise.all([
        User.find(filter).sort(sort),
        User.countDocuments(filter),
      ]);

      return this.success(res, {
        pageData: orders,
        totalRecords: numberOrders,
      });
    }

    const pageIndex = parseInt(query.pageIndex);
    const pageSize = parseInt(query.pageSize);

    const limit = pageSize;
    const skip = (pageIndex - 1) * pageSize;

    const [users, numberUsers] = await Promise.all([
      // User.find(filter).sort(sort).skip(skip).limit(limit),
      User.aggregate([
        {
          $match: filter,
        },
        {
          $lookup: {
            from: "orders",
            localField: "_id",
            foreignField: "user._id",
            as: "orders",
          },
        },
        {
          $addFields: {
            totalMoney: { $sum: "$orders.totalMoney" },
            totalOrders: { $size: "$orders" },
          },
        },
        {
          $sort: sort,
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]),
      User.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      data: {
        pageData: users,
        totalRecords: numberUsers,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: [
        {
          param: "server",
          msg: "Server Error",
          value: error,
        },
      ],
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id: idListStr } = req.params;
    const idList = idListStr.split(";");
    const filterList = [];
    const filterListCart = [];
    const idListCount = idList.length;
    for (let index = 0; index < idListCount; index++) {
      const id = idList[index];
      filterList.push({
        _id: id,
      });
      filterListCart.push({
        user: id,
      });
    }
    const foundEntities = await User.find({ $or: filterList }).select({
      _id: 1,
    });
    if (foundEntities.length !== idList.length) {
      return res.sendStatus(404);
    }
    await Promise.all([
      User.deleteMany({ $or: filterList }),
      Cart.deleteMany({ $or: filterListCart }),
      Review.deleteMany({ $or: filterListCart }),
    ]);
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: [
        {
          param: "server",
          msg: "Server Error",
          value: error,
        },
      ],
    });
  }
};
