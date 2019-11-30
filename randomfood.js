// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion, Payload } = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function suggestFood(agent) {
    console.log('a');
    // This should come from parameters
    let foodType = agent.parameters.foodtype;
    let calLimit = agent.parameters.cal + 0;

    const foods = [
      {
        name: 'ข้าวมันไก่',
        type: 'คาว',
        calories: 585,
        imageURL: 'https://food.mthai.com/app/uploads/2016/01/Hainanese-chicken-rice.jpg'
      },
      {
        name: 'ราเมง',
        type: 'คาว',
        calories: 640,
        imageURL: 'https://www.jgbthai.com/wp-content/uploads/2014/02/donchan_r01.jpg'
      },
      {
        name: 'ซีซาร์สลัด',
        type: 'คาว',
        calories: 240,
        imageURL: 'https://www.jessicagavin.com/wp-content/uploads/2019/07/caesar-salad-9-600x900.jpg'
      },
      {
        name: 'บัวลอยเผือก',
        type: 'หวาน',
        calories: 300,
        imageURL: 'https://f.ptcdn.info/444/052/000/ot2xb2poaH100GlUqqz-o.jpg'
      },
      {
        name: 'บิงซู',
        type: 'หวาน',
        calories: 397,
        imageURL: 'https://www.cocobings.com/wp-content/uploads/2016/02/Strawberry-Milk-Bingsu.jpg'
      },
      {
        name: 'โดนัท',
        type: 'หวาน',
        calories: 192,
        imageURL: 'https://christinascucina.com/wp-content/uploads/2014/01/IMG_4471-660.jpg'
      }
    ];

    console.log('b');
    console.log(foodType);
    console.log(calLimit);
    let filteredFoods = foods.filter(food => {
      return food.type == foodType && food.calories < calLimit;
    });
    console.log(filteredFoods);
    if (filteredFoods.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredFoods.length);
      console.log('random' + randomIndex);
      console.log('lenght' + filteredFoods.length);
      const food = filteredFoods[randomIndex];
      const payloadJson = {
        "type": "flex",
        "altText": "Flex Message",
        "contents": {
          "type": "bubble",
          "hero": {
            "type": "image",
            "url": food.imageURL,
            "size": "full",
            "aspectRatio": "20:13",
            "aspectMode": "cover"
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": food.name,
                "size": "xl",
                "weight": "bold"
              },
              {
                "type": "box",
                "layout": "vertical",
                "spacing": "sm",
                "margin": "lg",
                "contents": [
                  {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Calories",
                        "flex": 2,
                        "size": "sm",
                        "color": "#AAAAAA"
                      },
                      {
                        "type": "text",
                        "text": food.calories + " kcal",
                        "flex": 5,
                        "size": "sm",
                        "weight": "bold",
                        "color": "#666666",
                        "wrap": true
                      }
                    ]
                  }
                ]
              }
            ]
          },
          "footer": {
            "type": "box",
            "layout": "vertical",
            "flex": 0,
            "spacing": "sm",
            "contents": [
              {
                "type": "button",
                "action": {
                  "type": "uri",
                  "label": "ค้นหาร้านค้า",
                  "uri": "https://www.wongnai.com/businesses?q=" + food.name
                },
                "height": "sm",
                "style": "link"
              },
              {
                "type": "spacer",
                "size": "sm"
              }
            ]
          }
        }
      };
      console.log('c');
      const payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
      console.log('d');
      agent.add(payload);
      console.log('e');
    } else {
      const payloadJson = {
        type: "sticker",
        packageId: "11537",
        stickerId: "52002751"
      };
      const payload = new Payload('LINE', payloadJson, {sendAsMessage: true});
      agent.add('ไม่พบรายการอาหารตัวความต้องการ');
      agent.add(payload);
    }

  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  // intentMap.set('Default Welcome Intent', welcome);
  // intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('eat - custom - yes', suggestFood);
  agent.handleRequest(intentMap);
});
