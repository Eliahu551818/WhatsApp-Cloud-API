import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

class WA:
    def __init__(self, token=os.getenv('WHATSAPP_TOKEN'), phone_number_id=os.getenv('PHONE_NUMBER_ID'), version=os.getenv('VERSION')):
        # Initialize the WhatsApp class with necessary parameters.
        self.token = token  # Input: WhatsApp API token (string)
        self.phone_number_id = phone_number_id  # Input: WhatsApp phone number ID (string)
        self.version = version  # Input: WhatsApp API version (string)
    
    def send_media_by_id(self, phone_number, id, caption=None):
        # Send media (image) by ID to the specified phone number.
        # Inputs:
        #   - phone_number: Phone number to send the media to (string)
        #   - id: ID of the media to be sent (string)
        #   - caption: Caption for the media (string or None)
        # Output: None
        url = f"https://graph.facebook.com/{self.version}/{self.phone_number_id}/messages"
        payload = json.dumps({
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": phone_number,
            "type": "image",
            "image": {
                "id": id,
                "caption": caption
            }
        })
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + self.token
        }
        response = requests.request("POST", url, headers=headers, data=payload)
        print(response.text)
    
    def get_media_id(self, path, file_name, type):
        # Get media ID from the specified file path, name, and type.
        # Inputs:
        #   - path: Path to the media file (string)
        #   - file_name: Name of the media file (string)
        #   - type: Type of the media file (string)
        # Output: Media ID (string)
        url = f"https://graph.facebook.com/{self.version}/{self.phone_number_id}/media"
        payload = {'messaging_product': 'whatsapp'}
        files = [('file', (file_name, open(path, 'rb'), type))]
        headers = {
            'Authorization': 'Bearer ' + self.token
        }
        response = requests.request("POST", url, headers=headers, data=payload, files=files)
        return response.text[7:-2]
    
    def send_media_by_path(self, phone_number, path, file_name, file_type, caption=None):
        # Send media (image) using file path, name, and type.
        # Inputs:
        #   - phone_number: Phone number to send the media to (string)
        #   - path: Path to the media file (string)
        #   - file_name: Name of the media file (string)
        #   - file_type: Type of the media file (string)
        #   - caption: Caption for the media (string or None)
        # Output: None
        id = self.get_media_id(path, file_name, file_type)
        self.send_media_by_id(phone_number, id, caption)

    def send_text_message(self, phone_number, text):
        # Send a text message to the specified phone number.
        url = f"https://graph.facebook.com/{self.version}/{self.phone_number_id}/messages"
        payload = json.dumps({
            "messaging_product": "whatsapp",
            "preview_url": False,
            "recipient_type": "individual",
            "to": phone_number,
            "type": "text",
            "text": {
                "body": text 
            }
        })
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + self.token
        }
        res = requests.request("POST", url, headers=headers, data=payload)
        return res

    def send_template(self, phone_number, temp_name, lang, components):
        # Send a template message with specified components.
        url = f"https://graph.facebook.com/{self.version}/{self.phone_number_id}/messages"
        if components:
            payload = json.dumps({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": phone_number,
                "type": "template",
                "template": {
                    "name": temp_name,
                    "language": {
                        "code": lang
                    },
                    "components": components
                }
            })
        else:
            payload = json.dumps({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": phone_number,
                "type": "template",
                "template": {
                    "name": temp_name,
                    "language": {
                        "code": lang
                    },
                }
            })
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + self.token
        }
        res = requests.request("POST", url, headers=headers, data=payload)
        return res
    
    def send_document_by_path(self, phone_number, path, file_name, file_type, caption=None):
        # Send a document using file path, name, and type.
        id = self.get_media_id(path, file_name, file_type)
        url = f"https://graph.facebook.com/{self.version}/{self.phone_number_id}/messages"
        payload = json.dumps({
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": phone_number,
            "type": "document",
            "document": {
                "id": id,
                "caption": caption,
                "filename": file_name
            }
        })
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + self.token
        }
        requests.request("POST", url, headers=headers, data=payload)

    def send_button(self, phone_number, button_text, buttons):
        # Send an interactive button message.
        url = f"https://graph.facebook.com/{self.version}/{self.phone_number_id}/messages"
        payload = json.dumps({
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": phone_number,
            "type": "interactive",
            "interactive": {
                "type": "button",
                "body": {
                    "text": button_text
                },
                "action": {
                    "buttons": buttons
                }
            }
        })
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + self.token
        }
        response = requests.request("POST", url, headers=headers, data=payload)
        return response.text
    
    def sendCTA(self, phoneNumber, body, display_text, url, header=None, footer=None):
        # Send a Call-To-Action (CTA) URL message.
        interactive = {
            "type": "cta_url",
        }
        if header:
            interactive["header"] = header
        interactive["body"] = {"text": body}
        if footer:
            interactive["footer"] = {"text": footer}
        interactive["action"] = {
            "name": "cta_url",
            "parameters": {
                "display_text": display_text,
                "url": url
            }
        }
        data = json.dumps({
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": phoneNumber,
            "type": "interactive",
            "interactive": interactive
        })
        url = f"https://graph.facebook.com/{self.version}/{self.phone_number_id}/messages"
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.token}'
        }
        response = requests.post(url, headers=headers, data=data)
        return response.text



