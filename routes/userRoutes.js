import express from "express";
import
{
    forgotPassword,
    login,
    logout,
    refreshToken,
    resetPassword,
    signUp,
    updatePassword,
    verifyAccount,
} from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/protectRoutes.js";
import restrictTo from "../middlewares/roleManager.js";
import
{
    createUser,
    deleteMe,
    deleteUser,
    getAllUsers,
    getMe,
    getUser,
    reactivateAccount,
    resizeUserPhoto,
    updateMe,
    updateUser,
    updateUserRole,
    uploadUserPhoto,
} from "../controllers/userController.js";

const router = express.Router();


router.route("/verify-email").post(verifyAccount);

router.route("/signup").post(signUp);

router.route("/login").post(login);

router.route("/refresh-token").post(refreshToken);

router.route("/forgot-password").post(forgotPassword);

router.route("/reset-password/:token").patch(resetPassword);

// Ensure that all the routes below are authenticated
router.use(isAuthenticated);

router.route("/logout").post(logout);
router.route("/update-password").patch(updatePassword);
router.get("/me", getMe, getUser);
// router.patch("/update-me", uploadUserPhoto, resizeUserPhoto, updateMe);
router.patch("/update-me", updateMe);
router.delete("/delete-me", deleteMe);

// Restrict the endpoints below to admin access only
router.use(restrictTo("admin"));

router.route("/")
    .get(getAllUsers)
    .post(createUser);

router.route("/update-role/:id").patch(updateUserRole);
router.route("/re-activate-user").patch(reactivateAccount);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
