import httpStatus from "http-status";
import ApiError from "../../errors/apiError";
import moment from "moment";
import { daySchedule } from '../models/doctorDaySchedule.model';
import {  appointmentService } from "./appointment.service";
import { v4 as uuidv4 } from 'uuid';

const createDaySchedule = async (user: any, payload: any): Promise<any> => {
    const sub: string = user.sub; // Explicitly specifying the type as string

    // check if date exist in dynamo db then add to the available timeslot
    // else 
    // check interval set
    // divide time selected by the interval
    // create time slot
    //create new timeslot
    //return result;

    const { date, interval, start,  end} = payload;

    // Check if date exists in DynamoDB
    //const isDateExist = await daySchedule.get({
       // doctorId: sub,
       // date: date,
     //   filled: false
   // });
const isDayExist = await daySchedule.query.byDoctor({ doctorId: sub, date: date }).go();

    if (isDayExist.data.length > 0) {

        // Add to the available timeslot
        // TODO: Implement logic to add to available timeslot
        addSlotsToDaySchedule(user, payload);
    } else {
        // Check interval set
        if (!interval) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Interval is required');
        }

        // Divide time selected by the interval
        let timeSlots: string[] = createTimeSlots({start, end}, interval);
        // Create time slots
            const result = await daySchedule.create({
                dayScheduleId:uuidv4(),
                date: date,
                interval: interval,
                doctorId: sub,
                filled: false,
                start: start,
                end: end,
                availableSlots: timeSlots,
                updatedAt: moment().unix()
            }).go();

        // Return result
        return result;
    }
}

const fillSlot = async (doctorId: any, date: string, time: string): Promise<any> => {
    const schedule = await daySchedule.query.byDoctor({ doctorId: doctorId, date: date }).where(
        (attr, op) => `
        ${op.contains(attr.availableSlots, time)}
    `).go();
    if (schedule.data.length > 0) {
        const availableSlots = schedule.data[0].availableSlots ?? [];
        const takenSlots = schedule.data[0].takenSlots ?? [];
        if (availableSlots.includes(time)) {
            availableSlots.splice(availableSlots.indexOf(time), 1);
            takenSlots.push(time);
            const result = await daySchedule.patch({ dayScheduleId: schedule.data[0].dayScheduleId })
                .set({ availableSlots, takenSlots }).go();
            return result;
        }
    } else {
        throw new ApiError(httpStatus.NOT_FOUND, 'Slot not found');
    }
    return null;
}
/**
 * creating timeslots
 * @param timeSelected 
 * @param interval 
 * @returns 
 */
const createTimeSlots =  (timeSelected: any, interval: number): string[] => { 
    // Divide time selected by the interval
    let startTime = moment(timeSelected.start, 'HH:mm');
    const endTime = moment(timeSelected.end, 'HH:mm');
    let timeSlots = [];
    while (startTime.isBefore(endTime)) {
        timeSlots.push(startTime.format('HH:mm'));
        startTime.add(interval, 'minutes');    
    }

    return timeSlots;
}

/**
 * Add timeslots to ech day schedule
 * @param user 
 * @param payload 
 * @returns 
 */
const addSlotsToDaySchedule = async (user: any, dayScheduleId: string, payload: any): Promise<any> => {
    // Get old day schedule from dynamodb
    const schedule = await daySchedule.get({dayScheduleId: dayScheduleId}).go();
    if (!schedule || !schedule.data) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Day Schedule not found');
    }
    let start: string = schedule.data.start;
    let end: string = schedule.data.end;
    if (start > payload.start) {
        start = payload.start;
    }
    if (end < payload.end) {
        end = payload.end;
    }

    let timeslots = createTimeSlots({start: payload.start, end: payload.end}, schedule.data.interval);
    // Update day schedule in dynamodb
    const result = await daySchedule.patch({ dayScheduleId: schedule.data.dayScheduleId })
        .set({ availableSlots: timeslots.concat(schedule.data.availableSlots || []), start, end }).go();
    // Return result
    return result;
}


/**
 * Add timeslots to ech day schedule
 * @param user 
 * @param payload 
 * @returns 
 */
const deleteSlotsfromDaySchedule = async (user: any, dayScheduleId: string, payload: any): Promise<any> => {
    // Get old day schedule from dynamodb

    const schedule = await daySchedule.get({dayScheduleId: dayScheduleId}).go();
    if (!schedule || !schedule.data) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Day Schedule not found');
    }
    // If earliest appointments were deleted then start time will be from when the next appointment is 
    let scheduleNewStart = schedule.data.start;
    let scheduleNewEnd = schedule.data.end;
    let availableSlots = schedule.data.availableSlots || [];
    
    // Filter out the time slots that fall within the specified range
    schedule.data.takenSlots = removeFromSlots(schedule.data.takenSlots || [], payload.start, payload.end);
    availableSlots = removeFromSlots(availableSlots, payload.start, payload.end);
    if (availableSlots.length === 0 && schedule.data.takenSlots?.length === 0) {
        // Delete the day schedule if no available slots and no taken slots
        const result = await daySchedule.delete({dayScheduleId: schedule.data.dayScheduleId}).go();
        return result;
    } else {
    // If deletion was from the middle    
    if (payload.start <= schedule.data.start) {
        scheduleNewStart = payload.end;
    }
    if (payload.end >= schedule.data.end) {
        scheduleNewEnd = payload.start;
    }
    let cancelApptResult = await appointmentService.cancelDoctorAppointmentsByTime(user, schedule.data.date, payload.start, payload.end);
    // Update day schedule in dynamodb
    if (cancelApptResult) {
        const result = await daySchedule.patch({ dayScheduleId: schedule.data.dayScheduleId })
        .set({ availableSlots: availableSlots, takenSlots: schedule.data.takenSlots, start:  scheduleNewStart, end: scheduleNewEnd}).go();
        return result;
        }
    }
    
}

/**
 * 
 * @param slots 
 * @param start 
 * @param end 
 */
const removeFromSlots =  (slots: string[], start: string, end: string): string[] => {
    return slots = slots.filter((slot: string) => {
        const slotTime = moment(slot, 'HH:mm');
        return slotTime.isBefore(moment(start, 'HH:mm')) || slotTime.isAfter(moment(end, 'HH:mm'));
    });
}

/**
 * 
 * @param user 
 * @param id 
 * @returns 
 */
const deleteSchedule = async (user: any, id: string): Promise<any> => {
    
    const schedule = await daySchedule.get({dayScheduleId: id}).go();
    if (!schedule || !schedule.data) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Day Schedule not found');
    }
    await appointmentService.cancelDoctorAppointmentsByDate(user, schedule.data.date);
    const result = await daySchedule.delete({dayScheduleId: id}).go();
    return result;
}


const getDaySchedule = async (user: any, date: string): Promise<any| null> => {
    //todo add cognito check that this is valid doctor
    const result = await daySchedule.query.byDoctor({ doctorId: user.sub, scheduleDate: date}).go();
    return result.data;
}
/**
 * 
 * @param doctorId 
 * @param period 
 * @returns 
 */
const getAvailableScheduleByPeriod = async (doctorId: string, startDate: string, endDate: string): Promise<any | null> => {
    //todo add cognito check that this is valid doctor
    const result = await daySchedule.query.byDoctor({ doctorId: doctorId }).between({ "date": startDate }, { "date": endDate }).
        where(
            (attr, op) => `
            ${op.eq(attr.filled, false)} 
        `,
        ).go();

        const scheduleByDate: any = {};

        result.data.forEach((schedule: any) => {
            const { date } = schedule;
            scheduleByDate[date] = schedule;
        });

    return scheduleByDate;
}

export const doctorScheduleService = {
    createDaySchedule,
    addSlotsToDaySchedule,
    deleteSlotsfromDaySchedule,
    getAvailableScheduleByPeriod,
    deleteSchedule,
    getDaySchedule,
    fillSlot
    
}