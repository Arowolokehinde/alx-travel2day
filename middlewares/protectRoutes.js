import catchAsync from "../utils/catchAsync.js";
import AppError from "../errorHandlers/appError.js";
import Jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const isAuthenticated = catchAsync(async (req, res, next) =>
{
  
  let access_token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
  {
    access_token = req.headers.authorization.split(" ")[1];
  } else
  {
    access_token = req.cookies.token;
  }

  if (!access_token)
    return next(new AppError("Please, login to access this resources", 401));

  const decoded = Jwt.verify(access_token, process.env.ACCESS_TOKEN);

  if (!decoded) return next(new AppError("Invalid Access Token", 400));

  const user = await User.findById(decoded.id);

  if (!user)
    return next(new AppError("Please login to access this resource", 400));

  // 4) Check if user changed password after the token was issued
  if (user.changedPasswordAfter(decoded.iat))
  {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  req.user = user;
  next();
});
