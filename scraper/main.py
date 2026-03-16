import requests
from bs4 import BeautifulSoup

URL = "https://mathworld.wolfram.com"
MAX_DESC_LEN = 500

def parse_index(f):
    print("parsing index..")

    res = requests.get(URL + "/letters")
    soup = BeautifulSoup(res.content, "html.parser")

    for a in soup.select("ul.topics-list li a"):
        parse_letter(a.get("href"), f)

def parse_letter(href, f):
    print(href)

    res = requests.get(URL + href)
    soup = BeautifulSoup(res.content, "html.parser")

    for a in soup.select("ul.topics-list li a"):
        parse_page(a.get("href"), f)

def clean(s):
    return ( s
        .replace("\"", "&quot;")
    )

def parse_page(href, f):
    print(" ", href)

    res = requests.get(URL + href)
    soup = BeautifulSoup(res.content, "html.parser")

    ps = soup.select("div.entry-content p")
    imgs = soup.select("div.entry-content div.center-image img")
    crumbs = soup.select("nav.breadcrumbs ul.breadcrumb li:first-child")

    id = href.split(".")[0][1:]
    title = soup.find("h1").text

    desc = ""
    desc_text = ""
    # what about "see also"s?
    if ps: 
        inner = str(ps[0].encode_contents())[2:][:-1]
        sentence_count = 0
        for char in inner:
            desc += char
            if len(desc) >= 2 and desc[-2:] == ". ": sentence_count += 1
            if sentence_count >= 2: break

        text = ps[0].text
        sentence_count = 0
        for char in text:
            desc_text += char
            if len(desc_text) >= 2 and desc_text[-2:] == ". ": sentence_count += 1
            if sentence_count >= 2: break

        desc = clean(desc
            .replace('src="/', 'src="' + URL + '/')
            .replace('href="/', 'href="' + URL + '/')
            .replace("\n", "")
            .replace("\\n", "")
        )
        desc_text = clean(desc_text.replace("\n", ""))

    img_src = ""
    if imgs:
        img_src = URL + imgs[0].get("src")

    categories = []
    if crumbs:
        categories = list(set(crumb.text.replace("\n", "") for crumb in crumbs))

    f.write(f'{{ id: "{id}", title: "{title}", desc: "{desc}", descText: "{desc_text}", img: "{img_src}", categories: {str(categories)} }},\n')
    f.flush()

def parse_page_simple(href, text, f):
    print(" ", href)
    
    id = href.split(".")[0][1:]
    title = text

    f.write(f"{id} // {text}\n")

with open("output/parsed.json", "w") as f:
    parse_index(f)
    
