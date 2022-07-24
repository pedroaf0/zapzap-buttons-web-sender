
// Require google from googleapis package.
const { google } = require('googleapis')

// Require oAuth2 from our google instance.
const { OAuth2 } = google.auth

// Create a new instance of oAuth and set our Client ID & Client Secret.
const oAuth2Client = new OAuth2(
  '1020118333835-30g2erf5b3032tse7c9hgfji8tpqjdkd.apps.googleusercontent.com',
  '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'
)

// Call the setCredentials method on our oAuth2Client instance and set our refresh token.
oAuth2Client.setCredentials({
  refresh_token: '1//04_7kM8dTJCkGCgYIARAAGAQSNwF-L9IrGbuY5_GDVIb6CJfj42Q5gMbkau8vfAgbYIDABQLZoTeYCcj7TKxtsOtZeH39grdE9bs',
})

// Create a new calender instance.
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

// Create a new event start date instance for temp uses in our calendar.
const eventStartTime = new Date()
console.log(eventStartTime)
//eventStartTime.setDate(eventStartTime.getDay() + 2)

// Create a new event end date instance for temp uses in our calendar.
const eventEndTime = new Date()
//eventEndTime.setDate(eventEndTime.getDay() + 4)
eventEndTime.setMinutes(eventEndTime.getMinutes() + 45)

const checkdate =  (eventStartTime, eventEndTime)=> new Promise((re,err)=>{

calendar.freebusy.query(
  {
    resource: {
      timeMin: eventStartTime,
      timeMax: eventEndTime,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      items: [{ id: 'primary' }],
    },
  },
  (err, res) => {
    // Check for errors in our query and log them if they exist.
    if (err) return console.error('Free Busy Query Error: ', err)

    // Create an array of all events on our calendar during that time.
    const eventArr = res.data.calendars.primary.busy

    // Check if event array is empty which means we are not busy
    if (eventArr.length === 0){
        console.log("a")
        return re({"disponivel":true})
    }else{
        console.log("b")
        return re({"disponivel":false, eventArr })
    }
  }
)

})
async function main(){
     const a = await checkdate(eventStartTime, eventEndTime)
     console.log(a, "as")

}main()