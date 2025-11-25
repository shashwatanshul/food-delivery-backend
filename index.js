import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";

import itemRouter from "./routes/item.routes.js";
import shopRouter from "./routes/shop.routes.js";
import orderRouter from "./routes/order.routes.js";
import http from "http";
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";

import path from "path";
import { fileURLToPath } from "url";

/** ---------- ESM __dirname setup ---------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** ---------- Express + HTTP + Socket.io ---------- */

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["POST", "GET"],
  },
});

app.set("io", io);

const port = process.env.PORT || 5000;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

/** ---------- API Routes ---------- */

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

/** ---------- Socket.io Handler ---------- */
socketHandler(io);

/** ---------- Serve Frontend in PRODUCTION ---------- */
if (process.env.NODE_ENV === "production") {
  // 👉 If using Vite: frontend/dist
  const frontendPath = path.join(__dirname, "frontend", "dist");

  // 👉 If using CRA instead, use:
  // const frontendPath = path.join(__dirname, "frontend", "build");

  // Serve static assets
  app.use(express.static(frontendPath));

  // Fallback: any non-API route → index.html
  app.use((req, res, next) => {
    if (req.originalUrl.startsWith("/api")) {
      return next(); // let API routes continue to 404 handler if not matched
    }
    return res.sendFile(path.join(frontendPath, "index.html"));
  });
} else {
  // Simple dev root route
  app.get("/", (req, res) => {
    res.send("Backend running (dev) 🚀");
  });
}

/** ---------- Start Server ---------- */

server.listen(port, () => {
  connectDb();
  console.log(`server started at ${port}`);
});
