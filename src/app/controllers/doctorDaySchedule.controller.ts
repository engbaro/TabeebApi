import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { doctorScheduleService } from "../services/doctorDaySchedule.service";
import { daySchedule } from "../models/doctorDaySchedule.model";

const createDaySchedule = catchAsync(async (req: ExpressRequest, res: ExpressResponse) => {
    const result = await doctorScheduleService.createDaySchedule(req.user, req.body);
    sendResponse(res, {
        statusCode: 200,
        message: 'Successfully Created Day Schedule !!',
        success: true,
        data: result
    })
})

const getDaySchedule = catchAsync(async (req: Request, res: Response) => {
    const result = await doctorScheduleService.getDaySchedule(req.user, req.body);
    sendResponse(res, {
        statusCode: 200,
        message: 'Successfully returned !day schedule!',
        success: true,
        data: result
    })
})

const cancelDaySchedule = catchAsync(async (req: Request, res: Response) => {
    const result = await doctorScheduleService.deleteSchedule(req.user, req.params.id);
    sendResponse<any>(res, {
        statusCode: 200,
        message: 'Successfully Canceled day schedule !!',
        success: true,
        data: result,
    })
})
const deleteSlotsfromDaySchedule = catchAsync(async (req: Request, res: Response) => {
    const result = await doctorScheduleService.deleteSlotsfromDaySchedule(req.user, req.params.id, req.query);
    sendResponse< any>(res, {
        statusCode: 200,
        message: 'Successfully Canceled slots !!',
        success: true,
        data: result,
    })
})

const addSlotsToDaySchedule = catchAsync(async (req: Request, res: Response) => {
    const result = await doctorScheduleService.addSlotsToDaySchedule(req.user, req.params.id,req.body);
    sendResponse(res, {
        statusCode: 200,
        message: 'Successfully added slots !!',
        success: true,
        data: result
    })
})

const getAvailableScheduleByPeriod = catchAsync(async (req: Request, res: Response) => {
    const doctorId = req.query.doctorId?.toString() ?? "";
    const startDate = req.query.startDate?.toString() ?? "";
    const endDate = req.query.endDate?.toString() ?? "";
    
    const result = await doctorScheduleService.getAvailableScheduleByPeriod(doctorId, startDate, endDate);
    sendResponse(res, {
        statusCode: 200,
        message: 'Successfully Retrieved schedules !!',
        success: true,
        data: result
    })
})

export const doctorDayScheduleController = {
    createDaySchedule,
    getDaySchedule,
    getAvailableScheduleByPeriod,
    cancelDaySchedule,
    deleteSlotsfromDaySchedule,
    addSlotsToDaySchedule,
}


