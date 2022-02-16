/**
 * modules
 */
const request = require("request");
const cron = require("node-cron");
import { TwitterApi } from "twitter-api-v2";
const fs = require("fs");

/**
 * import setting
 */
import { interval, TWITTER_USERS } from "../setting";
require("dotenv").config();

/**
 * twitter api setting
 */
const TWITTER_BEARER: string | null = process.env.TWITTER_BEARER || "";
// Instanciate with desired auth type (here's Bearer v2 auth)
// Tell typescript it's a readonly app
const twitterClient = new TwitterApi(TWITTER_BEARER);
const client = twitterClient.readOnly;

/**
 * slack api setting
 */
const SLACK_API_URL: string = "https://slack.com/api/";
const SLACK_BOT_TOKEN: string = process.env.SLACK_BOT_TOKEN || "";

/**
 * twitter helper
 */
const getTwitterUserID = (user: string) => {
  return new Promise((resolve) => {
    const userIDObject = client.v2.userByUsername(user);
    resolve(userIDObject);
  });
};

/**
 * twitter main
 */
const getTweet = (id: string, now: string, before5min: string) => {
  return new Promise((resolve) => {
    const userTweets = client.v2.userTimeline(id, {
      exclude: "replies",
      max_results: 5,
      start_time: before5min,
      end_time: now,
    });
    resolve(userTweets);
  });
};

/**
 * slack helper
 */
const slackOptions: {
  token: string;
  channel?: string;
  text?: string;
} = {
  token: SLACK_BOT_TOKEN,
};
const returnOneUserTweets = (oneUserTweets: any) => {
  return new Promise((resolve) => {
    resolve(oneUserTweets);
  });
};

/**
 * slack main
 */
const postSlack = (user: string, tweet: any) => {
  return new Promise((resolve) => {
    /**
     * Data set
     */
    slackOptions["channel"] = TWITTER_USERS[user]["slackChannelName"];
    const sendText = `
${tweet.text}
\`From: https://twitter.com/${user}/status/${tweet.id} \`
      `;
    slackOptions["text"] = sendText;

    /**
     * Data post
     */
    request.post({ url: SLACK_API_URL + "chat.postMessage", formData: slackOptions }, function (error: any, response: any, body: any) {
      if (!error && response.statusCode == 200) {
        console.log("ok");
        resolve("ok");
      } else {
        console.log("status code: " + response.statusCode);
      }
    });
  });
};

/**
 * slack notification
 */
const notificationPost = () => {
  const notificationOptions: {
    token: string;
    channel?: string;
    text?: string;
  } = {
    token: SLACK_BOT_TOKEN,
    channel: "twitter-bot-notification",
    text: `send start: ${new Date()}`,
  };
  request.post({ url: SLACK_API_URL + "chat.postMessage", formData: notificationOptions }, function (error: any, response: any, body: any) {
    if (!error && response.statusCode == 200) {
      console.log("ok");
    } else {
      console.log("status code: " + response.statusCode);
    }
  });
};

const send = async (): Promise<void> => {
  notificationPost();

  const _now = new Date(Math.ceil(new Date().getTime() / 1000 / 60 / 5) * 1000 * 60 * 5);
  const now = _now.toISOString();
  const _before5min = new Date(_now.getTime() - interval * 60 * 1000);
  const before5min = _before5min.toISOString();
  const userTweetArray: {
    [name: string]: any;
  } = {};

  for (let user of Object.keys(TWITTER_USERS)) {
    const id: any = await getTwitterUserID(user);
    const tweetObj: any = await getTweet(id.data.id, now, before5min);
    const tweets: any = tweetObj._realData.data;
    // 空だったらスキップ
    if (tweets === undefined) continue;
    userTweetArray[user] = tweets;
  }

  // 空だったら処理終了
  if (userTweetArray === {}) return;

  for (let user of Object.keys(userTweetArray)) {
    if (userTweetArray[user] === undefined) continue; // 保険（データがない場合はスキップ）

    let tweetsData: any = await returnOneUserTweets(userTweetArray[user]);
    for (let tweet of tweetsData.reverse()) {
      await postSlack(user, tweet);
    }
  }
};
/**
 * cron start
 */
cron.schedule(`0 */${interval} * * * *`, async () => await send(), {
  timezone: "Asia/Tokyo",
});

/**
 * once test
 */
// send();
