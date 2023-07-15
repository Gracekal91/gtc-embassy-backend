import express from 'express';
const router = express.Router();
import visas from "./visas";

export default (): express.Router =>{
    visas(router)
    return router
}