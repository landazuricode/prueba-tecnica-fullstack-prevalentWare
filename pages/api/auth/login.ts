import { NextApiRequest, NextApiResponse } from 'next';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión con GitHub
 *     description: Autentica un usuario usando el código de autorización o token de GitHub
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             githubCode:
 *               summary: Login con código de autorización
 *               value:
 *                 githubCode: "abc123def456"
 *             githubToken:
 *               summary: Login con token de acceso
 *               value:
 *                 githubToken: "ghp_1234567890abcdef"
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             examples:
 *               success:
 *                 summary: Login exitoso
 *                 value:
 *                   message: "Hello World desde /api/auth/login - POST (GitHub)"
 *                   success: true
 *                   data:
 *                     user:
 *                       id: "1"
 *                       name: "Pepito Perez"
 *                       email: "pepito@github.com"
 *                       username: "pepitoperez"
 *                       avatar: "https://github.com/pepitoperez.png"
 *                       role: "ADMIN"
 *                       provider: "github"
 *                     token: "github-demo-token-12345"
 *                     expiresIn: "24h"
 *       400:
 *         description: Faltan credenciales de GitHub
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Hello World - Faltan credenciales de GitHub"
 *               error: "Código de autorización o token de GitHub requerido"
 *       405:
 *         description: Método no permitido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Hello World - Método no permitido"
 *               error: "Método GET no permitido"
 */
const LoginHandler = (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case 'POST':
      // Hello World - Procesar login con GitHub
      const { githubCode, githubToken } = req.body;

      if (!githubCode && !githubToken) {
        return res.status(400).json({
          message: 'Hello World - Faltan credenciales de GitHub',
          error: 'Código de autorización o token de GitHub requerido',
        });
      }

      // Simular validación de GitHub OAuth
      res.status(200).json({
        message: 'Hello World desde /api/auth/login - POST (GitHub)',
        success: true,
        data: {
          user: {
            id: '1',
            name: 'Pepito Perez',
            email: 'pepito@github.com',
            username: 'pepitoperez',
            avatar: 'https://github.com/pepitoperez.png',
            role: 'ADMIN',
            provider: 'github',
          },
          token: 'github-demo-token-12345',
          expiresIn: '24h',
        },
      });
      break;

    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).json({
        message: 'Hello World - Método no permitido',
        error: `Método ${method} no permitido`,
      });
  }
};

export default LoginHandler;
