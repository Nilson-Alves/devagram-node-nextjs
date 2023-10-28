import type { NextApiRequest, NextApiResponse, NextApiHandler }
    from "next";
import mongoose from "mongoose";
import { respostaPadraoMsg } from '../types/RespostaPadraoMsg';

export const conectarMongoDB = (handler: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {

        // VERIFICAR SE O BANCO ESTÁ CONECTADO E SEGUIR PARA O ENDPOINT OU PRÓXIMO
        // MIDDLEWARE
        if (mongoose.connections[0].readyState) {
            return handler(req, res);
        }

        //SE ESTIVER DESCONETADO, CONECTAR!
        //OBTER A VARIÁVEL PREENCHIDA DO ENV
        const { DB_CONEXAO_STRING } = process.env;

        //SE A VARIÁVEL(env) ESTIVER VAZIA AVISAR O PROGRAMADOR!
        if (!DB_CONEXAO_STRING) {
            return res.status(500).json({ erro: 'Configuração do BD não informada!' });
        }

        mongoose.connection.on('connected', () => console.log('MongoDB conectado!'));
        mongoose.connection.on('error', error => console.log(`Ocorreu um erro ao conectar: ${error}`));
        await mongoose.connect(DB_CONEXAO_STRING);

        //AGORA POSSO SEGUIR PARA O ENDPOINT, POIS CONECTEI AO BANCO!
        return handler(req, res);
    };