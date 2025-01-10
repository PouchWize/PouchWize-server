import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import routes from "../routes/index";
import { dbConnection } from "./database";

dotenv.config();
dbConnection();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use("/api", routes);

export default app;
