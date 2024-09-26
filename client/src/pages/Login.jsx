import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../context/AuthContext';
import { toast } from "react-toastify";
import { BASE_URL } from '../config';
import * as Yup from 'yup';
import PasswordForgot from '../pages/PasswordForgot';
import HashLoader from 'react-spinners/HashLoader';

const Login = () =>
{
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  const [showOverlay, setShowOverlay] = useState(false);
  const [formErrors, setFormErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const navigate = useNavigate();
  const { dispatch } = useContext(authContext);

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email!")
      .required("Please enter your email!"),
    password: Yup.string().required("Please enter your password!").min(6)
  });

  const handleForgotPassword = () =>
  {
    setIsModalOpen(!isModalOpen);
    setShowOverlay(true)
  }

  const handleCloseForgotPasswordForm = () =>
  {
    setIsModalOpen(!isModalOpen);
    setShowOverlay(false)
  }

  // Close modal when clicking outside of it
  useEffect(() =>
  {
    const handleClickOutside = (event) =>
    {
      if (modalRef.current && !modalRef.current.contains(event.target))
      {
        handleCloseForgotPasswordForm();
      }
    };

    if (isModalOpen)
    {
      document.addEventListener("mousedown", handleClickOutside);

      if (inputRef.current)
      {
        inputRef.current.focus();
      }
    } else
    {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () =>
    {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  // Prevent tabbing out of the modal when open
  useEffect(() =>
  {
    const handleTabKey = (e) =>
    {
      if (isModalOpen && modalRef.current)
      {
        const focusableElements = modalRef.current.querySelectorAll('input, button');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement)
        {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement)
        {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    if (isModalOpen)
    {
      document.addEventListener('keydown', (e) =>
      {
        if (e.key === 'Tab')
        {
          handleTabKey(e);
        }
      });
    }

    return () =>
    {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isModalOpen]);


  const handleInputChange = e =>
  {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e =>
  {

    e.preventDefault()
    setLoading(true);

    try
    {
      await schema.validate(formData, { abortEarly: false });

      const res = await fetch(`${BASE_URL}/users/login`, {
        method: 'post',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const result = await res.json();

      if (res.ok)
      {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: result.user,
            accessToken: result.accessToken,
          }
        })
        setLoading(false);

        toast.success("Log in successful", { className: "toast-message" })
        navigate("/");
      }
      else
      {
        // throw new Error(result.Error)
        toast.error(result.message, { className: "toast-message" });
        setLoading(false);
        console.log(result);
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
        // toast.error(err.data.message);
        console.log(err);
      }
      setLoading(false)
    }

  }


  return (
    <main className="main">
      <div className={`login-form  sm:w-[57rem] ${isModalOpen ? 'pointer-events-none' : ''}`}>
        <h2 className="heading-secondary ma-bt-lg">Log into your account</h2>
        <form className="form form--login" onSubmit={handleSubmit}>
          <div className="form__group">
            <label className="form__label" htmlFor="email">
              Email address
            </label>
            <input
              name="email"
              className="form__input"
              type="email"
              placeholder="you@example.com"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="password">
              Password
            </label>
            <input
              name="password"
              className="form__input"
              type="password"
              placeholder="••••••••"
              required
              minLength="8"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          <div className="form__group">
            <button className="btn btn--green" type="submit">
              {loading ? <HashLoader size={35} color="#ffffff" /> : "Login"}
            </button>
          </div>

          <div className="form__group">
            <p className="form__text">
              Don't have an account yet?{'  '}
              <a href="/signup" className="form__link mx-2">
                Register
              </a>
              or
              <button onClick={handleForgotPassword} className="form__link ml-2">
                Reset Password
              </button>
            </p>
          </div>

        </form>
      </div>

      {showOverlay && (<div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-2 flex justify-center items-center `}></div>)}
      {isModalOpen && (< div ref={modalRef} className="p-4 md:p-5 text-center">
        <PasswordForgot onClick={handleCloseForgotPasswordForm} close={handleCloseForgotPasswordForm} ref={inputRef} />
      </div>
      )
      }
    </main>
  );
};

export default Login;
