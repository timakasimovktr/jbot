const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf("8294824898:AAEAngJesONfc1EcnAn-ksLsQii2ZXQqfgo");

// ID админа
const ADMIN_ID = 693825152;
const CHANNEL_ID = "-1002942035724"; // канал курса

// --- Текст плана курса ---
const COURSE_PLAN = `
📚 *Kurs rejasi*

1️⃣ *Erkaklar va ayollar salomatligi*  
1. Ayollar anatomiyasi va funksiyasi  
2. Urologiyaga kirish: urolog nimani davolaydi?  
3. Gigiyena va jinsiy yo‘l bilan yuqadigan infeksiyalar  
4. Erkaklar va ayollar siydik-tanosil tizimining anatomiyasi va fiziologiyasi  
5. Erkaklar va ayollar uchun kontratsepsiya  

2️⃣ *PIKAP XXI ASRDA: yaqinlashuv fan sifatida*  
1. Erkaklar uchun jalb etish: alfa strategiyasi va xulq-atvori  
2. Ayollar uchun jozibadorlik: yumshoq kuch, signallar  
3. Pikap XXI asrda  
4. Erkakni qanday qilib o‘ziga jalb qilish mumkin – nigohdan yaqinlashuvgacha  
5. Ehtirosni uyg‘otuvchi atirlar va liboslar  

3️⃣ *Istak kimyosi: bizni boshqaradigan gormonlar*  
1. Testosteron – gormonlar qiroli  
2. Jinsiy aloqada xavfsizlik: holatlar, xavf-xatarlar va tana signallari  
3. Pornografiyaga qaramlik  
4. Hayz ko‘rish muammolari va PMS  
5. Prostatit xavflimi?  
6. Hayz va gormonlar cho‘qqisida erkak bilan qanday muloqot qilish kerak?  

4️⃣ *Psixologiya va seksologiya*  
1. Juftlikda ishonch va xavfsizlik  
2. Masturbatsiya: bu normal holatmi?  
3. 40 yoshdan keyingi jinsiy aloqa: agar hamma narsa o‘zgarsa, nima qilish kerak?  
4. Jinsiy aloqa haqida 10 ta afsona  
5. Nega ayol erkakga aylanadi?  
6. Qanday qilib erkakni manipulyatsiya qilish mumkin?  

5️⃣ *PRO orgazm*  
1. Partnyorni qanday ehtiroslantirish kerak  
2. Ko‘p martalik orgazm – bu afsona emas  
3. Ideal o‘lcham qaysi?  
4. Seksual fantaziyalar  
5. Ayolni qanday rom qilish va unga ta’sir o‘tkazish  

6️⃣ *Top 10 qaynoq savollar*  
1. Ginekologiya  
2. Psixolog & seksolog  
3. Urologiya  
4. Pikaper  

🎁 *Bonus materiallar*  
Bonus: Top 10 seks poza.
`;

// --- Старт ---
bot.start(async (ctx) => {
  await ctx.reply("👋 Assalomu aleykum! Siz kursga xush kelibsiz!");
  await ctx.reply(COURSE_PLAN, { parse_mode: "Markdown" });

  await ctx.replyWithVideo(
    {
      source: "lesson.mp4",
    },
    {
      caption: "Bu video sizga kurs haqida ko‘proq ma’lumot beradi.",
      supports_streaming: true,
      thumb: { source: "qqqq.png" },
    }
  );

  await ctx.reply(
    "🔥 Maxsus aksya!\n\n" +
      "Do‘stlar, bizda katta yangilik bor! 🎉\n" +
      "Kursimizning narxi 399 000 so‘m bo‘lgan bo‘lsa, endi faqat 99 000 so‘m 💥\n\n" +
      "✨ Bundan tashqari, sizga bonus .PDF qo‘llanma ham sovg‘a qilamiz!\n\n" +
      "⏳ Diqqat! Bu narx faqat 24 soat amal qiladi.\n" +
      "Shoshiling, aksiya tugaganidan keyin eski narx qaytadi.\n\n" +
      "👉 Hoziroq o‘qishni boshlang va bonusni qo‘lga kiriting!"
  );

  await ctx.replyWithDocument(
    {
      source: "bonus.pdf",
    },
    {
      caption: "Bu sizning bonus .PDF qo‘llanma."
    }
  );

  await ctx.reply(
    "📌 *Kursga qo‘shilish uchun:*\n\n" +
      "1\\. 99 000 so‘mni quyidagi kartaga o‘tkazing 💳\n" +
      "```K.T. 8600 5729 9639 7647```\n\n" +
      "2\\. To‘lov skrinshotini shu yerga yuboring ✅",
    {
      parse_mode: "MarkdownV2",
      reply_markup: {
        inline_keyboard: [
          [{ text: "💳 Kartani ko‘rish", callback_data: "copy_card" }],
          [{ text: "📨 Skrinshot yuborish", callback_data: "send_screenshot" }],
        ],
      },
    }
  );
});

// --- Приём чека ---
bot.on("photo", async (ctx) => {
  const user = ctx.from;

  await ctx.reply(
    "✅ Rahmat! To‘lovingiz tekshiriladi va sizga tez orada kirish beriladi."
  );

  // Уведомляем админа
  await ctx.telegram.sendMessage(
    ADMIN_ID,
    `📩 Yangi to‘lov!\n👤 @${user.username || user.id}\nID: ${user.id}`
  );

  const photos = ctx.message.photo;
  const fileId = photos[photos.length - 1].file_id;

  await ctx.telegram.sendPhoto(ADMIN_ID, fileId, {
    caption: `To‘lovni tasdiqlash kerakmi?`,
    reply_markup: {
      inline_keyboard: [
        [{ text: "✅ Tasdiqlash", callback_data: `approve_${user.id}` }],
        [{ text: "❌ Rad etish", callback_data: `reject_${user.id}` }],
      ],
    },
  });
});

// --- Обработка кнопок ---
bot.on("callback_query", async (ctx) => {
  const data = ctx.callbackQuery.data;

  // Пользовательские кнопки
  if (data === "copy_card") {
    await ctx.answerCbQuery("💳 8600 5729 9639 7647");
    await ctx.reply("💳 Mana karta raqami: `8600 5729 9639 7647`", {
      parse_mode: "MarkdownV2",
    });
  }

  if (data === "send_screenshot") {
    await ctx.answerCbQuery("📸 Endi skrinshot yuboring!");
    await ctx.reply("📸 Iltimos, to‘lov skrinshotini shu yerga yuboring.");
  }

  // Админские кнопки
  const [action, userId] = data.split("_");

  if (action === "approve") {
    await ctx.telegram.sendMessage(
      userId,
      "🎉 To‘lov tasdiqlandi! Kursga xush kelibsiz!"
    );

    const inviteLink = await ctx.telegram.exportChatInviteLink(CHANNEL_ID);
    await ctx.telegram.sendMessage(
      userId,
      `👉 Bu yerdan qo‘shiling: ${inviteLink}`
    );

    await ctx.answerCbQuery("✅ Foydalanuvchi qo‘shildi");
  }

  if (action === "reject") {
    await ctx.telegram.sendMessage(
      userId,
      "❌ To‘lov tasdiqlanmadi. Iltimos, qo‘llab-quvvatlash bilan bog‘laning."
    );
    await ctx.answerCbQuery("❌ Rad etildi");
  }
});

bot.launch();
