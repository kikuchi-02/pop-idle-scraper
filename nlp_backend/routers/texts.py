import re
from collections import Counter
from itertools import chain

from fastapi import APIRouter, Body
from janome.tokenizer import Token
from models import ScriptBody
from utils.tokens import get_tokenizer

router = APIRouter()


split_pos = {"句点", "読点", "並立助詞", "係助詞", "連語", "接続助詞"}
next_unsplittable = {*split_pos, "非自立", "助動詞"}


def splittable(token: Token, next_token=None) -> bool:
    if token.surface == "\n":
        return True

    pos = token.part_of_speech.split(",")
    next_pos = next_token.part_of_speech.split(",") if next_token is not None else []

    split_characters = ["。", "、", "？", "！"]

    is_next_split = next_token is not None and (
        next_token.surface in split_characters or any((p in next_pos for p in next_pos))
    )

    splittable = (
        any((p in split_pos for p in pos)) or token.surface in split_characters
    ) and not is_next_split

    return splittable


@router.post("/newline")
def split_by_new_line(body: ScriptBody = Body(..., embedded=True)):
    splitted_token = []
    str = ""
    token = None
    tokenizer = get_tokenizer()
    for next_token in chain(tokenizer.tokenize(body.text), (None,)):
        if token is None or next_token is None:
            token = next_token
            continue
        str += token.surface
        if splittable(token, next_token):
            str = str.replace("。", "。\n").replace("☆", "\n☆\n\n\n")
            if str == "\n":
                splitted_token.push("")
            else:
                splitted_token.extend(str.split("\n"))
            str = ""

        token = next_token

    if str != "":
        splitted_token.append(str)
    return splitted_token


@router.post("/phonetics")
def generate_phonetics(body: ScriptBody = Body(..., embedded=True)):
    text = re.sub(r"（[^）]*）", "", body.text)
    input_unknown_indexes = []
    output_unknown_indexes = []
    output_warning_indexes = []
    result = []
    inputIndex = 0
    outputIndex = 0

    token = None
    tokenizer = get_tokenizer()
    for next_token in chain(tokenizer.tokenize(text), (None,)):
        if token is None or next_token is None:
            token = next_token
            continue

        outputLength: int
        inputLength = len(token.surface)
        features = token.part_of_speech.split(",")

        # should be ignored
        if "☆" == token.surface:
            inputIndex += len(token.surface)

            token = next_token
            continue

        if features[1] == "数":
            output_warning_indexes.append(
                {"start": outputIndex, "end": outputIndex + len(token.surface)}
            )

        if token.infl_type == "特殊・マス" and next_token.surface == "。":
            pronunciation = "マ_ス"
            result.append(pronunciation)
            outputLength = len(pronunciation)
        elif token.node_type != "UNKNOWN" and token.phonetic != "*":
            result.append(token.phonetic)
            outputLength = len(token.phonetic)
        elif token.surface.strip() == "":
            result.append(token.surface)
            outputLength = len(token.surface)
        else:
            result.append(token.surface)
            input_unknown_indexes.append(
                {
                    "word": token.surface,
                    "start": inputIndex,
                    "end": inputIndex + inputLength,
                }
            )
            outputLength = len(token.surface)
            output_unknown_indexes.append(
                {
                    "word": token.surface,
                    "start": outputIndex,
                    "end": outputIndex + outputLength,
                }
            )

        inputIndex += len(token.surface)
        outputIndex += outputLength

        token = next_token
    return {
        "text": "".join(result),
        "input_unknown_indexes": input_unknown_indexes,
        "output_unknown_indexes": output_unknown_indexes,
        "output_warning_indexes": output_warning_indexes,
    }


@router.post("/tags")
def extract_tags(body: ScriptBody = Body(..., embedded=True)):
    text = body.text
    text = re.sub(r"（[^）]*）", "", text)
    text = re.sub(r"☆", "", text)
    tokenizer = get_tokenizer()
    tokens = (
        token.base_form
        for token in tokenizer.tokenize(text)
        if token.node_type != "UNKNOWN"
        and token.part_of_speech.split(",")[0] in ["名詞", "カスタム名詞"]
    )
    counter = Counter(tokens)
    return dict(counter.most_common(30))
