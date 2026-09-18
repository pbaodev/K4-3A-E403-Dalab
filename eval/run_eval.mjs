/**
 * Chạy toàn bộ golden set qua quyết định trung tâm và chấm tự động.
 *
 *   GEMINI_API_KEY=xxx node eval/run_eval.mjs
 *
 * Key đọc từ BIẾN MÔI TRƯỜNG, không bao giờ nằm trong repo (luật an toàn BTC).
 * Mọi prompt + response THÔ ghi ra codebase/logs/ để người chấm xác minh.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { decide, getTrace, CONFIG } from "../codebase/tutor-core.js";

// Key theo provider đang chọn trong CONFIG — luôn đọc từ BIẾN MÔI TRƯỜNG, không từ file.
const ENV = { groq: "GROQ_API_KEY", gemini: "GEMINI_API_KEY" }[CONFIG.provider];
const KEY = process.env[ENV];
if (!KEY) { console.error(`Thiếu ${ENV}. Chạy: ${ENV}=xxx node eval/run_eval.mjs`); process.exit(1); }
console.log(`Provider: ${CONFIG.provider} · ${CONFIG.model}`);

const gs = JSON.parse(readFileSync(new URL("./golden_set.json", import.meta.url), "utf8"));

// --only=hard  : chỉ chạy các ca thuộc kind đó (dùng khi free tier hết hạn mức phút)
// --merge      : ghép với kết quả đã có trong run1-raw.json thay vì chạy lại toàn bộ
const only  = (process.argv.find(a => a.startsWith("--only=")) ?? "").split("=")[1] || null;
const merge = process.argv.includes("--merge");
// --run=2      : số lượt chạy. Mỗi lượt ghi file RIÊNG — không bao giờ ghi đè bằng chứng lượt trước.
const RUN   = Number((process.argv.find(a => a.startsWith("--run=")) ?? "--run=1").split("=")[1]);
const RAW   = `./run${RUN}-raw.json`;
const REPORT = RUN === 1 ? "./run_results.md" : `./run${RUN}-results.md`;

let results = [];
if (merge) {
  try { results = JSON.parse(readFileSync(new URL(RAW, import.meta.url), "utf8")); }
  catch { results = []; }
}
const todo = gs.cases.filter(c => (!only || c.kind === only) && !results.some(r => r.id === c.id));
console.log(`Chạy ${todo.length} ca${only ? ` (kind=${only})` : ""}${merge ? `, ghép với ${results.length} ca đã có` : ""}`);

for (const c of todo) {
  let r, err = null;
  // Free tier bị 429 rất nhanh -> thử lại có giãn cách. Ca nào vẫn hỏng thì ghi ERROR,
  // KHÔNG được lặng lẽ bỏ qua: lỗi hạ tầng cũng là một kết quả phải báo cáo.
  for (let attempt = 0; attempt < 5; attempt++) {
    try { r = await decide(c.q, KEY); err = null; break; }
    catch (e) {
      err = e.message;
      if (!/429|quota|rate/i.test(e.message)) break;
      await new Promise(s => setTimeout(s, 12000 * (attempt + 1)));
    }
  }
  if (err) r = { label: "ERROR", answer: "", reason: err, citation: null };

  const got = r.label;
  // Vai ca chap nhan nhieu nhan dung (vd nua co can cu nua khong) -> expect.label_any
  const accept = c.expect.label_any ?? [c.expect.label];
  const okLabel = accept.includes(got);
  const gotPage = r.citation?.page ?? null;
  const okPage  = c.expect.page == null ? true : gotPage === c.expect.page;
  // Nhãn UNGROUNDED/PARTIAL mà vẫn khai một trang không có thật => trích dẫn bịa
  const fabricated = r.fabricated_page ?? null;
  // Câu trả lời có chứa nội dung bị cấm không (bịa nội dung dù đã gắn nhãn đúng)
  const forbidHit = c.forbid ? (new RegExp(c.forbid, "i").test(r.answer || "") ? c.forbid : null) : null;

  const pass = okLabel && okPage && !fabricated && !forbidHit;
  results.push({ ...c, got, gotPage, fabricated, forbidHit, pass, err,
                 answer: (r.answer || "").replace(/\s+/g, " ").slice(0, 200),
                 reason: (r.reason || "").replace(/\s+/g, " ").slice(0, 160), ms: r.ms });
  process.stdout.write(pass ? "." : "X");
  await new Promise(s => setTimeout(s, CONFIG.provider === "groq" ? 9000 : 4000));   // nới nhịp, tránh rate limit
}
console.log("\n");
results.sort((a, b) => a.id.localeCompare(b.id));

const pass = results.filter(r => r.pass).length;
const byGroup = (fn) => {
  const m = new Map();
  for (const r of results) { const k = fn(r); const v = m.get(k) ?? [0, 0]; v[0] += r.pass ? 1 : 0; v[1]++; m.set(k, v); }
  return [...m.entries()].sort();
};

mkdirSync(new URL("../codebase/logs/", import.meta.url), { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
writeFileSync(new URL(`../codebase/logs/trace-${stamp}.json`, import.meta.url), JSON.stringify(getTrace(), null, 2));
writeFileSync(new URL(RAW, import.meta.url), JSON.stringify(results, null, 2));

const pct = (a, b) => `${a}/${b} = ${(a / b * 100).toFixed(0)}%`;
const L = [];
L.push(`# Kết quả chạy golden set — lượt ${RUN}`);
L.push(``);
L.push(`**Chạy lúc:** ${new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })} · **Provider:** \`${CONFIG.provider}\` · **Model:** \`${CONFIG.model}\` · **AI thật:** ${CONFIG.USE_REAL_AI ? "CÓ" : "KHÔNG"}`);
L.push(`**Lệnh chạy lại:** \`${ENV}=xxx node eval/run_eval.mjs --run=${RUN}\``);
L.push(`**Log prompt + response thô:** \`codebase/logs/trace-${stamp}.json\` · **Kết quả máy đọc:** \`eval/run${RUN}-raw.json\``);
L.push(``);
L.push(`## Tỷ lệ đạt: **${pct(pass, results.length)}**`);
L.push(``);
L.push(`### Theo nhãn kỳ vọng`);
L.push(`| Nhãn kỳ vọng | Đạt | Ý nghĩa nếu trượt |`);
L.push(`|---|---|---|`);
const mean = { GROUNDED: "tutor **từ chối oan** — pain 752 ca trong evidence", PARTIAL: "tutor **đoán bừa** thay vì hỏi lại", UNGROUNDED: "tutor **bịa** — pain gốc của lát cắt" };
for (const [k, [a, b]] of byGroup(r => (r.expect.label_any ?? [r.expect.label]).join("/"))) L.push(`| ${k} | ${pct(a, b)} | ${mean[k] ?? ""} |`);
L.push(``);
L.push(`### Theo lớp chỗ khó`);
L.push(`| Lớp | Đạt |`);
L.push(`|---|---|`);
for (const [k, [a, b]] of byGroup(r => r.class)) L.push(`| ${k} — ${gs.meta.taxonomy[k]} | ${pct(a, b)} |`);
L.push(``);
L.push(`### Theo kiểu ca`);
L.push(`| Kiểu | Đạt |`);
L.push(`|---|---|`);
for (const [k, [a, b]] of byGroup(r => r.kind)) L.push(`| ${k} | ${pct(a, b)} |`);
L.push(``);
L.push(`## Chi tiết 20 ca`);
L.push(``);
L.push(`| ID | Lớp | turn_id | Câu hỏi | Kỳ vọng | Nhận được | Kết quả |`);
L.push(`|---|---|---|---|---|---|---|`);
for (const r of results) {
  const exp = `${(r.expect.label_any ?? [r.expect.label]).join("/")}${r.expect.page ? ` tr.${r.expect.page}` : ""}`;
  const got = `${r.got}${r.gotPage ? ` tr.${r.gotPage}` : ""}${r.fabricated ? ` ⚠tr.${r.fabricated} KHÔNG CÓ THẬT` : ""}${r.forbidHit ? ` ⚠nội dung bị cấm` : ""}`;
  L.push(`| ${r.id} | ${r.class} | ${r.turn_id ?? "—"} | ${r.q.slice(0, 52)} | ${exp} | ${got} | ${r.pass ? "✅" : "❌"} |`);
}
const fails = results.filter(r => !r.pass);
L.push(``);
L.push(`## Phân tích ${fails.length} ca trượt`);
L.push(``);
if (!fails.length) L.push(`Không có ca trượt ở lượt 1.`);
for (const r of fails) {
  L.push(`### ${r.id} — ${r.turn_id ?? "tổng hợp"} (lớp ${r.class}, ${r.kind})`);
  L.push(`> **Hỏi:** ${r.q}`);
  L.push(``);
  L.push(`- **Kỳ vọng:** ${(r.expect.label_any ?? [r.expect.label]).join(" hoặc ")}${r.expect.page ? ` + trích trang ${r.expect.page}` : ""}`);
  L.push(`- **Nhận được:** ${r.got}${r.gotPage ? ` + trang ${r.gotPage}` : ""}`);
  if (r.fabricated) L.push(`- **Trích dẫn bịa:** model khai trang ${r.fabricated} — trang này không có trong tài liệu`);
  if (r.forbidHit) L.push(`- **Nội dung bị cấm:** khớp \`${r.forbidHit}\` — đã sinh nội dung dù không có căn cứ`);
  if (r.err) L.push(`- **Lỗi kỹ thuật:** ${r.err}`);
  L.push(`- **Model nói:** ${r.answer}`);
  L.push(`- **Lý do model đưa ra:** ${r.reason}`);
  L.push(`- **Nguyên nhân:** ⬜ *(điền tay sau khi đọc log)*`);
  L.push(``);
}
writeFileSync(new URL(REPORT, import.meta.url), L.join("\n") + "\n");
console.log(`ĐẠT ${pct(pass, results.length)}  ->  eval/${REPORT.slice(2)}`);
