import express from "express";
import
  {
    getCheckoutSession,
    getAllBookings,
    createBooking,
    getBooking,
    updateBooking,
    deleteBooking,
  } from "./../controllers/bookingController.js";
import { isAuthenticated } from "../middlewares/protectRoutes.js";
import restrictTo from "../middlewares/roleManager.js";

const router = express.Router();

router.use(isAuthenticated);

router.post("/checkout-session/:tourId", getCheckoutSession);

router.use(restrictTo("admin", "lead-guide"));

router.route("/").get(getAllBookings).post(createBooking);

router.route("/:id").get(getBooking).patch(updateBooking).delete(deleteBooking);

export default router;
