const { Client } = require("@notionhq/client")
const moment = require('moment')
console.log(moment().format())
const data = moment().add(1,'day').format('YYYY-MM-DD')
const notion = new Client({ auth: 'secret_bWTZilKizDlfWnOOR8gCqQxTEwW2EuIjJxlXv0EcNwx' })

const databaseId = '71028d4cf413461d8b45f5abe21eeeb0'

async function addItem(text) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: { 
          title:[
            {
              "text": {
                "content": text
              }
            }
          ]
        },
        Data:{
            "date": {
              "start": data
            }
        }
      },
    })
    console.log(response)
    console.log("Success! Entry added.")
  } catch (error) {
    console.error(error)
  }
}
async function querydb(){
    const databaseId = '71028d4cf413461d8b45f5abe21eeeb0';
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
        "property": "Data",
        "date": {
            "equals": moment().format('YYYY-MM-DD')
        }
    }
  });
  console.log(response);

}
addItem("amanhã")
//querydb()