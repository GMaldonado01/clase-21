import { Router } from "express";
import { UserManager } from "../dao/user.manager.mdb.js";

const router = Router();
const manager = new UserManager();

router.get("/", async (req, res) => {
  try {
    const users = await manager.getUsers();
    res.status(200).send({ status: "OK", data: users });
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

router.get("/paginated", async (req, res) => {
  try {
    const users = await manager.getUsersPaginated();
    res.status(200).send({ status: "OK", data: users });
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});
router.get("/users", async (req, res) => {
  const data = await manager.getUsersPaginated(
    req.query.page || 1,
    req.query.limit || 50
  );

  data.pages = [];
  for (let i = 1; i <= data.totalPages; i++) data.pages.push(i);

  res.render("users", {
    title: "Listado de USUARIOS",
    data: data,
  });
});

export default router;
