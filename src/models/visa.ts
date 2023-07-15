import mongoose from 'mongoose';
import crypto from 'crypto';

const VisaSchema = new mongoose.Schema({
        name: { type: String, required: true },
        maiden_name: { type: String, required: true },
        middle_names: { type: String, required: true },
        first_name: { type: String, required: true },
        city_of_birth: { type: String, required: true },
        country_of_birth: { type: String, required: true },
        date_of_birth: { type: Date, required: true },
        citizenship_at_birth: { type: String, required: true },
        current_citizenship: { type: String, required: true },
        sex: { type: String, enum: ['Male', 'Female'], required: true },
        marital_status: { type: String, required: true },
        spouse_name: { type: String },
        profession: { type: String, required: true },
        residence_address: { type: String, required: true },
        personal_cellphone: { type: String, required: true },
        email_address: { type: String, required: true },
        father_name: { type: String, required: true },
        father_citizenship: { type: String, required: true },
        mother_name: { type: String, required: true },
        mother_citizenship: { type: String, required: true },
        type_of_passport: { type: String, enum: ['ordinary', 'diplomatic', 'service', 'other'], required: true },
        travel_document_number: { type: String, required: true },
        passport_validation_date: { type: String, required: true },
        passport_issued_by: { type: String, required: true },
        residence_permit_number: { type: String, required: true },
        permit_expiration_date: { type: String, required: true },
        purpose_of_travel: { type: String, enum: ['visit family', 'service mission', 'official mission', 'Tourism', 'business', 'study', 'scientific/culture/sport', 'ngo', 'Journalist', 'conference'], required: true },
        ticket_reference: { type: String, required: true },
        ticket_issued_by: { type: String, required: true },
        destination_city: { type: String, required: true },
        entry_point: {
            transit: {
                departure: { type: String }, // date from - to
                return: { type: String }, // date from to
                visa_number: { type: String, required: true }
            },
            one_access_point: [{ type: String }], // from date - to date
            two_access_point: {
                first_access: [{ type: String }], // from date - to date
                second_access: [{ type: String }] // from date - to date
            },
            multiple_access_point: {
                first_access: [{ type: String }], // from date - to date
                second_access: [{ type: String }] // from date - to date
            }
        },
        last_congolese_visa_obtained: {
            number: { type: String },
            issued_date: { type: Date },
            validity: [{ type: Date }] // Array of two Date objects
        },
        host_sponsor: {
            name: { type: String },
            address: { type: String },
            cellphone: { type: String }
        },
        guarantee_of_support: { type: String },
    //return a unique number generated based on passport number and date of birth
    reference: {
        type: String,
        required: true,
        unique: true,
        index: true,
        default: function () {
            const hash = crypto.createHash('md5');
            // @ts-ignore
            const hashValue = hash
                .update(
                    // @ts-ignore
                    this.date_of_birth.toISOString() +
                    // @ts-ignore
                    this.ticket_reference
                )
                .digest('hex');
            return hashValue.slice(0, 8).toUpperCase();
        },
    },
    status: {
        type: String,
        enum: ['submitted', 'payment', 'in-progress', 'ready'],
        default: 'submitted'
    }
});

export const VisaModel = mongoose.model('Visa', VisaSchema);

/* TODO
departure date can't be less than today's date
same user can have multiple application - unique fields are ticket reference.
*/

