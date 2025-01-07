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
        command: 'sites',
        description: 'выбор сайта: интернет магазин, лэндинг, сайт визитка и т.д.'
    },
    {
        command: 'share',
        description: 'Поделиться'
    },
    {
        command: 'our_website',
        description: 'переходите на наш сайт!'
    },
    {
        command: 'add',
        description: 'напишите что нам добавить' 
    },
    {
        command: 'menu',
        description: 'открыть меню'
    }
]);

bot.command('start', async (ctx) => {
    await ctx.reply('Привет я - бот команды STUDIO. Мы заботимся о том чтобы вам было еще удобнее пользоваться нашим сервисом', {
        /* reply_parameters: {message_id: ctx.msg.message_id} */
        /* parse_mode: 'HTML',
        disable_web_page_preview: 'True' */
    });
    await ctx.reply('В меню ты сможешь найти все что тебе нужно а если этого нет то напиши сообщение с add и мы добавим это в нашего бота')
    await ctx.reply('🎉')
});

const menuKeyboard = new InlineKeyboard().text('пройти консультацию', 'consultation').row()
.text('обратиться в поддержку', 'support').row()
.text('Правила пользования', 'supp')
const backKeyboard = new InlineKeyboard().text('👈🏻 Назад в меню', 'back')

bot.command('menu', async (ctx) => {
    await ctx.reply('Выберите пункт меню', {
        reply_markup: menuKeyboard
    });
});

bot.callbackQuery('consultation', async (ctx) => {
    await ctx.answerCallbackQuery();//важно нужно в каждом обработчике клавиатуры чтобы заработало
    await ctx.callbackQuery.message.editText('Прохождение консультации:', {
        reply_markup: backKeyboard
    });
});

bot.callbackQuery('supp', async (ctx) => {
    await ctx.answerCallbackQuery();//важно нужно в каждом обработчике клавиатуры чтобы заработало
    await ctx.callbackQuery.message.editText('<b>Правила пользования</b>: 1.Необходимо быть вежливым и уважительным в общении с ботом. 2.Не допускаются оскорбления, угрозы, призывы к насилию или другие неприемлемые высказывания. 3.Бот предназначен для получения информации о услугах веб студии STUDIO, задавайте вопросы, связанные с деятельностью студии. 4.Не стоит отправлять боту рекламные сообщения или спам. 5.В случае возникновения проблем или вопросов, обратитесь за помощью к администратору бота. 6.Пожалуйста, не делайте запросы, которые не относятся к работе и услугам веб студии STUDIO. 7.Используйте бот ответственно, не поощряйте незаконные или мошеннические действия. 8.Все данные, предоставленные боту, будут использованы конфиденциально и безопасно. 9.Учтите, что бот может быть временно недоступен или ответить с задержкой, будьте терпеливы. 10.Пользуйтесь ботом с удовольствием и получайте полезную информацию о веб студии STUDIO.', {
        reply_markup: backKeyboard,
        parse_mode: 'HTML'
    });
});

bot.callbackQuery('support', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.callbackQuery.message.editText('Напишите ваш запрос', {
        reply_markup: backKeyboard
    });
});

bot.callbackQuery('back', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.callbackQuery.message.editText('Выберите пункт меню', {
        reply_markup: menuKeyboard
    });
});

bot.command('add', async (ctx) => {
    await ctx.reply('напишите ваше предложение по добавлению новых функций в бота')
})

bot.command('mood', async (ctx) => {
    /* const moodKeyboard = new Keyboard().text('хорошо').row().text('норм').row().text('плохо').resized().oneTime() */
    const moodLabels = ['хорошо', 'норм', 'плохо']
    const rows = moodLabels.map((label) => {
        return [
            Keyboard.text(label)
        ]
    });
    const moodKeyboard2 = Keyboard.from(rows).resized()
    await ctx.reply('как настроение ?', {
        reply_markup: moodKeyboard2
    });
});

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

bot.callbackQuery(/btn-[1-3]/, async (ctx) => {
    await ctx.answerCallbackQuery()
    await ctx.reply('вы выбрали цифру')
    /* await ctx.reply(`Вы нажали кнопку ${ctx.callbackQuery.data}`) */
});

/* bot.on('callback_query:data', async (ctx) => {
    await ctx.answerCallbackQuery()
    await ctx.reply(`Вы нажали кнопку ${ctx.callbackQuery.data}`)
}); */

bot.command('sites', async (ctx) => {
    const siteKeyboard = new Keyboard().text('Интернет-магазин').row().text('Лэндинг').row().text('Визитка').row().text('Корпоративный сайт').row().text('Промо-сайт').oneTime().resized()
    await ctx.reply('Выберите сайт из предложенных вариантов:', {
        reply_markup: siteKeyboard
    });
});

bot.hears(/!ADD/, async (ctx) => {
    await ctx.reply('спасибо мы учтем ваши пожелания', {
        reply_parameters: {message_id: ctx.msg.message_id}
    });
    await ctx.reply('👌');
});

bot.hears('Интернет-магазин', async (ctx) => {
    await ctx.reply('прекрасно!', {
        reply_parameters: {message_id: ctx.msg.message_id}
    });
});

bot.hears([/пиздец/, /пизда/, /черт/, /гандон/, /педик/, /додик/, /блять/, /сука/, /сукин сын/, /пидорас/, /уебище/, /пидор/ ], async (ctx) => {
    await ctx.reply('Не советую а то бан полетит')
});

bot.hears(['#Studio', 'Studio'], async (ctx) => {
    await ctx.reply('Промокод принят наш менеджер вам позвонит.')
});

bot.hears('хорошо', async (ctx) => {
    await ctx.reply('супер!', {
        reply_markup: {remove_keyboard: true}
    });
});

bot.hears('ID', async (ctx) => {
    await ctx.reply(`Ваш ID: ${ctx.from.id}`)
});

bot.on(':contact', async (ctx) => {
    await ctx.reply('спасибо!')
});

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
