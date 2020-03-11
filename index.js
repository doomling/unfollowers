var Twitter = require('twitter-lite')
const fs = require("fs");
const axios = require("axios");

const client = new Twitter({
  consumer_key: 'KEY',
  consumer_secret: 'SECRET',
  access_token_key: 'ACCESS-TOKEN',
  access_token_secret: 'ACCESS-SECRET',
})

getFollowers = async () => {
  let unfollows;
  let currentFollowers = [];
  let previousFollowers = [];

  try {
    
    if (fs.existsSync("followers.json")) {
      fs.readFile("followers.json", "utf8", (err, data) => {
        if (err) throw err;
        return previousFollowers = JSON.parse(data);
      });
    }

    currentFollowers = await client.get('followers/ids', { screen_name: 'iamdoomling', stringify_ids: true });

    if(currentFollowers) {
      fs.writeFile("followers.json", JSON.stringify(currentFollowers.ids), () => {
        console.log("json file saved");
      })
      unfollows =  previousFollowers.filter(id => {
        return currentFollowers.ids.indexOf(id) === -1
      })
    }
    
    if (unfollows.length > 0) {
      const unfollowNames = await client.post('users/lookup', { user_id: unfollows.join(",") })
      const screenNames = unfollowNames.map(item => {return item.screen_name})
      console.log(screenNames)
        sendTelegramMessage(`Esta gente te dejó de seguir desde el último checkeo: @${screenNames}. Mansos snowflakes ❄️.`)
      }
  }
  catch(e) {
    console.log(e)
  }
}

getFollowers()

sendTelegramMessage = (message) => {

  const botId = "BOT-ID";
  const chat = "CHAT-ID"
  const telegramMsg = encodeURIComponent(message);
  const url = `https://api.telegram.org/${botId}/sendMessage?chat_id=${chat}&text=${telegramMsg}`;
    axios.get(url);
};