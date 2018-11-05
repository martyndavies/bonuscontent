if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const loki = require('lokijs');
const db = new loki('loki.json');
const respondents = db.addCollection('respondents');

const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
  applicationId: process.env.APPLICATION_ID,
  privateKey: './private.key'
});

module.exports = {
  inbound: async ctx => {
    const { msisdn } = ctx.request.body;
    const message = `Thanks for participating! Your bonus content can be found at ${
      process.env.CONTENT_URL
    }?ref=${msisdn}`;

    respondents.insert(ctx.request.body);

    nexmo.channel.send(
      { type: 'sms', number: msisdn },
      { type: 'sms', number: process.env.SENDER },
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
    ctx.body = result;
  }
};
