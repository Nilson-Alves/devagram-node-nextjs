import type { NextApiRequest, NextApiResponse } from 'next';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import type { CadastroRequisicao } from '../../types/CadastroRequisicao';
import { UsuarioModel } from '../../models/UsuarioModel';
import { conectarMongoDB } from '../../middelwares/conectarMongoDB';
import md5 from 'md5';
import mongoose from 'mongoose';

const endpointCadastro =
    async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

        if (req.method === 'POST') {
            const usuario = req.body as CadastroRequisicao;

            if (!usuario.nome || usuario.nome.length < 2) {
                return res.status(400).json({ erro: 'Nome inválido' });
            }

            if (!usuario.email || usuario.email.length < 5
                || !usuario.email.includes('@')
                || !usuario.email.includes('.')) {
                return res.status(400).json({ erro: 'E-mail inválido' });
            }

            if (!usuario.senha || usuario.senha.length < 4) {
                return res.status(400).json({ erro: 'Senha inválida' });
            }

            //VALIDAR SE JÁ TEM E-MAIL CADASTRADO
            //SALVAR NA VARIÁVEL(userDuplicado) O RESULTADO NA BUSCA AO BANCO DE DADOS
            //(UsuarioModel.find) PELO EMAIL INFORMADO PELO USUÁRIO(req.body[usuario.email])
            const userDuplicado = await UsuarioModel.find({ email: usuario.email });
            if (userDuplicado && userDuplicado.length > 0) {
                return res.status(400).json({ erro: 'Já existe usuário para o email informado!' });
            }


            //SALVAR NO BANCO DE DADOS
            const userSalvar = {
                nome: usuario.nome,
                email: usuario.email,
                senha: md5(usuario.senha),
            }

            await UsuarioModel.create(userSalvar);
            return res.status(200).json({ mensagem: 'Usuário criado com sucesso!' });

        }
        return res.status(405).json({ erro: 'Método informado não é válido' });
    }
export default conectarMongoDB(endpointCadastro);
