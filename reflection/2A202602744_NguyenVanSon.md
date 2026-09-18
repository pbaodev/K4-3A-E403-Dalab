# Reflection — NGUYỄN VĂN SƠN · 2A202602744

> ⚠️ **Bản nháp do Claude Code dựng sẵn từ lịch sử repo — người đứng tên PHẢI đọc lại, sửa cho đúng việc mình thật sự làm, và tự viết các mục ⬜ trước 17:30 18/9.**
> Phần đã điền sẵn chỉ gồm những gì kiểm chứng được trong repo (file, commit, số liệu). Phân công trong README là bản nhóm chốt; nếu bạn không làm phần nào trong đây thì xoá đi — giám khảo hỏi theo đúng file này và README (vibe-coding rule: không giải thích được → 0 điểm phần đó).

## 1 · Vai trò
UX & Demo lead — 4 đường đi trải nghiệm, giao diện prototype, nguyên tắc HAX/PAIR, slide và video.

## 2 · Phần việc trực tiếp phụ trách
- `codebase/index.html`: nhãn 🟢🟡🔴, **khối trích dẫn hiện nguyên văn dòng trích**, khối đỏ chặn số trang bịa, nút *"Tài liệu có nói mà"* (G9), chip feedback *"Sai trang / Bịa / Thiếu / Lạc đề"* (G15)
- `spec.md` §4b (6 nguyên tắc có vị trí áp dụng) · §6 (4 đường đi)
- `demo-slides.pdf` 6 trang · video demo dự phòng ⬜
- Vòng validation với Nguyễn Anh Tú, Phạm Văn Nghị → `validation/user_testing_log.md` ⬜

**Phải giải thích được khi bị hỏi:**
- Vì sao trích dẫn phải kèm **nguyên văn dòng trích**, không chỉ số trang (`T10572`: `[trang 117]` trông hợp lệ mà không dò được)
- G10 áp vào đâu: 🔴 thì **không sinh nội dung, không sinh số trang**
- Nút "Tài liệu có nói mà" dùng để làm gì — nó là van xả cho ca từ chối oan

## 3 · Cách tôi ứng dụng AI trong quá trình làm
*Điền sẵn (có trong repo):* dùng **Claude Code** để dựng giao diện, dựng slide từ HTML và xuất PDF.

⬜ **Tự viết:** phần giao diện nào bạn tự quyết, phần nào để AI đề xuất? Có đề xuất nào của AI bạn bỏ không?

## 4 · Bài học từ một ca thất bại của nhóm
**Ca spec và code lệch nhau:** sau khi đổi problem statement ngày 17/9, spec §4b hứa *"gắn kèm nguyên văn dòng được trích"*, nhưng giao diện chỉ hiện `— trang N`. `fabricated_page` đã tính trong lõi từ CP3 nhưng **chưa bao giờ hiện ra màn hình** — tức chính cái pain của §1 bị nuốt mất trong bản demo. Phát hiện khi rà lại, sửa 6 chỗ ngày 17/9.

⬜ **Tự viết (3–5 câu):** vì sao đổi spec mà không rà lại giao diện là nguy hiểm? Phiên thử với Tú và Nghị cho bạn thấy điều gì mà nhóm không tự thấy?
