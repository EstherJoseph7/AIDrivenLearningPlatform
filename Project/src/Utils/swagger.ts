import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'AI-Driven Learning Platform API',
            version: '1.0.0',
            description: 'REST API for the AI-Driven Learning Platform',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{ bearerAuth: [] }],
        tags: [
            { name: 'Auth', description: 'Authentication endpoints' },
            { name: 'User', description: 'User endpoints' },
            { name: 'Admin', description: 'Admin endpoints' },
        ],
        paths: {
            '/auth/register': {
                post: {
                    tags: ['Auth'],
                    summary: 'Register a new user',
                    security: [],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['userId', 'name', 'phone', 'password'],
                                    properties: {
                                        userId: { type: 'string', example: '123456789' },
                                        name: { type: 'string', example: 'Israel Cohen' },
                                        phone: { type: 'string', example: '0501234567' },
                                        password: { type: 'string', example: 'Pass1234' },
                                        adminSecret: { type: 'string', example: '123456' },
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'User created successfully' },
                        400: { description: 'Validation error' },
                    }
                }
            },
            '/auth/login': {
                post: {
                    tags: ['Auth'],
                    summary: 'Login and receive JWT token',
                    security: [],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['userId', 'password'],
                                    properties: {
                                        userId: { type: 'string', example: '123456789' },
                                        password: { type: 'string', example: 'Pass1234' },
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Login successful, returns JWT token' },
                        401: { description: 'Invalid credentials' },
                    }
                }
            },
            '/user/categories': {
                get: {
                    tags: ['User'],
                    summary: 'Get all categories',
                    responses: {
                        200: { description: 'List of categories' },
                        404: { description: 'No categories found' },
                    }
                }
            },
            '/user/subcategories/{category_id}': {
                get: {
                    tags: ['User'],
                    summary: 'Get sub-categories by category',
                    parameters: [{
                        name: 'category_id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' }
                    }],
                    responses: {
                        200: { description: 'List of sub-categories' },
                        404: { description: 'No sub-categories found' },
                    }
                }
            },
            '/user/prompts': {
                post: {
                    tags: ['User'],
                    summary: 'Send a prompt to AI and save the lesson',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['category_id', 'sub_category_id', 'prompt'],
                                    properties: {
                                        category_id: { type: 'string' },
                                        sub_category_id: { type: 'string' },
                                        prompt: { type: 'string', example: 'Teach me about black holes' },
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Lesson generated and saved' },
                        400: { description: 'Missing required fields' },
                    }
                }
            },
            '/user/prompts/my-history': {
                get: {
                    tags: ['User'],
                    summary: 'Get learning history of the logged-in user',
                    responses: {
                        200: { description: 'List of prompts and lessons' },
                        404: { description: 'No prompts found' },
                    }
                }
            },
            '/admin/users': {
                get: {
                    tags: ['Admin'],
                    summary: 'Get all users',
                    responses: {
                        200: { description: 'List of all users' },
                        403: { description: 'Forbidden' },
                    }
                }
            },
            '/admin/prompts': {
                get: {
                    tags: ['Admin'],
                    summary: 'Get all prompts history',
                    responses: {
                        200: { description: 'List of all prompts' },
                        403: { description: 'Forbidden' },
                    }
                }
            },
            '/admin/prompts/{user_id}': {
                get: {
                    tags: ['Admin'],
                    summary: 'Get prompt history by user',
                    parameters: [{
                        name: 'user_id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' }
                    }],
                    responses: {
                        200: { description: 'List of prompts for the user' },
                        404: { description: 'No prompts found' },
                    }
                }
            },
            '/admin/categories': {
                post: {
                    tags: ['Admin'],
                    summary: 'Create a new category',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name'],
                                    properties: {
                                        name: { type: 'string', example: 'Science' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Category created' },
                        400: { description: 'Name is required' },
                    }
                }
            },
            '/admin/subcategories': {
                post: {
                    tags: ['Admin'],
                    summary: 'Create a new sub-category',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name', 'category_id'],
                                    properties: {
                                        name: { type: 'string', example: 'Space' },
                                        category_id: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Sub-category created' },
                        400: { description: 'Name and category_id are required' },
                    }
                }
            },
        }
    },
    apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
