import express from "express";
import { isAuthenticated } from "../middlewares/protectRoutes.js";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  setTourUserIds,
  updateReview,
} from "../controllers/reviewController.js";
import restrictTo from "../middlewares/roleManager.js";

const router = express.Router({ mergeParams: true });

router.use(isAuthenticated);

router
  .route("/")
  .get(getAllReviews)
  .post(restrictTo("user"), setTourUserIds, createReview);

router
  .route("/:id")
  .get(getReview)
  .patch(restrictTo("user", "admin"), updateReview)
  .delete(restrictTo("user", "admin"), deleteReview);

export default router;
