import cartModel from "./models/cart.model.js";
import productModel from "./models/product.model.js";

export class CartManager {
  constructor() {}

  async getCarts() {
    try {
      return await cartModel
        .find()
        .populate({ path: "products", model: productModel })
        .lean();
    } catch (err) {
      return err.message;
    }
  }
  async addCart(cart) {
    try {
      await cartModel.create(cart);
      return "Carro agregado";
    } catch (err) {
      return err.message;
    }
  }
  async getCartById(id) {
    try {
      const cart = await cartModelModel.findById(id);
      return cart === null ? "No se encuentra el cart" : cart;
    } catch (err) {
      return err.message;
    }
  }
  async getCartAndDeleteProduct(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw new Error("No se encuentra el cart");
      }
      const productInCart = await productModel.findByIdAndDelete(productId);
      if (!productInCart) {
        throw new Error("No se encuentra el product");
      }
      return productInCart;
    } catch (err) {
      return err.message;
    }
  }

  async updateCart(id, newContent) {
    try {
      const procedure = await cartModel.findByIdAndUpdate(id, newContent);
      return procedure;
    } catch (err) {
      return err.message;
    }
  }
  async deleteCart(id) {
    try {
      const procedure = await cartModel.findByIdAndDelete(id);
      return procedure;
    } catch (err) {
      return err.message;
    }
  }
  async deleteProductsInCart(id) {
    try {
      const updateCart = await cartModel.findByIdAndUpdate(id, {
        products: null,
        total: null,
      });
      return updateCart;
    } catch (err) {
      return err.message;
    }
  }
  async objectsInCart(id) {
    try {
      const cart = await cartModel
        .findById(id)
        .populate({ path: "products", model: productModel });
      return cart === null ? "No se encuentra el cart" : cart;
    } catch (err) {
      return err.message;
    }
  }
}
