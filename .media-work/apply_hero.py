"""Hero/alert redesign + site-wide image refresh. Usage: python3 apply.py <app>"""
import json, pathlib, re, sys
from PIL import Image

app = pathlib.Path(sys.argv[1])
src = app / "src"


def edit(rel, pairs, root=src):
    p = root / rel
    s = p.read_text()
    for old, new in pairs:
        if old not in s and new in s:
            continue
        assert s.count(old) == 1, f"{rel}: {s.count(old)} matches for {old[:70]!r}"
        s = s.replace(old, new)
    p.write_text(s)
    print("ok", rel)


# 1. thumbnails for the downloaded photos
for f in (app / "public/images/site").glob("*-1920.webp"):
    out = f.with_name(f.name.replace("-1920", "-480"))
    if not out.exists():
        im = Image.open(f)
        im.resize((480, round(im.height * 480 / im.width)), Image.LANCZOS).save(out, "WEBP", quality=76, method=6)

# 2. slides
p = src / "pages/home/data.ts"
s = p.read_text()
a = s.index("export type Slide = {")
b = s.index("export const popularTasks")
slides = '''export type Slide = {
  id: string;
  /** "campaign" = a Commission advert or campaign (gold tag); "story" = a standing message */
  kind: "campaign" | "story";
  eyebrow: string;
  title: string;
  summary: string;
  cta: { label: string; href?: string; chat?: boolean };
  image: string;
  srcSet: string;
  thumb: string;
  alt: string;
  position?: string;
  /** Show from / until (YYYY-MM-DD). Set by Corporate Communications: an expired slide never shows (brief §12). */
  starts?: string;
  ends?: string;
};

/** Licensed stock photos (Unsplash licence), see public/images/site/CREDITS.md */
const stock = (n: string) => ({
  image: `/images/site/${n}-1920.webp`,
  srcSet: `/images/site/${n}-960.webp 960w, /images/site/${n}-1920.webp 1920w`,
  thumb: `/images/site/${n}-480.webp`,
});
/** PenCom's own photos (public/images) */
const own = (n: string) => ({
  image: `/images/opt/${n}-1200.webp`,
  srcSet: `/images/opt/${n}-640.webp 640w, /images/opt/${n}-1080.webp 1080w, /images/opt/${n}-1200.webp 1200w`,
  thumb: `/images/opt/${n}-384.webp`,
});

/** Slider rules from the design brief §7.1: every slide leads to a task, and each one is also reachable elsewhere. */
const allSlides: Slide[] = [
  {
    id: "ppp-campaign",
    kind: "campaign",
    eyebrow: "Personal Pension Plan campaign",
    title: "Save small today, retire with dignity",
    summary:
      "Traders, artisans and small business owners can join the Personal Pension Plan and save as much, and as often, as suits them.",
    cta: { label: "Join the Personal Pension Plan", href: "/services#ppp" },
    ...own("pencom-trader"),
    alt: "A trader at her pepper stall in a busy market",
    position: "50% 35%",
    starts: "2026-10-01",
    ends: "2027-03-31",
  },
  {
    id: "secure-retirement",
    kind: "story",
    eyebrow: "For every Nigerian worker",
    title: "Plan for a secure, dignified retirement",
    summary:
      "Under the Contributory Pension Scheme, at least 18% of your monthly pay is saved for your retirement in an account that is yours, regulated by PenCom.",
    cta: { label: "Explore pension services", href: "/services" },
    ...own("pencom-contributor"),
    alt: "A smiling young woman outside her workplace",
    position: "62% 30%",
  },
  {
    id: "pencare-campaign",
    kind: "campaign",
    eyebrow: "Pencare for retirees",
    title: "Health cover that continues after you retire",
    summary: "Retirees under the Contributory Pension Scheme can join Pencare, the Commission's health insurance programme.",
    cta: { label: "Join Pencare health insurance", href: "/services#pencare" },
    ...stock("retiree-health-check"),
    alt: "A health worker checks an older man's blood pressure",
    position: "62% 40%",
  },
  {
    id: "q1-2026-report",
    kind: "story",
    eyebrow: "Q1 2026 Pension Industry Report",
    title: "See how pension savings are performing",
    summary: "Our latest quarterly report on assets, investment returns and membership across the industry.",
    cta: { label: "Read the report", href: "/resources/reports/q1-2026" },
    ...stock("abuja-dusk"),
    alt: "Abuja at dusk, seen from above",
    position: "50% 55%",
  },
  {
    id: "assistant",
    kind: "story",
    eyebrow: "PenCom Assistant",
    title: "Get quick answers to your pension questions",
    summary: "Ask about RSA transfers, retirement benefits, the PCC and more. Never share your RSA PIN in a chat.",
    cta: { label: "Ask PenCom Assistant", chat: true },
    ...stock("woman-phone"),
    alt: "A young woman smiling at her phone",
    position: "62% 35%",
  },
];

const today = new Date().toISOString().slice(0, 10);
export const slides = allSlides.filter((s) => (!s.starts || s.starts <= today) && (!s.ends || s.ends >= today));

'''
p.write_text(s[:a] + slides + s[b:])
print("ok data.ts slides")

# 3. alerts now live inside the hero
edit("pages/Home.tsx", [
    ('import AlertBanner from "@/components/AlertBanner";\n', ""),
    ("      <AlertBanner />\n", ""),
])

# 4. images across the site
edit("pages/about/AboutHero.tsx", [
    ('src="/banner-elders.jpg"', 'src="/images/site/abuja-dusk-1920.webp"\n          srcSet="/images/site/abuja-dusk-960.webp 960w, /images/site/abuja-dusk-1920.webp 1920w"\n          sizes="(min-width: 1024px) 62vw, 100vw"'),
    ("object-[60%_30%]", "object-[50%_60%]"),
])
edit("pages/chronicles/data.ts", [('cover: "/banner-elders.jpg"', 'cover: "/images/opt/pencom-retiree-family-1200.webp"')])
edit("pages/chronicles/PreviewPages.tsx", [('src="/banner-family.jpg"', 'src="/images/opt/pencom-woman-headscarf-1080.webp"')])
edit("pages/news/data.ts", [
    ('image: "/news-meeting.jpg",\n    imageAlt: "Commission staff reviewing industry figures in a meeting room",',
     'image: "/images/site/board-meeting-1920.webp",\n    imageAlt: "Colleagues reviewing figures around a boardroom table",'),
    ('image: "/news-circular.png",\n    imageAlt: "A printed Commission statement on a desk",',
     'image: "/images/site/signing-document-1920.webp",\n    imageAlt: "A hand signing a printed statement",'),
    ('image: "/news-technology.png",\n    imageAlt: "Illustration of a fast digital approval process",',
     'image: "/images/site/elder-woman-call-1920.webp",\n    imageAlt: "A retired woman smiling during a phone call",'),
    ('image: "/news-tech.jpg",\n    imageAlt: "Charts showing pension asset growth on a screen",',
     'image: "/images/site/laptop-phone-1920.webp",\n    imageAlt: "Someone checking figures on a laptop and a phone",'),
    ('image: "/banner-family.jpg",\n    imageAlt: "A family outside their home",',
     'image: "/images/opt/pencom-trader-1200.webp",\n    imageAlt: "A trader at her pepper stall in a busy market",'),
])
s = (src / "pages/home/Stories.tsx").read_text()
s = s.replace('"/video-poster.jpg"', '"/images/site/video-poster-team.webp"')
(src / "pages/home/Stories.tsx").write_text(s)
print("ok Stories posters")
p = src / "pages/resources/Library.tsx"
s = p.read_text()
s = s.replace('{ src: "/highlight-video2.mp4", title: "PenCom at work",', '{ src: "/highlight-video2.mp4", poster: "/images/site/video-poster-team.webp", title: "PenCom at work",')
s = s.replace('{ src: "/highlight-video.mp4", title: "PenCom highlights",', '{ src: "/highlight-video.mp4", poster: "/images/site/video-poster-elders.webp", title: "PenCom highlights",')
s = s.replace('<img src="/video-poster.jpg" alt="" className="h-full w-full object-cover" />', '<img src={x.poster} alt="" className="h-full w-full object-cover" />')
n = s.count('"/video-poster.jpg"')
s = s.replace('"/video-poster.jpg"', "{v.poster}").replace("={{v.poster}}", "={v.poster}")
p.write_text(s)
print("ok Library posters", n)

# 5. translations for the new text
new = {
    "Personal Pension Plan campaign": ["Kamfen ɗin Personal Pension Plan", "Ìpolongo Personal Pension Plan", "Mkpọsa Personal Pension Plan"],
    "Save small today, retire with dignity": ["Yi ƙaramar ajiya yau, ka yi ritaya cikin mutunci", "Fi díẹ̀ pamọ́ lónìí, fẹ̀yìntì pẹ̀lú ọlá", "Chekwaa ntakịrị taa, laa ezumike nka n'ùgwù"],
    "A trader at her pepper stall in a busy market": ["Wata 'yar kasuwa a rumfar barkonon ta a kasuwa mai cunkoso", "Oníṣòwò kan níbi àtẹ ata rẹ̀ ní ọjà tó kún", "Onye ahịa nọ n'ebe ọ na-ere ose n'ahịa jupụtara"],
    "A smiling young woman outside her workplace": ["Wata budurwa tana murmushi a wajen wurin aikinta", "Ọ̀dọ́bìnrin kan ń rẹ́rìn-ín níta ibi iṣẹ́ rẹ̀", "Nwa agbọghọ na-amụmụ ọnụ ọchị n'èzí ebe ọrụ ya"],
    "Pencare for retirees": ["Pencare ga masu ritaya", "Pencare fún àwọn tó ti fẹ̀yìntì", "Pencare maka ndị lara ezumike nka"],
    "Health cover that continues after you retire": ["Inshorar lafiya da ke ci gaba bayan ka yi ritaya", "Ìbánigbófò ìlera tó ń bá a lọ lẹ́yìn ìfẹ̀yìntì", "Mkpuchi ahụike na-aga n'ihu mgbe ị lara ezumike nka"],
    "Retirees under the Contributory Pension Scheme can join Pencare, the Commission's health insurance programme.": [
        "Masu ritaya ƙarƙashin Tsarin Fansho na Gudunmawa za su iya shiga Pencare, shirin inshorar lafiya na Hukumar.",
        "Àwọn tó ti fẹ̀yìntì lábẹ́ Ètò Ìfẹ̀yìntì Oníìdáwó lè darapọ̀ mọ́ Pencare, ètò ìbánigbófò ìlera Àjọ náà.",
        "Ndị lara ezumike nka n'okpuru Atụmatụ Ezumike Nka nke Ntinye Ego nwere ike isonye na Pencare, mmemme mkpuchi ahụike nke Kọmịshọn ahụ."],
    "A health worker checks an older man's blood pressure": ["Wani ma'aikacin lafiya yana auna hawan jinin wani dattijo", "Òṣìṣẹ́ ìlera kan ń wọn ẹ̀jẹ̀ ríru àgbàlagbà kan", "Onye ọrụ ahụike na-enyocha ọbara mgbali nke otu agadi nwoke"],
    "Abuja at dusk, seen from above": ["Abuja da magariba, daga sama", "Abuja nígbà ìrọ̀lẹ́, láti òkè", "Abuja n'uhuruchi, site n'elu"],
    "A young woman smiling at her phone": ["Wata budurwa tana murmushi ga wayarta", "Ọ̀dọ́bìnrin kan ń rẹ́rìn-ín sí fóònù rẹ̀", "Nwa agbọghọ na-amụmụ ọnụ ọchị na ekwentị ya"],
    "Go to slide {n}: {title}": ["Je hoto na {n}: {title}", "Lọ sí àwòrán {n}: {title}", "Gaa na foto {n}: {title}"],
    "Slides": ["Hotuna", "Àwọn àwòrán", "Foto"],
    "Read the Act": ["Karanta Dokar", "Ka Òfin náà", "Gụọ Iwu ahụ"],
    "Go to Services": ["Je shafin Ayyuka", "Lọ sí Iṣẹ́ Wa", "Gaa na Ọrụ Anyị"],
    "See what you need": ["Duba abin da kake bukata", "Wo ohun tí o nílò", "Lee ihe ị chọrọ"],
    "Dismiss all {n} alerts": ["Rufe duk sanarwoyi {n}", "Pa gbogbo ìkìlọ̀ {n} dé", "Mechie ọkwa {n} niile"],
    "Colleagues reviewing figures around a boardroom table": ["Abokan aiki suna duba alƙaluma a teburin taro", "Àwọn alábàáṣiṣẹ́ ń ṣàyẹ̀wò nọ́ńbà ní tábìlì ìpàdé", "Ndị ọrụ ibe na-enyocha ọnụọgụgụ na tebụl nzukọ"],
    "A hand signing a printed statement": ["Hannu yana sa hannu a kan wata sanarwa", "Ọwọ́ kan ń buwọ́lu ìkéde tí a tẹ̀", "Aka na-abịnye aka n'ọkwa e bipụtara"],
    "A retired woman smiling during a phone call": ["Wata mai ritaya tana murmushi tana waya", "Obìnrin tó ti fẹ̀yìntì ń rẹ́rìn-ín nígbà tó ń sọ̀rọ̀ lórí fóònù", "Nwanyị lara ezumike nka na-amụmụ ọnụ ọchị n'oge ọ na-akpọ ekwentị"],
    "Someone checking figures on a laptop and a phone": ["Wani yana duba alƙaluma a kwamfuta da waya", "Ẹnìkan ń ṣàyẹ̀wò nọ́ńbà lórí kọ̀ǹpútà àti fóònù", "Onye na-enyocha ọnụọgụgụ na laptọọpụ na ekwentị"],
}
for i, lang in enumerate(["ha", "yo", "ig"]):
    p = src / f"i18n/dict/{lang}.ts"
    s = p.read_text()
    add = "".join(f"  {json.dumps(k, ensure_ascii=False)}: {json.dumps(v[i], ensure_ascii=False)},\n" for k, v in new.items() if json.dumps(k, ensure_ascii=False) + ":" not in s)
    if add:
        j = s.rindex("};")
        s = s[:j] + "\n  /* Home slider, alerts and photo descriptions */\n" + add + s[j:]
        p.write_text(s)
    print("ok dict", lang)
