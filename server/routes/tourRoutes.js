import express from "express";
import
{
  aliasTopTours,
  createTour,
  deleteTour,
  getAllTours,
  getDistances,
  getMonthlyPlan,
  getTour,
  getTourStats,
  getToursWithin,
  updateTour,
} from "../controllers/tourController.js";
import { isAuthenticated } from "../middlewares/protectRoutes.js";
import restrictTo from "../middlewares/roleManager.js";
import reviewRouter from "../routes/reviewRoutes.js";

const router = express.Router();

router.use("/:tourId/reviews", reviewRouter);

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router.route("/distances/:latlng/unit/:unit").get(getDistances);

router.route("/tour-stats").get(getTourStats);

router
  .route("/monthly-plan/:year")
  .get(
    isAuthenticated,
    restrictTo("admin", "lead-guide", "guide"),
    getMonthlyPlan
  );

router
  .route("/")
  .get(getAllTours)
  .post(isAuthenticated, restrictTo("admin", "lead-guide"), createTour);

router
  .route("/:id")
  .get(getTour)
  .patch(isAuthenticated, restrictTo("admin", "lead-guide"), updateTour)
  .delete(isAuthenticated, restrictTo("admin", "lead-guide"), deleteTour);

export default router;
