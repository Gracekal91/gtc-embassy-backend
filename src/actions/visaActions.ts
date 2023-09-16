import mongoose from 'mongoose';
import {VisaModel} from "../models/visa";

//to be performed by officials or admins // protected
export const getAllVisaApplications = () => VisaModel.find();

export const getVisaApplicationsByPassportNumber = async (travel_document_number: string) => {
    try {
        const visaApplications = await VisaModel.find({ travel_document_number }).exec();

        if (visaApplications.length > 0) {
            // Visa applications found
            console.log('Visa applications:', visaApplications);
            return visaApplications;
        } else {
            // No visa applications found
            console.log('No visa applications found');
            return [];
        }
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
};

export const getVisaByReference = async(reference: string) => await VisaModel.findOne({reference}).exec();
export const getVisaById = async(id: string) => await VisaModel.findById(id);

//Applicant can edit their application - create an application
export const createVisaApplication = async (values: Record<string, any>) => await new VisaModel(values).save().then((visa) => visa.toObject());
export const updateVisaApplicationById = async (id: string, values: Record<string, any>) => VisaModel.findByIdAndUpdate(id, values);
// Officials can read applications - get application by Passport - update the state of the application

//Admin can do all + delete application
export const deleteVisaApplicationById = (id: string) => VisaModel.findOneAndDelete({_id: id});
export const updateStatus =  (id: string, value: any | string) =>  VisaModel.findByIdAndUpdate(id, value);







