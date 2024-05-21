import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { appointmentService } from "../services/appointment.service";
import { appointment} from "../models/appointment.model";

const createAppointment = catchAsync(async (req: ExpressRequest, res: ExpressResponse) => {
    const result = await appointmentService.createAppointment(req.body);
    sendResponse(res, {
        statusCode: 200,
        message: 'Successfully Appointment Created !!',
        success: true,
        data: result
    })
})

const getAppointment = catchAsync(async (req: Request, res: Response) => {
    const result = await appointmentService.getAppointment(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        message: 'Successfully Get Appointment !!',
        success: true,
        data: result,
    })
})


const cancelAppointmentByPatient = catchAsync(async (req: Request, res: Response) => {
    const result = await appointmentService.cancelAppointmentByPatient(req.user, req.params.id);
    sendResponse<typeof appointment>(res, {
        statusCode: 200,
        message: 'Successfully Canceled Appointment !!',
        success: true,
        data: result,
    })
})
const cancelAppointmentByDoctor = catchAsync(async (req: Request, res: Response) => {
    const result = await appointmentService.cancelAppointmentByDoctor(req.user, req.params.id);
    sendResponse<typeof appointment>(res, {
        statusCode: 200,
        message: 'Successfully Canceled Appointment !!',
        success: true,
        data: result,
    })
})
/*const updateAppointment = catchAsync(async (req: Request, res: Response) => {
    const result = await AppointmentService.updateAppointment(req.params.id, req.body);
    sendResponse<appointment>(res, {
        statusCode: 200,
        message: 'Successfully Updated Appointment !!',
        success: true,
        data: result,
    })
})*/

/*const getPatientAppointmentById = catchAsync(async (req: Request, res: Response) => {
    const result = await AppointmentService.getPatientAppointmentById(req.user);
    sendResponse<appointment[]>(res, {
        statusCode: 200,
        message: 'Successfully Updated Appointment !!',
        success: true,
        data: result,
    })
})*/

const getDoctorAppointments = catchAsync(async (req: Request, res: Response) => {
    const result = await appointmentService.getDoctorAppointments(req.user, req.query);
    sendResponse(res, {
        statusCode: 200,
        message: 'Successfully Retrieve doctor apppointments !!',
        success: true,
        data: result
    })
})

const getAccountAppointments = catchAsync(async (req: Request, res: Response) => {
    const result = await appointmentService.getAccountAppointments(req.user, req.query);
    sendResponse(res, {
        statusCode: 200,
        message: 'Successfully Retrieve account apppointments !!',
        success: true,
        data: result
    })
})

const updateAppointmentTime = catchAsync(async (req: Request, res: Response) => {
    const result = await appointmentService.updateAppointmentTime(req.params.id, req.query.scheduleDate, req.query.scheduleTime);
    sendResponse(res, {
        statusCode: 200,
        message: 'Successfully updated apppointments !!',
        success: true,
        data: result
    })
})
/** 
const getDoctorPatients = catchAsync(async (req: Request, res: Response) => {
    const result = await AppointmentService.getDoctorPatients(req.user);
    sendResponse<Patient[]>(res, {
        statusCode: 200,
        message: 'Successfully retrieve doctor patients !!',
        success: true,
        data: result
    })
})*/
/*
const getPaymentInfoViaAppintmentId = catchAsync(async (req: Request, res: Response) => {
    const result = await AppointmentService.getPaymentInfoViaAppintmentId(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        message: 'Successfully retrieve payment info !!',
        success: true,
        data: result
    })
})*/
/*
const getPatientPaymentInfo = catchAsync(async (req: Request, res: Response) => {
    const result = await AppointmentService.getPatientPaymentInfo(req.user);
    sendResponse(res, {
        statusCode: 200,
        message: 'Successfully retrieve payment info !!',
        success: true,
        data: result
    })
})*/
/** 
const getDoctorInvoices = catchAsync(async (req: Request, res: Response) => {
    const result = await AppointmentService.getDoctorInvoices(req.user);
    sendResponse(res, {
        statusCode: 200,
        message: 'Successfully retrieve Doctor info!!',
        success: true,
        data: result
    })
})*/

export const AppointmentController = {
    getDoctorAppointments,
    //updateAppointmentByDoctor,
    //getPatientAppointmentById,
    //updateAppointment,
    createAppointment,
    //getAllAppointment,
    getAppointment,
    cancelAppointmentByPatient,
    cancelAppointmentByDoctor,
    updateAppointmentTime,
    getAccountAppointments
    //getDoctorPatients,
    //getPaymentInfoViaAppintmentId,
    //getPatientPaymentInfo,
    //getDoctorInvoices,
}


