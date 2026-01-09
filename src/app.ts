import express from "express";
import cors from "cors";
import { authRoute } from "./modules/index.js";
import { prisma } from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/v1/login", authRoute);

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.get("/check", async(req, res) => {
    const check = await prisma.check.findMany();
    res.json(check);
});

export default app;