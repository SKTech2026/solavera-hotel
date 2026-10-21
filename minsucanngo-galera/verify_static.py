from pathlib import Path
from html.parser import HTMLParser
import re

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=[]; self.anchors=[]
    def handle_starttag(self,tag,attrs):
        values=dict(attrs)
        if 'id' in values: self.ids.append(values['id'])
        if tag=='a' and values.get('href','').startswith('#'): self.anchors.append(values['href'][1:])

page=Path('index.html').read_text(encoding='utf-8')
data=Path('js/destinations.js').read_text(encoding='utf-8')
app=Path('js/app.js').read_text(encoding='utf-8')
parser=PageParser();parser.feed(page)
assets=set(re.findall(r'assets/(?:logos|images)/[A-Za-z0-9_.-]+',page+data))
assert len(parser.ids)==len(set(parser.ids)), 'duplicate IDs'
assert all(anchor in parser.ids for anchor in parser.anchors), 'broken internal links'
assert all(Path(asset).exists() for asset in assets), 'missing local assets'
assert not any(value in page+data+app for value in ('canva://','/_sdk/','dataSdk')), 'Canva dependency found'
print('Static checks PASS:',len(parser.ids),'IDs,',len(parser.anchors),'anchors,',len(assets),'assets')
