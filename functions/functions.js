
const fetch = require("node-fetch");


exports.handler = async (event, context, callback) => {
    const pass = (body) => {callback(null, {statusCode: 200, body: JSON.stringify(body)})}

    const formData = JSON.parse(event.body);
    const email = formData.email;


    const data = {
        email: email,
        api_key : process.env.CONVERT_KIT,
        "first_name": formData.firstName
    };

    const subscriber = JSON.stringify(data);

  
    try {
      let response = await fetch("https://api.convertkit.com/v3/forms/2107071/subscribe", 
    {
     method: event.httpMethod,
     headers: {
       "Content-Type": "application/json"
    },
     body: subscriber
    })
     let data = await response.json()
     await pass(data)
   } catch(err) {
       let error = {
         statusCode: err.statusCode || 500,
         body: JSON.stringify({error: err.message})
   }
    await pass(error)
   }
  }
