const express = require("express");
const connectDB = require("./db/connect");
const productsRouter = require("./routes/products");
const notFound = require("./middleware/notfound");
const errorHandler = require("./middleware/errorhandler");
const userRouter = require("./routes/users");
const orderRouter = require("./routes/orders");

const app = express();
app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB();
    console.log("connected to db");
    app.listen(5000, () => {
      console.log("server is listening on port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};

start();
