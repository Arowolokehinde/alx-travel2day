import multer from "multer";
import sharp from "sharp";
import User from "./../models/userModel.js";
import catchAsync from "./../utils/catchAsync.js";
import AppError from "../errorHandlers/appError.js";
import
{
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../services/GenericService.js";
import Email from "../emails/email.js";

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) =>
  {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) =>
  {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  }
});

// const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) =>
{
  if (file.mimetype.startsWith("image"))
  {
    cb(null, true);
  } else
  {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single("photo");

export const resizeUserPhoto = catchAsync(async (req, res, next) =>
{
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) =>
{
  const newObj = {};
  Object.keys(obj).forEach((el) =>
  {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getMe = (req, res, next) =>
{
  req.params.id = req.user.id;
  next();
};

export const updateMe = catchAsync(async (req, res, next) =>
{
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm)
  {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // // 2) Filtered out unwanted fields names that are not allowed to be updated
  // const filteredBody = filterObj(req.body, "name", "email");
  // if (req.file) filteredBody.photo = req.file.filename;

   // 2) Filtered out unwanted fields names that are not allowed to be updated
   const filteredBody = filterObj(
    req.body,
    "name",
    "email",
    "photo"
  );

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "Profile updated successfully",
    data: {
      user: updatedUser,
    },
  });
});

export const deleteMe = catchAsync(async (req, res, next) =>
{
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const updateUserRole = catchAsync(async (req, res, next) =>
{
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      role: req.body.role,
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: user,
  });
});

export const reactivateAccount = catchAsync(async (req, res, next) =>
{
  const user = await User.findOne({ email: req.body.email }).setOptions({
    role: "admin",
  });

  if (!user)
    return next(
      new AppError(
        "Data not found. Please SignUp to get access to the resources",
        404
      )
    );

  if (user.active == true)
    return next(
      new AppError("Login to your Account. Your account is still active", 400)
    );

  user.active = true;
  await user.save({ validateBeforeSave: false });

  const data = {
    user: { name: user.name },
  };

  await new Email(user, data).accountReactivated();

  res.status(200).json({
    status: "success",
    data: user,
  });
});

export const createUser = (req, res) =>
{
  res.status(500).json({
    status: "error",
    message: "This route is not defined! Please use /signup instead",
  });
};

export const getUser = getOne(User);
export const getAllUsers = getAll(User);

// Do NOT update passwords with this!
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
