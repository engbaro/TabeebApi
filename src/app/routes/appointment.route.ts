import express from 'express';
import { AppointmentController } from '../controllers/appointment.controller';
import auth from '../middlewares/auth';
import enums from '../enums';

const router = express.Router();

//router.get('/', AppointmentController.getAllAppointment);
//router.get('/patient/appointments', AppointmentController.getPatientAppointmentById);
//router.get('/patient/invoices', AppointmentController.getPatientPaymentInfo);
//router.get('/doctor/invoices', AppointmentController.getDoctorInvoices);
router.post('/', auth(enums.AuthUser.PATIENT, enums.AuthUser.DOCTOR), AppointmentController.createAppointment);
router.get('/bydoctor', auth(enums.AuthUser.DOCTOR), AppointmentController.getDoctorAppointments);
router.get('/:id', auth(enums.AuthUser.PATIENT, enums.AuthUser.DOCTOR), AppointmentController.getAppointment);
router.get('/patient', auth(enums.AuthUser.PATIENT), AppointmentController.getAccountAppointments);
router.delete('/:id', auth(enums.AuthUser.PATIENT), AppointmentController.cancelAppointmentByPatient);
router.delete('/bydoctor/:id', auth(enums.AuthUser.DOCTOR), AppointmentController.cancelAppointmentByDoctor);
router.put('/:id', auth(enums.AuthUser.PATIENT, enums.AuthUser.DOCTOR), AppointmentController.updateAppointmentTime);
//router.patch('/:id',AppointmentController.updateAppointment);
//router.patch('/doctor/update-appointment', AppointmentController.updateAppointmentByDoctor);
//router.get('/doctor/patients'), AppointmentController.getDoctorPatients);
//router.get('/patient-payment-info/:id', AppointmentController.getPaymentInfoViaAppintmentId);
//router.post('/tracking', AppointmentController.getAppointmentByTrackingId);

export const AppointmentRouter = router;