p='src/pages/homecalm/Showcase.tsx';s=open(p).read()
R=[
('"inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 px-5 text-lg font-semibold transition',
 '"inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border-2 px-3.5 text-base font-semibold transition sm:min-h-14 sm:gap-2 sm:rounded-2xl sm:px-5 sm:text-lg'),
('<div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-white px-4 py-4 sm:px-6">',
 '<div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 bg-white px-3 py-3 sm:gap-3 sm:px-6 sm:py-4">'),
('<ol className="order-last flex w-full items-center justify-center gap-2 sm:order-none sm:w-auto" aria-label="Slides">',
 '<ol className="order-last flex w-full items-center justify-center gap-1.5 sm:order-none sm:w-auto sm:gap-2" aria-label="Slides">'),
('"relative flex h-12 min-w-12 items-center justify-center overflow-hidden rounded-xl px-3 text-lg font-bold transition',
 '"relative flex h-9 min-w-9 items-center justify-center overflow-hidden rounded-lg px-2.5 text-base font-bold transition sm:h-12 sm:min-w-12 sm:rounded-xl sm:px-3 sm:text-lg'),
('className="absolute inset-x-0 bottom-0 h-1.5 origin-left bg-[#F4D27A]"','className="absolute inset-x-0 bottom-0 h-1 origin-left bg-[#F4D27A] sm:h-1.5"'),
('          <div className="flex items-center gap-3">\n            <button\n              type="button"\n              onClick={() => setPlaying',
 '          <div className="flex items-center gap-2 sm:gap-3">\n            <button\n              type="button"\n              onClick={() => setPlaying'),
('{/* ── Controls: large and labelled ── */}','{/* ── Controls: labelled; compact on phones, large from tablet up ── */}'),
]
for a,b in R:
    assert a in s,a[:60]; s=s.replace(a,b,1)
# icons in controls
seg_start=s.index('{/* ── Controls')
seg_end=s.index('<p className="sr-only" aria-live', seg_start)
seg=s[seg_start:seg_end]
seg=seg.replace('className="h-5 w-5" aria-hidden="true"','className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true"')
s=s[:seg_start]+seg+s[seg_end:]
open(p,'w').write(s);print('ok')
