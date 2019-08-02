const apiURL = 'https://cdc-react.herokuapp.com/api/'; //localhost:8080 //Alterar caso o server esteja local
const apiAutores = 'autores';
const apiLivros = 'livros';
const publishAutores = 'atualiza-lista-autores';
const publishLivros = 'atualiza-lista-livros';
const errosValidacao = 'erro-validacao';
const limpaErros = 'limpa-erros';

const APIConstants = { 'apiURL': apiURL
                  , 'endPoints' : {
                      'autores': apiAutores,
                      'livros': apiLivros
                    }
                  , publishs: {
                      'autores': publishAutores,
                      'livros': publishLivros,
                      'validacao': errosValidacao,
                      'limpaErros': limpaErros
                    }
                  }

export default APIConstants;