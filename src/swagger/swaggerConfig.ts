import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express TypeScript API with Swagger",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/*.ts"], // files containing annotations as above
};

export const swaggerSpec = swaggerJsdoc(options);
