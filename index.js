const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require('grammy');
require('dotenv').config();
const {hydrate} = require('@grammyjs/hydrate')

const bot = new Bot(process.env.BOT_API);
bot.use(hydrate());

bot.api.setMyCommands([
    {
        command: 'start', 
        description: 'Запуск бота',
    },
    {
        command: 'our_website',
        description: 'переходите на наш сайт!'
    },
    {
        command: 'menu',
        description: 'меню с доп. функциями'
    }
]);

bot.command('start', async (ctx) => {
    await ctx.reply('Давайте начнем готовить!!!👩🏻‍🍳');
});

const menuKeyboard = new InlineKeyboard()
.text('Правила пользования', 'supp').row()
.text('список рецептов', 'shop')
const backKeyboard = new InlineKeyboard().text('👈🏻 Назад в меню', 'back')
const back2Keyboard = new InlineKeyboard().text('👈🏻 Назад в меню', 'back2')

bot.command('menu', async (ctx) => {
    await ctx.reply('меню с доп. функциями', {
        reply_markup: menuKeyboard
    });
});
const shopKeyboard = new InlineKeyboard()
    .text('Шарлотка', 'sharlotka').row()
    .text('r', 'r1').row()
    .text('r', 'r2').row()
    .text('r', 'r3').row()
    .text('👈🏻 Назад в меню', 'back')

bot.callbackQuery('shop', async (ctx) => {
    await ctx.answerCallbackQuery();//важно нужно в каждом обработчике клавиатуры чтобы заработало
    await ctx.callbackQuery.message.editText('вот некоторые виды сайтов для заказа:', {
        reply_markup: shopKeyboard
    });
});

bot.callbackQuery('sharlotka', async (ctx) => {
    await ctx.answerCallbackQuery();//важно нужно в каждом обработчике клавиатуры чтобы заработало
    await ctx.callbackQuery.message.editText('рецепт шарлотки:', {
        reply_markup: back2Keyboard
    });
    await ctx.replyWithPhoto('https://i.pinimg.com/736x/aa/07/ee/aa07eec8584ed62e72aa2e983485c091.jpg', { caption: 'вот такая красота у вас получиться. Ингридиенты: \n 1.куриные яйца — 4 шт.; \n 2.сахарный песок — 200г.; \n 3.мука пшеничная хлебопекарная — 200г.; \n 4.разрыхлитель — 1 ч. л.; \n 5.яблоки (советуют брать кисло-сладкие) — 3–4 шт.; \n 6.ванильный сахар — по вкусу; \n 7.сливочное масло — для смазывания формы.' });
});

bot.callbackQuery('back2', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.callbackQuery.message.editText('вот некоторые услуги которые у нас есть', {
        reply_markup: shopKeyboard
    });
});

bot.callbackQuery('supp', async (ctx) => {
    await ctx.answerCallbackQuery();//важно нужно в каждом обработчике клавиатуры чтобы заработало
    await ctx.callbackQuery.message.editText('<b>Правила пользования</b>: \n 1.Необходимо быть вежливым и уважительным в общении с ботом. \n 2.Не допускаются оскорбления, угрозы, призывы к насилию или другие неприемлемые высказывания. \n 3.Бот предназначен для получения информации о услугах веб студии STUDIO, задавайте вопросы, связанные с деятельностью студии. \n 4.Не стоит отправлять боту рекламные сообщения или спам. \n 5.В случае возникновения проблем или вопросов, обратитесь за помощью к администратору бота. \n 6.Пожалуйста, не делайте запросы, которые не относятся к работе и услугам веб студии STUDIO. \n 7.Используйте бот ответственно, не поощряйте незаконные или мошеннические действия. \n 8.Все данные, предоставленные боту, будут использованы конфиденциально и безопасно. \n 9.Учтите, что бот может быть временно недоступен или ответить с задержкой, будьте терпеливы. \n 10.Пользуйтесь ботом с удовольствием и получайте полезную информацию о веб студии STUDIO.', {
        reply_markup: backKeyboard,
        parse_mode: 'HTML'
    });
});

bot.callbackQuery('back', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.callbackQuery.message.editText('Выберите пункт меню', {
        reply_markup: menuKeyboard
    });
});

bot.command('add', async (ctx) => {
    await ctx.reply('напишите ваше предложение по добавлению новых функций в бота указав в любом месте предложения !ADD')
})

bot.command('our_website', async (ctx) => {
/*     const inlineKeyboard = new InlineKeyboard()
    .text('1', 'btn-1').row()
    .text('2', 'btn-2').row()
    .text('3', 'btn-3') */

    const inlineKeyboard2 = new InlineKeyboard().url('перейти на сайт', 'http://e36957342g.temp.swtest.ru')
    await ctx.reply('У нас есть чем вас удивить', {
        reply_markup: inlineKeyboard2
    });
});

/* bot.hears('Интернет-магазин', async (ctx) => {
    await ctx.reply('прекрасно!', {
        reply_parameters: {message_id: ctx.msg.message_id}
    });
}); */
/* const PhoneKeyboard = new Keyboard().requestContact('отправить номер').placeholder('Отправить контакт').resized().oneTime()
bot.hears('Интернет-магазин', async (ctx) => {
    await ctx.reply('мы вас поняли оставьте телефон чтобы наш менеджер перезвонил вам.', {
        reply_markup: {remove_keyboard: true}
    });  

    await ctx.reply('мы храним в безопастности данные наших клиентов \ это прописанно в <a href="#">политке конфиденциальности</a>', {
        reply_markup: PhoneKeyboard,
        parse_mode: 'HTML',
        reply_markup: {remove_keyboard: true}
    })
}); */

bot.on('message:voice', async (ctx) => {
    await ctx.reply('❌ Эта команда еще в разработке напишите текстом')
});

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;

    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    } else {
        console.error("Unknown error:", e);
    }
});



bot.start();
