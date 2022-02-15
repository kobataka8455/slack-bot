/**
 * interval:周回する間隔
 * TWITTER_USERS:ツイッタユーザーの登録/投稿するSlackチャンネルの設定
 */
// global setting
export const interval = 5; // unit:min

export const TWITTER_USERS: {
  [userID: string]: { slackChannelName: string };
} = {
  // hobby
  ha2wa: { slackChannelName: "twitter-葉庭" },
  mimi_puru: { slackChannelName: "twitter-魅未_ぷるぷる" },
  heavenburnsred: { slackChannelName: "twitter-ヘブンバーンズレッド" },
  ponkan_8: { slackChannelName: "twitter-ぽんかん" },

  // work
  fladdict: { slackChannelName: "twitter-深津さん_the-guild_note" },
  clockmaker: { slackChannelName: "twitter-池田-泰延_ics" },
  tsubotax: { slackChannelName: "twitter-坪田-朋_クラシル" },
  muuuuu_org: { slackChannelName: "twitter-muuuuu_org" },
  webcreatorbox: { slackChannelName: "twitter-webcreatorbox" },
};
