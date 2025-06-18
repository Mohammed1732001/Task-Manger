import express from "express";
import initApp from "./src/app.router.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
const app = express();
const port = 5000

app.use(cors())
initApp(app, express)



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})