# CANVAS CP1 — Nhóm Dalab · 3A · E403
*(scaffold 7 dòng theo `02-guide.md` §1.5 — dán thẳng vào form CP1)*

**Đội trưởng:** PHAN DUY BẢO — 2A202602767
**Repo:** https://github.com/pbaodev/K4-3A-E403-Dalab

---

**1 · Hướng:** Track **A — VLearn Tutor**, đề **A1** (tối ưu AI tutor hiện có).

**2 · Job executor + quy trình hiện tại:** Học viên khoá K4 đang mở một bộ slide trong VLearn, gõ câu hỏi về nội dung đang đọc, rồi nhận câu trả lời có gắn `[trang N]` để tự kiểm lại — không phải hỏi thủ tục ngoài tài liệu.

*Hôm nay họ giải quyết bằng gì:* hỏi tutor ngay trong trang học, đọc câu trả lời, rồi bấm/cuộn theo số trang được chỉ để đọc thêm hoặc để kiểm lại.
*Fail ở đâu:* số trang được chỉ thường không dẫn tới đâu. Giao diện K4 không gửi số trang cho tutor (0/3.097 lượt), nên số trang trong câu trả lời không neo vào tài liệu đang mở. Chỗ còn kiểm được thì sai thật: 58 lượt tutor tự mâu thuẫn ngay trong một câu, 12,8% lượt trích tới trang không tồn tại.
*Vì sao chưa bỏ:* phần nội dung của câu trả lời phần lớn vẫn đúng — bỏ tutor là mất phần đang dùng tốt; giữ thì không biết lúc nào tin được trích dẫn.

**3 · Pain một câu:** Học viên K4 nhận được câu trả lời có gắn trích dẫn "trang N" ở **72,9%** số lượt (2.259/3.097), trong khi giao diện K4 **không hề gửi số trang nào** cho hệ thống (0/3.097 lượt) — không học viên nào đối chiếu được N. Ở những chỗ còn đối chiếu được, số trang đó sai thật: **58 lượt** hệ thống tự mâu thuẫn ngay trong một câu (51 lượt thuộc K4), và **12,8%** lượt trích tới một trang không tồn tại trong bộ slide.

**4 · Bằng chứng (chuẩn B — mining 13.494 lượt hỏi-đáp thật):**
- **K4: câu hỏi có kèm số trang** — 0/3.097 · **0,0%** (giao diện chỉ gửi `(Đang học phần "…")`).
- **K4: câu trả lời có gắn `[trang N]`** — 2.259/3.097 · **72,9%**.
- **Tự mâu thuẫn** (lời văn trang A, trích `[trang B≠A]`) — **58 lượt · 29 học viên**, trong đó **51 lượt thuộc K4**.
- **Trích tới trang KHÔNG TỒN TẠI** — 164/1.284 · **12,8%** (sàn) · 50 học viên.
- Quote `T10572`: *"…ở trang 7 **[trang 117]** của tài liệu…"* — lời văn dùng đúng số trang, trích dẫn lại dùng số của một kho tài liệu gộp khác, hai số khác nhau xuất hiện trong cùng một câu trả lời.
- Quote `T00506`: giải thích **đúng nội dung**, chỉ sai mỗi số trang — không có tín hiệu nào để học viên nghi ngờ.
- Script đếm lại được: `evidence/count_citations.py` · log đầy đủ: `evidence/mining-notes.md`

**5 · LÁT CẮT MỘT CÂU:**
> **Một học viên K4 đang đọc slide trong VLearn** cần **hỏi một câu về nội dung đang đọc** được **AI quyết định câu trả lời có neo được vào một trang CÓ THẬT trong tài liệu đang mở hay không — và chỉ gắn số trang khi neo được** giúp **mở đúng trang đó kiểm lại trong một lần bấm, thay vì phải tin một con số không dò được**.

**6 · Automation — Conditional** *(AI tự làm ca neo được, chuyển người ca không neo được)*
Hai loại sai: **gắn trích dẫn sai** (đo được: 58 ca tự mâu thuẫn, 12,8% trích trang không tồn tại) và **từ chối oan** (không đo được trong dataset gốc — `rating` chỉ phủ 1,3% lượt, quá nhỏ để xếp hạng loại sai nào đắt hơn). Vì vậy thiết kế **không** lệch hẳn về phía từ chối: neo được thì phải trả lời, không neo được thì không được bịa số trang.

**7 · Phân công + willing users:**

| Thành viên | MSSV | Phần việc |
|---|---|---|
| PHAN DUY BẢO | 2A202602767 | Lead · spec §1-§4 · nộp 5 form |
| ĐOÀN DUY BÁCH | 2A202602515 | Quyết định trung tâm · AI call thật · `fabricated_page` · trace log |
| TRẦN THỊ THUÝ | 2A202602960 | Evidence A/B · golden set · chấm kết quả |
| NGUYỄN VĂN SƠN | 2A202602744 | 4 đường đi UX · prototype UI · slide + video |

**Willing users (≥2):** ✅ **Nguyễn Anh Tú** · **Phạm Văn Nghị** — cả hai là học viên 3A nhóm khác, user thật của VLearn tutor, đã đồng ý thử prototype (chi tiết `TEAMMATES.md`).
