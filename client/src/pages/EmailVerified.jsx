import React from 'react';

const EmailVerified = () => {
  return (
    <main className="main">
      <div className="email-verified">
        <h2 className="heading-secondary ma-bt-lg">Email Verified Successfully!</h2>
        <p className="email-verified__text">
          Your email address has been successfully verified. You can now log in to your account.
        </p>
        <a href="/login" className="btn btn--green">
          Log In
        </a>
      </div>
    </main>
  );
};

export default EmailVerified;
