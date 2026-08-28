# Hermes Marketplace Bot 🤖🛒

بات تلگرام مارکت‌پلیس محصولات دیجیتال، مجهز به **Hermes Agent**.

کاربران با انجام تسک‌های ساده (فالو/ساب) کردیت می‌گیرند، با کمک هرمس محصول
می‌سازند (آموزش، قالب، فایل و...) و آن را در مارکت به فروش می‌رسانند.
درآمد پلتفرم: کمیسیون فروش + فروش تبلیغات (تسک).

---

## 🚀 راه‌اندازی سریع

```bat
cd marketplace-bot
copy .env.example .env
:: فایل .env را ویرایش کنید (BOT_TOKEN حداقل)
run.bat
```

یا دستی:

```bash
python -m venv venv
venv\Scripts\pip install -r requirements.txt
venv\Scripts\python bot.py
```

## 🔌 اتصال به هرمس

موتور AI بات (`hermes_engine.py`) سه بک‌اند دارد و `HERMES_MODE` را می‌شناسد:

| Mode | توضیح | پیش‌نیاز |
|------|-------|----------|
| `cli` | اجرای واقعی Hermes Agent برای هر پیام: `hermes chat -q ... -Q` + resume خودکار session | نصب hermes-agent (`pip install -e .` از ریپو) |
| `http` | POST به یک سرور gateway سازگار (`{message, user_id, session_id}` → `{response, session_id}`) | `HERMES_GATEWAY_URL` |
| `api` | فراخوانی مستقیم OpenAI-compatible API (بدون ابزارهای هرمس) | `AI_API_KEY` |

- حالت پیش‌فرض `auto` است: اول CLI، بعد HTTP، بعد API.
- در حالت `cli/http` هر کاربر تلگرام یک **session جداگانه هرمس** دارد که در جدول
  `hermes_sessions` ذخیره می‌شود؛ یعنی حافظه مکالمه بین پیام‌ها حفظ می‌ماند.
- خروجی quiet-mode هرمس (`session_id:` روی stderr) به‌صورت خودکار پارس می‌شود.

نمونه تنظیم `.env` برای حالت CLI:

```
HERMES_MODE=cli
HERMES_CMD=hermes
HERMES_PROFILE=marketplace
```

## 💰 اقتصاد برنامه

- **کردیت** واحد پول است. ۵۰ کردیت هدیه ثبت‌نام.
- تسک = تبلیغ: مثلاً «۲۰۰۰ فالو × ۵ کردیت» = ۱۰,۰۰۰ کردیت از تبلیغ‌کننده کم و
  بین انجام‌دهندگان تقسیم می‌شود.
- کمیسیون فروش: پیش‌فرض ۱۰٪ (`COMMISSION_RATE`) — به فروشنده می‌رسد، بقیه سهم پلتفرم.
- شمارنده `products_sold` فروشنده پس از هر فروش به‌روز می‌شود (لیدربرد/پروفایل).

## 🧩 ساختار

```
bot.py              # نقطه ورود
config.py           # تنظیمات (+ load_dotenv)
database.py         # SQLite: users/tasks/products/purchases/follows/engagement/comments/skills
hermes_engine.py    # موتور AI: cli / http / api + session per user
ai_agent.py         # پرامپت هرمسا + smart_messages (مهارت + حافظه + فشرده‌سازی)
memory.py           # حافظه بلندمدت: provider ها + پروفایل خرید + پیشنهاد شخصی
skills.py           # مهارت‌ها با فرمت SKILL.md هرمس + تزریق relevance-ranked
app_api.py          # API مینی‌اپ: auth تلگرام، فید، engage، خرید، استور، والت
tools.py            # ۱۵+ ابزار ایجنت (سرچ/دانش/وب/سندباکس/کاور/list_skills…)
fleet.py            # تیم چند-ایجنتی (Atlas) برای سؤال‌های سنگین
cron_jobs.py        # گزارش روزانه + بکاپ خودکار تلگرامی + یادآورها
web_admin.py        # سرور وب: داشبورد ادمین + فروشگاه + مینی‌اپ + بکاپ/بازیابی
a2a_server.py       # API ماشین-به-ماشین (اختیاری، A2A_PORT)
utils.py            # ارسال امن Markdown + ChatStream استریم انسانی
platforms.py        # گیت‌وی چند-پلتفرمی (دیسکورد و…)
handlers/
  start.py          # منوی اصلی + دروازه کانال + خوش‌آمد
  tasks.py          # تسک و کسب کردیت (ساخت تسک داخل FSM)
  products.py       # ساخت محصول (AI یا دستی) + آپلود فایل
  marketplace.py    # فروشگاه + جستجو + 🎯 پیشنهاد شخصی + خرید + کمیسیون
  ai_chat.py        # چت هرمسا (استریم انسانی) + سندساز + کریدیت‌گذاری
  wallet.py         # کیف پول: واریز/برداشت + نوار پیشرفت + تاریخچه دلاری
  profile.py        # پروفایل + نردبان رتبه + 🧠 حافظه من + لیدربرد
  admin.py          # /admin, /addcredits, broadcast همگانی
web/
  app/              # 📱 DropAgentX Mini App — SPA فارسی RTL
    index.html      #   پوسته + TG SDK + router
    css/            #   design-system.css + pages.css
    js/core/        #   tg.js · api.js · router.js · ui.js
    js/pages/       #   home · explore · search · product · create · profile · wallet · activity · agent
  storefront.html   # فروشگاه قدیمی (legacy → /shop)
  admin.html        # پنل ادمین: آمار، مودریشن، مالی، کاربران+حافظه، بکاپ، مهارت‌ها
  login.html        # ورود ادمین (WEB_PASSWORD)
  senpai/           # کاکپیت AI ادمین (/cockpit)
```

## 🌐 داشبورد وب و فروشگاه عمومی

با `WEB_PORT=8080` در `.env` (و `WEB_PASSWORD` برای پنل ادمین) دو رابط وب بالا می‌آید:

| مسیر | توضیح |
|------|-------|
| `/` | **فروشگاه عمومی**: کاتالوگ محصولات تأییدشده + جستجو + دسته‌ها + امتیاز ستاره + لیدربرد. خرید فقط از بات تلگرام (دکمه Open in Telegram). |
| `/admin` | **پنل ادمین**: KPI ها + نمودار ۱۴ روزه (فروش/ثبت‌نام)، مودریشن محصول (تأیید/رد)، واریزها (شارژ کردیت)، برداشت‌ها (پرداخت/رد+برگشت)، کاربران (بن، ±کردیت)، تسک‌ها، سشن‌های هرمس، برودکست همگانی، ویرایش جدول settings. |
| /cockpit | 🧠 **کاکپیت AI ادمین** (نیاز به کوکی ادمین): چت‌کوک SenPai Neural OS — اتصال مستقیم مرورگر به راوتر خودت، استریم، Mission/Council، شمارندهٔ توکن. کلید API فقط در localStorage مرورگر خودت. |

- احراز هویت ادمین با کوک HMAC-signed (7 روزه)؛ رمز از `WEB_PASSWORD`، امضا از `WEB_SECRET` (یا BOT_TOKEN).
- اگر از داخل `bot.py` اجرا شود (پیش‌فرض)، برودکست و نوتیفیکیشن تلگرامی هم فعال است؛ به‌صورت مستقل هم کار می‌کند: `python web_admin.py`
- سرور همان دیتابیس singleton بات را بازخوانی می‌کند — بدون دیتابیس دوم، بدون sync.
- تب کاربران → دکمه 🧠: مشاهده/افزودن/حذف حافظهٔ بلندمدت هر کاربر + ساخت پرسونای AI.

## 🧠 حافظه بلندمدت (memory providers + پروفایل خرید)

معماری پلاگین‌پذیر به سبک Hermes Agent — `memory.py`:

| لایه | جدول | توضیح |
|------|------|-------|
| خاطرات ماندگار | `user_memories` | ترجیح/علاقه/مهارت/هدف، استخراج خودکار دوره‌ای از چت (هر N پیام، JSON contract)، dedup با SHA1، امتیاز اهمیت ۱-۵ |
| پروفایل خرید | `user_profile` | تعداد/مبلغ خریدها، تاریخچه دسته‌ها (rolling 12)، پرسونای AI یک‌جمله‌ای |
| recall | — | رتبه‌بندی relevance = اهمیت × decay زمانی × هم‌پوشانی کلمات؛ تزریق ~۸۰۰ کاراکتری به system prompt چت و حلقه ابزارها |
| پیشنهاد | 🎯 «برای تو» در مارکت | affinity دسته‌ای از خریدها+علاقه‌ها × ستاره/فروش؛ محصولات خریده‌شده حذف می‌شوند |

- Provider قابل تعویض: `MEMORY_PROVIDER=sqlite` (پیش‌فرض). بک‌اند جدید (mem0/honcho/…) فقط با `register_provider(MyProvider)` — همان ABC.
- کنترل هزینه: استخراج هر ۶ پیام (`/set memory_extract_every N`)، خاموشی کامل با `/set memory_enabled 0`.
- حریم خصوصی کاربر: پروفایل ← «🧠 حافظه من» ← دیدن همهٔ خاطرات + دکمه «🗑 فراموش کن» (فقط لایه بلندمدت پاک می‌شود).

## 🛡 بکاپ و مهاجرت (دیتا کجاست و چطور نجاتش بدیم)

کل داده = **یک فایل SQLite** (`DB_PATH`، روی Railway: `/data/marketplace.db` روی Volume) + پوشهٔ آپلودها (`UPLOAD_DIR`). سه لایهٔ محافظت:

1. **بکاپ خودکار روزانه** — cron هر روز (ساعت `BACKUP_HOUR`، پیش‌فرض ۴) یک snapshot سازگار می‌گیرد، آخرین ۷ نسخه را در `data/backups/` نگه می‌دارد و همان فایل را به چت همهٔ ادمین‌ها می‌فرستد (`BACKUP_TO_TELEGRAM=1`). یعنی همیشه یک نسخهٔ خارج از سرور داری.
2. **دانلود دستی از پنل** — `/admin` ← تب تنظیمات ← «⬇️ دانلود دیتابیس» (+ ZIP آپلودها).
3. **بازیابی با دو کلیک** — همان‌جا «⬆️ بازیابی دیتابیس»: فایل `.db` را بده ← integrity-check خودکار ← صف بازیابی ← **Restart سرویس** ← جایگزین می‌شود (نسخهٔ قبلی `.pre-restore.bak`).

**مهاجرت به Railway جدید یا VPS:** دانلود دیتابیس + ZIP آپلودها از پنل قدیمی → در مقصد deploy کن → در پنل جدید بازیابی + Restart → تمام. برای VPS: فایل‌ها را در `data/` بگذار و `docker compose up -d`.

## 🧩 سیستم مهارت‌ها (فرمت هرمس Agent)

هرمسا از **SKILL.md های فرمت رسمی هرمس** پشتیبانی می‌کند — ساختار `پوشه/SKILL.md` با YAML frontmatter:

```markdown
---
name: selling-tips
description: "راهنمای فروش بهتر و قیمت‌گذاری کردیتی"
version: 1.0.0
tags: [فروش, قیمت‌گذاری]
---
# دستورالعمل...
```

- **تزریق هوشمند**: فهرست فشردهٔ همهٔ مهارت‌های فعال همیشه در پرامپت + متن کاملِ ۲ مهارتِ مرتبط‌ترین با پیام کاربر (امتیازدهی کلیدواژه‌ای روی نام/توضیح/تگ)
- **ابزار ایجنت**: هرمسا خودش `list_skills` و `load_skill` را صدا می‌زند
- **کنترل ادمین**: پنل وب ← تب «🧩 مهارت‌ها» ← افزودن (فایل .md یا تایپ)، روشن/خاموش، حذف
- ذخیره روی Volume (`data/skills/`) → داخل بکاپ‌ها هم هست · خاموشی سراسری: `/set skills_enabled 0`

## ✅ رفع اشکالات نسخه قبل

- `.env` لود نمی‌شد → `load_dotenv()` اضافه شد.
- دکمه جستجوی مارکت بدون هندلر ورودی بود → FSM اضافه شد.
- هندلر سراسری پیام‌های دارای `|` همه چیز را می‌دزدید → به FSM محدود شد.
- دکمه‌های مرده (Edit Manually، Save as Product، Add Credits، Broadcast) پیاده‌سازی شدند.
- `products_sold` هیچ‌وقت زیاد نمی‌شد → در خرید آپدیت می‌شود.
- کرش Markdown روی خروجی AI/username ها → `send_safe/edit_safe`.
- callback بی‌جواب (query timeout) → همه هندلرها `callback.answer()` دارند.

## 🔐 Hardening v2

در شاخهٔ `hardening-v2` مسیر خرید بات و Mini App از primitive مشترک `commerce.py`
استفاده می‌کند: موجودی، idempotency، ledger، فروش و `products_sold` در یک تراکنش
SQLite ثبت می‌شوند. فایل‌های دیجیتال فقط برای خریدار احراز‌شده تحویل می‌شوند و
مسیرهای public، مسیر واقعی فایل را برنمی‌گردانند.

### تأیید زنجیره و پرداخت خودکار

`blockchain.py` برای TRON، BSC، Base، Solana و TON adapter خواندن تراکنش دارد.
Worker با `TREASURY_AUTO_ENABLED=1` فعال می‌شود. برای امضای payout، به‌جای ذخیره
private key در بات، یک سرویس خارجی idempotent در `PAYOUT_API_URL` تنظیم کن؛ باید
هدر `Idempotency-Key` را پشتیبانی کند و `{ok:true,txid}` برگرداند.

بدون RPC/indexer و payout provider، worker fail-closed است و هیچ credit یا پرداختی
را حدس نمی‌زند. ابتدا با staging/test data تست کن.

### تست و نصب

```bash
python -m pip install -r requirements-dev.txt
pytest
python -m compileall -q .
```

نسخه‌های resolve‌شده در `requirements.lock` و CI در `.github/workflows/ci.yml`
قرار دارد. `LICENSE` تحت MIT اضافه شده است.
