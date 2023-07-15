import express from 'express';
import {
    getVisas,
    createVisa,
    getVisaApplicationsByPassport,
    getVisaByRef,
    getVisaApplicationById,
    updateVisaStatus, deleteVisa
} from "../controllers/visaControllers";
import { Router } from 'express';

export default (router: Router): void => {
    router.get('/visas', getVisas);
    router.post('/create_visa', createVisa)
    router.get('/visas/:passport', getVisaApplicationsByPassport);
    router.get('/visa/:ref', getVisaByRef);
    router.get('/visaby/:id', getVisaApplicationById);
    router.patch('/visa/:id', updateVisaStatus);
    router.delete('/visa/:id', deleteVisa)
}