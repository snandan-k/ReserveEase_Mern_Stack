import express from "express";
import { 
  sendReservation, 
  adminLogin, 
  adminRegister,
  getAllReservations, 
  updateReservationStatus 
} from "../controller/reservation.js";

const router = express.Router();

// User Route
router.post("/send", sendReservation);

// Admin Auth Routes
router.post("/admin/login", adminLogin);
router.post("/admin/signup", adminRegister);

// Admin Action Routes
router.get("/admin/all", getAllReservations);
router.put("/admin/status/:id", updateReservationStatus);

export default router;