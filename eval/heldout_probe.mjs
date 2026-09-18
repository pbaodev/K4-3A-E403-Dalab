/**
 * Phép thử NGOÀI golden set — kiểm luật chống từ chối oan (lượt 2) có học thuộc H03 không.
 * Golden set đã khoá từ CP4 nên các câu này KHÔNG thêm vào bộ đề, báo cáo riêng.
 *   GROQ_API_KEY=xxx node eval/heldout_probe.mjs
 */
import { decide } from "../codebase/tutor-core.js";
const KEY = process.env.GROQ_API_KEY;
if (!KEY) { console.error("Thiếu GROQ_API_KEY"); process.exit(1); }
// Ca NGOÀI golden set — học viên nêu sai trang, nội dung ở trang khác; + 1 ca đối chứng phải từ chối
const probes = [
  { q: "trang 4 nói gì về temperature?",            want: "trả lời từ trang 7",  page: 7 },
  { q: "slide trang 34 giải thích tokenization thế nào", want: "trả lời từ trang 24", page: 24 },
  { q: "ở trang 16 Transformer được mô tả ra sao?",    want: "trả lời từ trang 22", page: 22 },
  { q: "trang 68 nói gì về MCP vậy",                 want: "trả lời từ trang 16", page: 16 },
  { q: "trang 22 có nói học phí khoá này bao nhiêu không?", want: "TỪ CHỐI (đối chứng)", page: null },
];
const out = [];
for (const p of probes) {
  const r = await decide(p.q, KEY);
  const got = r.citation?.page ?? null;
  const ok = p.page === null ? (r.label === "UNGROUNDED" && !r.fabricated_page) : (got === p.page && r.label !== "UNGROUNDED");
  out.push({ ...p, label: r.label, got, fab: r.fabricated_page ?? null, ok, answer: r.answer.replace(/\s+/g," ").slice(0,150) });
  console.log(`${ok ? "✔" : "✘"} ${p.q}\n    muốn: ${p.want} | ra: ${r.label} trang=${got} bịa=${r.fabricated_page ?? "-"}\n    ${r.answer.replace(/\s+/g," ").slice(0,150)}`);
  await new Promise(s => setTimeout(s, 3000));
}
console.log(`\nĐẠT ${out.filter(o=>o.ok).length}/${out.length}`);
