const loki = require('lokijs');

module.exports = {
  inbound: async ctx => {
    console.log(ctx.request.body);
  }
};
