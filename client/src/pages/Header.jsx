import React, { useContext, useEffect, useRef } from 'react';
import { authContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useGetProfile from "../hooks/useFetchData"
import { BASE_URL } from '../config';

const Header = () =>
{
  const headerRef = useRef(null)
  const { user, token, dispatch } = useContext(authContext);
  const { data: userData } = useGetProfile(`${BASE_URL}/users/me`);
  const profileUser = userData?.data?.data;

  console.log(user)
  const navigate = useNavigate()


  const handleLogout = () =>
  {
    dispatch({ type: "LOGOUT" })
    navigate("/")
  }

  const handleStickyHeader = () =>
  {
    window.addEventListener('scroll', () =>
    {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80)
      {
        headerRef?.current?.classList?.add('sticky_header');
      } else
      {
        headerRef?.current?.classList?.remove('sticky_header')
      }
    })
  }


  useEffect(() =>
  {
    handleStickyHeader()

    return () => window.removeEventListener('scroll', handleStickyHeader)
  });


  return (
    <header className="header flex items-center z-[1010] !py-10 !w-[100vw] dark:bg-[#011027] sm:pr-0 pl-6 bg-emerald-50" ref={headerRef}>
      <nav className="nav nav--tours">
        <a href="/" className="nav__el">All tours</a>
      </nav>
      <div className="header__logo">
        <img src="/img/logo-white.png" alt="Natours logo" />
      </div>
      <nav className="nav nav--user">
        {user ? (
          <div className='flex justify-between gap-x-5'>
            <a onClick={handleLogout} className=" nav__el !mt-4 sm:!mt-0">Log out</a>
            <a href="/me" className="nav__el">
              {profileUser?.photo && (
                <img
                  src={profileUser?.photo ? profileUser?.photo : " "}
                  // alt={`Photo of ${profileUser?.name ? profileUser?.name : user?.name}`}
                  className="nav__user-img"
                />
              )}

              <span className='hidden sm:flex'>
                {user?.name.split(' ')[0] ? user?.name.split(' ')[0] : profileUser?.name.split(' ')[0]}
              </span>
            </a>
          </div>
        ) : (
          <>
            <a href="/login" className="nav__el">Log in</a>
            <a href="/signup" className="nav__el nav__el--cta">Sign up</a>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
