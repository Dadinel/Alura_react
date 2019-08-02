import React, {Component} from 'react'
import InputCustomizado from './componentes/InputCustomizado';
import constAPI from './APIConstants';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioLivro extends Component {
    constructor() {
        super();
        this.state = this.getEmptyState();
        this.enviaForm = this.enviaForm.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutorId = this.setAutorId.bind(this);
    }

    getEmptyState() {
        return {titulo:'', preco:0, autorId:''};
    }

    setTitulo(evento) {
        this.setState({titulo:evento.target.value});
    }

    setPreco(evento) {
        this.setState({preco:evento.target.value});
    }

    setAutorId(evento) {
        this.setState({autorId:evento.target.value});
    }

    enviaForm(evento) {
        evento.preventDefault();
            $.ajax({
                url:constAPI.apiURL + constAPI.endPoints.livros,
                contentType: 'application/json',
                dataType: 'json',
                type:'post',
                data: JSON.stringify({titulo:this.state.titulo, preco:this.state.preco, autorId:this.state.autorId}),
                success: function(novaListagem){
                    PubSub.publish(constAPI.publishs.livros, novaListagem);
                    this.setState(this.getEmptyState());
                }.bind(this),
                error: function(resposta){
                    if(resposta.status === 400) {
                        new TratadorErros().publicaErros(resposta.responseJSON);
                    }
                    else {
                        console.error(resposta);
                    }
                },
                beforeSend: function() {
                    PubSub.publish(constAPI.publishs.limpaErros, {});
                }
            });
    }

    render() {
        return (
            <div className='pure-form pure-form-aligned'>
                <form className='pure-form pure-form-aligned' onSubmit={this.enviaForm} method='post'>
                    <InputCustomizado id='titulo' type='text' name='titulo' value={this.state.titulo} onChange={this.setTitulo} label='Título'/>
                    <InputCustomizado id='preco' type='number' name='preco' value={this.state.preco} onChange={this.setPreco} label='Preço'/>
                    { /*<InputCustomizado id='autorId' type='text' name='autorId' value={this.state.autorId} onChange={this.setAutorId} label='Autor'/>*/ }

                    <div className='pure-control-group'>
                        <label htmlFor='autorId'>Autor</label> 
                        <select value={this.state.autorId} name='autorId' onChange={this.setAutorId}>
                            <option value="">Selecione</option>
                            { 
                                this.props.autores.map(function(autor) {
                                return <option key={ autor.id } value={ autor.id }>
                                            { autor.nome }
                                        </option>;
                                })
                            }
                        </select>
                    </div>

                    <div className='pure-control-group'>                                  
                        <label></label> 
                        <button type='submit' className='pure-button pure-button-primary'>Gravar</button>                                    
                    </div>
                </form>
            </div>
        );
    }
}

class TabelaLivros extends Component {
    render() {
        return (
            <div>            
                <table className='pure-table'>
                    <thead>
                    <tr>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Preço</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.lista.map( function(livro) {
                                return (
                                    <tr key={livro.titulo}>
                                        <td>{livro.titulo}</td>
                                        <td>{livro.autor.nome}</td>
                                        <td>{livro.preco}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export class LivroBox extends Component {
    constructor() {
        super();
        this.state = {lista: [{titulo: 'Desconhecido', preco: 0, autorId: '', autor: {nome: 'Daniel',}}], autores: [ {nome: 'Daniel', id: 'Daniel'}]}; //Valor default, apenas para testes
    }

    componentWillMount() {
        $.ajax({
            url:constAPI.apiURL + constAPI.endPoints.livros,
            dataType: 'json',
            success: function(resposta) {
                this.setState({lista: resposta});
            }.bind(this)
        });

        $.ajax({
            url:constAPI.apiURL + constAPI.endPoints.autores,
            dataType: 'json',
            success: function(resposta) {
                this.setState({autores: resposta});
                console.log(resposta);
            }.bind(this)
        });

        PubSub.subscribe(constAPI.publishs.livros, function(topico, novaListagem) {
            this.setState({lista: novaListagem});
        }.bind(this));
    }

    render() {
        return (
            <div>
                <div className='header'>
                    <h1>Cadastro de livros</h1>
                </div>
                <div className='content' id='content'>
                    <FormularioLivro autores={this.state.autores}/>
                    <TabelaLivros lista={this.state.lista}/>
                </div>
            </div>
        );
    }
}