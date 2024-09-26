const userSchema = {
    User: {
        type: 'object',
        properties: {
            _id: {
                type: 'string',
                description: 'Unique identifier for the user',
            },
            name: {
                type: 'string',
                description: 'User name',
            },
            email: {
                type: 'string',
                description: 'User email address',
                format: 'email',
            },
            password: {
                type: 'string',
                description: 'User password (hashed)',
            },
            passwordConfirm: {
                type: 'string',
                description: 'User password confirmation',
            },
            role: {
                type: 'string',
                description: 'User role (e.g., admin, user, guide)',
                enum: ['user', 'guide', 'lead-guide', 'admin'],
            },
            active: {
                type: 'boolean',
                description: 'Indicates if the user is active or deactivated',
                default: true,
            },
            photo: {
                type: 'string',
                description: 'URL of the user profile photo',
                default: 'default.jpg',
            },
            passwordChangedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Timestamp when the password was last changed',
            },
            passwordResetToken: {
                type: 'string',
                description: 'Token for resetting the password',
            },
            passwordResetExpires: {
                type: 'string',
                format: 'date-time',
                description: 'Expiration time for the password reset token',
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Timestamp when the user was created',
            },
        },
    },
};

export default userSchema;
