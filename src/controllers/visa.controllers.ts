import {
    getAllVisaApplications,
    createVisaApplication,
    getVisaByReference,
    getVisaApplicationsByPassportNumber,
    getVisaById, updateStatus, deleteVisaApplicationById
} from "../actions/visaActions";
import express from "express";

//Create a visa application
/*
* @Public
* */

export const createVisa = async (req: express.Request, res: express.Response)=>{
    try{
        const {...data} = req.body;
        if(!data) return res.sendStatus(400);

        const newVisa = await createVisaApplication(data);
        return res.status(201).json(`visa application successfully created ref number ${newVisa.reference}`);

    }catch (e) {
        console.log('Error', e);
        return res.sendStatus(400)
    }
}

//Get all visas applications - @Private

export const getVisas = async (req: express.Request, res: express.Response) => {
    try{
        const visas = await getAllVisaApplications();
        res.status(200).json(visas);
    }catch (e) {
        console.log('Error', e)
        res.sendStatus(400)
    }
}


//Get visa by Travelling document number

/**
 * @Members
 * */

export const getVisaApplicationsByPassport = async (req: express.Request, res: express.Response) =>{
    try{
        const {passportNumber} = req.body;
        if(!passportNumber) return res.status(400).json('No Application exist with the following passport number');

        const visa = await getVisaApplicationsByPassportNumber(passportNumber);
        return res.status(201).json(visa);
    }catch(e){
        console.log('Error', e);
        res.sendStatus(400)
    }
}

//Get one visa application by reference

export const getVisaByRef = async (req: express.Request, res: express.Response) =>{
    const {ref} = req.params;
    try{
        if(!ref) return res.status(400).json(`No Visa Reference Number provided`);
        const visa = await getVisaByReference(ref);
        if(!visa) return res.status(400).json(`No Visa Application with the reference number: ${ref}}`);
        return res.status(201).json(visa);

    }catch (e) {
        console.log('Error', e)
        throw e;
    }
}

//get Visa Application by ID

export const getVisaApplicationById = async (req: express.Request, res: express.Response) => {
    try{
        const {id} = req.params;
        if(!id) return res.sendStatus(400);

        const visa = await getVisaById(id);
        if(!visa) return res.status(404).json(`A visa application with the Id: ${id} does not exist`);
        return res.status(200).json(visa);

    }catch (e) {
        console.log('Error', e);
        throw  e;
    }
}

//Update visa status

export const updateVisaStatus = async (req: express.Request, res: express.Response) =>{
    const {id} = req.params;
    const status = req.body?.value
    try{
        const visa = await getVisaById(id);
        if(!visa) return res.send(400);
        await updateStatus(id, {status});
        return res.json(`successfully update new status is : ${status}`)

    }catch (e) {
        console.log('Error', e);
        throw e;
    }
}

//delete visa

export const deleteVisa = async (req: express.Request, res: express.Response) => {
    const {id} = req.params;
    try{
        const visa = await getVisaById(id);
        if(!visa) return res.status(404).json('No visa found');
        await deleteVisaApplicationById(id);
        res.status(200).json('successfully deleted');
    }catch (e) {
        console.log('Error', e)
        throw e;
    }
}




