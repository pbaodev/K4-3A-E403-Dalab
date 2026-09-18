/**
 * Test lớp chặn (guard) — KHÔNG gọi mạng, KHÔNG cần API key.
 *   node eval/guard_test.mjs
 *
 * Giả lập câu trả lời của model rồi đưa qua đúng code của aiDecide(). Trả lời câu hỏi:
 * "nếu model trả về đúng kiểu trích dẫn sai đã thấy trong chatlog VLearn, prototype xử lý thế nào?"
 * Golden set chạy AI thật không kiểm được điều này, vì model trong lượt chạy thật không bịa trang lần nào.
 */
import { aiDecide } from "../codebase/tutor-core.js";

const fakeModel = out => {
  globalThis.fetch = async () => ({ ok: true, json: async () => ({
    choices: [{ message: { content: typeof out === "string" ? out : JSON.stringify(out) } }] }) });
};
let pass = 0, fail = 0;
async function check(name, question, modelOut, expect) {
  fakeModel(modelOut);
  const r = await aiDecide(question, "khong-can-key");
  const errs = [];
  for (const [k, v] of Object.entries(expect)) {
    const got = k === "page" ? (r.citation?.page ?? null) : k === "who" ? (r.route?.who ?? null) : r[k];
    if (got !== v) errs.push(`${k}: muốn ${JSON.stringify(v)}, ra ${JSON.stringify(got)}`);
  }
  errs.length ? fail++ : pass++;
  console.log(`${errs.length ? "✘" : "✔"} ${name}${errs.length ? "\n    " + errs.join("\n    ") : ""}`);
}

console.log("── Trích dẫn sai lấy từ chatlog thật → phải bị chặn và KHÔNG được mang nhãn 🟢");
await check("T10572 · K4 · 'ở trang 7 [trang 117]'", "giải thích đoạn ở trang 7",
  { label: "GROUNDED", reason: "", answer: "Bốn làn sóng AI → ML → DL → LLM", citation_page: 117 },
  { label: "PARTIAL", page: null, fabricated_page: 117 });
await check("T10977 · K4 · 'ở trang 38 [trang 205]'", "Autoregressive là gì",
  { label: "GROUNDED", reason: "", answer: "…", citation_page: 205 },
  { label: "PARTIAL", page: null, fabricated_page: 205 });
await check("T00506 · trích [trang 8] — trang không có trong tài liệu đang nạp", "phân biệt rule-based bot và agent",
  { label: "GROUNDED", reason: "", answer: "…", citation_page: 8 },
  { label: "PARTIAL", page: null, fabricated_page: 8 });
await check("UNGROUNDED mà vẫn khai trang → vẫn lộ ra là bịa", "temperature mặc định là bao nhiêu",
  { label: "UNGROUNDED", reason: "", answer: "Tài liệu không có.", citation_page: 99 },
  { label: "UNGROUNDED", page: null, fabricated_page: 99 });

console.log("\n── Trích dẫn đúng → giữ nguyên");
await check("Trang 22 có thật, nội dung đúng", "Transformer khác cách đọc tuần tự ở chỗ nào?",
  { label: "GROUNDED", reason: "", answer: "…", citation_page: 22 },
  { label: "GROUNDED", page: 22, fabricated_page: null });

console.log("\n── Định tuyến câu 🔴 tới đúng người (spec §6)");
const U = { label: "UNGROUNDED", reason: "", answer: "Tài liệu không có.", citation_page: null };
await check("Commit sau nửa đêm → TA", "t nộp bài từ 6h chiều, sau 12h có thêm commit thì có chấm không?", U, { who: "TA trực kênh #hoi-dap trên Discord" });
await check("Xem điểm lab → TA nhắn riêng", "Cho mình xem điểm lab buổi trước của mình với", U, { who: "TA qua tin nhắn riêng" });
await check("Tiêu chí chấm → giảng viên", "lab này chấm theo rubric nào vậy", U, { who: "Giảng viên phụ trách buổi" });
await check("Trang 99 (nội dung ngoài tài liệu) → giảng viên", "giải thích giúp mình trang 99", U, { who: "Giảng viên phụ trách buổi" });
await check("Học phí → Syllabus", "học phí khoá này bao nhiêu", U, { who: "Syllabus trên LMS" });

console.log("\n── Model trả sai định dạng → tính là lỗi, không nuốt");
await check("Không phải JSON", "hi", "xin chào bạn!", { label: "PARSE_ERROR" });

console.log("\n── GIỚI HẠN ĐÃ BIẾT (test này ghi lại, không phải sửa được bằng code)");
await check("Trích trang CÓ THẬT nhưng SAI chỗ (token ở trang 24, model trích 22) → lọt qua lớp chặn",
  "token là gì", { label: "GROUNDED", reason: "", answer: "Token là đơn vị nhỏ nhất…", citation_page: 22 },
  { label: "GROUNDED", page: 22, fabricated_page: null });
console.log("    ↳ Lớp chặn chỉ biết trang có TỒN TẠI không. Ca này được đỡ bằng cách khác: UI hiện NGUYÊN VĂN\n      trang 22 (nói về Transformer, không có chữ token) ngay dưới nhãn — học viên nhìn là thấy lệch.\n      Golden set bắt ca này bằng cột expect.page.");

console.log(`\n${pass}/${pass + fail} đạt`);
process.exit(fail ? 1 : 0);
