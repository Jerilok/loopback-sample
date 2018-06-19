'use strict';

const _ = require('lodash');

module.exports = function(App) {
  App.observe('before save', function updateTimestamp(ctx, next) {
    const userId = _.get(ctx, 'options.accessToken.userId');
    if (!userId) {
      return next('Not restricted access');
    }
    if (ctx.instance && ctx.isNewInstance) {
      ctx.instance.ownerId = userId;
    }
    next();
  });

  App.observe('access', function logQuery(ctx, next) {
    const userId = _.get(ctx, 'options.accessToken.userId');
    if (!userId) {
      return next('Not restricted access');
    }

    const where = _.get(ctx, 'query.where', {});
    where.ownerId = userId;
    _.set(ctx, 'query.where', where);
    next();
  });
};
