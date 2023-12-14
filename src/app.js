import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";

import { __dirname } from "./utils.js";
import viewsRouter from "./routes/views.routes.js";
import productsRouter from "./routes/products.routes.js";
import usersRouter from "./routes/users.routes.js";
import chatRouter from "../src/routes/chat.routes.js";
import cartsRouter from "../src/routes/cart.routes.js";
import { MessageManager } from "./dao/message.manager.mdb.js";
import cookiesRouter from "./routes/cookies.routes.js";
import sessionsRouter from "./routes/sessions.routes.js";

const PORT = 8080;
const MONGOOSE_URL =
  "mongodb+srv://coder_55605:Pastillas952@cluster0.0a63ncc.mongodb.net/ecomerce";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("talitaKey123"));

const fileStorage = FileStore(session);
app.use(
  session({
    // store: new fileStorage({ path: "./sessions", ttl: 60, retries: 0 }),
    store: MongoStore.create({
      mongoUrl: MONGOOSE_URL,
      mongoOptions: {},
      ttl: 60,
      clearInterval: 5000,
    }),
    secret: "talitaKey123",
    resave: false,
    saveUninitialized: false,
  })
);

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/cookies", cookiesRouter);
app.use("/api/sessions", sessionsRouter);

app.use("/static", express.static(`${__dirname}/public`));

let messages = [];
app.use("/chat", chatRouter);

app.use("/carts", cartsRouter);

try {
  await mongoose.connect(MONGOOSE_URL);
  const server = app.listen(PORT, () => {
    console.log(`Backend activo puerto ${PORT} conectado a bbdd`);
  });

  const io = new Server(server);
  const manager = new MessageManager();

  io.on("connection", (socket) => {
    console.log(`Chat actual enviado a ${socket.id}`);

    socket.on("user_connected", async (data) => {
      messages = await manager.getMessage();

      socket.emit("messagesLogs", messages);
      socket.broadcast.emit("user_connected", data);
    });

    socket.on("message", async (data) => {
      messages.push(data);
      await manager.addMessage(data);
      io.emit("messagesLogs", messages);
    });
  });
} catch (err) {
  console.log(`No se puede conectar con bbdd (${err.message})`);
}
