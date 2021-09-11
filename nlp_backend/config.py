import json
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict

from pydantic import BaseSettings


@lru_cache()
def get_settings():
    return Settings()


def json_config_settings_source(settings: BaseSettings) -> Dict[str, Any]:
    """
    A simple settings source that loads variables from a JSON file
    at the project's root.

    Here we happen to choose to use the `env_file_encoding` from Config
    when reading `config.json`
    """
    encoding = settings.__config__.env_file_encoding
    return json.loads(Path("../env.json").read_text(encoding))


class TwitterSettings(BaseSettings):
    API_KEY: str
    API_SECRET_KEY: str
    BEARER_TOKEN: str
    ACCESS_TOKEN: str
    ACCESS_TOKEN_SECRET: str


class LineSettings(BaseSettings):
    CHANNEL_ACCESS_TOKEN: str


class DiscordSettings(BaseSettings):
    URL: str


class RedisSettings(BaseSettings):
    HOST: str
    PORT: int


class DatabaseSettings(BaseSettings):
    NAME: str
    HOST: str
    PORT: int
    USER: str
    PASSWORD: str


class Settings(BaseSettings):
    TWITTER: TwitterSettings
    LINE: LineSettings
    DISCORD: DiscordSettings
    REDIS: RedisSettings
    SALT_ROUND: int
    DATABASE: DatabaseSettings
    SECRET: str

    class Config:
        env_file_encoding = "utf-8"

        @classmethod
        def customise_sources(
            cls,
            init_settings,
            env_settings,
            file_secret_settings,
        ):
            return (
                init_settings,
                json_config_settings_source,
                env_settings,
                file_secret_settings,
            )
