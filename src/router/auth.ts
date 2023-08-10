import {createNewUser, login, getRefreshToken} from "../controllers/auth.controller";
import { Router } from 'express';


export default (router: Router): void => {
    router.post('/api/v1/auth/register', createNewUser);
    router.post('/api/v1/auth/login', login);
    router.post('/api/v1/auth/refresh', getRefreshToken)
}
