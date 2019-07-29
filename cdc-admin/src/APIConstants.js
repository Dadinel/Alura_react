const apiURL = 'https://cdc-react.herokuapp.com/api/' //localhost:8080 //Alterar caso o server esteja local
const apiAutores = 'autores'
const publishAutores = 'atualiza-lista-autores'

const APIConstants = { 'apiURL': apiURL
                  , 'endPoints' : { 'autores': apiAutores }
                  , publishs: { 'autores': publishAutores }
                  }

export default APIConstants;