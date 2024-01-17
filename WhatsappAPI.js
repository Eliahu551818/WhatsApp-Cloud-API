require('dotenv').config();

// const jsonFile = require('jsonfile'),
const jsonFile = require('file.json'),
axios = require("axios").default,
fs = require('fs'),
FormData = require('form-data');

/**
 * Represents a WhatsApp bot for sending messages and media.
 * @class
 */

class WA {
    /**
     * Creates an instance of WA.
     * @constructor
     * @param {string} token - The access token for interacting with the WhatsApp API.
     * @param {string} phoneNumberID - The phone number ID associated with the bot.
     * @param {string} version - The version of the WhatsApp API.
     */
    
  constructor(token,phoneNumberID,version){
      this.version = version;
      this.token = token;
      this.phoneNumberID = phoneNumberID;
    };
    
    /**
   * Sends a text message to a user.
   * @param {string} phoneNumber - The recipient's phone number.
   * @param {string} text - The text message to be sent.
   */
  // sends a text message to the user
  sendTextMessage(phoneNumber,text){
    axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url:
        "https://graph.facebook.com/"
        + this.version + '/' +
        this.phoneNumberID +
        "/messages?access_token=" +
        this.token,
      data: {
        messaging_product: "whatsapp",
        to: phoneNumber,
        text: { body: text }
      },
      headers: { "Content-Type": "application/json" }
    });
  };

    /**
   * Sends media by link to a user.
   * @param {string} phoneNumber - The recipient's phone number.
   * @param {string} mediaLink - The link to the media.
   * @param {string|null} caption - The caption for the media (optional).
   */
    sendMediaByLink(phoneNumber, mediaLink, caption = null) {
        let data = JSON.stringify({
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": phoneNumber,
            "type": "image",
            "image": {
              "link": mediaLink, "caption": caption
            }
        });
        
    axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
            "https://graph.facebook.com/"
            + this.version + '/' +
            this.phoneNumberID +
            "/messages",
        data: data,
        headers: {
            'Authorization': 'Bearer ' + this.token,
            "Content-Type": "application/json"
        },
        maxBodyLength: Infinity,

    }); 
    };
 

     /**
   * Sends media by its ID to a user.
   * @param {string} phoneNumber - The recipient's phone number.
   * @param {string} id - The ID of the media to be sent.
   * @param {string|null} caption - The caption for the media (optional).
   */  
    sendMediaById(phoneNumber, id, caption = null) {
      /**
     * Sends a media message using the Facebook Graph API.
     * @param {string} url - The URL to send the media message.
     * @param {string} method - The HTTP method to use for the request (POST).
     * @param {Object} data - The data object containing message details.
     * @param {Object} headers - The headers for the HTTP request.
     * @returns {Promise<void>} A promise indicating the success or failure of the operation.
     */
    let data = JSON.stringify({
      "messaging_product": "whatsapp",
      "recipient_type": "individual",
      "to": phoneNumber,
      "type": "image",
      "image": {
        "id": id, "caption": caption
      }
    });
    
    var config = {
    method: 'post',
    url: 'https://graph.facebook.com/'
    + this.version + '/'
    + this.phoneNumberID 
    + '/messages',
    headers: { 
    'Content-Type': 'application/json', 
    'Authorization': 'Bearer ' + this.token
    },
    data : data
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
  };

     /**
   * Sends media by file path to a user.
   * @param {string} phoneNumber - The recipient's phone number.
   * @param {string} filePath - The path to the media file.
   * @param {string|null} caption - The caption for the media (optional).
   */
  async sendMediaByFilePath(phoneNumber,filePath,caption = null){
    const response = await this.getMediaId(filePath);
    this.sendMediaById(phoneNumber,response,caption)
  };

    /**
   * Gets the media ID for a given file path.
   * @param {string} filePath - The path to the media file.
   * @returns {string} The media ID.
   */
  async getMediaId(filePath){
    let data = new FormData();
    data.append('messaging_product', 'whatsapp');
    data.append('file', fs.createReadStream(filePath));

    const config = {
    method: 'post',
    url:
        "https://graph.facebook.com/"
        + this.version + '/' +
        this.phoneNumberID +
        "/media",
    headers: { 
        'Authorization': 'Bearer ' + this.token,
        ...data.getHeaders()
    },
    data : data
    };

    const response = await axios(config)
    return response.data.id
  }
    
    /**
   * Replies to a message.
   * @param {string} messageId - The ID of the message to reply to.
   * @param {string} body - The text of the reply message.
   */
  reply(messageId,body){
    let data = JSON.stringify({
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": this.WhatsId,
    "context": {
        "message_id": messageId,
    },
    "type": "text",
    "text": {
        "preview_url": false,
        "body": body
    }
    });

    let config = {
    method: 'post',
    url: 'https://graph.facebook.com/'
    + this.version + '/'
    + this.phoneNumberID
    + '/messages',
    headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ' + this.token
    },
    data : data
    };

    axios(config)
  };
    
    /**
   * Sends a list to a user.
   * @param {string} phoneNumber - The recipient's phone number.
   * @param {string|null} header - The header text for the list (optional).
   * @param {string} body - The main text of the list.
   * @param {string} buttonText - The text for the action button.
   * @param {Object[]} sectionsList - An array of objects representing list sections.
   */
  sendList (phoneNumber,header = null,body,buttonText,sectionsList){
    // the list is an array of objects with the following properties:
    // [{
    //       "id": "SECTION_1_ROW_1_ID",
    //       "title": "SECTION_1_ROW_1_TITLE",
    //       "description": "SECTION_1_ROW_1_DESCRIPTION"
    // }]
    let data = JSON.stringify({
      "messaging_product": "whatsapp",
      "recipient_type": "individual",
      "to": phoneNumber,
      "type": "interactive",
      "interactive": {
        "type": "list",
        "header": {
          "type": "text",
          "text": header
        },
        "body": {
          "text": body
        },
        "action": {
          "button": buttonText,
          "sections": sectionsList
        }
      }
    });
    
    let config = {
      method: 'post',
      url: 'https://graph.facebook.com/'
      + this.version + '/'
      + this.phoneNumberID
      + '/messages',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ' + this.token
      },
      data : data
    };
    
    axios(config)
    .then(function (response) {
    })
    .catch(function (error) {
      console.log(error);
    });
  };
    
    /**
   * Sends a button to a user.
   * @param {string} phoneNumber - The recipient's phone number.
   * @param {string} body - The main text of the button.
   * @param {Object[]} buttons - An array of objects representing buttons.
   */
    sendButton(phoneNumber,body,buttons){
    // buttons is an array of objects with the following structure:
    // [{
    //     "type": "reply",
    //     "reply": {
    //       "id": "UNIQUE_BUTTON_ID_1",
    //       "title": "BUTTON_TITLE_1" 
    //     }
    // }]

    let data = JSON.stringify({
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": phoneNumber,
    "type": "interactive",
    "interactive": {
        "type": "button",
        "body": {
        "text": body
      },
        "action": {
        "buttons": buttons
        }
    }
    });

    var config = {
    method: 'post',
    url: 'https://graph.facebook.com/'
    + this.version + '/'
    + this.phoneNumberID 
    + '/messages',
    headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${this.token}`
    },
    data : data
    };

    axios(config)
    .then(function (response) {
    })
    .catch(function (error) {
    console.log(error);
    });
}; 
  
    /**
   * Sends a call-to-action (CTA) with a URL to a user.
   * @param {string} phoneNumber - The recipient's phone number.
   * @param {string} body - The main text of the CTA.
   * @param {string} display_text - The display text for the URL.
   * @param {string} url - The URL for the CTA.
   * @param {string|null} header - The header text for the CTA (optional).
   * @param {string|null} footer - The footer text for the CTA (optional).
   */
    sendCTA(phoneNumber, body, display_text, url, header = null, footer = null) {
        /*
            "interactive": {
                "type": "cta_url",
                "header": {
                'type': 'image',
                "image": {
                    "link" : photo_link,
                }
                },
                "body": {
                    "text": f"*{name}*\n\n{discription}"
                },
                "footer": {
                    "text": "If there is any question, feel free ask"
                },
                "action": {
                    "name": "cta_url",
                    "parameters": {
                    "display_text": price,
                    "url": "<BUTTON_URL>"
                }
                }
            }
        */
        
        let interactive = {
            "type": "cta_url",
        }
        if (header) interactive.header = header;
        interactive.body = { "text": body };
        if (footer) interactive.footer = { "text": footer }
        interactive.action = {
            "name": "cta_url",
            "parameters": {
                "display_text": display_text,
                "url": url
            }
        }

        let data = JSON.stringify({
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": phoneNumber,
            "type": "interactive",
            "interactive": interactive
        });
        
        var config = {
            method: 'post',
            url: 'https://graph.facebook.com/'
            + this.version + '/'
            + this.phoneNumberID 
            + '/messages',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${this.token}`
            },
            data : data
        };
        
        axios(config)
        .then(function (response) {
        })
        .catch(function (error) {
            console.log(error);
        });
    
    };      
        
    /**
   * Downloads a file from a given URL.
   * @param {string} url - The URL of the file to download.
   * @param {string} path - The local path to save the downloaded file.
   * @returns {string} The local path of the downloaded file.
   */
  async downloadUrl(url,path){
    let axios = require('axios');

    let config = {
      method: 'get',
      url: url,
      headers: { 
        'Authorization': 'Bearer ' + this.token
    },
      responseType: "stream",

    };

    const response = await axios(config)
    .catch(function (error) {
      console.log(error);
    });

    const w = response.data.pipe(
        fs.createWriteStream(path));
      
      return path;

    };
    

    /**
   * Downloads an image by its ID and saves it to a local path.
   * @param {string} id - The ID of the image to download.
   * @param {string} path - The local path to save the downloaded image.
   * @returns {string} The local path of the downloaded image.
   */
  async downloadImage(id,path){
  
    let config = {
      method: 'get',
      url: 'https://graph.facebook.com/v14.0/'+id,
      headers: { 
        'Authorization': 'Bearer ' + this.token
    },
    };

    let response = await axios(config)
    
    .catch(function (error) {
      console.log(error);
    });

    await this.downloadUrl(JSON.stringify(response.data.url).split('"')[1],path)

    return path;
  };

    /**
   * Sends a template message to a user.
   * @param {string} phoneNumber - The recipient's phone number.
   * @param {string} templateName - The name of the template.
   * @param {string} language - The language code for the template.
   * @param {Object[]} bodyComponents - An array of objects representing message components.
   */
  sendTemplate(phoneNumber, templateName, language, bodyComponents){

      // compose the components of the message
      // [
      //     {
      //         "type": "text",
      //         "text": "text-string"
      //     },
      //     {
      //         "type": "currency",
      //         "currency": {
      //            "fallback_value": "$100.99",
      //            "code": "USD",
      //            "amount_1000": 100990
      //         }    
      //     },
      //     {  
      //          "type": "date_time",
      //          "date_time": {
      //             "fallback_value": "February 25, 1977",
      //             "day_of_week": 5,
      //             "year": 1977,
      //             "month": 2,
      //             "day_of_month": 25,
      //             "hour": 15,
      //             "minute": 33,
      //             "calendar": "GREGORIAN"
      //         }
      //     }
      // ]
  
      let data = JSON.stringify({
          "messaging_product": "whatsapp",
          "recipient_type": "individual",
          "to": phoneNumber,
          "type": "template",
          "template": {
              "name": templateName,
              "language": {
              "code": language
              },
              "components": [
              {
                  "type": "body",
                  "parameters": bodyComponents
              }
              ]
          }
      });
  
      let config = {
      method: 'post',
      url: 'https://graph.facebook.com/'
      + this.version + '/'
      + this.phoneNumberID
      + '/messages',
      headers: { 
          'Content-Type': 'application/json', 
          'Authorization': 'Bearer ' + this.token
      },
      data : data
      };

        axios(config)
        .then(function (response) {
        console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
        console.log(error);
        });
  };

    /**
   * Sends a media template message to a user.
   * @param {string} phoneNumber - The recipient's phone number.
   * @param {string} templateName - The name of the template.
   * @param {string} language - The language code for the template.
   * @param {string} imageId - The ID of the image in the template.
   * @param {Object[]} bodyComponents - An array of objects representing message components.
   */
  sendMediaTemplateById(phoneNumber, templateName, language, imageId, bodyComponents){

    // {
    //   "type": "header",
    //   "parameters": [
    //     {
    //       "type": "image",
    //       "image": {
    //         "id": "id"
    //       }
    //     }
    //   ]
    // },
    // {
    //   "type": "body",
    //   "parameters": [
    //     {
    //       "type": "text",
    //       "text": "text-string"
    //     },
    //     {
    //       "type": "currency",
    //       "currency": {
    //         "fallback_value": "$100.99",
    //         "code": "USD",
    //         "amount_1000": 100990
    //       }
    //     },
    //     {
    //       "type": "date_time",
    //       "date_time": {
    //         "fallback_value": "February 25, 1977",
    //         "day_of_week": 5,
    //         "year": 1977,
    //         "month": 2,
    //         "day_of_month": 25,
    //         "hour": 15,
    //         "minute": 33,
    //         "calendar": "GREGORIAN"
    //       }
    //     }
    //   ]
    // }
      let data = JSON.stringify({
      "messaging_product": "whatsapp",
      "recipient_type": "individual",
      "to": phoneNumber,
      "type": "template",
      "template": {
        "name": templateName,
        "language": {
          "code": language
        },
        "components": [
          {
              "type": "header",
              "parameters": [
                {
                  "type": "image",
                  "image": {
                    "id": imageId
                  }
                }
              ]
            },
            {
                "type": "body",
                "parameters": 
                  bodyComponents
                }
          
          
        ]
      }
    });

    let config = {
      method: 'post',
      url: 'https://graph.facebook.com/'
      + this.version + '/'
      + this.phoneNumberID
      + '/messages',
      headers: { 
          'Content-Type': 'application/json', 
          'Authorization': 'Bearer ' + this.token
      },
      data : data
    };

    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });

  }

    /**
   * Sends a document by its ID to a user.
   * @param {string} phoneNumber - The recipient's phone number.
   * @param {string} documentId - The ID of the document.
   * @param {string} fileName - The name of the document file.
   * @param {string|null} caption - The caption for the document (optional).
   */
  sendDocumentById(phoneNumber,documentId,fileName,caption = null){
    
      const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": phoneNumber,
        "type": "document",
        "document": {
          "id": documentId,
          "caption": caption,
          "filename": fileName
        }
      })

      let config = {
        method: 'POST',
        url: 'https://graph.facebook.com/'
         + this.version + '/' 
         + this.phoneNumberID
         + '/messages',
  
          headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.token 
        },
        data: data
      };
      axios(config)
      .catch((error) => {
        console.log(error);
      })
  };

    /**
   * Sends a document by its file path to a user.
   * @param {string} phoneNumber - The recipient's phone number.
   * @param {string} path - The local path of the document file.
   * @param {string} fileName - The name of the document file.
   * @param {string|null} caption - The caption for the document (optional).
   */
  async sendDocumentByPath(phoneNumber,path,fileName,caption  = null) {
    const documentId = await this.getMediaId(path);
    this.sendDocumentById(phoneNumber,documentId,fileName,caption);
  };
};


// Export the WA class
module.exports = {WA};
