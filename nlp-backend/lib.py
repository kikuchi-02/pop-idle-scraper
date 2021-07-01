from pprint import pprint
from typing import Dict, List

import spacy
from ginza import *
from pydantic import BaseModel

nlp = spacy.load("ja_ginza")
# doc = nlp("銀座でランチをご一緒しましょう。明日はきっと腫れ。")
# for sent in doc.sents:
#     for token in sent:
#         print(
#             token.i,
#             token.orth_,
#             token.lemma_,
#             token.pos_,
#             token.tag_,
#             # token.dep_,
#             # token.head.i,
#         )
#         # print(token)
#     print("EOS")


def tokenize(text: str) -> List[List[str]]:
    doc = nlp(text)
    sentences = [
        [[token.orth_, token.lemma_, token.pos_, token.tag_] for token in sent]
        for sent in doc.sents
    ]
    return sentences


class ConstituencyIn(BaseModel):
    textBlocks: List[str]


class ConstituencyOut(BaseModel):
    subjI: int
    subjToken: str
    objI: int
    objToken: str


def constituency_parse(text_blocks: ConstituencyIn) -> List[List[ConstituencyOut]]:
    result = []
    for text in text_blocks:
        doc = nlp(text)
        tokens = [token for sent in doc.sents for token in sent]
        pair_list: List[ConstituencyOut] = [
            {
                "subjI": token.i,
                "subjToken": str(token),
                "objI": token.head.i,
                "objToken": str(token.head),
            }
            for token in tokens
            if token.dep_ in ["nsubj", "iobj"]
        ]
        result.append(pair_list)
    return result


if __name__ == "__main__":
    text = "銀座でランチをご一緒しましょう。明日はきっと腫れ。"
    pprint(constituency_parse(text))
    while True:
        print("input here: ", end="")
        text = input()
        pprint(tokenize(text))
