import AppError from "../errorHandlers/appError.js";
import Review from "../models/reviewModel.js";
import Tour from "../models/tourModel.js";
import {
  createOne,
  getAll,
  getOne,
  updateOne,
} from "../services/GenericService.js";
import catchAsync from "../utils/catchAsync.js";

export const setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

export const getAllReviews = getAll(Review);
export const getReview = getOne(Review);
export const createReview = createOne(Review);

export const updateReview = updateOne(Review);

export const deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (!review) {
    return next(new AppError("No review found with that ID", 404));
  }

  const tour = await Tour.findById(review.tour);

  tour.ratingsQuantity -= 1;
  tour.ratingsAverage =
    (tour.ratingsAverage + review.rating) / tour.ratingsQuantity;

  await tour.save({ validateBeforeSave: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
