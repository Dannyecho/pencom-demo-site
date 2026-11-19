// Collect user-visible English strings from the given source files (TS compiler API).
// Usage: node extract.cjs <app/src> file1 file2 ... > strings.json
const ts = require(process.cwd() + "/node_modules/typescript");
const fs = require("fs");
const path = require("path");
const [, , srcDir, ...files] = process.argv;

const SKIP_ATTR = new Set(["className", "href", "to", "src", "id", "key", "type", "role", "rel", "target", "htmlFor", "name", "icon", "color", "layoutId", "aria-controls", "aria-labelledby", "aria-describedby", "aria-live", "aria-current", "aria-haspopup", "aria-roledescription_", "fetchPriority", "loading", "decoding", "autoComplete", "inputMode", "mode", "position", "variant", "size", "side", "align", "objectPosition", "d", "viewBox", "fill", "stroke", "strokeWidth", "strokeLinecap", "strokeLinejoin", "preserveAspectRatio", "xmlns", "method", "action", "pattern", "lang", "dir", "transform", "gradientUnits", "offset", "stopColor", "x1", "x2", "y1", "y2"]);
const SKIP_PROP = new Set(["href", "to", "src", "id", "icon", "color", "image", "url", "slug", "date", "className", "position", "bg", "border", "text", "iconColor", "category", "type_", "accent", "tone", "anchor", "hash", "file", "img", "keywords", "value", "suffix", "key", "ext", "size"]);
const looksCode = (s) =>
  !/[A-Za-z]{2}/.test(s) ||
  /^[#./@]/.test(s) ||
  /^https?:/.test(s) ||
  /^[a-z0-9_\-:\[\]\/#.%()!&>~,*= ]+$/.test(s) && !/ [a-z]{3,} [a-z]{3,}/.test(s) && /[-:\[]/.test(s) ||
  /^[a-z][a-zA-Z0-9]*$/.test(s) && s.length < 25 ||
  /^(rgba?|hsl|var)\(/.test(s) || /^[a-z-]+\/[a-z]/.test(s) || /\.(tsx?|jpe?g|png|svg|pdf|json)$/.test(s);

const out = new Map();
const add = (s, file) => {
  s = s.replace(/\s+/g, " ").trim();
  if (!s || looksCode(s)) return;
  if (!out.has(s)) out.set(s, path.basename(file));
};

for (const rel of files) {
  const file = path.join(srcDir, rel);
  const sf = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const visit = (node) => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) return;
    if (ts.isJsxAttribute(node)) {
      const nm = node.name.getText(sf);
      if (SKIP_ATTR.has(nm) || nm.startsWith("data-")) return;
    }
    if (ts.isPropertyAssignment(node)) {
      const nm = node.name.getText(sf).replace(/["']/g, "");
      if (SKIP_PROP.has(nm)) return;
    }
    if (ts.isCallExpression(node)) {
      const callee = node.expression.getText(sf);
      if (/^(cn|clsx|getElementById|querySelector|setItem|getItem|removeItem|localStorage\.|document\.|scrollToId|useState|addEventListener|removeEventListener|navigate|console\.)/.test(callee) || /(getItem|setItem|getElementById|querySelector|addEventListener|startsWith|includes|split|replace|join|matchMedia|localeCompare|toLocaleDateString|padStart)$/.test(callee)) return;
    }
    if (ts.isBinaryExpression(node) && /===|!==|==/.test(node.operatorToken.getText(sf))) return;
    if (ts.isCaseClause(node)) { node.statements.forEach(visit); return; }
    if (ts.isJsxText(node)) add(node.getText(sf), file);
    else if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) add(node.text, file);
    else if (ts.isTemplateExpression(node)) {
      add(node.head.text, file);
      node.templateSpans.forEach((sp) => { visit(sp.expression); add(sp.literal.text, file); });
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}
process.stdout.write(JSON.stringify([...out].map(([s, f]) => ({ s, f })), null, 0));
