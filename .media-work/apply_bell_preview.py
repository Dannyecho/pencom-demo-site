import json
def edit(p, pairs):
    s=open(p).read()
    for a,b in pairs:
        assert a in s, (p, a[:70]); s=s.replace(a,b,1)
    open(p,'w').write(s)

# 1) Take the floating alert card off the homepage slider
edit('src/pages/homemodern/Hero.tsx',[
 ('import AlertBanner from "@/components/AlertBanner";\n',''),
 ('        {/* alerts float over the slide, below the progress bar */}\n        <AlertBanner className="inset-x-3 top-16 sm:inset-x-4" />\n\n',''),
])
edit('src/pages/HomeModern.tsx',[('(3) important alerts (floating card over the slider, plus the header bell) →','(3) important alerts (header bell, opens with the top notice on first load) →')])

# 2) Bell: open on first load showing one notice, with an expand button
p='src/components/NoticesBell.tsx'
edit(p,[
 ('import { AlertTriangle, ArrowRight, Bell, CheckCheck, CheckCircle2, Info, RotateCcw, ShieldAlert, X } from "lucide-react";',
  'import { AlertTriangle, ArrowRight, Bell, CheckCheck, CheckCircle2, ChevronDown, Info, RotateCcw, ShieldAlert, X } from "lucide-react";'),
 ('const READ = "pencom:notices-read";',
  'const READ = "pencom:notices-read";\nconst PREVIEWED = "pencom:notices-previewed"; // per browser session: the preview opens once per visit'),
 (''' * Nothing opens, closes or changes on its own.
 */''',''' * On the first page load of a visit, the panel opens by itself showing the top notice only, with a
 * button to expand the full list. It never closes on its own: readers close it with ×, the bell or Escape.
 * Opening it from the bell shows the full list.
 */'''),
 ('''  const [open, setOpen] = useState(false);''','''  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(false); // opened by itself: one notice + expand button'''),
 ('''  useEffect(() => save(READ, read), [read]);''','''  // First load of the visit: open the panel with the top notice, if there is anything unread.
  useEffect(() => {
    let done = false;
    try {
      done = window.sessionStorage.getItem(PREVIEWED) === "1";
    } catch {
      /* storage unavailable */
    }
    if (done || unread.length === 0) return;
    const id = window.setTimeout(() => {
      setPreview(true);
      setOpen(true);
      try {
        window.sessionStorage.setItem(PREVIEWED, "1");
      } catch {
        /* ignore */
      }
    }, 900);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => save(READ, read), [read]);'''),
 # outside click only closes a panel the reader opened; the preview waits for an explicit close
 ('''    const onDown = (e: PointerEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);''',
  '''    const onDown = (e: PointerEvent) => !preview && !wrap.current?.contains(e.target as Node) && setOpen(false);'''),
 ('''    panel.current?.focus();
    return () => {''','''    if (!preview) panel.current?.focus(); // don't pull focus away when it opened by itself
    return () => {'''),
 ('''  }, [open]);''','''  }, [open, preview]);'''),
 ('''        onClick={() => setOpen((o) => !o)}''','''        onClick={() => {
          setPreview(false);
          setOpen((o) => !o);
        }}'''),
])
s=open(p).read()
# list: only the first notice while previewing
s=s.replace('''                {shown.map((n) => {''','''                {(preview ? shown.slice(0, 1) : shown).map((n) => {''',1)
# close button in the panel header
a='''              {unread.length > 0 && (
                <button type="button" onClick={markAll}'''
assert a in s
s=s.replace(a,'''              <div className="flex items-center gap-1">
              {unread.length > 0 && !preview && (
                <button type="button" onClick={markAll}''',1)
a='''                  {t("Mark all as read")}
                </button>
              )}
            </div>'''
assert a in s
s=s.replace(a,'''                  {t("Mark all as read")}
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setPreview(false);
                  btn.current?.focus();
                }}
                aria-label={t("Close notices")}
                title={t("Close notices")}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
              </div>
            </div>''',1)
# expand button after the list
a='''            </ul>

            {gone.some('''
assert a in s
s=s.replace(a,'''            </ul>

            {preview && shown.length > 1 && (
              <button
                type="button"
                onClick={() => setPreview(false)}
                aria-expanded="false"
                aria-controls="notices-panel"
                data-i18n-done
                className="group flex w-full items-center justify-center gap-2 border-t border-gray-100 bg-[#F4F7F2] px-4 py-3 text-sm font-semibold text-[#117F21] transition hover:bg-[#E8F5E9] focus-visible:outline focus-visible:outline-[3px] focus-visible:-outline-offset-[3px] focus-visible:outline-[#FFD84D]"
              >
                {t("Show all {n} notices", { n: shown.length })}
                <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
              </button>
            )}

            {!preview && gone.some(''',1)
open(p,'w').write(s)

D={"Close notices":{'ha':"Rufe sanarwoyi",'yo':"Pa àwọn ìkéde dé",'ig':"Mechie ọkwa"},
   "Show all {n} notices":{'ha':"Nuna dukkan sanarwoyi {n}",'yo':"Fi gbogbo ìkéde {n} hàn",'ig':"Gosi ọkwa {n} niile"}}
for k,m in D.items():
    for l,v in m.items():
        q=f'src/i18n/dict/{l}.ts';t=open(q).read()
        if json.dumps(k)+':' not in t:
            i=t.rindex('};');t=t[:i]+f'  {json.dumps(k)}: {json.dumps(v,ensure_ascii=False)},\n'+t[i:];open(q,'w').write(t)
print('ok')
