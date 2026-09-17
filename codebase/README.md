# codebase — quyết định trung tâm của lát cắt

Một quyết định duy nhất: **câu hỏi này có căn cứ trong tài liệu đang mở không?**
Ba nhãn, mọi thứ khác bám theo nhãn.

| Nhãn | Nghĩa | Hệ thống làm gì |
|---|---|---|
| 🟢 `GROUNDED` | Trích được nội dung trong tài liệu | Trả lời **kèm số trang** để học viên tự kiểm |
| 🟡 `PARTIAL` | Câu hỏi chưa đủ rõ | **Hỏi lại**, không đoán |
| 🔴 `UNGROUNDED` | Tài liệu không chứa câu trả lời | **Không sinh nội dung** — nói rõ + chỉ đúng người cần hỏi |

## Chạy

Cần một HTTP server — ES module không chạy qua `file://`.

```bash
python3 -m http.server 8000        # rồi mở http://localhost:8000/codebase/
```

Hoặc bấm thẳng trên GitHub Pages: **https://pbaodev.github.io/K4-3A-E403-Dalab/**

Dán **API key** vào ô trên giao diện rồi bấm *Lưu*. Key nằm trong `sessionStorage` của tab
đó, **không vào repo, không gửi đi đâu ngoài provider**. Đóng tab là mất.
Lấy key free tại [console.groq.com/keys](https://console.groq.com/keys).

### Hai provider — đổi bằng một dòng

`CONFIG.provider` trong `tutor-core.js` nhận `"groq"` hoặc `"gemini"`. Không phải sửa gì khác.

| | `groq` *(mặc định)* | `gemini` |
|---|---|---|
| Model | `qwen/qwen3.8-27b` | `gemini-3.6-flash` |
| Độ trễ đo với prompt thật (3.348 ký tự) | **0,5s** | 7,3s |
| Hạn mức free | 1.000 req / ~3 phút · 8.000 token/phút | **20 req/phút** |
| Dạng API | OpenAI-compatible, `choices[]` | Interactions, `steps[]` |

Nhóm chạy CP3 lượt 1 trên Gemini rồi **đổi sang Groq** vì hạn mức 20 req/phút của Gemini
làm chết lượt chạy 28 ca giữa chừng, và 7,3s/lượt khiến demo trực tiếp bị đứng hình.
Kết quả cả hai lượt đều giữ trong `eval/` để so sánh được.

## Thật hay mock — khai báo đầy đủ

| Phần | Trạng thái |
|---|---|
| Quyết định phân loại + sinh câu trả lời | 🟢 **AI THẬT** — `qwen/qwen3.8-27b` trên Groq, 1 lời gọi/câu (đổi sang Gemini được) |
| Ghi vết prompt + response thô | 🟢 **THẬT** — `logTrace()`, đổ ra `codebase/logs/trace-*.json` |
| Nội dung tài liệu đang mở | 🟡 Fixture — 10 trang trích ngắn từ slide D01 trong data pack |
| Giao diện trang học VLearn | 🟡 Mock — trang tĩnh mô phỏng khung tutor |
| Bảng định tuyến "hỏi ai" | 🟡 Mock — 4 dòng cứng trong `fixtures.js` |
| `mockDecide()` | 🔵 Giữ lại làm đường lui khi không có key — **không dùng để đo** |

## File

| File | Việc |
|---|---|
| `tutor-core.js` | Quyết định trung tâm. `decide()` → `aiDecide()` (thật) hoặc `mockDecide()` (lui) |
| `fixtures.js` | 10 trang tài liệu + bảng định tuyến + 4 câu mẫu |
| `index.html` | Giao diện hai cột, nhãn màu, trace log, nút sửa sai |
| `logs/` | Prompt + response **thô** từng lượt — bằng chứng cho R5 |

## Lời gọi AI nằm ở đâu

`aiDecide()` trong [`tutor-core.js`](tutor-core.js) — bảng `CALL` dựng request theo provider:

```
POST https://api.groq.com/openai/v1/chat/completions      (groq, mặc định)
Authorization: Bearer <key>
{ "model": "qwen/qwen3.8-27b", "temperature": 0, "messages": [{"role":"user","content": <prompt>}] }

POST https://generativelanguage.googleapis.com/v1beta/interactions?key=<key>   (gemini)
{ "model": "models/gemini-3.6-flash", "input": <prompt> }
```

Prompt do `buildPrompt()` dựng: nhét **toàn bộ 10 trang tài liệu** + **luật cứng**
(deadline / quy chế / điểm cá nhân / thao tác hệ thống → luôn 🔴, kể cả khi học viên
khẳng định tài liệu có nói) + yêu cầu trả JSON.

`extractText()` bóc chữ ra khỏi cả hai dạng: Groq trả `choices[0].message.content`, Gemini trả mảng `steps[]` với phần `model_output`.
Nếu model khai một `citation_page` **không có trong tài liệu**, `aiDecide()` gắn cờ
`fabricated_page` — trích dẫn bịa bị lộ ra chứ không bị nuốt.

> ⚠️ `gemini-2.0-flash` đã bị Google khai tử ngày 17/9 và endpoint `:generateContent`
> trả 404 với key này. Đó là lý do code dùng Interactions API + `gemini-3.6-flash`.

## Đo

```bash
GEMINI_API_KEY=xxx node eval/run_eval.mjs
```

Kết quả → [`../eval/run_results.md`](../eval/run_results.md) · bộ ca → [`../eval/golden_set.json`](../eval/golden_set.json)

## Phụ trách

`tutor-core.js` + prompt: **ĐOÀN DUY BÁCH** · giao diện: **NGUYỄN VĂN SƠN** ·
golden set + đo: **TRẦN THỊ THUÝ** · spec + lát cắt: **PHAN DUY BẢO**
