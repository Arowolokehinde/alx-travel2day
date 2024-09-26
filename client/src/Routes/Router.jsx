import { Routes, Route } from 'react-router-dom';

import SignUp from '../pages/SignUp'
import ToursList from '../pages/ToursList';
import TourDetails from '../pages/TourDetails';
import EmailVerified from '../pages/EmailVerified';
import EmailVerificationSent from '../pages/EmailVerificationSent';
import UserSettings from '../pages/UserSettings';
import ResetPassword from '../pages/ResetPassword';
import Login from '../pages/Login';
import CheckoutSuccess from '../pages/CheckoutSucess';
import CheckoutFail from '../pages/CheckoutFail';


const Routers = () =>
{
  return <Routes>
    <Route path="/" element={<ToursList />} />
    <Route path="/home" element={<ToursList />} />
    <Route path="/tours" element={<ToursList />} />
    <Route path="/tours/:id" element={<TourDetails />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/verify" element={<EmailVerificationSent />} />
    <Route path="/verified" element={<EmailVerified />} />
    <Route path="/me" element={<UserSettings />} />
    <Route path="/reset-password/:token" element={<ResetPassword />} />
    <Route path="/checkout-success" element={<CheckoutSuccess />} />
    <Route path="/checkout-fail" element={<CheckoutFail />} />


  </Routes>
};

export default Routers;