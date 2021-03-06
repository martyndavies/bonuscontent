const atob = require('atob');

const {
  API_KEY,
  API_SECRET,
  APPLICATION_ID,
  CONTENT_URL,
  SENDER
} = process.env;

const loki = require('lokijs');
const db = new loki('loki.json');
const respondents = db.addCollection('respondents');

const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: API_KEY,
  apiSecret: API_SECRET,
  applicationId: APPLICATION_ID,
  privateKey:
    typeof process.env.PRIVATE_KEY !== 'undefined'
      ? atob(process.env.PRIVATE_KEY)
      : './private.key'
});

module.exports = {
  inbound: async ctx => {
    const { msisdn, messageId } = ctx.request.body;
    const message = `Thanks for participating! Your bonus content can be found at ${CONTENT_URL}?ref=${messageId}`;

    respondents.insert(ctx.request.body);

    nexmo.channel.send(
      { type: 'sms', number: msisdn },
      { type: 'sms', number: SENDER },
      {
        content: {
          type: 'text',
          text: message
        }
      },
      (err, data) => {
        if (data) {
          ctx.status = 200;
        } else {
          throw err;
        }
      }
    );
    ctx.status = 200;
  },
  getRespondents: async ctx => {
    const result = await respondents.find();
    ctx.body = { amountOfInteractions: result.length };
  }
};
