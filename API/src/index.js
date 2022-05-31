import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import filmeController from './controller/FilmesController.js'
import usuarioController from './controller/usuarioController.js'

const server = express();
server.use(cors());
server.use(express.json());


//Parte para rota da imagem
server.use('/strorage/capaFilmes',
express.static('strorage/capaFilmes'));

//Endpoits Config
server.use(usuarioController);
server.use(filmeController);

server.listen (process.env.PORT, () => console.log(`API online na porta ${process.env.PORT}`))