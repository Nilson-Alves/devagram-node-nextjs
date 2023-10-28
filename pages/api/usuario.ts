import type{NextApiRequest, NextApiResponse} from 'next';
import {validarTokenJwt} from '../../middelwares/validarTokenJwt';

const usuarioEndpoint = (req: NextApiRequest, res: NextApiResponse)=>{
    res.status(200).json('Usuário autenticado com sucesso!');
}
export default validarTokenJwt(usuarioEndpoint); 