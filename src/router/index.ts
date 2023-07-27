import express from 'express';
const router = express.Router();
import visas from "./visas";
import auth from './auth'

export default (): express.Router =>{
    visas(router)
    auth(router)
    return router
}