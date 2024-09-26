import React, { useContext, useState } from 'react';
import ReviewCard from './ReviewCard'; // Import the ReviewCard component
import { BASE_URL } from '../config';
import { useNavigate, useParams } from "react-router-dom";
import useGetTour from '../hooks/useFetchData';
import { authContext } from '../context/AuthContext';
import ErrorPage from './Error';
import Loading from '../components/Loader/Loading';

const TourDetails = () =>
{
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, token } = useContext(authContext);


  const {
    data: tourData,
    loading,
    error
  } = useGetTour(`${BASE_URL}/tours/${id}`, null, false);

  const tour = tourData?.data?.data;



  const bookingHandler = async () =>
  {
    try
    {
      setCheckoutLoading(true);
      const res = await fetch(`${BASE_URL}/bookings/checkout-session/${tour.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok)
      {
        setCheckoutLoading(false);
        navigate("/checkout-fail");
        throw new Error(data.message + "Please try again");
      }

      if (data.session.url)
      {
        window.location.href = data.session.url
      }

      setCheckoutLoading(false);
      // navigate("/checkout-success");
    }
    catch (error)
    {
      // throw new Error(error)
      navigate("/checkout-fail")
      toast.error(error.message)
    }
  }


  const date = new Date(tour?.startDates[0]).toLocaleString('en-us', {
    month: 'long',
    year: 'numeric',
  });

  const paragraphs = tour?.description.split('\n');

  return (
    <main>
      {loading && <Loading />}
      {error && <ErrorPage />}
      {!loading && !error && (
        <>
          <section className="section-header">
            <div className="header__hero">
              <div className="header__hero-overlay">&nbsp;</div>
              <img
                className="header__hero-img"
                src={`/img/tours/${tour?.imageCover}`}
                alt={tour?.name}
              />
            </div>

            <div className="heading-box">
              <h1 className="heading-primary">
                <span>{`${tour?.name} tour`}</span>
              </h1>
              <div className="heading-box__group">
                <div className="heading-box__detail">
                  <svg className="heading-box__icon">
                    <use xlinkHref="/img/icons.svg#icon-clock"></use>
                  </svg>
                  <span className="heading-box__text">{`${tour?.duration} days`}</span>
                </div>
                <div className="heading-box__detail">
                  <svg className="heading-box__icon">
                    <use xlinkHref="/img/icons.svg#icon-map-pin"></use>
                  </svg>
                  <span className="heading-box__text">
                    {tour?.startLocation?.description}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="section-description">
            <div className="overview-box">
              <div>
                <div className="overview-box__group">
                  <h2 className="heading-secondary ma-bt-lg">Quick facts</h2>

                  <OverviewBox label="Next date" text={date} icon="calendar" />
                  <OverviewBox
                    label="Difficulty"
                    text={tour?.difficulty}
                    icon="trending-up"
                  />
                  <OverviewBox
                    label="Participants"
                    text={`${tour?.maxGroupSize} people`}
                    icon="user"
                  />
                  <OverviewBox
                    label="Rating"
                    text={`${tour?.ratingsAverage} / 5`}
                    icon="star"
                  />
                </div>

                <div className="overview-box__group">
                  <h2 className="heading-secondary ma-bt-lg">Your tour guides</h2>

                  {tour?.guides?.map((guide) => (
                    <div className="overview-box__detail" key={guide?.name}>
                      <img
                        className="overview-box__img"
                        src={`/img/users/${guide?.photo}`}
                        alt={guide?.name}
                      />
                      <span className="overview-box__label">
                        {guide?.role === 'lead-guide'
                          ? 'Lead guide'
                          : 'Tour guide'}
                      </span>
                      <span className="overview-box__text">{guide?.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="description-box">
              <h2 className="heading-secondary ma-bt-lg">
                About {tour?.name} tour
              </h2>
              {paragraphs?.map((p, index) => (
                <p className="description__text" key={index}>
                  {p}
                </p>
              ))}
            </div>
          </section>

          <section className="section-pictures">
            {tour?.images.map((img, i) => (
              <div className="picture-box" key={i}>
                <img
                  className={`picture-box__img picture-box__img--${i + 1}`}
                  src={`/img/tours/${img}`}
                  alt={`The Park Camper Tour ${i + 1}`}
                />
              </div>
            ))}
          </section>

          <section className="section-map">
            <img id="map" src="/img/map.png" alt="" />
            {/* <div id="map" data-locations={JSON.stringify(tour?.locations)}></div> */}
          </section>

          <section className="section-reviews">
            <div className="reviews">
              {tour?.reviews.map((review, index) => (
                <ReviewCard review={review} key={index} />
              ))}
            </div>
          </section>

          <section className="section-cta">
            <div className="cta">
              <div className="cta__img cta__img--logo">
                <img src="/img/logo-white.png" alt="Natours logo" />
              </div>
              <img
                className="cta__img cta__img--1"
                src={`/img/tours/${tour?.images[1]}`}
                alt="Tour picture"
              />
              <img
                className="cta__img cta__img--2"
                src={`/img/tours/${tour?.images[2]}`}
                alt="Tour picture"
              />
              <div className="cta__content">
                <h2 className="heading-secondary">What are you waiting for?</h2>
                <p className="cta__text">
                  {`${tour?.duration} days. 1 adventure. Infinite memories. Make it yours today!`}
                </p>

                {user ? (
                  <button
                    className="btn btn--green span-all-rows"
                    id="book-tour"
                    onClick={bookingHandler}
                    data-tour-id={tour?.id}
                  >
                    {loading ? <HashLoader size={25} color="#ffffff" /> : "Book tour now!"}
                  </button>
                ) : (
                  <a className="btn btn--green span-all-rows" href="/login">
                    Log in to book tour
                  </a>
                )}
              </div>
            </div>
          </section>
        </>
      )}

    </main>
  );
};

// Reusable OverviewBox component
const OverviewBox = ({ label, text, icon }) => (
  <div className="overview-box__detail">
    <svg className="overview-box__icon">
      <use xlinkHref={`/img/icons.svg#icon-${icon}`} />
    </svg>
    <span className="overview-box__label">{label}</span>
    <span className="overview-box__text">{text}</span>
  </div>
);

export default TourDetails;
