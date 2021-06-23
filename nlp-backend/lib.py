from ginza import *
import spacy
from typing import List

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


if __name__ == "__main__":
    text = "銀座でランチをご一緒しましょう。明日はきっと腫れ。"
    print(tokenize(text))
