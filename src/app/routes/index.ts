import express from 'express';
//import { ReviewRouter } from './reviews.route';
import { AppointmentRouter } from './appointment.route';
import { doctorDayScheduleRouter } from './doctorDaySchedule.route';
/**
    import { PrescriptionRouter } from './prescription.route';
    import { FavouriteRouter } from './favourites.route';
    
    import { BlogRoutes } from './blog.route';
    import { MedicineRouter } from './medicine.route';
*/
import { ContactRouter } from './contact.route';

const router = express.Router();


const moduleRoutes = [

    {
        path: '/schedule',
        route: doctorDayScheduleRouter,
    },
    /**
        {
            path: '/review',
            route: ReviewRouter,
        },
    */
    {
        path: '/appointment',
        route: AppointmentRouter,
    },
    /**
        {
            path: '/prescription',
            route: PrescriptionRouter,
        },
        {
            path: '/favourite',
            route: FavouriteRouter,
        },

        {
            path: '/blogs',
            route: BlogRoutes,
        },
        {
            path: '/medicine',
            route: MedicineRouter
        },
    */
    {
        path: '/contact',
        route: ContactRouter
    }
]
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
