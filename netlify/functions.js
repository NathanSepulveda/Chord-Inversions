// exports.handler = async (event, context, callback) => {
//     const pass = (body) => {callback(null, {statusCode: 200, body: JSON.stringify(body)})}
  
//     try {
//         let response = await fetch("https://api.convertkit.com/v3/forms/2107071/subscribe", 
//     {
//      method: event.httpMethod,
//      headers: {
//     //    "Authorization": `Bearer ${process.env.AIRTABLE_API}`, 
//        "Content-Type": "application/json"
//     },
//      body: event.body
//     })
    
//     let api_key = process.env.CONVERT_KIT
//      let initialData = await response.json()
//      await pass({api_key, ... initialData})
//    } catch(err) {
//        let error = {
//          statusCode: err.statusCode || 500,
//          body: JSON.stringify({error: err.message})
//    }
//     await pass(error)
//    }
//   }


const request = require("request");



exports.handler = async (event, context, callback) => {

    const formData = JSON.parse(event.body);
    const email = formData.email;
    let errorMessage = null;

    if (!formData) {
        errorMessage = "No form data supplied";
        console.log(errorMessage);
        callback(errorMessage);
    }



    const data = {
        email: email,
        api_key = process.env.CONVERT_KIT
    };

    const subscriber = JSON.stringify(data);
    console.log("Sending data to mailchimp", subscriber);

    request({
        method: "POST",
        url: "https://api.convertkit.com/v3/forms/2107071/subscribe",
        body: subscriber,
        headers: {
            // "Authorization": `apikey ${mailChimpAPI}`,
            "Content-Type": "application/json"
        }
    }, (error, response, body) => {
        if (error) {
            callback(error, null)
        }
        const bodyObj = JSON.parse(body);

        console.log("Mailchimp body: " + JSON.stringify(bodyObj));
        console.log("Status Code: " + response.statusCode);

        if (response.statusCode < 300 || (bodyObj.status === 400 && bodyObj.title === "Member Exists")) {
            console.log("Added to list in Mailchimp subscriber list");
            callback(null, {
                statusCode: 201,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": "true"
                },
                body: JSON.stringify({
                    status: "saved email"
                })
            })
        } else {
            console.log("Error from mailchimp", bodyObj.detail);
            callback(bodyObj.detail, null);
        }

    });
    
};