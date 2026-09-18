# Reflection — ĐOÀN DUY BÁCH · 2A202602515

> ⚠️ **Bản nháp do Claude Code dựng sẵn từ lịch sử repo — người đứng tên PHẢI đọc lại, sửa cho đúng việc mình thật sự làm, và tự viết các mục ⬜ trước 17:30 18/9.**
> Phần đã điền sẵn chỉ gồm những gì kiểm chứng được trong repo (file, commit, số liệu). Phân công trong README là bản nhóm chốt; nếu bạn không làm phần nào trong đây thì xoá đi — giám khảo hỏi theo đúng file này và README (vibe-coding rule: không giải thích được → 0 điểm phần đó).

## 1 · Vai trò
AI engineer — module quyết định trung tâm và lời gọi AI thật.

## 2 · Phần việc trực tiếp phụ trách
- `codebase/tutor-core.js`: phân loại GROUNDED / PARTIAL / UNGROUNDED trước khi trả lời; prompt với các luật cứng
- Hai provider: **Groq `qwen3.8-27b`** (chính, ~0,5 s/lượt) · Gemini (dự phòng — hết hạn mức 20 req/phút giữa lượt chạy 17/9)
- `fabricated_page`: bắt mọi số trang model khai mà tài liệu không có
- `PARSE_ERROR`: model trả sai JSON thì tính là ca **trượt**, không nuốt lỗi
- Trace log prompt + response thô trong `codebase/logs/`

**Phải giải thích được khi bị hỏi:**
- `fabricated_page` hoạt động thế nào (so `citation_page` với danh sách trang có thật trong fixture)
- Vì sao câu deadline / điểm / quy chế đi đường 🔴 bằng **luật cứng trong prompt**, không để model tự phán
- Luật chống từ chối oan thêm ngày 18/9 là gì, và vì sao phải chạy lại **trọn bộ** 28 ca sau khi sửa

## 3 · Cách tôi ứng dụng AI trong quá trình làm
*Điền sẵn (có trong repo):* dùng **Claude Code** để viết `tutor-core.js` và `eval/run_eval.mjs`, đổi provider Gemini → Groq, chạy golden set.

⬜ **Tự viết:** prompt phân loại do ai viết, sửa mấy lần? Bạn kiểm output của model bằng cách nào ngoài con số % đạt?

## 4 · Bài học từ một ca thất bại của nhóm
**Ca `H03`:** học viên hỏi *"trang 22 nói gì về token?"* (token ở trang 24). Model **tự ghi trong `reason` là token nằm ở trang 24** — rồi vẫn bảo học viên đi hỏi người phụ trách. Nguyên nhân: prompt có luật chống bịa nhưng **không có luật đối xứng chống từ chối oan**. Vá ngày 18/9 → 28/28; thêm 5 câu ngoài bộ → 5/5 (`eval/run2-results.md`).

*Lỗi phụ đáng nhắc:* sau khi chuyển sang Groq, giao diện vẫn hiện *"Dán Gemini API key"* — sót tới 17/9 mới bắt được.

⬜ **Tự viết (3–5 câu):** vì sao chặn bịa thôi là chưa đủ? Bạn học được gì về việc viết luật cho model?
