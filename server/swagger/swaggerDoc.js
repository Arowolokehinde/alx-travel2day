import swaggerJSDoc from "swagger-jsdoc";
import userSchema from "./users/userSchema.js";
import userPath from "./users/userSwagger.js";
import authPath from "./auth/authSwagger.js";

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API documentation for the User Management system',
        },
        servers: [
            {
                url: 'http://localhost:5000', // Update with your server URL
            },
        ],
        components: {
            schemas: {
                ...userSchema,  // Include the User schema
                // Add other schemas similarly if needed
            },
        },
    },
    apis: [
        './../routes/userRoutes.js'
    ],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
export default swaggerDocs;
