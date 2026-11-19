#!/bin/bash
cd "$(dirname "$0")"
pdftoppm -r 220 -gray ../../public/documents/pension-reform-act-2014.pdf pg
for f in pg-*.pgm; do tesseract "$f" "${f%.pgm}" -l eng --psm 4 >/dev/null 2>&1; done
echo done > DONE
