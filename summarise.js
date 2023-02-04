const { Configuration, OpenAIApi } = require("openai");
const dotenv = require('dotenv');
dotenv.config()
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getSum(transcript) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Summarise: \n ${transcript}`,
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  return(response.data.choices[0].text);
}

module.exports = { getSum }
