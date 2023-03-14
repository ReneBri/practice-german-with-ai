// setup
const { Configuration, OpenAIApi } = require("openai");
const functions = require("firebase-functions");
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const configuration = new Configuration({
    organization: "org-CMUBAJG3wpV8r7RDy0S3oUNV",
    apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);


const app = express()
app.use(bodyParser.json())
app.use(cors({origin: 'https://practice-german-with-ai.web.app'}))
const port = 3080

app.post('/', async (req, res) => {
    const { messages } = req.body;
    console.log(messages);

    try{
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 100,
        temperature: .5,
      });

      console.log(response.data.choices[0].message)
      res.json({
        message: response.data.choices[0].message,
      })}
      catch (err){
        console.log(err.message)
      }
});

exports.app = functions.https.onRequest(app);

// app.listen(port, () => {
//     console.log(`example app listening at http://localhost:${port}`)
// })