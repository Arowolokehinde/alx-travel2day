import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../context/AuthContext';
import * as Yup from 'yup';
import { toast } from "react-toastify";
import { BASE_URL } from '../config';
import HashLoader from "react-spinners/HashLoader"

const EmailVerificationSent = () =>
{

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState(null);

  const navigate = useNavigate();
  const { activationToken, activation_Code } = useContext(authContext);

  const [verificationCode, setVerificationCode] = useState('');
  console.log(verificationCode)

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email!")
      .required("Please enter your email!")
  });


  const handleInputChange = (event) =>
  {
    setVerificationCode(event.target.value);
  };

  const handleSubmit = async (e) =>
  {
    e.preventDefault()
    setLoading(true);

    try
    {
      const res = await fetch(`${BASE_URL}/users/signup`, {
        method: 'post',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          activation_token: activationToken,
          activation_Code: activation_Code
        })
      })

      const result = await res.json();
      console.log(res)

      if (res.ok)
      {
        setLoading(false);

        // toast.success("Verification Successful")
        navigate("/verified");
      }
      else
      {
        // throw new Error(result.Error)
        toast.error(result.message, { className: "toast-message" });
        setLoading(false);
        // console.log(result);
      }

    }
    catch (err)
    {
      if (err instanceof Yup.ValidationError)
      {
        const errors = {};
        err.inner.forEach(e =>
        {
          errors[e.path] = e.message;
        });
        setFormErrors(errors);
      }
      else
      {
        toast.error(err.message);
      }
      setLoading(false)
    }

  };
  return (
    <main className="main">
      <div className="email-verified">
        <h2 className="heading-secondary ma-bt-lg">Check Your Email</h2>
        <p className="email-verified__text">
          A verification code has been sent to your email. Please enter it below:
        </p>

        <form onSubmit={handleSubmit} className="verification-form">
          <input
            type="text"
            value={verificationCode}
            onChange={handleInputChange}
            placeholder="Enter verification code"
            className="verification-input"
            required
          />
          {formErrors && formErrors.email && (
            <span className="input_error">{formErrors.email}</span>
          )}
          <button type="submit" className="btn btn-primary">
            {loading ? <HashLoader size={35} color="#ffffff" /> : "Verify Email"}
          </button>
        </form>

        <p className="email-verified__subtext">
          Didn’t receive the email? Make sure to check your spam folder or{' '}
          <a href="/resend-verification" className="email-verified__link">
            resend the verification email
          </a>.
        </p>
      </div>
    </main>
  );
};

export default EmailVerificationSent;
