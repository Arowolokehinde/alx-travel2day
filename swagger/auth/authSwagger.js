const authPath = {
  '/api/vi/users/verify-email': {
    post: {
      summary: 'Verify account before saving it',
      description: 'Verifies a user’s account by checking the provided email and generating a verification token. Sends an email to the user for account verification.',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'The user’s name',
                  example: 'John Doe',
                },
                email: {
                  type: 'string',
                  description: 'The user’s email address',
                  example: 'johndoe@example.com',
                },
                password: {
                  type: 'string',
                  description: 'The user’s password',
                  example: 'password123',
                },
                passwordConfirm: {
                  type: 'string',
                  description: 'Confirmation of the password',
                  example: 'password123',
                },
              },
              required: ['name', 'email', 'password', 'passwordConfirm'],
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Account verification initiated. A verification email is sent to the user.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },
                  message: {
                    type: 'string',
                    example: 'Please check your email: johndoe@example.com to activate your account!',
                  },
                  token: {
                    type: 'string',
                    description: 'JWT token for verifying the email',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Bad request. Email already exists.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'fail',
                  },
                  message: {
                    type: 'string',
                    example: 'Email Already exists',
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  '/api/v1/users/signup/{verify_token}': {
    post: {
      summary: 'Sign up a new user',
      description: 'Sign up a new user by verifying the token and persisting the user data in the database.',
      parameters: [
        {
          name: 'verify_token',
          in: 'path',
          required: true,
          description: 'The verification token sent to the user’s email',
          schema: {
            type: 'string',
            example: 'abc123',
          },
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                authorization: {
                  type: 'string',
                  description: 'Bearer token from email verification',
                  example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
                },
              },
              required: ['authorization'],
            },
          },
        },
      },
      responses: {
        201: {
          description: 'User successfully signed up and persisted to the database. JWT token sent to the client.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },
                  token: {
                    type: 'string',
                    description: 'JWT token for the signed-up user',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
                  },
                  data: {
                    type: 'object',
                    properties: {
                      user: {
                        type: 'object',
                        properties: {
                          name: {
                            type: 'string',
                            description: 'Name of the new user',
                            example: 'John Doe',
                          },
                          email: {
                            type: 'string',
                            description: 'Email of the new user',
                            example: 'johndoe@example.com',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Invalid token or token does not match.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'fail',
                  },
                  message: {
                    type: 'string',
                    example: 'Invalid token. Please try again',
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  '/api/v1/users/login': {
    post: {
      summary: 'Log in a user',
      description: 'Logs in an existing user by checking their email and password, and sends a JWT token if authentication is successful.',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  description: 'Email address of the user',
                  example: 'johndoe@example.com',
                },
                password: {
                  type: 'string',
                  description: 'Password of the user',
                  example: 'password123',
                },
              },
              required: ['email', 'password'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'User logged in successfully, and JWT token returned.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },
                  token: {
                    type: 'string',
                    description: 'JWT token for the authenticated user',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
                  },
                  data: {
                    type: 'object',
                    properties: {
                      user: {
                        type: 'object',
                        properties: {
                          name: {
                            type: 'string',
                            description: 'Name of the user',
                            example: 'John Doe',
                          },
                          email: {
                            type: 'string',
                            description: 'Email of the user',
                            example: 'johndoe@example.com',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Bad request. Email or password not provided.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'fail',
                  },
                  message: {
                    type: 'string',
                    example: 'Please provide email and password!',
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized. Incorrect email or password.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'fail',
                  },
                  message: {
                    type: 'string',
                    example: 'Incorrect email or password',
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  '/api/v1/users/logout': {
    post: {
      summary: 'Logout a user',
      description: 'Logs out the user by clearing the access and refresh tokens.',
      responses: {
        200: {
          description: 'User logged out successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },
                  message: {
                    type: 'string',
                    example: 'Logged out successfully',
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Bad request. Error while logging out.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false,
                  },
                  message: {
                    type: 'string',
                    example: 'Error message here',
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  '/api/v1/users/refresh-token': {
    post: {
      summary: 'Refresh access token',
      description: 'Generates a new access token using the refresh token from cookies.',
      responses: {
        200: {
          description: 'Access token and refresh token refreshed successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'success',
                  },
                  accessToken: {
                    type: 'string',
                    description: 'New JWT access token for the authenticated user',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
                  },
                  refreshToken: {
                    type: 'string',
                    description: 'New JWT refresh token for the authenticated user',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Bad request. Could not refresh token or user not found.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'fail',
                  },
                  message: {
                    type: 'string',
                    example: 'Could not refresh token',
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized. User recently changed password or token is invalid.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'fail',
                  },
                  message: {
                    type: 'string',
                    example: 'User recently changed password! Please log in again.',
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  '/api/v1/users/update-password': {
    post: {
      summary: 'Update user password',
      description: 'Allows the user to update their password by providing the old password, new password, and a password confirmation.',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                oldPassword: {
                  type: 'string',
                  description: 'The current password of the user',
                  example: 'currentPassword123',
                },
                newPassword: {
                  type: 'string',
                  description: 'The new password the user wants to set',
                  example: 'newPassword123',
                },
                passwordConfirm: {
                  type: 'string',
                  description: 'Confirmation of the new password',
                  example: 'newPassword123',
                },
              },
              required: ['oldPassword', 'newPassword', 'passwordConfirm'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Password updated successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },
                  user: {
                    type: 'object',
                    description: 'Updated user details',
                    properties: {
                      _id: {
                        type: 'string',
                        example: '60b8d9d6e24d2e001f85b8c3',
                      },
                      name: {
                        type: 'string',
                        example: 'John Doe',
                      },
                      email: {
                        type: 'string',
                        example: 'johndoe@example.com',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Bad request. Missing or invalid parameters.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'fail',
                  },
                  message: {
                    type: 'string',
                    example: 'Please provide your old and new passwords',
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized. Current password is incorrect.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'fail',
                  },
                  message: {
                    type: 'string',
                    example: 'Your current password is wrong.',
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  '/api/v1/users/forgot-password': {
    post: {
      summary: 'Forgot password',
      description: 'Generates a password reset token and sends it to the user\'s email address.',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  description: 'Email address of the user requesting password reset',
                  example: 'johndoe@example.com',
                },
              },
              required: ['email'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Password reset token sent successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'success',
                  },
                  message: {
                    type: 'string',
                    example: 'Token sent to email!',
                  },
                },
              },
            },
          },
        },
        404: {
          description: 'User not found. No user with the provided email address.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'fail',
                  },
                  message: {
                    type: 'string',
                    example: 'There is no user with email address.',
                  },
                },
              },
            },
          },
        },
        500: {
          description: 'Internal server error. Issue sending the email.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'fail',
                  },
                  message: {
                    type: 'string',
                    example: 'There was an error sending the email. Try again later!',
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  '/api/v1/users/reset-password/{token}': {
    post: {
      summary: 'Reset user password',
      description: 'Resets the user\'s password using a valid reset token.',
      parameters: [
        {
          name: 'token',
          in: 'path',
          required: true,
          description: 'Password reset token sent to the user\'s email',
          schema: {
            type: 'string',
          },
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                password: {
                  type: 'string',
                  description: 'New password for the user',
                  example: 'newPassword123',
                },
                passwordConfirm: {
                  type: 'string',
                  description: 'Confirmation of the new password',
                  example: 'newPassword123',
                },
              },
              required: ['password', 'passwordConfirm'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Password reset successful.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'success',
                  },
                  message: {
                    type: 'string',
                    example: 'Password reset successful. Please, log in with your new password.',
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Bad request. Token is invalid or has expired.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'fail',
                  },
                  message: {
                    type: 'string',
                    example: 'Token is invalid or has expired',
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  '/api/v1/users/is-logged-in': {
    get: {
      summary: 'Check if user is logged in',
      description: 'Checks if the user is logged in by verifying the JWT token from cookies. Sets the current user in response locals if authenticated.',
      responses: {
        200: {
          description: 'User is logged in.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'success',
                  },
                  user: {
                    type: 'object',
                    properties: {
                      _id: {
                        type: 'string',
                        example: '60b8d9d6e24d2e001f85b8c3',
                      },
                      name: {
                        type: 'string',
                        example: 'John Doe',
                      },
                      email: {
                        type: 'string',
                        example: 'johndoe@example.com',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        204: {
          description: 'User is not logged in.',
        },
        500: {
          description: 'Internal server error. Unable to verify token.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'fail',
                  },
                  message: {
                    type: 'string',
                    example: 'Unable to verify token.',
                  },
                },
              },
            },
          },
        },
      },
    },
  }
};

export default authPath;

