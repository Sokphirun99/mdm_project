import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'MDM Backend API',
    version: '2.0.0',
    description: 'Mobile Device Management API for Android devices',
    contact: {
      name: 'MDM Team',
      email: 'admin@example.com'
    }
  },
  servers: [
    { url: '/api', description: 'API Server' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' },
          code: { type: 'string' }
        }
      },
      Device: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          deviceId: { type: 'string' },
          deviceName: { type: 'string' },
          model: { type: 'string' },
          manufacturer: { type: 'string' },
          androidVersion: { type: 'string' },
          status: { 
            type: 'string', 
            enum: ['ENROLLED', 'PENDING', 'INACTIVE', 'COMPROMISED'] 
          },
          lastCheckin: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Command: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          deviceId: { type: 'string' },
          type: { 
            type: 'string', 
            enum: ['WIPE', 'LOCK', 'UNLOCK', 'REBOOT', 'LOCATION', 'INSTALL_APP', 'UNINSTALL_APP', 'APPLY_POLICY', 'SYNC'] 
          },
          status: { 
            type: 'string', 
            enum: ['PENDING', 'SENT', 'ACKNOWLEDGED', 'COMPLETED', 'FAILED', 'EXPIRED'] 
          },
          payload: { type: 'object' },
          result: { type: 'object' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        responses: {
          '200': {
            description: 'API is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean' },
                    timestamp: { type: 'string' },
                    version: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/auth/login': {
      post: {
        summary: 'Admin login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' },
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/devices': {
      get: {
        summary: 'List devices',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'status',
            in: 'query',
            schema: { type: 'string', enum: ['ENROLLED', 'PENDING', 'INACTIVE', 'COMPROMISED'] }
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 }
          },
          {
            name: 'offset',
            in: 'query',
            schema: { type: 'integer', minimum: 0, default: 0 }
          }
        ],
        responses: {
          '200': {
            description: 'List of devices',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    devices: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Device' }
                    },
                    total: { type: 'integer' },
                    limit: { type: 'integer' },
                    offset: { type: 'integer' }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Enroll device',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['deviceId', 'deviceName'],
                properties: {
                  deviceId: { type: 'string' },
                  deviceName: { type: 'string' },
                  fcmToken: { type: 'string' },
                  deviceInfo: { type: 'object' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Device enrolled successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Device' }
              }
            }
          }
        }
      }
    },
    '/devices/{id}': {
      get: {
        summary: 'Get device by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Device details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Device' }
              }
            }
          },
          '404': {
            description: 'Device not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/devices/{id}/wipe': {
      post: {
        summary: 'Send wipe command to device',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  confirmation: { type: 'boolean', description: 'Must be true to confirm wipe' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Wipe command sent',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Command' }
              }
            }
          },
          '400': {
            description: 'Invalid request or missing confirmation',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/devices/{id}/commands': {
      get: {
        summary: 'Get device commands',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          },
          {
            name: 'status',
            in: 'query',
            schema: { type: 'string', enum: ['PENDING', 'SENT', 'ACKNOWLEDGED', 'COMPLETED', 'FAILED', 'EXPIRED'] }
          }
        ],
        responses: {
          '200': {
            description: 'Device commands',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Command' }
                }
              }
            }
          }
        }
      }
    }
  }
};

export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
    explorer: true,
    customSiteTitle: 'MDM API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: '.swagger-ui .topbar { display: none }'
  }));
  
  // Also serve the raw OpenAPI spec
  app.get('/api-docs.json', (_req, res) => {
    res.json(openApiSpec);
  });
}
