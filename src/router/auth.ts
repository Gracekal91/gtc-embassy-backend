import {createNewUser, login} from "../controllers/auth.controller";
import { Router } from 'express';


export default (router: Router): void => {
    router.post('/auth/register', createNewUser);
    router.post('/auth/login', login);
}
