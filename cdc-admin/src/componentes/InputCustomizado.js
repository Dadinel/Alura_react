import React, {Component} from 'react'
import PubSub from 'pubsub-js';
import constAPI from '../APIConstants';

class InputCustomizado extends Component {

    constructor() {
        super();
        this.state = this.getEmptyErrorMsg();
    }

    getEmptyErrorMsg() {
        return {msgErro: ''};
    }

    componentDidMount() {
        PubSub.subscribe(constAPI.publishs.validacao, function(topico, erro) {
            if(erro.field == this.props.name) {
                this.setState({msgErro: erro.defaultMessage});
            }
        }.bind(this));

        PubSub.subscribe(constAPI.publishs.limpaErros, function(topico) {
            this.setState(this.getEmptyErrorMsg());
        }.bind(this));
    }

    render() {
        return (
            <div className='pure-control-group'>
                <label htmlFor={this.props.nome}>{this.props.label}</label> 
                <input id={this.props.id} type={this.props.type} name={this.props.name} value={this.props.value} onChange={this.props.onChange} />
                <span className="error">{this.state.msgErro}</span>
            </div>
        );
    }
}

export default InputCustomizado;