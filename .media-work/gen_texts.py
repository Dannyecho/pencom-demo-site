import json,os,re
P=os.path.join(os.environ['HOME'],'mnt/pencom/rag/data/parsed')
M={'09931282d0f2':'guidelines-on-personal-pension-plan-ppp','0ffb4c7aaf3e':'revised-regulation-on-retiree-life-annuity',
'14a8bdc0840c':'the-revised-regulation-on-investment-of-pension-fund-assets',
'2c7aa76a8f4f':'code-of-corporate-governance-for-licensed-pension-operators','3ea473d0e849':'regulations-for-auditing-pension-funds',
'440d0d606913':'revised-regulation-on-the-administration-of-retirement-and-terminal-benefits','5fc33aa08dcb':'regulation-on-valuation-of-pension-fund-assets',
'701363a48f40':'guidelines-for-micro-pension-plan','7385231da46d':'revised-regulation-for-the-transfer-of-rsas',
'a270a0d0f2f1':'regulation-on-fees-structure-march-2009','aa260c5cf5d1':'regulation-on-investment-of-pension-fund-assets-2012',
'e3ebf5a673ff':'regulation-on-investment-of-pension-funds-asset-2008',
'e4e913d6f603':'guidelines-for-cross-border-arrangements-under-the-pension-reform-act','44f07d95b0a8':'voluntary-contribution-guidelines-under-the-contributory-pension-scheme',
'6fbbfb32d943':'regulations-for-compliance-officers'}
lib={d['id']:d for d in json.load(open('.media-work/library.json'))}
def table(txt):
    lines=[l for l in txt.split('\n') if l.strip().startswith('|')]
    cap=txt.split('\n')[0] if not txt.startswith('|') else ''
    cap=re.sub(r'^Table:\s*','',cap); cap=re.sub(r'\s*\(pages? [^)]*\)','',cap)
    rows=[[c.strip() for c in l.strip().strip('|').split('|')] for l in lines if not re.match(r'^\|\s*-',l.strip())]
    if not rows: return None
    return {'t':'table','cap':cap,'head':rows[0],'rows':rows[1:]}
out={}
for pre,lid in M.items():
    f=[x for x in os.listdir(P) if x.startswith(pre)][0]
    d=json.load(open(os.path.join(P,f)))
    blocks=[];seen=set();words=0
    for e in d['elements']:
        k=e['kind'];x=(e.get('text') or '').strip()
        if k in('page_footer','figure','page_header') or not x: continue
        if re.search(r'\.{5,}',x) or re.match(r'^(Page \d+ of \d+|www\.pencom\.gov\.ng|Public|PenCom)$',x,re.I): continue
        if x.startswith('Description: The image'): continue
        if k=='table':
            tb=table(x)
            if tb: blocks.append(tb)
            continue
        x=re.sub(r'\s+',' ',x)
        if re.fullmatch(r'[_\-\s]+',x): continue
        if k=='heading':
            if x in seen and len(blocks)<6: continue
            seen.add(x); blocks.append({'t':'h','l':e.get('level') or 2,'x':x})
        else:
            m=re.match(r'^((?:\d+\.)+\d*|\([a-z]{1,4}\)|[a-z]\)|[ivx]+\))\s+(.*)$',x)
            blocks.append({'t':'p','n':m.group(1),'x':m.group(2)} if m else {'t':'p','x':x})
        words+=len(x.split())
    # drop leading duplicate title headings
    import difflib
    title=lib[lid]['title'].lower()
    def titleish(b):
        x=b.get('x','').strip()
        if not x or x=='---' or re.fullmatch(r'[_\-\s]+',x): return True
        if set(re.sub(r'[^\w. ]','',x).lower().split())<=set('www.pencom.gov.ng national pension commission pencom'.split()): return True
        if re.match(r'^\d',x): return False
        if re.fullmatch(r'(national pension commission|pencom|about this (regulation|guidelines|code)|[a-z]+ \d{4}|\d{1,2} [a-z]+,? \d{4}|rr/p&r/\S+|contents|table of contents)',x.lower()): return True
        return difflib.SequenceMatcher(None,title,x.lower()).ratio()>0.6 or x.upper()==x and len(x)<60
    while blocks and blocks[0]['t'] in ('h','p') and titleish(blocks[0]) and len(blocks)>5: blocks.pop(0)
    json.dump({'id':lid,'pages':d.get('pages'),'words':words,'blocks':blocks},open(f'public/documents/text/{lid}.json','w'),ensure_ascii=False)
    out[lid]={'words':words,'pages':d.get('pages'),'blocks':len(blocks)}
    print(lid[:60],'|',lib[lid]['date'],'|',words,'words |',len(blocks),'blocks | first:',blocks[0]['x'][:60] if blocks and 'x' in blocks[0] else '')
json.dump(out,open('.media-work/texts-index.json','w'))
