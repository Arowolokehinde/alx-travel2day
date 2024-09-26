import Notification from "../models/notificationModel.js";
import AppError from "../errorHandlers/appError.js";
import catchAsync from "../utils/catchAsync.js";
import { createOne, getAll } from "../services/GenericService.js";

export const setNotificationCreatedByAndEmail = (req, res, next) => {
  // Allow nested routes
  if (!req.body.createdBy) req.body.createdBy = req.user.name;
  if (!req.body.email) req.body.email = req.user.email;
  next();
};

export const createNotification = createOne(Notification);
export const getAllNotifications = getAll(Notification);

export const getNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) return next(new AppError("Data not found", 404));

  notification.status = "read";

  await notification.save();

  res.status(200).json({
    status: "Success",
    data: {
      data: notification,
    },
  });
});
