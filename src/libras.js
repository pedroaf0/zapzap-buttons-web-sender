
const request = require("request");

module.exports.libraspesquisa = (q) => new Promise((re,err)=>{

    var options = {
      method: 'GET',
      url: `https://wikiback.vlibras.gov.br/dictionary/1?code=${q}`,
    };
    
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      re(JSON.parse(body));
    });
    
      
});
module.exports.task_IDtomp4 = (task_ID) => new Promise((re,err)=>{

    var options = {
      method: 'GET',
      url: `https://wikiback.vlibras.gov.br/object-task/${task_ID}/2`,
    };
    
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
   
      re(`https://wikiback.vlibras.gov.br/download/${JSON.parse(body)[0].path}`);
    });
    
      
});

// async function a(){
//   const res = await libraspesquisa("bateria")
//   const mp4 = await task_IDtomp4(res.data[0].task_id)
// console.log(mp4)

// }a();