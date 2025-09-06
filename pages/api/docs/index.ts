import { NextApiRequest, NextApiResponse } from 'next';
import { swaggerSpec } from '../../../lib/swagger';

const DocsHandler = (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      message: 'Método no permitido',
      error: `Método ${method} no permitido`,
    });
  }

  // Retornar la especificación OpenAPI en formato JSON
  res.status(200).json(swaggerSpec);
};

export default DocsHandler;
