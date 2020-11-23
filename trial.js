const {
    Telegraf,
    Stage,
    session,
} = require('telegraf');
const {
    generateUpdateMiddleware
} = require('telegraf-middleware-console-time');