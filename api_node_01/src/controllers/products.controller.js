const Product = require("../models/product.model");
const mongoose = require("mongoose");



const getAllProducts = async (req, res) => {
  try {
    const { page, limit } = req.query;

    let products;
    let total = await Product.countDocuments();

    if (limit) {
      const pageNumber  = parseInt(page)  || 1;
      const limitNumber = parseInt(limit);
      const skip = (pageNumber - 1) * limitNumber;

      products = await Product.find()
        .skip(skip)
        .limit(limitNumber);

      return res.status(200).json({
        data: products,
        pagination: {
          total,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(total / limitNumber)
        }
      });
    }

    //Si no hay limit, devolvemos todo
    products = await Product.find();

    res.status(200).json({
      data: products,
      total
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // id inválido (no es ObjectId)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const product = await Product.findById(id);

    // No existe
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchProducts = async (req, res) => {
  try {
    const {
      department,
      available,
      minPrice,
      maxPrice,
      sortBy  = 'name',    // campo por el que ordenar
      order   = 'asc',     // asc o desc
      page    = 1,
      limit   = 10
    } = req.query;
 
    // Construimos el filtro dinámicamente
    const filter = {};
 
    if (department) {
      filter.department = department;
    }
 
    if (available !== undefined) {
      filter.available = available === 'true';
    }
 
    // Rango de precios
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
 
    // Ordenación: 'asc' → 1, 'desc' → -1
    const sortOrder = order === 'desc' ? -1 : 1;
    const sort = { [sortBy]: sortOrder };
 
    const pageNum  = parseInt(page)  || 1;
    const limitNum = parseInt(limit) || 10;
    const skip     = (pageNum - 1) * limitNum;
 
    const [results, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limitNum),
      Product.countDocuments(filter)
    ]);
 
    res.status(200).json({
      data: results,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Product.findByIdAndUpdate(id, req.body, { returnDocument: 'after' });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





module.exports = { getAllProducts, createProduct, getProductById, searchProducts, updateProduct, deleteProduct };

