import React, {Component} from 'react'
import InputCustomizado from './componentes/InputCustomizado';
import constAPI from './APIConstants';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioAutor extends Component {
    constructor() {
        super();
        this.state = this.getEmptyState();
        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
    }

    getEmptyState() {
        return {nome:'', email:'', senha:''};
    }

    setNome(evento) {
        this.setState({nome:evento.target.value});
    }

    setEmail(evento) {
        this.setState({email:evento.target.value});
    }

    setSenha(evento) {
        this.setState({senha:evento.target.value});
    }

    enviaForm(evento) {
        evento.preventDefault();
        console.log('Dados sendo enviados');

            $.ajax({
                url:constAPI.apiURL + constAPI.endPoints.autores,
                contentType: 'application/json',
                dataType: 'json',
                type:'post',
                data: JSON.stringify({nome:this.state.nome, email:this.state.email, senha:this.state.senha}),
                success: function(novaListagem){
                    PubSub.publish(constAPI.publishs.autores, novaListagem);
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
                    <InputCustomizado id='nome' type='text' name='nome' value={this.state.nome} onChange={this.setNome} label='Nome'/>
                    <InputCustomizado id='email' type='email' name='email' value={this.state.email} onChange={this.setEmail} label='E-mail'/>
                    <InputCustomizado id='senha' type='password' name='senha' value={this.state.senha} onChange={this.setSenha} label='Senha'/>
                    <div className='pure-control-group'>                                  
                        <label></label> 
                        <button type='submit' className='pure-button pure-button-primary'>Gravar</button>                                    
                    </div>
                </form>
            </div>
        );
    }
}

class TabelaAutores extends Component {
    render() {
        return (
            <div>            
                <table className='pure-table'>
                    <thead>
                    <tr>
                        <th>Nome</th>
                        <th>email</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.lista.map( function(autor) {
                                return (
                                    <tr>
                                        <td>{autor.nome}</td>
                                        <td>{autor.email}</td>
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

export class AutorBox extends Component {
    constructor() {
        super();
        this.state = {lista: [{nome: 'Alberto', email: 'alberto.souza@caelum.com.br', senha:'123456'}]}; //Valor default, apenas para testes
    }

    componentWillMount() {
        $.ajax({
            url:constAPI.apiURL + constAPI.endPoints.autores,
            dataType: 'json',
            success: function(resposta) {
                this.setState({lista: resposta});
            }.bind(this)
        });

        PubSub.subscribe(constAPI.publishs.autores, function(topico, novaListagem) {
            this.setState({lista: novaListagem});
        }.bind(this));
    }

    render() {
        return (
            <div>
                <FormularioAutor/>
                <TabelaAutores lista={this.state.lista}/>
            </div>
        );
    }
}