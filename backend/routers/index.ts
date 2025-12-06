import express from "express";
const app = express();
import healthRouter from "./health.routes";
import transactionRouter from "./transaction.routes";
import authRouter from "./auth.routes";
import walletRouter from "./wallet.routes";

app.use("/", express.Router());
app.use("/health", healthRouter);
app.use("/transaction", transactionRouter);
app.use("/auth", authRouter);
app.use("/wallet", walletRouter);

export default app;
