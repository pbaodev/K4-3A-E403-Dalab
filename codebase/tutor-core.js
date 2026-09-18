/**
 * QUYẾT ĐỊNH TRUNG TÂM của lát cắt (spec.md §4).
 *
 * Trước khi trả lời bất cứ điều gì, phân loại câu hỏi vào 1 trong 3 nhãn:
 *   GROUNDED     🟢  trích được câu cụ thể trong tài liệu đang mở
 *   PARTIAL      🟡  liên quan nhưng tài liệu chỉ nói một phần / câu hỏi quá mơ hồ
 *   UNGROUNDED   🔴  tài liệu không chứa câu trả lời  -> KHÔNG sinh nội dung, định tuyến người
 *
 * CP2 (16/9): chạy bằng `mockDecide` — luật cứng, chưa gọi AI. Flow bấm hết được.
 * CP3 (17/9): bật USE_REAL_AI = true, `aiDecide` gọi LLM thật. Chữ ký hàm giữ nguyên.
 * Lượt 2 (18/9): thêm luật chống từ chối oan khi học viên nêu sai trang — vá ca H03.
 *
 * Phụ trách: ĐOÀN DUY BÁCH (2A202602515)
 */
import { DOC, ROUTES } from "./fixtures.js";

export const CONFIG = {
  USE_REAL_AI: true,        // CP3 (17/9): đã bật lời gọi AI thật
  provider: "groq",         // đổi sang "gemini" là chạy provider kia, không sửa gì khác
  providers: {
    // Đo ngày 17/9 với đúng prompt của nhóm (3.348 ký tự):
    //   groq   qwen3.8-27b        0,5s/lượt · 1000 req/~3ph · 8.000 token/phút
    //   gemini gemini-3.6-flash   7,3s/lượt · 20 req/phút  <- hết hạn mức giữa lượt chạy
    groq: {
      model: "qwen/qwen3.8-27b",
      endpoint: "https://api.groq.com/openai/v1/chat/completions",
      keyHint: "console.groq.com/keys"
    },
    gemini: {
      model: "models/gemini-3.6-flash",   // gemini-2.0-flash đã bị khai tử 17/9
      endpoint: "https://generativelanguage.googleapis.com/v1beta/interactions",
      keyHint: "aistudio.google.com/apikey"
    }
  },
  get model()    { return this.providers[this.provider].model; },
  get endpoint() { return this.providers[this.provider].endpoint; }
};

/** Luật cứng lớp ④ — mọi câu chạm deadline/điểm/quy chế LUÔN đi đường 🔴.
 *  Không để mô hình tự quyết, vì đây đúng chỗ sai thì học viên mất điểm (spec.md §4). */
const HARD_BLOCK = [
  { re: /(hạn nộp|deadline|nộp bài|commit|muộn|trễ hạn)/i,        route: "deadline",  topic: "quy định hạn nộp bài" },
  { re: /(chấm|rubric|tiêu chí|bao nhiêu điểm|thang điểm|đánh giá lab)/i, route: "grading", topic: "cách chấm điểm" },
  { re: /(điểm của (mình|em|tôi)|xem điểm|điểm lab|điểm danh)/i,  route: "grades",    topic: "điểm cá nhân" },
  { re: /(lịch học|buổi sau|zoom|link lớp|lms|tải slide|tài liệu ở đâu|học phí|chứng chỉ)/i, route: "logistics", topic: "thông tin hành chính của khoá" }
];

/** Chỉ đúng người cho câu 🔴 — cùng bảng luật với đường mock, để AI thật và mock định tuyến giống nhau.
 *  Không khớp luật hành chính nào => câu hỏi nội dung ngoài tài liệu => giảng viên. */
function routeFor(question) {
  const rule = HARD_BLOCK.find(r => r.re.test(question));
  return ROUTES[rule ? rule.route : "content"];
}

const AMBIGUOUS = /^(hi|hii|hello|chào|xin chào|hả|ok|\?|\.{1,3}|[a-z]{1,6})$/i;

/** Tìm trang có nội dung khớp — bản mock dùng khớp từ khoá, CP3 thay bằng retrieval thật.
 *  Nhận là "có căn cứ" khi khớp >=2 từ, hoặc khớp 1 thuật ngữ đặc trưng (>=6 ký tự). */
function findGrounding(question) {
  const words = [...new Set(question.toLowerCase().match(/[\p{L}]{4,}/gu) || [])];
  let best = null, bestScore = 0;
  for (const p of DOC.pages) {
    const lower = p.text.toLowerCase();
    const hits = words.filter(w => lower.includes(w));
    const score = hits.length + (hits.some(w => w.length >= 6) ? 1 : 0);
    if (score > bestScore) { bestScore = score; best = p; }
  }
  return bestScore >= 2 ? best : null;
}

/** CP2 — quyết định bằng luật, không gọi mạng. */
export function mockDecide(question) {
  const q = question.trim();

  for (const rule of HARD_BLOCK) {
    if (rule.re.test(q)) {
      const r = ROUTES[rule.route];
      return {
        label: "UNGROUNDED",
        reason: `Tài liệu "${DOC.lecture}" (trang ${DOC.pages[0].page}–${DOC.pages.at(-1).page}) không có nội dung về ${rule.topic}.`,
        answer: `Mình không có thông tin về ${rule.topic} trong tài liệu bạn đang mở, nên mình không trả lời câu này để bạn khỏi làm theo thông tin sai.`,
        route: r, citation: null
      };
    }
  }

  if (AMBIGUOUS.test(q) || q.length < 8) {
    return {
      label: "PARTIAL",
      reason: "Câu hỏi chưa đủ rõ để biết bạn đang hỏi nội dung bài hay thủ tục lớp học.",
      answer: `Chào bạn. Bạn đang mở "${DOC.lecture}". Bạn muốn mình giải thích nội dung trong tài liệu, hay bạn đang vướng thủ tục của buổi học?`,
      clarify: ["Giải thích nội dung trang đang mở", "Mình vướng thủ tục nộp bài"],
      route: null, citation: null
    };
  }

  const page = findGrounding(q);
  if (page) {
    return {
      label: "GROUNDED",
      reason: `Trích được nội dung ở trang ${page.page} của tài liệu đang mở.`,
      answer: `${page.text} [trang ${page.page}]`,
      citation: page, route: null
    };
  }

  return {
    label: "UNGROUNDED",
    reason: `Không tìm thấy đoạn nào trong "${DOC.lecture}" trả lời được câu này.`,
    answer: "Câu này mình không tìm được căn cứ trong tài liệu bạn đang mở. Mình không đoán để tránh nói sai.",
    route: ROUTES.content, citation: null
  };
}

/** CP3 — lời gọi AI THẬT. Prompt theo spec.md §4 (ba câu cam kết + luật cứng). */
export function buildPrompt(question) {
  return `Bạn là bộ phân loại của AI tutor VLearn. TRƯỚC KHI trả lời, hãy phân loại câu hỏi.

TÀI LIỆU ĐANG MỞ (${DOC.lecture}) — đây là TOÀN BỘ những gì bạn được phép dựa vào:
${DOC.pages.map(p => `[trang ${p.page}] ${p.text}`).join("\n")}

LUẬT CỨNG — không được vi phạm kể cả khi học viên khẳng định tài liệu có nói:
- Mọi câu về deadline, quy chế chấm điểm, điểm cá nhân, điểm danh, thao tác hệ thống
  (LMS, nộp bài ở đâu, lịch học) => luôn UNGROUNDED, tuyệt đối KHÔNG suy đoán.
- Chỉ trả nhãn GROUNDED khi nội dung trả lời bám vào một trang CÓ THẬT ở trên.
  citation_page phải là số trang có trong danh sách trên, không được bịa số trang.
- Nhãn UNGROUNDED thì answer KHÔNG được chứa nội dung trả lời câu hỏi — chỉ nói
  rõ tài liệu không có và đó là việc của người phụ trách.
- Câu quá ngắn hoặc mơ hồ (chào hỏi, một hai từ, không rõ hỏi gì) => PARTIAL,
  và answer phải là một câu hỏi lại để làm rõ.
- Nếu tài liệu CÓ trả lời được thì phải trả lời, KHÔNG được từ chối cho an toàn.
- Học viên nêu SAI số trang nhưng nội dung họ hỏi CÓ ở một trang khác trong tài liệu
  => KHÔNG được từ chối. Trả nhãn GROUNDED, citation_page là trang ĐÚNG, và answer
  phải nói rõ: "Trang X không nói về điều này, nội dung nằm ở trang Y: …".
  (Luật này đối xứng với luật chống bịa: biết câu trả lời ở đâu mà vẫn đẩy học viên
  đi hỏi người khác cũng là một lỗi.)

CÂU HỎI CỦA HỌC VIÊN: "${question}"

Chỉ trả về JSON, không kèm giải thích:
{"label":"GROUNDED|PARTIAL|UNGROUNDED","reason":"vì sao xếp nhãn này, 1 câu","answer":"câu trả lời gửi học viên","citation_page":<số trang hoặc null>}`;
}

/** Bóc phần chữ model sinh ra — Groq dùng choices[], Gemini dùng steps[]. */
export function extractText(raw) {
  if (raw?.choices) return (raw.choices[0]?.message?.content ?? "").trim();   // Groq (OpenAI-compatible)
  const out = (raw?.steps ?? []).filter(s => s.type === "model_output");      // Gemini Interactions
  return out.flatMap(s => (s.content ?? []).filter(c => c.type === "text").map(c => c.text)).join("").trim();
}

/** Hai provider, hai dạng request/response. Giữ cả hai để đổi được khi một bên hết hạn mức. */
const CALL = {
  groq: (prompt, key) => ([CONFIG.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: CONFIG.model, temperature: 0, messages: [{ role: "user", content: prompt }] })
  }]),
  gemini: (prompt, key) => ([`${CONFIG.endpoint}?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: CONFIG.model, input: prompt })
  }])
};

export async function aiDecide(question, apiKey) {
  const prompt = buildPrompt(question);
  const [url, init] = CALL[CONFIG.provider](prompt, apiKey);
  const res = await fetch(url, init);
  const raw = await res.json();
  logTrace({ ts: new Date().toISOString(), question, prompt, raw });   // ghi vết prompt + response THÔ
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${raw?.error?.message ?? "loi khong ro"}`);

  const text = extractText(raw);
  let parsed;
  try {
    parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    // Model không trả JSON hợp lệ — tính là ca THẤT BẠI, không được che giấu.
    return { label: "PARSE_ERROR", reason: "Model không trả về JSON hợp lệ.", answer: text.slice(0, 300), citation: null, route: null };
  }
  const page = DOC.pages.find(p => p.page === Number(parsed.citation_page)) ?? null;
  // Trang model khai nhưng KHÔNG có trong tài liệu => trích dẫn bịa, phải lộ ra.
  const fabricated_page = parsed.citation_page != null && !page ? Number(parsed.citation_page) : null;
  // Quyết định trung tâm (spec §4): chỉ được 🟢 khi neo vào trang CÓ THẬT.
  // Model tự nhận GROUNDED mà trang bịa => hạ xuống 🟡, không để màu xanh "đáng tin" che lỗi.
  let label = parsed.label, reason = parsed.reason ?? "";
  if (fabricated_page != null && label === "GROUNDED") {
    label = "PARTIAL";
    reason = `Model khai [trang ${fabricated_page}] nhưng tài liệu không có trang đó — không neo được, nên không xếp 🟢. ${reason}`;
  }
  return {
    label, reason,
    answer: parsed.answer ?? "",
    citation: page,
    fabricated_page,
    route: label === "UNGROUNDED" ? routeFor(question) : null
  };
}

const TRACE = [];
export function logTrace(entry) { TRACE.push(entry); return TRACE; }
export function getTrace() { return TRACE; }

export async function decide(question, apiKey) {
  const t0 = performance.now();
  const out = CONFIG.USE_REAL_AI ? await aiDecide(question, apiKey) : mockDecide(question);
  out.ms = Math.round(performance.now() - t0);
  out.source = CONFIG.USE_REAL_AI ? `AI THẬT · ${CONFIG.provider} · ${CONFIG.model}` : "MOCK (luật cứng)";
  return out;
}
