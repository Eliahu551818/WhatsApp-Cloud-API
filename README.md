## WhatsApp Cloud API (Node.js)

### Introduction

This repository contains a WhatsApp bot implemented in Node.js. The bot facilitates sending text messages, media, templates, documents, buttons, and call-to-action (CTA) messages using the WhatsApp API.

### Getting Started

1. Clone the repository:

```bash
   git clone https://github.com/your-username/whatsapp-bot-node.git
   cd whatsapp-bot-node
```

2. Install Dependencies

```bash
    npm install
```
3. Set up Environment Variables

    Create a `.env` file in the project root and add the following:

```env
WHATSAPP_TOKEN=your_whatsapp_token
PHONE_NUMBER_ID=your_phone_number_id
VERSION=your_api_version
```

### Run the Bot

Run the bot script using the following command:

```bash
node your_bot_script.js

Replace your_bot_script.js with the actual filename of your bot script. This command initiates the execution of your WhatsApp bot.

Usage
The WA class provides methods for various WhatsApp functionalities. Here's an example usage:
```

### Usage

The `WA` class provides methods for various WhatsApp Cloud API functionalities. Here's an example usage:

```javascript
const { WA } = require('./path/to/your/whatsapp-bot');

const whatsappBot = new WA('your_whatsapp_token', 'your_phone_number_id', 'your_api_version');

// Example: Sending a text message
whatsappBot.sendText

```

### Methods

#### `sendTextMessage(phoneNumber, text)`

Sends a text message to the specified phone number.

```javascript
whatsappBot.sendTextMessage('recipient_number', 'Hello, World!');
```

#### `sendMediaById(phoneNumber, id, caption = null)`

Sends media by its ID to a user.

```javascript
whatsappBot.sendMediaById('recipient_number', 'media_id', 'Optional caption');
```

#### `getMediaId(filePath)`

Gets the media ID for a given file path.

```javascript
const mediaId = whatsappBot.getMediaId('/path/to/media/file');
```

#### `sendMediaByFilePath(phoneNumber, filePath, caption = null)`

Sends media by file path to a user.

```javascript
whatsappBot.sendMediaByFilePath('recipient_number', '/path/to/media/file', 'Optional caption');
```


## WhatsApp Cloud API Bot (Python)

#### Introduction

This repository contains a WhatsApp bot implemented in Python, utilizing the WhatsApp Cloud API. The bot facilitates sending text messages, media, templates, documents, buttons, and call-to-action (CTA) messages using the WhatsApp API.

#### Getting Started

1. **Clone the repository:**

```bash
   git clone https://github.com/your-username/whatsapp-bot-python.git
   cd whatsapp-bot-python
```

2. **Install Dependencies**

```bash
    pip install -r requirements.txt
```

3. **Set up Environment Variables**

    Create a `.env` file in the project root and add the following:

```env
WHATSAPP_TOKEN=your_whatsapp_token
PHONE_NUMBER_ID=your_phone_number_id
VERSION=your_api_version
```

#### Run the Bot

Run the bot script using the following command:

```bash
python your_bot_script.py

Replace your_bot_script.py with the actual filename of your bot script. This command initiates the execution of your WhatsApp bot.
```

#### Usage

The `WA` class provides methods for various WhatsApp Cloud API functionalities. Here's an example usage:

```python
from whatsapp_bot import WA

whatsapp_bot = WA('your_whatsapp_token', 'your_phone_number_id', 'your_api_version')

# Example: Sending a text message
whatsapp_bot.send_text_message('recipient_number', 'Hello, World!')
```

#### Methods

##### `send_text_message(phone_number, text)`

Sends a text message to the specified phone number.

```python

whatsapp_bot.send_text_message('recipient_number', 'Hello, World!')
```

##### `send_media_by_id(phone_number, id, caption = None)`

Sends media by its ID to a user.

```python

whatsapp_bot.send_media_by_id('recipient_number', 'media_id', 'Optional caption')
```

##### `get_media_id(file_path)`

Gets the media ID for a given file path.

```python
media_id = whatsapp_bot.get_media_id('/path/to/media/file')
```

##### `send_media_by_file_path(phone_number, file_path, caption = None)`

Sends media by file path to a user.

```python

whatsapp_bot.send_media_by_file_path('recipient_number', '/path/to/media/file', 'Optional caption')
```
