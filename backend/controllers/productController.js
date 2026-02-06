import Product from "../models/Product.js";
import cloudinary from "../utils/cloudinary.js";
import escapeRegex from "../utils/escapeRegex.js";

/* ======================================================
   CREATE PRODUCT (ADMIN)
====================================================== */
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, sizes, colors, stock } = req.body;

    let images = [];

    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      sizes,
      colors,
      stock,
      images,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ======================================================
   GET PRODUCTS (PUBLIC) — SAFE SEARCH
====================================================== */
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      color,
      size,
      priceOrder,
      search,
    } = req.query;

    const query = {};

    /* 🔒 SAFE SEARCH */
    if (search) {
      if (search.length > 50) {
        return res.status(400).json({
          success: false,
          message: "Search query too long",
        });
      }

      const safeSearch = escapeRegex(search.trim());
      query.name = { $regex: safeSearch, $options: "i" };
    }

    /* 🎯 FILTERS */
    if (category) query.category = category;
    if (color) query.colors = color;
    if (size) query.sizes = Number(size);

    /* 🔃 SORT */
    let sortOption = { createdAt: -1 };
    if (priceOrder === "asc") sortOption = { price: 1 };
    if (priceOrder === "desc") sortOption = { price: -1 };

    /* 📄 PAGINATION */
    const currentPage = Number(page);
    const perPage = Number(limit);
    const skip = (currentPage - 1) * perPage;

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(perPage);

    res.status(200).json({
      success: true,
      products,
      currentPage,
      totalPages: Math.ceil(totalProducts / perPage),
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* ======================================================
   GET PRODUCT BY ID (PUBLIC)
====================================================== */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* ======================================================
   UPDATE PRODUCT (ADMIN)
====================================================== */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Replace images if new ones uploaded
    if (req.files && req.files.length > 0) {
      for (const img of product.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }

      product.images = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    const fields = [
      "name",
      "description",
      "price",
      "category",
      "sizes",
      "colors",
      "stock",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* ======================================================
   DELETE PRODUCT (ADMIN)
====================================================== */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    for (const img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      id: req.params.id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
