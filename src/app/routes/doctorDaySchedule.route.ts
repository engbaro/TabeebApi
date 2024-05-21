import express from "express";
import { doctorDayScheduleController } from "../controllers/doctorDaySchedule.controller";
import auth from "../middlewares/auth";
import enums from "../enums";
const router = express.Router();
router.post("/",auth( enums.AuthUser.DOCTOR ), doctorDayScheduleController.createDaySchedule);
router.get("/:id",auth( enums.AuthUser.PATIENT, enums.AuthUser.DOCTOR ), doctorDayScheduleController.getDaySchedule);
router.delete("/:id", auth( enums.AuthUser.DOCTOR ), doctorDayScheduleController.cancelDaySchedule);
router.delete("/slots/:id", auth( enums.AuthUser.DOCTOR), doctorDayScheduleController.deleteSlotsfromDaySchedule);

router.post("/slots/:id", auth( enums.AuthUser.DOCTOR ), doctorDayScheduleController.addSlotsToDaySchedule);
router.get("/", auth( enums.AuthUser.PATIENT, enums.AuthUser.DOCTOR ), doctorDayScheduleController.getAvailableScheduleByPeriod);

export const doctorDayScheduleRouter = router;