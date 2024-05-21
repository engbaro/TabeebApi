import ApiError from "../../errors/apiError";
import httpStatus from "http-status";
import moment from 'moment';
import { EmailtTransporter } from "../../helpers/emailTransporter";
import * as path from 'path';
import config from "../../config";
import {appointment, appointmentSchema} from "../models/appointment.model";
import {patient} from "../models/patient.model";
import { v4 as uuidv4 } from 'uuid';


const checkPatientExist = async (payload: any): Promise<boolean> => {
    if (payload.patientId) {
        const result = await patient.get({
            patientId: payload.patientId
        }).go();
        if (result.data == null) {
            return false;
        }
    } else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Patient Id is required !!')
    }

    return true;
}

export default {
    checkPatientExist,
};