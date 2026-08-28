# DropAgentX v1.1.1 🤖💎

> **DropAgentX** — The Next-Gen Autonomous Social-Commerce Agent & Marketplace Engine powered by **Hermes AI**, Telegram Mini App (SPA), Dual Economy (Credits + Multi-Chain USDT), Vector-like Long-Term Memory, and Fractal Network Architecture.

[![Version](https://img.shields.io/badge/version-1.1.1-blue.svg)](V1.1.1-CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![CI Status](https://github.com/ImXforever/DropAgentXBot/workflows/CI/badge.svg)](.github/workflows/ci.yml)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Platform: Telegram + Web](https://img.shields.io/badge/platform-Telegram%20%7C%20Web%20MiniApp-0088cc.svg)](https://telegram.org)

---

## 🌟 What is DropAgentX?

**DropAgentX** is not just another Telegram bot — it is a complete, self-sustaining **Social-Commerce Ecosystem** driven by an autonomous AI Agent named **Hermesa**. It seamlessly merges chat intelligence, decentralized digital product marketplace, multi-chain USDT treasury, gamified social engagement, and web management dashboards into a unified platform.

Whether you're looking to run an AI-assisted marketplace, deploy an autonomous AI sales assistant, monetize digital content, or build a referral-driven community network, DropAgentX delivers enterprise-grade architecture out-of-the-box.

---

## 🔥 Key Highlights & Features

### 🧠 1. Multi-Engine Autonomous AI (Hermesa)
* **Hermes Agent Integration**: Supports `CLI` (direct binary execution with session persistence), `HTTP` Gateway, and direct OpenAI-compatible `API` backends (`auto` mode resolves gracefully).
* **Skill Matrix**: Dynamic load & relevance-ranked injection of `SKILL.md` documents (Hermes skill standard).
* **Multi-Agent Fleet**: Powered by `fleet.py` (Atlas Orchestrator) for parallel task distribution and multi-role collaborative reasoning.
* **Persistent Vector-like Memory**: Auto-extracts long-term user preferences, purchase profiles, and personal memories stored in SQLite FTS5 with privacy control (`/set memory_enabled`).

### 📱 2. Telegram Mini App (SPA) & Web Cockpit
* **Modern Web Interface**: Built-in Persian RTL Telegram Mini App with 6 interactive views (Home, Explore, Create, Wallet, Profile, Agent).
* **Web Admin Panel**: Secure, password-protected web dashboard (`/admin`) for analytics, transaction monitoring, content moderation, broadcast tools, and one-click database backup/restore.
* **AI Senpai Cockpit**: Direct browser-based interaction interface with Hermesa.

### 💰 3. Dual Economy & Multi-Chain Treasury
* **Dual Currency**: Internal `Credits` (earned via social micro-tasks, referrals, and daily engagement) + real `USDT` (on TON, BSC, Solana, TRX).
* **Telegram Stars (XTR)**: Native Telegram payments integration for frictionless zero-friction purchases.
* **Automated Blockchain Verification**: Multi-chain listener for incoming transactions with zero-trust idempotent treasury worker.
* **Atomic Financial Engine**: Single-transaction database ACID locks ensuring zero double-spending or credit collision during concurrent purchases.

### 👥 4. Growth & Fractal Referral Matrix
* **5-Tier Growth Mechanics**: Referral invite rewards, mystery boxes, milestone bonuses, and lifetime marketplace sales commissions.
* **Fractal Network Ranks**: Automated progression from Soldier to Capo and Underboss with tier-based override commissions.
* **Anti-Sybil & Security Shield**: Multi-layered IP rate-limiting, prompt injection sanitization, XSS defense, SSRF guards, and channel membership verification.

---

## 🏗 System Architecture & Directory Map

```
DropAgentX/
├── bot.py                  # Main entry point (Telegram Polling + Async Web Loop)
├── config.py               # Centralized configuration with .env environment validation
├── database.py             # Singleton SQLite engine (WAL mode, FTS5 index, integrity checks)
├── hermes_engine.py        # Multi-backend AI Gateway (CLI / HTTP / API modes + Session store)
├── ai_agent.py             # Hermesa system prompt & smart context compression
├── memory.py               # Vector-like long-term memory engine (SQLite & pluggable backends)
├── skills.py               # Hermes SKILL.md dynamic parser and relevance ranker
├── app_api.py              # Telegram Mini App API (Telegram initData HMAC validation)
├── tools.py                # 15+ Native Agent tools (Web Search, Code Execution, Cover AI)
├── fleet.py                # Atlas Multi-Agent Team (Parallel role distribution)
├── commerce.py             # Atomic transactional primitives for purchases and ledger
├── blockchain.py           # Multi-chain crypto transaction verification adapters
├── cron_jobs.py            # Automated daily backups to Telegram, cleanup & metrics
├── web_admin.py            # FastAPI Web Server (Admin Panel, Storefront, Media server)
├── a2a_server.py           # Agent-to-Agent machine interface (REST JSON-RPC)
├── handlers/               # Modular Telegram Handlers (160+ UI routes)
│   ├── start.py            # Welcome gate, referral tracking & main keyboard
│   ├── marketplace.py      # Digital catalog, personalized recommendations & buy flow
│   ├── products.py         # AI-assisted product creation & digital asset upload
│   ├── ai_chat.py          # Conversational AI with human-like streaming
│   ├── wallet.py           # Multi-chain USDT deposits, withdrawals & ledger
│   ├── profile.py          # User stats, rank progress & memory management
│   ├── tasks.py            # Earn credits via social engagement tasks
│   ├── referral.py         # Network referral matrix & mystery box claims
│   └── admin.py            # Granular admin command suite & mass broadcasts
└── web/                    # Embedded Web UI assets (MiniApp SPA, Admin, Cockpit)
```

---

## ⚡ Quick Start & Deployment Guide

### Prerequisites
* Python `3.10` or higher
* Telegram Bot Token (from [@BotFather](https://t.me/BotFather))
* OpenAI-compatible API Key (OpenAI, OpenRouter, DeepSeek, etc.)

### 1. Local Development Setup

```bash
# Clone the repository
git clone https://github.com/ImXforever/DropAgentXBot.git
cd DropAgentXBot

# Create & activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and supply your BOT_TOKEN, ADMIN_IDS, and AI_API_KEY

# Launch DropAgentX
python bot.py
```

---

### 2. Railway Deployment (Production Recommended) ☁️

DropAgentX is optimized for 1-click cloud deployment on [Railway](https://railway.com) using Docker volumes for persistent storage.

1. Fork or push this repository to your GitHub account.
2. Create a **New Project** on Railway → Select **Deploy from GitHub repo**.
3. Add a **Persistent Volume** mounted at `/data` under service settings.
4. Set the required **Environment Variables** in Railway (see table below).
5. Generate a **Public Domain** on port `8080`.

#### Essential Railway Environment Variables:

| Variable | Recommended Value | Description |
| :--- | :--- | :--- |
| `BOT_TOKEN` | `123456:ABC-DEF...` | Telegram Bot Token from @BotFather |
| `ADMIN_IDS` | `8198598635` | Comma-separated Telegram User IDs of Admins |
| `AI_API_KEY` | `sk-or-v1-...` | API Key for OpenRouter/OpenAI |
| `AI_BASE_URL` | `https://openrouter.ai/api/v1` | Base URL for LLM provider |
| `AI_MODEL` | `stealth/ox-alpha` | AI Model ID |
| `HERMES_MODE` | `api` | `api` (direct HTTP) or `cli` / `http` |
| `DB_PATH` | `/data/marketplace.db` | **Crucial**: Persistent DB path on volume |
| `UPLOAD_DIR` | `/data/uploads` | **Crucial**: Digital product files path on volume |
| `WEB_PORT` | `8080` | Port for Web Admin & MiniApp API |
| `WEB_PASSWORD` | `YourSecurePassword` | Admin Dashboard Password |
| `BOT_USERNAME` | `DropAgentXBot` | Bot Username (without `@`) |

---

## 🔒 Security & Data Preservation

* **Zero-Loss Data Isolation**: All database state (`marketplace.db`), user memories, transaction logs, and uploaded digital assets reside inside the persistent `/data` volume. Standard deployment pushes to GitHub **never overwrite or erase user data**.
* **Automated Offsite Backups**: Every night at 04:00 (configurable via `BACKUP_HOUR`), DropAgentX creates an ACID-compliant snapshot of the SQLite database and sends the encrypted copy directly to the Telegram Chat of all designated Admins (`BACKUP_TO_TELEGRAM=1`).
* **One-Click Hot Restore**: Restore full database states directly from the Web Admin Dashboard (`/admin`) with automatic integrity validation and roll-back protection (`.pre-restore.bak`).

---

## 🧪 Testing & Code Quality

DropAgentX includes comprehensive test coverage for core business logic, marketplace transactions, and security controls.

```bash
# Install development dependencies
pip install -r requirements-dev.txt

# Run pytest test suite
pytest

# Validate Python compilation
python -m compileall -q .
```

---

## 📄 License & Credits

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

* Developed & Maintained by **[ImXforever](https://github.com/ImXforever)**
* Driven by **[Hermes Agent AI](https://github.com)** Framework architecture.

---
<p align="center">Made with ❤️ for the Social Commerce & AI Agent Community</p>

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
