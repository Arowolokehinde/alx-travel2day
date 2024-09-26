import express from "express";
import {
  createNotification,
  getAllNotifications,
  getNotification,
  setNotificationCreatedByAndEmail,
} from "../controllers/NotificationController.js";
import { isAuthenticated } from "../middlewares/protectRoutes.js";
import restrictTo from "../middlewares/roleManager.js";

const router = express.Router({ mergeParams: true });

router.route("/").post(createNotification);

router.use(isAuthenticated);

router
  .route("/with-auth")
  .post(setNotificationCreatedByAndEmail, createNotification);

router.use(restrictTo("admin"));

router.route("/").get(getAllNotifications);
router.route("/:id").get(getNotification);

export default router;
