var screenshotmachine = require('screenshotmachine');//allow us to use the API of Screenshot machine
var fs = require('fs');//allow us to write files

const { google } = require('googleapis');//api of Google
const path = require('path')//allow us to use the path of files in desktop

const CLIENT_ID = '870994141458-4g2a7jlilmbpbm56k0juetmk6duuj78n.apps.googleusercontent.com'
const CLIENT_SECRET = 'zUxFj_g_qljGeCx_7pkLPxEU'
const REDIRECT_URL = 'https://developers.google.com/oauthplayground'

const REFRESH_TOKEN = '1//04tA5TTp3fkLuCgYIARAAGAQSNwF-L9IrsainZ04L1F_3HThG96yP0yR5wp0JyetVoWa7ZWi-UNp3EIGu-uqZ0XpZl1cgWteqawY'

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);

oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

const drive = google.drive({
    version:'v3',
    auth: oauth2Client
})
//setting the google API to connect with a Drive
var files = []//array of files we will upload to the Drive 
var names = []//names of this files

for (var id = 0; id < 6; id++){
  if(id==0){
    console.log('Initialisation')
  }else if(id==1){
    setTimeout(() => screenshot('https://ifunded.de/en/', 1, 'iFunded'), 1000)
  }else if(id==2){
    setTimeout(() => screenshot('https://www.propertypartner.co', 2, 'Porperty Partner'),3000)
  }else if(id==3){
    setTimeout(() => screenshot('https://propertymoose.co.uk/', 3, 'Property Moose'),3000)
  }else if(id==4){
    setTimeout(() => screenshot('https://www.homegrown.co.uk/', 4, 'Homegrown'),3000)
  }else if(id==5){
    setTimeout(() => screenshot('https://www.realtymogul.com', 5, 'Realty Mogul'), 3000)
  }
}
//take the screenshot of the 5 websites with the next function, I had the "setTimeout" function because the function screenshot take some times to execute (communicate with the API then download the files, ...)

function screenshot(site, id, name){
  var customerKey = 'f4fd95';
    secretPhrase = ''; //leave secret phrase empty, if not needed
    options = {
      //mandatory parameter
      url : site,
      // all next parameters are optional, see our website screenshot API guide for more details
      dimension : '1920x1080', // or "1366xfull" for full length screenshot
      device : 'desktop',
      format: 'jpg',
      cacheLimit: '0',
      delay: '0',
      zoom: '0'
    }
    var apiUrl = screenshotmachine.generateScreenshotApiUrl(customerKey, secretPhrase, options);
    var output = id+'_'+name+'.jpg';
    screenshotmachine.readScreenshot(apiUrl).pipe(fs.createWriteStream(output).on('close', function() {
      console.log('Screenshot saved as ' + output);
    }));//function of the API of screenshot machine

    var filePath = path.join(__dirname, output)


    files.push(filePath)
    names.push(output)
    console.log(names, files)
    if(id==5){
      console.log('Waiting for Google Drive...')
      setTimeout(() => {for (var j=0; j < files.length; j++){
        uploadFile(names[j], files[j])
      }}, 10000)//here, we upload the previous screenshot to google Drive, it use the function of the google API
      
      

    }


}
async function uploadFile(name, path){
  try{
      const response = await drive.files.create({
          requestBody:{
              name: name,
              mimeType:'image/jpg',
              parents: ['1JKKAm4dOi8dmvYKR8OlitRh311qOPzyr']//allow us to upload in a specific file and not in the root of the Drive
          },
          media:{
              mimeType: 'image/jpg',
              body: fs.createReadStream(path)
          }
      })
      console.log(response.data)
  } catch(error){
      console.log(error.message)
  }
}//function of the Google API to upload a file
