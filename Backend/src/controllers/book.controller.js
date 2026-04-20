const bookModel = require("../models/book.model");
const {uploadFile, deleteFromImageKit} = require("../services/storage.service");

// Create a new book
async function createBook(req, res) {
  try {
    const { title, description, price, category, stock } = req.body;

    const seller = req.user.id;

    if (!title || !price) {
      return res.status(400).json({
        message: "Title and price are required"
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'At least one image is required.'
      });
    }

    const uploadedImages = await Promise.all(
      (req.files || []).map(async (file) => {
        const uploadedFile = await uploadFile(file.buffer);
        return uploadedFile;
      })
    );

    if (uploadedImages.some(img => !img)) {
      return res.status(500).json({
        message: "Image upload failed"
      });
    }

    const images = uploadedImages.map((img) => ({
      url: img.url,
      fileId: img.fileId,
      thumbnailUrl: img.thumbnailUrl,
    }));


    const book = await bookModel.create({
      title,
      description,
      price: Number(price),
      category,
      stock : stock ? Number(stock) : 0,
      images,
      seller
    });

    res.status(201).json({
      message: "Book created successfully",
      book
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while creating the book",
        error: error.message,
    });
  }
}

// Get all books
async function getBooks(req, res) {
  try {
    const {
      query,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (query) {
      filter.$text = { $search: query };
    }

    if (category) {
      filter.category = category;
    } /*  */

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const skip = (pageNum - 1) * limitNum;
    const total = await bookModel.countDocuments(filter);

    const books = await bookModel
      .find(filter)
      .skip(Number(skip))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Books retrieved successfully",
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      books,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while retrieving books",
      error: error.message,
    });
  }
}

// Get a single book by ID
async function getBookById(req, res) {
  try {
    const { id } = req.params;
    const book = await bookModel.findById(id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }
    res.status(200).json({
      message: "Book retrieved successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while retrieving the book",
      error: error.message,
    });
  }
}

// Update a book by ID
async function updateBook(req, res) {
  try {
    const { id } = req.params;
    const book = await bookModel.findById(id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    if (book.seller.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to update this book",
      });
    }

    const allowedFields = ["title", "description", "price", "category", "stock"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

     // Start with existing images
    let updatedImages = [...(book.images || [])];

    // Step 1: Delete images first
    if (req.body.deleteImages) {
      const deleteFileIds = JSON.parse(req.body.deleteImages);

      await Promise.all(
        deleteFileIds.map(fileId =>
          deleteFromImageKit(fileId).catch(() => {})
        )
      );

      updatedImages = updatedImages.filter(
        img => !deleteFileIds.includes(img.fileId)
      );
    }

    // Step 2: Add new images
    if (req.files && req.files.length > 0) {

      const existingCount = updatedImages.length;
      const newCount = req.files.length;

      if (existingCount + newCount > 5) {
        return res.status(400).json({
          message: `Max 5 images allowed.`
        });
      }

      const uploadedImages = await Promise.all(
      (req.files || []).map(async (file) => {
        const response = await uploadFile(file.buffer);
        return response;
      })
     );

     const newImages = uploadedImages.map(img => ({
        url: img.url,
        fileId: img.fileId,
        thumbnailUrl: img.thumbnailUrl
      }));

      updatedImages.push(...newImages);
    }

    updates.images = updatedImages;

    if (updates.price) updates.price = Number(updates.price);
    if (updates.stock) updates.stock = Number(updates.stock);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: 'No valid fields provided to update.'
      });

    }

    const updatedBook = await bookModel.findByIdAndUpdate(id, { $set: updates }, { returnDocument: "after", runValidators: true });

    res.status(200).json({
      message: "Book updated successfully",
      book: updatedBook,
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while updating the book",
      error: error.message,
    });
  }
}

// Delete a book by ID
async function deleteBook(req, res) {
  try {
    const { id } = req.params;
    const book = await bookModel.findById(id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    } 

    if (book.seller.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to delete this book",
      });
    }

    await bookModel.findByIdAndDelete(id);

    // Delete associated images from ImageKit 
    await Promise.all(
      (book.images || []).map(img =>
        deleteFromImageKit(img.fileId).catch(() => {})
      )
    );

    res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while deleting the book",
      error: error.message,
    });
  }
}

// Get all books of the logged-in seller
async function getMyBooks(req, res) {
  try {
    const sellerId = req.user.id;
    const books = await bookModel.find({ seller: sellerId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Books retrieved successfully",
      books,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while retrieving your books",
      error: error.message,
    });
  }
}

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  getMyBooks,
};