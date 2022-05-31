import { Router } from "express"
import { cadastrarFilme } from "../repository/filmesrepository.js"

const server = Router();

server.post('/filme' , async (req,resp) => {
    try {
     const FilmeParaCadastrar = req.body;
     if(!FilmeParaCadastrar.nome) throw new Error ("Nome é OBRIGATÓRIO!")
     if(!FilmeParaCadastrar.sinopse) throw new Error ("Sinopse do Filme é OBRIGATÓRIO!")
     if(FilmeParaCadastrar.avaliacao == undefined || FilmeParaCadastrar.avaliacao < 0) throw new Error ("Avaliação do filme é OBRIGATÓRIO!")
     if(!FilmeParaCadastrar.lancamneto) throw new Error ("Data de lançamento OBRIGATÓRIO!")
     if(!FilmeParaCadastrar.disponivel) throw new Error ("A disponibilidade do filme é OBRIGATÓRIA")
     if(!FilmeParaCadastrar.usuario) throw new Error ("Realize Login") 

     const resposta = await cadastrarFilme (FilmeParaCadastrar);
     resp.status(200).send({
         resposta
     })
    } 
    catch (err) {
       resp.status(400).send({
           Erro:err.message
       }) 
    }
})




export default server;