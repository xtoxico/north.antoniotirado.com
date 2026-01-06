import { Options } from 'swagger-jsdoc';

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'North API',
      version: '1.0.0',
      description: 'API for North - Goal Tracking & Habit Building Application',
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Goal: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            type: { type: 'string', enum: ['ELIMINATE_HABIT', 'BUILD_HABIT', 'ACHIEVEMENT'] },
          }
        },
        CreateGoalDto: {
            type: 'object',
             required: ['title', 'type', 'startDate'],
             properties: {
                 title: { type: 'string' },
                 description: { type: 'string' },
                 type: { type: 'string', enum: ['ELIMINATE_HABIT', 'BUILD_HABIT', 'ACHIEVEMENT'] },
                 startDate: { type: 'string', format: 'date-time' },
                 targetDate: { type: 'string', format: 'date-time' },
                 milestones: { type: 'array', items: { type: 'string' } }
             }
        }
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // We point to the route files. 
  // Note: Since we use webpack/nx, runtime paths might differ, but swagger-jsdoc parses source files usually.
  apis: ['./apps/api/src/app/routes/*.ts'], 
};
