import Cart from "../models/Cart.js";
import Product from "../models/Product.js";


export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    // If no cart found, initialize an empty one
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalAmount: 0
      });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find().populate("items.product").populate("user", "name email");
    res.status(200).json({ success: true, carts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const addToCart = async (req, res) => {
      try {
            const { productId, quantity, size, color } = req.body;
            const userId = req.user._id;
            
             // Check if product exists
            const product = await Product.findById(productId);
           if (!product) return res.status(404).json({ success: false, message: "Product not found" });

            // Find user's cart or create new
            let cart = await Cart.findOne({ user: userId });
            if (!cart) {
                  cart = new Cart({ user: userId, items: [], totalAmount: 0 });
            }

            // Check if same product/size/color exists
            const existingItem = cart.items.find(
                  (item) => item.product.toString() === productId && item.size === size && item.color === color
            );
            if (existingItem) {
                  existingItem.quantity += quantity; 
            } else {
                  cart.items.push({
                  product: productId,
                  quantity,
                  size,
                  color,
                  price: product.price, 
            });
      }
      
       // Recalculate total amount
      cart.totalAmount = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
      await cart.save();
      res.status(200).json({ success: true, message: "Cart updated", cart });
} catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity, size, color } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "productId is required" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (i) => i.product.toString() === productId && i.size === size && i.color === color
    );

    if (itemIndex === -1)
      return res.status(404).json({ success: false, message: "Item not found in cart" });

    if (quantity <= 0) {
      // Remove item if quantity <= 0
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    // Recalculate total
    cart.totalAmount = cart.items.reduce((sum, i) => sum + i.quantity * i.price, 0);
    await cart.save();

    res.status(200).json({ success: true, message: "Cart updated", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const removeCartItem = async (req, res) => {
      try {
            const { productId, size, color } = req.body;
            const cart = await Cart.findOne({ user: req.user._id });
            if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

            cart.items = cart.items.filter(
                  (item) => !(item.product.toString() === productId && item.size === size && item.color === color));

            // Recalculate total
            cart.totalAmount = cart.items.reduce((sum, i) => sum + i.quantity * i.price, 0);
            await cart.save();
            res.status(200).json({ success: true, message: "Item removed from cart", cart });
      } catch (error) {
    res.status(500).json({ success: false, message: error.message });
}
};


export const clearCart = async (req, res) => {
      try {
            const cart = await Cart.findOne({ user: req.user._id });
            if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

            cart.items = [];
            cart.totalAmount = 0;
            await cart.save();
            res.status(200).json({ success: true, message: "Cart cleared", cart });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
};
