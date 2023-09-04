import express from 'express';
import {
    getVisas,
    createVisa,
    getVisaApplicationsByPassport,
    getVisaByRef,
    getVisaApplicationById,
    updateVisaStatus, deleteVisa
} from "../controllers/visa.controllers";
import { Router } from 'express';
import isAuthenticated from "../middlewares/auth.middleware";

export default (router: Router): void => {
    router.get('/api/v1/visas',  isAuthenticated, getVisas);
    router.post('/create_visa', createVisa)
    router.get('/visas/:passport', isAuthenticated, getVisaApplicationsByPassport);
    router.get('/visa/:ref', isAuthenticated, getVisaByRef);
    router.get('/visaby/:id', isAuthenticated, getVisaApplicationById);
    router.patch('/visa/:id', isAuthenticated, updateVisaStatus);
    router.delete('/visa/:id', isAuthenticated, deleteVisa);
}
