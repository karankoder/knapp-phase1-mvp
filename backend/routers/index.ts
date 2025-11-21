import express from "express";
const app = express();
import healthRouter from "./health.routes";
import walletRouter from "./wallet.routes";
import priceRouter from "./price.routes";
import transactionRouter from "./transaction.routes";

app.use("/", express.Router());
app.use("/health", healthRouter);
app.use("/wallet", walletRouter);
app.use("/price", priceRouter);
app.use("/transaction", transactionRouter);

export default app;
