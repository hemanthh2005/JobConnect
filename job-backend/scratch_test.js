require('dotenv').config();
const fetch = require('node-fetch');

async function testGarbage() {
  const { JSEARCH_API_KEY, JSEARCH_API_HOST } = process.env;
  const url = `https://jsearch.p.rapidapi.com/search-v2?query=xxxxxxxxxxxxxx%20jobs%20in%20xxxxxxxxx&num_pages=1`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-host': JSEARCH_API_HOST || 'jsearch.p.rapidapi.com',
      'x-rapidapi-key': JSEARCH_API_KEY
    }
  };
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log("Type of data.data:", typeof data.data);
    console.log("Is array?", Array.isArray(data.data));
    console.log(data.data);
  } catch(e) {
    console.error(e);
  }
}
testGarbage();
