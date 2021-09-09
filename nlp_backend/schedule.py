import json
import collections
import re
import pandas as pd


def nogizaka():
    with open("nogizaka-member-link.buff") as f:
        members = json.load(f)
    names = list(set([m["name"] for m in members["value"]]))

    with open("nogizaka.json") as f:
        data = json.load(f)

    categories = [detail["category"] for d in data for detail in d["data"]]
    categories = list(set(categories))

    result = {c: {n: 0 for n in names} for c in categories}

    noMembers = []

    for d in data:
        if d['date'] < 202100:
            print(f'break at {d["date"]}')
            break
        for detail in d['data']:
            found = False
            for n in names:
                title = ''.join(detail['title'].split())
                if n in title:
                    found = True
                    result[detail['category']][n] += 1
            if not found:
                noMembers.append(title)

    df = pd.DataFrame(data=result)
    df.to_excel('nogizaka.xlsx')

    with open('nogizakaNoMember.json', 'w') as f:
        json.dump(noMembers, f, ensure_ascii=False)


def hinatazaka():
    with open("hinatazaka-member-link.buff") as f:
        members = json.load(f)
    names = list(set([m["name"] for m in members["value"]]))

    with open("hinatazaka.json") as f:
        data = json.load(f)

    medias = [d["media"] for d in data]
    medias = list(set(medias))

    result = {c: {n: 0 for n in names} for c in medias}

    noMembers = []

    for d in data:
        found = False
        for n in names:
            title = d['title']
            if n in d['members']:
                found = True
                result[d['media']][n] += 1
        if not found:
            noMembers.append(title)

    df = pd.DataFrame(data=result)
    df.to_excel('hinatazaka.xlsx')

    with open('hinatazakaNoMember.json', 'w') as f:
        json.dump(noMembers, f, ensure_ascii=False)


def sakurazaka():
    with open("sakurazaka-member-link.buff") as f:
        members = json.load(f)
    names = list(set([m["name"] for m in members["value"]]))

    with open("sakurazaka.json") as f:
        data = json.load(f)

    medias = [d["media"] for d in data]
    medias = list(set(medias))

    result = {c: {n: 0 for n in names} for c in medias}

    noMembers = []

    for d in data:
        found = False
        for n in names:
            title = d['title']
            if n in d['members']:
                found = True
                result[d['media']][n] += 1
        if not found:
            noMembers.append(title)

    df = pd.DataFrame(data=result)
    df.to_excel('sakurazaka.xlsx')

    with open('sakurazakaNoMember.json', 'w') as f:
        json.dump(noMembers, f, ensure_ascii=False)


if __name__ == "__main__":
    nogizaka()
    sakurazaka()
    hinatazaka()
