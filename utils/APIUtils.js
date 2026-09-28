// In fixtures.js file, this APIUtils.js file is referenced to create order using API call. The APIUtils.js file is used to create a new order using the API and return the response to the test function that will be executed after this fixture is set up.

class APIUtils
{

    constructor(apiContext, apiLoginPayload) // constructor created to point argument'apiContext' from main class APIWebPart1.spec.js
    {
        this.apiContext = apiContext;   // here this.apiContext applicable/points to this complete class 
        this.apiLoginPayload = apiLoginPayload;
    }


    async getToken() // whenever use of 'await' then need to declare 'async' to method
    {
        // COPIED ALL BELOW FROM WebAPIPart1.spec.js file from Login API section 
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
        {
        data:this.apiLoginPayload
        } )
        //expect(loginResponse.ok()).toBeTruthy(); // ok() = Contains a boolean stating whether the response was successful (status in the range 200-299) or not.     
        const loginResponseJson = await loginResponse.json();  // json() = Returns the JSON representation of response body.
        const token = loginResponseJson.token;
        console.log(token);
        return token;

    }

    async createOrder(orderPayload)
    {
        let response = {};  // response = is a object
        response.token = await this.getToken(); // token property
        // COPIED ALL BELOW FROM WebAPIPart1.spec.js file from Create Order API section 
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
                {
                data: orderPayload,
                headers:{
                        'Authorization' : response.token, // token property
                        'Content-Type'  : 'application/json'
                        },
                })
            const orderResponseJson = await orderResponse.json();
            console.log(orderResponseJson);    
            const orderId = orderResponseJson.orders[0];
            response.orderId = orderId; // this 'orderId' property value is feeded to this object 'response'
            return response; // this object 'response' hold 2 things = orderId & token

    }

}
module.exports = {APIUtils}; // export class APIUtils like this at end so that other class can access it otherwise no access outside this class 