import React, { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from '../config';
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";
import * as Yup from 'yup';

const ResetPassword = () =>
{
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState(null);
  const navigate = useNavigate();
  const { token } = useParams();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });

  const schema = Yup.object().shape({
    password: Yup.string().required("Please enter your new password").min(6, "Password must be at least 6 characters long"),
    confirmPassword: Yup.string()
      .required("Please confirm your new password")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  const handleInputChange = e =>
  {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e =>
  {
    e.preventDefault();
    setLoading(true);

    try
    {
      await schema.validate(formData, { abortEarly: false });

      const res = await fetch(`${BASE_URL}/users/reset-password/${token}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok)
      {
        toast.success(result.message, { className: "toast-message" });
        setLoading(false);
        navigate("/login");  // Redirect to login page after success
      } else
      {
        toast.error(result.message, { className: "toast-message" });
        setLoading(false);
      }
    } catch (err)
    {
      if (err instanceof Yup.ValidationError)
      {
        const errors = {};
        err.inner.forEach(e =>
        {
          errors[e.path] = e.message;
        });
        setFormErrors(errors);
      } else
      {
        toast.error(err.message);
      }
      setLoading(false);
    }
  };

  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Reset your password</h2>
        <form className="form form--reset-password" onSubmit={handleSubmit}>

          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="password">
              New Password
            </label>
            <input
              name="password"
              className="form__input"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          {formErrors && formErrors.password && (
            <span className="input_error">{formErrors.password}</span>
          )}

          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              name="confirmPassword"
              className="form__input"
              type="password"
              placeholder="••••••••"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </div>
          {formErrors && formErrors.confirmPassword && (
            <span className="input_error">{formErrors.confirmPassword}</span>
          )}

          <div className="form__group">
            <button className="btn btn--green" type="submit">
              {loading ? <HashLoader size={35} color="#ffffff" /> : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ResetPassword;
