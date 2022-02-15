/**
 * interval:周回する間隔
 * TWITTER_USERS:ツイッタユーザーの登録/投稿するSlackチャンネルの設定
 */
// global setting
export const interval = 5; // unit:min

export const TWITTER_USERS: {
  [userID: string]: { slackChannelName: string };
} = {
  ha2wa: {
    slackChannelName: "99-bot-send-test",
  },
  mimi_puru: {
    slackChannelName: "99-bot-send-test",
  },
};
