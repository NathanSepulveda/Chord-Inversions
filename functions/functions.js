
const request = require("request");

const fetch = require("node-fetch");

// exports.handler = async (event, context) => {

//     const formData = JSON.parse(event.body);
//     const email = formData.email;
//     let errorMessage = null;




//     const data = {
//         email: email,
//         api_key : process.env.CONVERT_KIT
//     };

//     const subscriber = JSON.stringify(data);
//     console.log("Sending data to mailchimp", subscriber);

//     request({
//         method: "POST",
//         url: "https://api.convertkit.com/v3/forms/2107071/subscribe",
//         body: subscriber,
//         headers: {
//             "Content-Type": "application/json"
//         }
//     }, (error, response, body) => {
//         if (error) {
//             callback(error, null)
//         }
//         const bodyObj = JSON.parse(body);

//         console.log("Mailchimp body: " + JSON.stringify(bodyObj));
//         console.log("Status Code: " + response.statusCode);

//         if (response.statusCode < 300 || (bodyObj.status === 400 && bodyObj.title === "Member Exists")) {
//             console.log("Added to list in Mailchimp subscriber list");
//             callback(null, {
//                 statusCode: 201,
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Access-Control-Allow-Origin": "*",
//                     "Access-Control-Allow-Credentials": "true"
//                 },
//                 body: JSON.stringify({
//                     status: "saved email"
//                 })
//             })
//         } else {
//             console.log("Error from mailchimp", bodyObj.detail);

//         }

//     });


    
// };





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



// exports.handler = async (event) => {
//     const { sku, quantity } = JSON.parse(event.body);
//     const product = inventory.find((p) => p.sku === sku);
//     const validatedQuantity = quantity > 0 && quantity < 11 ? quantity : 1;
  
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       billing_address_collection: 'auto',
//       shipping_address_collection: {
//         allowed_countries: ['US', 'CA'],
//       },
//       success_url: `${process.env.URL}/success.html`,
//       cancel_url: process.env.URL,
//       line_items: [
//         {
//           name: product.name,
//           description: product.description,
//           images: [product.image],
//           amount: product.amount,
//           currency: product.currency,
//           quantity: validatedQuantity,
//         },
//       ],
//     });
  
//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         sessionId: session.id,
//         publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
//       }),
//     };
//   };