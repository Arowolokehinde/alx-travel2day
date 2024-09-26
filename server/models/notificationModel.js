import mongoose from "mongoose";
import validator from "validator";

const notificationSchema = mongoose.Schema(
  {
    createdBy: {
      type: String,
      required: [true, "Please provide your name"],
    },

    notificationType: {
      type: String,
      required: true,
      default: "request",
    },

    title: {
      type: String,
      required: [true, "Please provide a title for your request"],
    },

    message: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: [true, "Please provide your email address"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },

    status: {
      type: String,
      required: true,
      default: "unread",
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
