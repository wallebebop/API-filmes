import multer, { MulterError } from "multer"
import { Router } from "express"
import { cadastrarFilme,  alterarImagem, listarTodosOsFilmes, BuscarPorNome, BuscarPorID, removerFilme, alterarFilme} from "../repository/filmesrepository.js"

const server = Router();
const upload = multer({dest:'storage/capaFilmes'});

server.post('/filme' , async (req,resp) => {
    try {
     const FilmeParaCadastrar = req.body;
     if(!FilmeParaCadastrar.nome) throw new Error ("Nome é OBRIGATÓRIO!")
     if(!FilmeParaCadastrar.sinopse) throw new Error ("Sinopse do Filme é OBRIGATÓRIO!")
     if(FilmeParaCadastrar.avaliacao == undefined || FilmeParaCadastrar.avaliacao < 0) throw new Error ("Avaliação do filme é OBRIGATÓRIO!")
     if(!FilmeParaCadastrar.lancamento) throw new Error ("Data de lançamento OBRIGATÓRIO!")
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

server.put('/filme/:id/capa' , upload.single('capa'), async (req,resp) => {
    try {
        const { id } = req.params;
        const imagem = req.file.path;

        const resposta= await alterarImagem(imagem,id);
        resp.status(204).send();
        if(resposta != 1)
            throw new Error ('A imagem não pode ser salva.')
        
    } catch (err) {
        resp.status(400).send({
            erro:err.message
        })
    }
})


server.get('/filme', async (req,resp) =>{
    try {
        
        const resposta = await listarTodosOsFilmes();
        resp.send(resposta);

    } catch (err) {
        resp.status(400).send({
            erro:err.message
        })
    }
})




server.get('/filme/busca', async (req,resp) =>{
    try {
        const { nome }  = req.query;
        const resposta = await BuscarPorNome(nome);

        if(resposta.length == 0)
        resp.status(404).send([])
        else
        resp.send(resposta);

    } catch (err) {
        resp.status(400).send({
            erro:err.message
        })
    }
})

server.get('/filme/:id', async (req,resp) =>{
    try {
        const {id} = req.params;
        const resposta = await BuscarPorID(id);

        if(!resposta)
            throw new Error("Filme não encontrado!")

        resp.send(resposta);

    } catch (err) {
        resp.status(400).send({
            erro:err.message
        })
    }
})

server.delete('/filme/:id', async (req, resp) => {
    try{
        const { id } = req.params;

        const resposta = await removerFilme(id);
         if(resposta != 1)
         throw new Error("Filme não pode ser removido.");
         resp.status(204).send();
     } catch (err) {
        resp.status(400).send({
            erro:err.message
        })
    }
})

server.put('/filme/:id', async (req,resp) => {
    try{
       const {id} = req.params;
       const filme = req.body;
       if(!filme.nome) throw new Error ('Nome do filme é OBRIGATÓRIO!')
       if(!filme.sinopse) throw new Error ('Sinopse do filme é OBRIGATÓRIO!')
       if(filme.avaliacao == undefined || filme.avaliacao < 0) throw new Error ('Avaliacao do filme é OBRIGATÓRIO!')
       if(!filme.lancamento) throw new Error ('Lançamento do filme é OBRIGATÓRIO!')
       if(filme.disponivel == undefined) throw new Error ('A disponibilidade do filme é OBRIGATÓRIO!')
       if(!filme.usuario) throw new Error ('Usuário não logado!')

       const resposta = await alterarFilme(id, filme);
       if(resposta != 1)
           throw new Error ("Filme não pode ser alterado!")
       
       else
       resp.status(204).send();

     } catch (err) {
       resp.status(400).send({
           erro:err.message
       })
   }
})

export default server;