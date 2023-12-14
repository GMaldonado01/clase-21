import { Router } from "express";
import { CartManager } from "../dao/cart.manager.mdb.js";

const router = Router();
const manager = new CartManager();

router.get("/", async (req, res) => {
  const carts = await manager.getCarts();
  res.status(200).send({ status: "ok", data: carts });
});
router.put("/api/carts/:cid/products/:pid", async (req, res) => {
  const productDelete = await managerCart.getCartAndDeleteProduct();
  res.render("products", {
    title: "Producto eliminado",
    data: productDelete,
  });
});

router.get("api/carts/:cid", async (req, res) => {
  const carts = await managerCart.getCartById();
  res.render("products", {
    title: "CART",
    carts,
  });
});

router.put("api/carts/:cid/empty", async (req, res) => {
  const cart = await managerCart.deleteProductsInCart();
  res.render("products", {
    title: "CART",
    cart,
  });
});
router.get("/:cid", async (req, res) => {
  const carts = await managerCart.objectsInCart;
  res.render("products", {
    title: "listado de productos",
    carts,
  });
});

export default router;
