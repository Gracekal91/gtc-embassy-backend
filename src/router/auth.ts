import {createNewUser, login, getRefreshToken, logout} from "../controllers/auth.controller";
import { Router } from 'express';
import isAuthenticated from '../middlewares/auth.middleware';

export default (router: Router): void => {
    router.post('/api/v1/auth/register', createNewUser);
    router.post('/api/v1/auth/login', login);
    router.post('/api/v1/auth/refresh', getRefreshToken);
    router.post('/api/v1/auth/logout', isAuthenticated, logout);
}
