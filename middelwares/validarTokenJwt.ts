import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { RespostaPadraoMsg } from '../types/RespostaPadraoMsg';
import jwt, { JwtPayload } from "jsonwebtoken";
import { Query } from "mongoose";

export const validarTokenJwt = (handler: NextApiHandler) =>
    (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

        try {
            //VALIDAR CHAVE DE ACESSO
            const { MINHA_CHAVE_JWT } = process.env;
            if (!MINHA_CHAVE_JWT) {
                return res.status(500).json({ erro: 'ENV chave JWT não informada na execução!' });
            }

            //VERIFICAR SE VEIO PELO MENOS 1 HEADER(AUTORIZAÇÃO)
            if (!req || !req.headers) {
                return res.status(401).json({ erro: 'Não foi possível validar o token de acesso!' });
            }

            //VERIFICAR SE O MÉTODO HTTP É DIFERENTE DE OPTIONS, SENÃO SEGUE PRO FINAL
            if (req.method !== 'OPTIONS') {

                //VALIDAR SE VEIO O HEADER DE AUTORIZAÇÃO
                const authorization = req.headers['authorization'];
                if (!authorization) {
                    return res.status(401).json({ erro: 'Não foi possível validar o token de acesso!' });
                }

                //VALIDAR SE VEIO O TOKEN
                const token = authorization.substring(7);
                if (!token) {
                    return res.status(401).json({ erro: 'Não foi possível validar o token de acesso!' });
                }

                //USAR O JWT PRA VERIFICAR O TOKEN(MINHA_CHAVE_JWT), SENÃO RETORNA ERRO
                const decoded = jwt.verify(token, MINHA_CHAVE_JWT) as JwtPayload;
                if (!decoded) {
                    return res.status(401).json({ erro: 'Não foi possível validar o token de acesso!' });
                }

                //SE VIER O OBJETO VER SE TEM ALGUMA QUERY NA REQ, SE SIM OK, SENÃO CRIA 1
                if (!req.query) {
                    req.query = {};
                }
                //APÓS A QUERY CRIADA ADICIONA O USUÁRIO 
                req.query.userId = decoded._id;
            }
        } catch (error) {
            console.log(error);
            return res.status(401).json({ erro: 'Não foi possível validar o token de acesso!' });
        }
        return handler(req, res);
    }