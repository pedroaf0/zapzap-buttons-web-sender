const moment = require('moment')
moment.locale('pt-br');
const week = 0;     
for (let index = 1; index < 6; index++) {
    // if (moment().startOf('week').add(index + (week*7), 'days').diff(moment()) > 0) {
        console.log(`${moment().startOf('week').add(index + (week*7), 'days').format('dddd DD/MM')}`)    
    // }
}

console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
console.log(moment().format())