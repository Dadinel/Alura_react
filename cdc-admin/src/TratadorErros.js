import PubSub from 'pubsub-js';
import constAPI from './APIConstants';

export default class TratadorErros {
    publicaErros(erros) {
        for(let i=0; i < erros.errors.length; i++) {
            let erro = erros.errors[i];

            PubSub.publish(constAPI.publishs.validacao, erro);
        }
    }
}