import app from "./app";
import dotenv from 'dotenv'
import path from "node:path"

dotenv.config({
    path: path.resolve(__dirname, '../.env')
})