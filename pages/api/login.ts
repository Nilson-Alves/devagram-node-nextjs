import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMongoDB } from '../../middelwares/conectarMongoDB';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { UsuarioModel } from '../../models/UsuarioModel';
import { LoginResposta } from '../../types/LoginResposta';
import md5 from 'md5';
import jwt from 'jsonwebtoken';

const endpointLogin = async (
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraoMsg | LoginResposta>
) => {
    const { MINHA_CHAVE_JWT } = process.env;
    if (!MINHA_CHAVE_JWT) {
        return res.status(500).json({ erro: 'ENV jwt não informada!' });
    }

    if (req.method === 'POST') {
        const { login, senha } = req.body;

        const usuarioEncontrado = await UsuarioModel.find({ email: login, senha: md5(senha) })
        if (usuarioEncontrado && usuarioEncontrado.length > 0) {
            const userBanco = usuarioEncontrado[0];

            const token = jwt.sign({ _id: userBanco._id }, MINHA_CHAVE_JWT);
            return res.status(200).json({
                nome: userBanco.nome,
                email: userBanco.email,
                token
            });
        }
        return res.status(400).json({ erro: 'Verifique se usuário e senha estão corretos!' });
    }
    return res.status(405).json({ erro: 'Método informado não é válido' });
}

export default conectarMongoDB(endpointLogin);