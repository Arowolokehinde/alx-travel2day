const userPath = {
    '/api/v1/users/me': {
        get: {
            summary: 'Get current user',
            description: 'Fetches the details of the currently logged-in user.',
            responses: {
                200: {
                    description: 'User details retrieved successfully.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: {
                                        type: 'string',
                                        example: 'success',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
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
                    },
                },
                401: {
                    description: 'Unauthorized. User not logged in.',
                },
            },
        },
    },

    '/api/v1/users/update-me': {
        patch: {
            summary: 'Update current user information',
            description: 'Updates the user’s name and email, but not the password.',
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string',
                                    example: 'Jane Doe',
                                },
                                email: {
                                    type: 'string',
                                    example: 'janedoe@example.com',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'User updated successfully.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: {
                                        type: 'string',
                                        example: 'success',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            user: {
                                                type: 'object',
                                                properties: {
                                                    _id: {
                                                        type: 'string',
                                                        example: '60b8d9d6e24d2e001f85b8c3',
                                                    },
                                                    name: {
                                                        type: 'string',
                                                        example: 'Jane Doe',
                                                    },
                                                    email: {
                                                        type: 'string',
                                                        example: 'janedoe@example.com',
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
                    description: 'Bad request. Password update attempted.',
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
                                        example: 'This route is not for password updates. Please use /updateMyPassword.',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },

    '/api/v1/users/delete-me': {
        delete: {
            summary: 'Delete current user account',
            description: 'Deactivates the current user account.',
            responses: {
                204: {
                    description: 'User account deactivated successfully.',
                },
                401: {
                    description: 'Unauthorized. User not logged in.',
                },
            },
        },
    },

    '/api/v1/users/update-role/{id}': {
        patch: {
            summary: 'Update user role',
            description: 'Updates the role of a specified user by ID.',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID of the user whose role is to be updated',
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
                                role: {
                                    type: 'string',
                                    example: 'admin',
                                },
                            },
                            required: ['role'],
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'User role updated successfully.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: {
                                        type: 'string',
                                        example: 'success',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                                example: '60b8d9d6e24d2e001f85b8c3',
                                            },
                                            role: {
                                                type: 'string',
                                                example: 'admin',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                404: {
                    description: 'User not found.',
                },
            },
        },
    },

    '/api/v1/users/reactivate-account': {
        post: {
            summary: 'Reactivate a user account',
            description: 'Reactivates a previously deactivated user account using the email address.',
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                email: {
                                    type: 'string',
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
                    description: 'Account reactivated successfully.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: {
                                        type: 'string',
                                        example: 'success',
                                    },
                                    data: {
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
                                            active: {
                                                type: 'boolean',
                                                example: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                404: {
                    description: 'User not found. Please sign up to access resources.',
                },
                400: {
                    description: 'Bad request. Account is still active.',
                },
            },
        },
    },

    '/api/v1/users/create': {
        post: {
            summary: 'Create a new user',
            description: 'This route is not defined. Please use /signup instead.',
            responses: {
                500: {
                    description: 'Error. This route is not defined.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: {
                                        type: 'string',
                                        example: 'error',
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'This route is not defined! Please use /signup instead',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },

    '/api/v1/users/{id}': {
        get: {
            summary: 'Get user by ID',
            description: 'Fetches user details by user ID.',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID of the user to retrieve',
                    schema: {
                        type: 'string',
                    },
                },
            ],
            responses: {
                200: {
                    description: 'User details retrieved successfully.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: {
                                        type: 'string',
                                        example: 'success',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
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
                    },
                },
                404: {
                    description: 'User not found.',
                },
            },
        },
    },

    '/api/v1/users': {
        get: {
            summary: 'Get all users',
            description: 'Fetches a list of all users.',
            responses: {
                200: {
                    description: 'List of users retrieved successfully.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: {
                                        type: 'string',
                                        example: 'success',
                                    },
                                    data: {
                                        type: 'array',
                                        items: {
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
                },
            },
        },
    }
}

export default userPath;