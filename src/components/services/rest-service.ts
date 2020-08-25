/*
*   SOME UNDEFINED TROUBLES WITH fetch() and Superagent
*   
*   THEN I PROCEED WITH $XMLHttpRequest
*/

import fakeApi from '../services/fake-api'

import HttpResponse from '../types/http-response';

class RestServices  {
    
    public get(url: string): Promise<any> {

        return new Promise((resolve, reject) => {
     
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.onload = () => resolve(this.parseResponse(xhr));
            xhr.onerror = () => reject(this.parseResponse(xhr));
            xhr.send();
        });
    }

    public parseResponse(xhr: XMLHttpRequest): HttpResponse {

        return {
            statusCode: xhr.status,
            statusText: xhr.statusText,
            payload: xhr.responseText,
        }
    }

    /* 
    *   CALLING A FAKE BACK-END 
    */
   public getFakeApi(): Promise<any> {
        
        return new Promise((resolve, reject) => {

            let response: HttpResponse = {
                statusCode: 200,
                statusText: "200",
                payload: fakeApi,
            };

            resolve(response);
            reject(null);
        });
    }
}

// SINGLETON
// Export an instance of the class directly
export default new RestServices();