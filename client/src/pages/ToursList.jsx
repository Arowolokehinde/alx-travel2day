import React, { useEffect, useState } from 'react';
import ErrorPage from './Error';
import Loading from '../components/Loader/Loading';
import useFetchData from '../hooks/useFetchData';
import { BASE_URL } from '../config';

const toursList = () =>
{
  const [query, setQuery] = useState('');
  const [debounceQuery, setDebounceQuery] = useState("")


  const handleSearch = () =>
  {
    setQuery(query.trim());
    console.log('handle search')
  };

  useEffect(() =>
  {
    const timeout = setTimeout(() =>
    {
      setDebounceQuery(query)
    }, 700)

    return () => clearTimeout(timeout)
  }, [query])

  let data;

  if (debounceQuery === "")
  {
    data = useFetchData(`${BASE_URL}/tours`, null, false)
  }
  // else
  // {
  //   data = useFetchData(`${BASE_URL}/tour?s?quer{debounceQuery}`, null, false);
  // }

  const error = data?.error;
  const loading = data?.loading;
  const tours = data?.data;

  return (
    <main className="main">

      <div className="max-w-[110rem] mx-auto grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-7">

        {!error && loading && <Loading />}
        {!loading && error && <ErrorPage msg={error.message} />}

        {tours?.data?.data.map((tour) => (
          <div className="card" key={tour?.id}>
            <div className="card__header">
              <div className="card__picture">
                <div className="card__picture-overlay">&nbsp;</div>
                <img
                  className="card__picture-img"
                  src={`/img/tours/${tour?.imageCover}`}
                  alt={tour?.name}
                />
              </div>
              <h3 className="heading-tertirary">
                <span>{tour?.name}</span>
              </h3>
            </div>

            <div className="card__details">
              <h4 className="card__sub-heading">
                {`${tour?.difficulty} ${tour?.duration}-day tour?`}
              </h4>
              <p className="card__text">{tour?.summary}</p>

              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="/img/icons.svg#icon-map-pin"></use>
                </svg>
                <span>{tour?.startLocation?.description}</span>
              </div>

              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="/img/icons.svg#icon-calendar"></use>
                </svg>
                <span>
                  {new Date(tour?.startDates[0]).toLocaleString('en-us', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="/img/icons.svg#icon-flag"></use>
                </svg>
                <span>{`${tour?.locations.length} stops`}</span>
              </div>

              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="/img/icons.svg#icon-user"></use>
                </svg>
                <span>{`${tour?.maxGroupSize} people`}</span>
              </div>
            </div>

            <div className="card__footer">
              <p>
                <span className="card__footer-value">${tour?.price}</span>{' '}
                <span className="card__footer-text">per person</span>
              </p>
              <p className="card__ratings">
                <span className="card__footer-value">{tour?.ratingsAverage}</span>{' '}
                <span className="card__footer-text">
                  rating ({tour?.ratingsQuantity})
                </span>
              </p>
              <a
                className="btn btn--green btn--small"
                href={`/tours/${tour?.id}`}
              >
                Details
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default toursList;
