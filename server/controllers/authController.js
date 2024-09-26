import crypto from "crypto";
import jwt from "jsonwebtoken";
import
{
  SignInAccessToken,
  SignInRefreshToken,
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/sendToken.js";
import User from "../models/userModel.js";
import AppError from "../errorHandlers/appError.js";
import Email from "../emails/email.js";
import catchAsync from "../utils/catchAsync.js";

// Create Email verification token
export const createVerificationToken = (user) =>
{
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const verificationToken = jwt.sign(
    { user, activationCode },
    process.env.VERIFY_EMAIL_SECRET,
    {
      expiresIn: process.env.VERIFY_EMAIL_EXPIRES_IN,
    }
  );

  return { verificationToken, activationCode };
};

// Verify Account before saving it.
export const verifyAccount = catchAsync(async (req, res, next) =>
{
  const { name, email, password, confirmPassword } = req.body;

  const checkEmail = await User.findOne({ email });
  if (checkEmail) return next(new AppError("Email Already exists", 400));

  const user = {
    name,
    email,
    password,
    confirmPassword,
  };

  const { verificationToken, activationCode } = createVerificationToken(user);

  const data = {
    user: { name: user.name },
    activationCode
  };

  await new Email(user, data).activateRegistration();

  res.status(201).json({
    success: true,
    message: `Please check your email: ${user.email} to activate your account!`,
    activationCode,
    verificationToken,
  });
});

// Sign Up the user - persist user data to database
export const signUp = catchAsync(async (req, res, next) =>
{
  // 1) Getting token and check of it's there
  let verification_token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
  {
    verification_token = req.headers.authorization.split(" ")[1];
  } else
  {
    verification_token = req.body.activation_token;
  }

  const { activation_Code } = req.body;

  const newUser = jwt.verify(
    verification_token,
    process.env.VERIFY_EMAIL_SECRET
  );

  console.log(newUser)

  if (newUser.activationCode != activation_Code)
    return next(new AppError("Invalid token. Please try again", 401));

  const { name, email, password, confirmPassword } = newUser.user;

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm: confirmPassword,
  });

  const data = {
    user: { name: user.name },
    welcomeURL: `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/me`,
  };

  await new Email(user, data).welcome();

  sendToken(user, 201, res);
});

//Log user in and send token
export const login = catchAsync(async (req, res, next) =>
{
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password)
  {
    return next(new AppError("Please provide email and password!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password)))
  {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client
  sendToken(user, 200, res);
});

//logout User
export const logout = catchAsync(async (req, res, next) =>
{
  try
  {
    res.cookie("access_token", "", { maxAge: 1 });
    res.cookie("refresh_token", "", { maxAge: 1 });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err)
  {
    return next(new AppError(err.message, 400));
  }
});

// update access token
export const refreshToken = catchAsync(async (req, res, next) =>
{
  const refresh_token = req.cookies.refresh_token;

  const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN);

  const message = "Could not refresh token";
  if (!decoded) return next(new AppError(message, 400));

  const currentUser = await User.findById(decoded.id);

  if (!currentUser)
    return next(new AppError("Please login to access these resources!", 400));

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat))
  {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  const accessToken = SignInAccessToken(currentUser._id, "5m");
  const refreshToken = SignInRefreshToken(currentUser._id, "3d");

  req.user = currentUser;

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(200).json({
    status: "success",
    accessToken,
    refreshToken,
  });
});

// update password
export const updatePassword = catchAsync(async (req, res, next) =>
{
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword)
    return next(new AppError("Please provide your old and new passwords", 400));

  if (!confirmPassword)
    return next(new AppError("Please confirm your password", 400));

  // 1) Get user from collection
  const user = await User.findById(req.user._id).select("+password");

  if (user?.password === "undefined")
  {
    return next(new AppError("Invalid user", 400));
  }
  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(oldPassword, user.password)))
  {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) If so, update password
  user.password = newPassword;
  user.passwordConfirm = confirmPassword;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  res.status(200).json({
    success: true,
    message: "Password successfully updated",
    user,
  });
});

export const forgotPassword = catchAsync(async (req, res, next) =>
{
  // 1) Get user based on POSTed email
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user)
  {
    return next(new AppError("There is no user with email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try
  {
    const data = {
      user: { name: user.name },
      resetToken,
      resetURL: `${process.env.CLIENT_URL}/reset-password/${resetToken}`,
    };

    console.log(data.resetURL);

    await new Email(user, data).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err)
  {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) =>
{
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  console.log(hashedToken)

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user)
  {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  res.status(200).json({
    status: "success",
    message:
      "Password reset successful. Please, log in with your new password.",
  });
  // sendToken(user, 200, res);
});

// Only for rendered pages, no errors!
export const isLoggedIn = async (req, res, next) =>
{
  if (req.cookies.jwt)
  {
    try
    {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser)
      {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat))
      {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err)
    {
      return next();
    }
  }
  next();
};
