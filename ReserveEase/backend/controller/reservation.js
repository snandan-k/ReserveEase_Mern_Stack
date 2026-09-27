import ErrorHandler from "../middlewares/error.js";
import { Reservation } from "../models/reservation.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// Nodemailer Helper Function
const sendEmailNotification = async (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `Sn_k Restaurant <${process.env.SMTP_MAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

// 1. User Reservation Send Controller
export const sendReservation = async (req, res, next) => {
  const { firstName, lastName, email, date, time, phone } = req.body;

  if (!firstName || !lastName || !email || !date || !time || !phone) {
    return next(new ErrorHandler("Please Fill Full Reservation Form!", 400));
  }

  try {
    await Reservation.create({ firstName, lastName, email, date, time, phone });
    res.status(201).json({
      success: true,
      message: "Reservation Sent Successfully!",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return next(new ErrorHandler(validationErrors.join(", "), 400));
    }
    return next(error);
  }
};

// 2. Admin Register Controller
export const adminRegister = async (req, res, next) => {
  try {
    const { email, password, secretCode } = req.body;

    if (!email || !password || !secretCode) {
      return next(new ErrorHandler("Please fill all fields!", 400));
    }

    if (secretCode !== "Savita_Nandan_2026") {
      return next(new ErrorHandler("Invalid Admin Secret Code!", 403));
    }

    const token = jwt.sign(
      { role: "admin", email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      success: true,
      message: "Admin Account Created Successfully!",
      token,
    });
  } catch (error) {
    return next(error);
  }
};

// 3. Admin Login Controller
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please Provide Email And Password!", 400));
    }

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        success: true,
        message: "Admin Logged In Successfully!",
        token,
      });
    } else {
      return next(new ErrorHandler("Invalid Admin Email or Password!", 401));
    }
  } catch (error) {
    return next(error);
  }
};

// 4. Admin Feature: Fetch All Reservations
export const getAllReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      reservations,
    });
  } catch (error) {
    return next(error);
  }
};

// 5. Admin Feature: Update Status & Send Email Notification
export const updateReservationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!reservation) {
      return next(new ErrorHandler("Reservation not found!", 404));
    }

    // Email Message Body Setup
    let messageText = "";
    if (status === "Approved") {
      messageText = `Hello ${reservation.firstName},\n\nYour reservation at Sn_k for ${reservation.date} at ${reservation.time} has been APPROVED!\n\nWe look forward to hosting you.\n\nBest regards,\nSn_kRestaurant Team`;
    } else if (status === "Rejected") {
      messageText = `Hello ${reservation.firstName},\n\nWe regret to inform you that your reservation request at Sn_k Restaurant for ${reservation.date} at ${reservation.time} has been REJECTED due to unavailability.\n\nSorry for the inconvenience.\n\nBest regards,\nSn_k Restaurant Team`;
    } else {
      messageText = `Hello ${reservation.firstName},\n\nYour reservation status has been updated to ${status}.`;
    }

    // Send Email
    try {
      await sendEmailNotification({
        email: reservation.email,
        subject: `Sn_k - Booking ${status}`,
        message: messageText,
      });
      console.log(`Email successfully sent to ${reservation.email}`);
    } catch (emailErr) {
      console.error("Failed to send email:", emailErr.message);
    }

    res.status(200).json({
      success: true,
      message: `Reservation status updated to ${status} and email notification sent!`,
      reservation,
    });
  } catch (error) {
    return next(error);
  }
};