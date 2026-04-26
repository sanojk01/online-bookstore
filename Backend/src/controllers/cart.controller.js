const cartModel = require("../models/cart.model");
const bookModel = require("../models/book.model");

// add items to cart
async function addToCart(req, res) {
  try {
    const userId = req.user._id;
    const { bookId, quantity = 1 } = req.body;

    const qty = Number(quantity);

    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive number." });
    }

    const book = await bookModel.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Seller cannot add their own book to cart
    if (book.seller.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot add your own book to the cart." });
    }

    let cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      // Stock check for new cart
      if (book.stock < qty) {
        return res.status(400).json({
          message: `Only ${book.stock} items available in stock.`,
        });
      }
      cart = new cartModel({
        user: userId,
        items: [{ book: bookId, quantity: qty }],
      });

    } else {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.book.equals(bookId)
      );

      if (existingItemIndex > -1) {
        const newQuantity = cart.items[existingItemIndex].quantity + qty;

        if (book.stock < newQuantity) {
          return res.status(400).json({
            message: `Only ${book.stock} items available in stock.`,
          });
        }

        cart.items[existingItemIndex].quantity = newQuantity;

      } else {
        if (book.stock < qty) {
          return res.status(400).json({
            message: `Only ${book.stock} items available in stock.`,
          });
        }

        cart.items.push({ book: bookId, quantity: qty });
      }
    }

    await cart.save();

    // Populate for response + amount calculation
    const populatedCart = await cartModel.findOne({ user: userId }).populate("items.book");

    // Calculate total amount
    let totalAmount = 0;

    populatedCart.items.forEach((item) => {
      totalAmount += item.book.price * item.quantity;
    });

    return res.status(200).json({
      message: "Book added to cart successfully",
      cart: populatedCart,
      totalAmount,
    });

  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get cart items
async function getCartItems(req, res) {
  try {
    const userId = req.user._id;

    const cart = await cartModel.findOne({ user: userId }).populate("items.book", "title price images stock seller");

    if (!cart) {
      return res.json({
        message: "Cart is empty",
        cart: { items: [] },
        totalAmount: 0,
        totalItems: 0,
      });
    }

    // Calculate total amount
    let totalAmount = 0;

    cart.items.forEach((item) => {
      totalAmount += item.book.price * item.quantity;
    });

    // Calculate total items
    let totalItems = 0;

    cart.items.forEach((item) => {
      totalItems += item.quantity;
    });

    return res.status(200).json({
      message: "Cart items retrieved successfully",
      cart,
      totalAmount,
      totalItems,
    });

  } catch (error) {
    console.error("Error fetching cart items:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// update cart item quantity
async function updateCartItem(req, res) {
  try {
    const userId = req.user._id;
    const { bookId } = req.params;
    const { quantity } = req.body;

    const qty = Number(quantity);

    if (isNaN(qty) || qty < 0) {
      return res.status(400).json({ message: "Quantity must be 0 or a positive number." });
    }

    const book = await bookModel.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    let cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex((item) => item.book.equals(bookId));

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Book not found in cart" });
    }

    if (qty === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      if (book.stock < qty) {
        return res.status(400).json({
          message: `Only ${book.stock} items available in stock.`,
        });
      }
      cart.items[itemIndex].quantity = qty;
    }

    await cart.save();

    // Populate same cart (no extra findOne)
    await cart.populate("items.book");

    // Calculate total amount
    let totalAmount = 0;

    cart.items.forEach((item) => {
      totalAmount += item.book.price * item.quantity;
    });

    // Calculate total items
    let totalItems = 0;

    cart.items.forEach((item) => {
      totalItems += item.quantity;
    });

    return res.status(200).json({
      message: "Cart item updated successfully",
      cart,
      totalAmount,
      totalItems,
    });

  } catch (error) {
    console.error("Error updating cart item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// remove item from cart
async function removeCartItem(req, res) {
  try {
    const userId = req.user._id;
    const { bookId } = req.params;

    const book = await bookModel.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    let cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex((item) => item.book.equals(bookId));

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Book not found in cart" });
    }

    cart.items.splice(itemIndex, 1);

    await cart.save();

    // Populate same cart (no extra findOne)
    await cart.populate("items.book");

    // Calculate total amount
    let totalAmount = cart.items.reduce((total, item) => total + item.book.price * item.quantity, 0);

    // Calculate total items
    let totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);

    return res.status(200).json({
      message: "Cart item removed successfully",
      cart,
      totalAmount,
      totalItems,
    });

  } catch (error) {
    console.error("Error removing cart item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


module.exports = {
  addToCart,
  getCartItems,
  updateCartItem,
  removeCartItem,
};
