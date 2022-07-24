const wppconnect = require('@wppconnect-team/wppconnect');
const {libraspesquisa, task_IDtomp4} = require("./src/libras.js");
const moment = require('moment')
moment.locale('pt-br');
wppconnect
.create()
.then((client) => start(client))
.catch((erro) => {
  console.log(erro);
});


async function start(client) {
    const actions = {}
    actions['librasmenu'] = function librasmenu(message){
        console.log('librasmenu')
        client.sendText(message.from, '*Libras-Perquisa*\nResponda essa mensagem para realizar uma busca no dicionário de Libras:')
    }
    actions['*Libras-Perquisa*'] = async function a(message){
        var result = await libraspesquisa(message.body)
        result = result.data
        var buttons = []
        for (let i = 0; i < result.length; i++) {
            buttons[i] = {}
            buttons[i]['id'] = JSON.stringify({'task_id': result[i].task_id, 'action':'task_IDtomp4'})
            buttons[i]['text'] = result[i].code
        }
        client.sendText(message.from, `Resultado da busca por: ${message.body}`, {
            title: 'Resultado Perquisa Libras', 
            footer: 'Use os botões abaixo para obter o gif do sinal:', 
            useTemplateButtons: true, // False for legacy
            buttons: buttons
        });    
    }
    actions['task_IDtomp4'] = async function ftask_IDtomp4(message){
        const video = await task_IDtomp4(JSON.parse(message.selectedId).task_id)
        client.sendVideoAsGif(message.from, video)
    }
    actions['agendarmenu'] = async function ftask_IDtomp4(message){
        client.sendText(message.from, 'Em que turno você deseja agendar?', {
            title: 'Agendamento', 
            footer: 'Use os botões abaixo para navegar:', 
            useTemplateButtons: true, // False for legacy
            buttons: [
            {
                id: JSON.stringify({'action':'agendamentosemana', 'turno':'manhã'}),
                text: 'Manhã'
            },
            {
                id: JSON.stringify({'action':'agendamentosemana', 'turno':'tarde'}),
                text: 'Tarde'
            },
            {
                id: JSON.stringify({'action':'agendamentosemana', 'turno':'noite'}),
                text: 'Noite'
            },
            {
                id: JSON.stringify({'action':'menu'}),
                text: 'Retornar ao início'
            }
            ]
        });
    }
    actions['agendamentosemana'] = async function ftask_IDtomp4(message){
        const buttons_ = []
        var text = ['Esta semana', 'Próxima semana', 'Daqui 2 semanas', 'Daqui 3 semanas','Daqui 4 semanas']  
        for (let index = 0; index < 5; index++) {
            buttons_[index] = {}
            buttons_[index]['id'] = JSON.stringify({'action':'agendamentodia', 'semana':index})
            buttons_[index]['text'] = `${text[index]} (dia ${moment().startOf('week').add(1 + (index*7), 'days').format('DD/MM')} até ${moment().endOf('week').add((index*7) - 1, 'days').format('DD/MM')})`
            
        }
        client.sendText(message.from, 'Em que semana você deseja agendar?', {
            title: 'Agendamento', 
            footer: 'Use os botões abaixo para selecionar:', 
            useTemplateButtons: true, // False for legacy
            buttons:buttons_
        });
    }
    actions['agendamentodia'] = async function ftask_IDtomp4(message){
        const buttons_ = []
        var btn = -1;
        for (let index = 1; index < 6; index++) {
            if (moment().startOf('week').add(index + (JSON.parse(message.selectedId).semana*7), 'days').diff(moment()) > 0) {
            btn++
            buttons_[btn] = {}
            buttons_[btn]['id'] = JSON.stringify({'action':'agendamentoturno', 'semana':index})
            buttons_[btn]['text'] = moment().startOf('week').add(index + (JSON.parse(message.selectedId).semana*7), 'days').format('dddd DD/MM')
            }
        }
        client.sendText(message.from, 'Em que semana você deseja agendar?', {
            title: 'Agendamento', 
            footer: 'Use os botões abaixo para selecionar:', 
            useTemplateButtons: true, // False for legacy
            buttons:buttons_
        });
    }


client.onMessage(async (message) => { console.log(message)

    function onerrormessage(message){
        client.sendText(message.from, 'Boas vindas ao pedroaf0_bot 2.0', {
            title: 'Menu inicial', 
            footer: 'Use os botões abaixo para navegar:', 
            useTemplateButtons: true, // False for legacy
            buttons: [
            {
                id: JSON.stringify({'action':'librasmenu'}),
                text: 'Dicionário de libras'
            },
            {
                id: JSON.stringify({'action':'agendamentosemana'}),
                text: 'Agendar consulta/procedimento'
            },
            {
                id: JSON.stringify({'action':'menu'}),
                text: 'Retornar ao início'
            }
            ]
        });
    }
    if (message.type == "template_button_reply"){
        console.log(message.selectedId)
        actions[JSON.parse(message.selectedId).action](message)
    }else{
        console.log("b")

        if (message.quotedMsgId){
            try {
                actions[JSON.parse(message.quotedMsg.hydratedButtons[0].id).onreply](message)
            } catch (error) {
                console.error(error)
                onerrormessage(message)
            }
        }else{
            try {
                const messagebefore = await client.getMessages(message.from, {'count': 1,'direction':'before','fromMe':true,id: message.id})
                console.log(messagebefore)
                actions[messagebefore[0].body.split("\n")[0]](message)
            } catch (error) {
                console.error(error)
                onerrormessage(message)
            }
        }
    }
});
}