import ApiError from "../../errors/apiError";
import httpStatus from "http-status";
import {appointment, appointmentSchema} from "../models/appointment.model";
import {patient} from "../models/patient.model";
import patientService from "./patient.service";
import enums from "../enums";
import { v4 as uuidv4 } from 'uuid';
import { ElectroEvent } from "electrodb";
import moment from "moment";
import { forEach } from "lodash";
import { doctorScheduleService } from "./doctorDaySchedule.service";
const logger = (event: ElectroEvent) => {
    console.log(JSON.stringify(event, null, 4));
  };
const createAppointment = async (payload: any): Promise<Object | null | any> => {
    debugger;
    const { error } = appointmentSchema.validate(payload);
    if (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Validation Error: ${error.details[0].message}`);
    }
    if(payload.patientId){
       const result =  await patient.get({
            patientId: payload.patientId,
            area:"iraq"
        }).go({ logger, ignoreOwnership: true });
        if (result.data == null) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid patientId');
        }
    } else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Patient Id is required !!')
    }

    //todo add checks if doctor exists or not
    await doctorScheduleService.fillSlot(payload.doctorId, payload.scheduleDate, payload.scheduleTime);
    payload.appointmentId =  uuidv4();
    payload.area = "iraq";
    await appointment.create(payload).go();
    return;
}

const getAppointment = async (id: string): Promise<Object | null> => {
    const result = await appointment.get({appointmentId: id, area: 'iraq'}).go();
    return result.data;
}

const getAccountAppointments = async (user: any, filter: any =  {period: ''}): Promise<any | null> => {

    /**
    const isPatientExist = await patientService.checkPatientExist({ user.sub });
    if (isPatientExist) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Patient Account is not found !!');
    }*/
    //todo add cognito check that this is valid doctor
    let condition = {status: enums.APPT_STATUS.Pending};
    let scheduleDate = moment().startOf('day').format('YYYY-MM-DD');
    let order: "asc" | "desc" = 'asc' ;
    
    if (filter.period == 'upcoming') {
        scheduleDate = moment().startOf('day').add(1, 'days').format('YYYY-MM-DD');
    }
    
    if (filter.period == 'past') {
        if (filter.month && filter.year) {
            scheduleDate = moment(`${filter.year}-${filter.month + 1}`, 'YYYY-MM').startOf('month').format('YYYY-MM-DD');
            condition = { status: enums.APPT_STATUS.Done };
            order = 'desc' as const;
        }
    }
    //todo improve this section
    const patients = await patient.query.byAccount({ subId: user.sub }).go();
    if (patients.data.length > 0) {
        const result = await Promise.all(patients.data.map(async (patient) => {
            const appointments = await appointment.query.byPatient({ patientId: patient.patientId }).gte({ scheduleDate }).where(
                (attr: any, op: any) => `
                    ${op.eq(attr.status, condition.status)} `,
            ).go({ order });
            return appointments.data;
        }));
        return result;
    }
    }

/** 
const getDoctorInvoices = async (doctorId: any): Promise<Payment[] | null> => {
    const { userId } = user;
    const result = await prisma.payment.findMany({
        where: 
    });
    return result;
}*/

const cancelAppointmentByDoctor = async (user:any, id: string, comment: string = ''): Promise<any> => {
    //todo add sns notiofication that apptv is cancelled
    // Get the record from database first
    const result = await appointment.patch({appointmentId: id, area: "iraq"
    }).set({status: "Canceled", comment: comment, actionBy: `doctor#${user.sub}`}).go({logger});
    // tslint:enable
    return result;

}

const cancelDoctorAppointmentsByTime = async (user:any, date: string, startTime: string, endTime: string): Promise<any> => {
    //todo add sns notiofication that apptv is cancelled
    // Get the record from database first
    const result = await appointment.query.byDoctor({ doctorId: user.sub, scheduleDate: date}).where(
        (attr, op) => `
          ${op.between(attr.scheduleTime, startTime, endTime)} AND  ${op.eq(attr.status, (enums.APPT_STATUS.Pending).toString())}`,).go();

    forEach(result.data, async (appt) => {
        await appointment.patch({appointmentId: appt.appointmentId, area: "iraq"
        }).set({status: "Canceled", comment: 'Doctor has cancelled his day schedule', actionBy: `doctor#${user.sub}`}).go({logger});
    });      
    return result.data;

}

const cancelDoctorAppointmentsByDate = async (user:any, date: string): Promise<any> => {
    //todo add sns notiofication that apptv is cancelled
    // Get the record from database first
    const result = await appointment.query.byDoctor({ doctorId: user.sub, scheduleDate: date}).
    where((attr: any, op: any) => `${op.eq(attr.status, enums.APPT_STATUS.Pending.toString())}`
    )
    .go();
    forEach(result.data, async (appt) => {
        await appointment.patch({appointmentId: appt.appointmentId, area: "iraq"
        }).set({status: "Canceled", comment: 'Doctor has cancelled his day schedule', actionBy: `doctor#${user.sub}`}).go({logger});
    });      
    return ;
}

const cancelAppointmentByPatient = async (user: any, id: string, comment: string = ''): Promise<any> => {
    //todo add sns notiofication that apptv is cancelled
    // Get the record from database first

    const result = await appointment.update({appointmentId: id, area: "iraq"
    }).set({status: "Canceled", comment: comment, actionBy: `patient#${user.sub}`}).go();
    // tslint:enable
    return result;
}

//doctor Side
/**
 * 
 * @param doctorId Get doctor appointments today, tomorrow, or in the past
 * @param filter 
 * @returns 
 */
const getDoctorAppointments = async (doctor: any, filter: any = {period: ''}): Promise<any> => {
    //todo add cognito check that this is valid doctor
    let condition = {status: enums.APPT_STATUS.Pending};
    let scheduleDate = moment().startOf('day').format('YYYY-MM-DD');
    let endDate = moment().startOf('day').add(1, 'days').format('YYYY-MM-DD');
    let order: "asc" | "desc" = 'asc' ;

    if (filter.period == 'today') {
        scheduleDate = moment().startOf('day').format('YYYY-MM-DD');
        endDate = moment().startOf('day').add(1, 'days').format('YYYY-MM-DD');
    }
    if (filter.period == 'thisweek') {
        scheduleDate = moment().startOf('day').add(1, 'days').format('YYYY-MM-DD');
        endDate = moment().startOf('day').add(8, 'days').format('YYYY-MM-DD');
    }

    if (filter.period == 'lastMonth' || filter.period == 'future') {
        if (filter.month && filter.year) {
            scheduleDate = moment(`${filter.year}-${filter.month}`, 'YYYY-MM').startOf('month').format('YYYY-MM-DD');
            endDate = moment(`${filter.year}-${filter.month}`, 'YYYY-MM').endOf('month').format('YYYY-MM-DD');
            condition = { status: filter.period === 'lastMonth' ? enums.APPT_STATUS.Done : enums.APPT_STATUS.Pending };
            order = 'desc' as const;
        } else {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Month and Year are required for past appointments');
        }
    }

}


/**
 * 
 * @param doctorId Get doctor appointments today, tomorrow, or in the past
 * @param filter 
 * @returns 
 */
const getDoctorAppointmentsByDate = async (doctor: any, date: string): Promise<any> => {
    //todo add cognito check that this is valid doctor
    const result = await appointment.query.byDoctor({ doctorId: doctor.sub, scheduleDate: date}).where(
        (attr, op) => `
          ${op.eq(attr.status, enums.APPT_STATUS.Pending.toString())} `,).go();
    return result.data;
}


/**
 * Update appointment time
 * @param id 
 * @param scheduleDate 
 * @param scheduleTime 
 */
const updateAppointmentTime = async(id: string, scheduleDate: any, scheduleTime: any): Promise<any> => {
    const appt = await getAppointment(id);
    if (appt) {
        const appointmentDateTime = moment(`${scheduleDate} ${scheduleTime}`);
        const currentDateTime = moment();
        const diffInHours = appointmentDateTime.diff(currentDateTime, 'hours');
        if (diffInHours <= 2) {
            throw new Error('Cannot update appointment time within 2 hours of the appointment');
        }
        const result = await appointment.patch({ appointmentId: id, area: "iraq" }).set({ scheduleDate, scheduleTime }).go();
        return result;
        //todo notify the doctor and the patient with new schedule
    } else {
        throw new Error('Appointment not found');
    }
}


/**
 * Update appointment time
 * @param id 
 * @param scheduleDate 
 * @param scheduleTime 
 */
const updateAppointmentTimeBySupport = async (id: string, scheduleDate: string, scheduleTime: string): Promise<any> => {
    const appt = await getAppointment(id);
    if (appt) {
        const result = await appointment.patch({ appointmentId: id, area: "iraq" }).set({ scheduleDate, scheduleTime }).go();
        return result;
        //todo notify the doctor and the patient with new schedule
    } else {
        throw new Error('Appointment not found');
    }
}

export const appointmentService = {
    createAppointment,
    getAppointment,
    cancelAppointmentByPatient,
    cancelAppointmentByDoctor,
    updateAppointmentTime,
    updateAppointmentTimeBySupport,
    getAccountAppointments,
    getDoctorAppointments,
    getDoctorAppointmentsByDate,
    cancelDoctorAppointmentsByTime,
    cancelDoctorAppointmentsByDate,
}

