import os

from dotenv import load_dotenv
from dataclasses import dataclass, field

load_dotenv()

# Semantic version of the project. Bumped on each release so the bot, web UI and
# health checks can report which build is running.
VERSION = "1.1.1"
APP_NAME = "DropAgentX / Hermes Marketplace Bot"


def _int_list(env_key: str) -> list[int]:
    return [int(x) for x in os.getenv(env_key, "").split(",") if x.strip()]


@dataclass
class Config:
    BOT_TOKEN: str = os.getenv("BOT_TOKEN", "")

    # --- Hermes engine (see hermes_engine.py) ---
    # auto: prefer local `hermes` CLI, then HERMES_GATEWAY_URL, then plain API
    HERMES_MODE: str = os.getenv("HERMES_MODE", "auto")
    HERMES_CMD: str = os.getenv("HERMES_CMD", "hermes")
    HERMES_PROFILE: str = os.getenv("HERMES_PROFILE", "")
    HERMES_GATEWAY_URL: str = os.getenv("HERMES_GATEWAY_URL", "")
    HERMES_GATEWAY_TOKEN: str = os.getenv("HERMES_GATEWAY_TOKEN", "")
    HERMES_TIMEOUT: int = int(os.getenv("HERMES_TIMEOUT", "180"))
    HERMES_MAX_CONCURRENT: int = int(os.getenv("HERMES_MAX_CONCURRENT", "2"))

    # --- Fallback API backend (accepts OPENAI_* aliases too) ---
    AI_API_KEY: str = os.getenv("AI_API_KEY", "") or os.getenv("OPENAI_API_KEY", "")
    AI_BASE_URL: str = (
        os.getenv("AI_BASE_URL", "")
        or os.getenv("OPENAI_BASE_URL", "")
        or "https://openrouter.ai/api/v1"
    )
    AI_MODEL: str = os.getenv("AI_MODEL", "openai/gpt-4o-mini")

    ADMIN_IDS: list[int] = field(default_factory=lambda: _int_list("ADMIN_IDS"))

    DB_PATH: str = os.getenv("DB_PATH", "data/marketplace.db")
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")
    MAX_FILE_SIZE_MB: int = int(os.getenv("MAX_FILE_SIZE_MB", "50"))

    COMMISSION_RATE: float = float(os.getenv("COMMISSION_RATE", "0.10"))
    CREDITS_PER_FOLLOW: int = int(os.getenv("CREDITS_PER_FOLLOW", "5"))
    WELCOME_CREDITS: int = int(os.getenv("WELCOME_CREDITS", "50"))

    # --- USDT treasury (internal wallet) ---
    # 1000 credits == 1 USDT
    CREDITS_PER_USDT: int = int(os.getenv("CREDITS_PER_USDT", "1000"))
    DEPOSIT_MIN_USDT: float = float(os.getenv("DEPOSIT_MIN_USDT", "1"))
    WITHDRAW_MIN_USDT: float = float(os.getenv("WITHDRAW_MIN_USDT", "5"))
    # network fee (USDT) deducted from the withdrawal amount, per network key
    WITHDRAW_FEES: dict = field(default_factory=lambda: {
        "ton": float(os.getenv("FEE_TON", "0.5")),
        "bsc": float(os.getenv("FEE_BSC", "1")),
        "sol": float(os.getenv("FEE_SOL", "0.5")),
        "trx": float(os.getenv("FEE_TRX", "1")),
    })
    DEPOSIT_WALLETS: dict = field(default_factory=lambda: {
        "ton": os.getenv("WALLET_TON", ""),
        "bsc": os.getenv("WALLET_BSC", ""),   # BSC / BASE (EVM)
        "sol": os.getenv("WALLET_SOL", ""),
        "trx": os.getenv("WALLET_TRX", ""),
    })

    # --- Referral program ---
    # Two-sided bonus (Dropbox) paid ONLY after referee's first real action (Coinbase gate)
    REF_INVITE_BONUS_REFERRER: int = int(os.getenv("REF_INVITE_BONUS_REFERRER", "75"))
    REF_BONUS_REFEREE: int = int(os.getenv("REF_BONUS_REFEREE", "50"))
    # Instant mystery-box for referrer on each signup (Robinhood) — kept small vs farming
    REF_MYSTERY_MIN: int = int(os.getenv("REF_MYSTERY_MIN", "5"))
    REF_MYSTERY_MAX: int = int(os.getenv("REF_MYSTERY_MAX", "20"))
    # Lifetime share of platform commission on referred users' sales (Binance)
    REF_COMMISSION_SHARE: float = float(os.getenv("REF_COMMISSION_SHARE", "0.20"))
    # Milestone ladder (Tesla): qualified-referrals -> bonus credits
    REF_MILESTONES: dict = field(default_factory=lambda: {
        5: int(os.getenv("REF_MS_5", "250")),
        25: int(os.getenv("REF_MS_25", "1500")),
        100: int(os.getenv("REF_MS_100", "8000")),
    })

    # --- Fractal autonomy org ranks ---
    # associate -> soldier: automatic on first sale (king of own shop)
    # soldier -> capo: automatic at CAPO_MIN_REFS qualified referrals
    # underboss: appointed by godfather (ADMIN_IDS), domain = category
    CAPO_MIN_REFS: int = int(os.getenv("CAPO_MIN_REFS", "10"))
    CAPO_OVERRIDE_PCT: float = float(os.getenv("CAPO_OVERRIDE_PCT", "0.05"))


config = Config()
