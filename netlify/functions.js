exports.handler = async (event, context, callback) => {
    const pass = (body) => {callback(null, {statusCode: 200, body: JSON.stringify(body)})}
  
    try {
        let response = await fetch("https://api.convertkit.com/v3/forms/2107071/subscribe", 
    {
     method: event.httpMethod,
     headers: {
    //    "Authorization": `Bearer ${process.env.AIRTABLE_API}`, 
       "Content-Type": "application/json"
    },
     body: event.body
    })
    
    let api_key = process.env.CONVERT_KIT
     let initialData = await response.json()
     await pass({api_key, ... initialData})
   } catch(err) {
       let error = {
         statusCode: err.statusCode || 500,
         body: JSON.stringify({error: err.message})
   }
    await pass(error)
   }
  }