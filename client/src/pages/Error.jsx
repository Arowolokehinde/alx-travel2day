import React from 'react';

const ErrorPage = ({ msg }) =>
{
  return (
    <main className="main">
      <div className="w-[100%] sm:w-[90vw] mx-auto text-center align-middle h-[40vh]">
        <div className="error__title">
          <h2 className="heading-secondary heading-secondary--error">
            Uh oh! Something went wrong!
          </h2>
          <h2 className="error__emoji">😢 🤯</h2>
        </div>
        <div className="error__msg">{msg}</div>
      </div>
    </main>
  );
};

export default ErrorPage;
