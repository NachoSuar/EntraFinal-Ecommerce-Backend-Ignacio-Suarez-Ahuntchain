import swaggerJsdoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Epcilon E-commerce',
      version: '1.0.0',
      description: 'API para un sistema de comercio electrónico. Esta API permite gestionar carritos de compra y productos.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Cart: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              description: 'User ID associated with the cart',
            },
            products: {
              type: 'array',
              items: {
                type: 'string',
                description: 'Product ID',
              },
            },
          },
        },
        Products: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Title of the product',
            },
            description: {
              type: 'string',
              description: 'Description of the product',
            },
            price: {
              type: 'number',
              description: 'Price of the product',
            },
            stock: {
              type: 'number',
              description: 'Stock of the product',
            },
            photo: {
              type: 'string',
              description: 'Photo URL of the product',
            },
            owner: {
              type: 'string',
              description: 'Owner email of the product',
            },
          },
        },
      },
    },
  };
  
  const options = {
    swaggerDefinition,
    apis: ['./routes/*.js', './dao/models/*.js'],
  };
  
  const swaggerSpec = swaggerJsdoc(options);
  
  export default swaggerSpec;
  
