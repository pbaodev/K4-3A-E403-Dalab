# CANVAS CP1 — Nhóm Dalab · 3A · E403
*(scaffold 7 dòng theo `02-guide.md` §1.5 — dán thẳng vào form CP1)*

**Đội trưởng:** PHAN DUY BẢO — 2A202602767
**Repo:** https://github.com/pbaodev/K4-3A-E403-Dalab

---

**1 · Hướng:** Track **A — VLearn Tutor**, đề **A1** (tối ưu AI tutor hiện có).

**2 · Job executor:** Học viên khoá K4 đang mở tài liệu trong trang học VLearn và gõ câu hỏi *quanh* buổi học (cách nộp bài, deadline, lab chấm thế nào) chứ không phải hỏi kiến thức trong slide.

**3 · Pain một câu:** Học viên K4 hỏi một câu mà tài liệu đang mở không chứa câu trả lời thì **86,7% số lần nhận được câu trả lời trôi chảy nhưng không dựa trên nguồn nào**, và không phân biệt được nó với 13,3% số lần câu trả lời là thật — dẫn tới làm sai quy chế nộp bài và **mất điểm**.

**4 · Bằng chứng đầu tiên (chuẩn B — mining 13.494 lượt hỏi-đáp thật):**
- **150 câu** ngoài phạm vi tài liệu / 10.427 câu học viên tự gõ — **70 học viên**, trong đó **130 ca (86,7%) thuộc chính khoá K4**.
- Tutor **từ chối đúng chỉ 20 ca (13,3%)**; **130 ca (86,7%) trả lời như thể biết**, trong đó **10 ca gắn `[trang N]` giả**.
- Quote `T04628`: HV hỏi *"t nộp bài từ 6h chiều, sau 12h có thêm commit thì có chấm không?"* → tutor **bịa ra chính sách chấm**: *"các hệ thống chấm bài tự động sẽ chỉ ghi nhận... trước hạn chót"*.
- Quote `T07094`: HV hỏi *"Cách tải slide ở đâu trên LMS?"* → tutor trả lời kèm **`[trang 57]`** — trang slide kỹ thuật không thể chứa hướng dẫn LMS.
- Đối chứng: `ask_probing_question` chỉ **28/13.494 lượt (0,2%)** — tutor gần như không bao giờ hỏi lại.
- Script đếm lại được: `evidence/count_ungrounded.py` · log đầy đủ: `evidence/mining-notes.md`

**5 · LÁT CẮT MỘT CÂU:**
> **Một học viên K4 đang mở tài liệu trong VLearn** cần **hỏi một câu mà slide không trả lời được** được **AI phân loại câu hỏi là CÓ hay KHÔNG có căn cứ trong tài liệu đang mở trước khi trả lời** giúp **học viên biết ngay câu trả lời nào đáng tin và phải hỏi ai cho phần còn lại**.

**6 · Automation — Conditional** *(AI tự làm ca chắc, chuyển người ca mơ hồ)*
Lý do theo cost-of-error: sai kiểu **bịa** → học viên làm theo → **mất điểm, không sửa được sau deadline** (cực đắt); sai kiểu **thận trọng thừa** → phải đi hỏi TA một câu (tốn 2 phút, rẻ). Chi phí lệch hai bậc nên hệ thống lệch hẳn về phía từ chối: chỉ tự trả lời khi trích được câu cụ thể trong tài liệu.

**7 · Phân công + willing users:**

| Thành viên | MSSV | Phần việc |
|---|---|---|
| PHAN DUY BẢO | 2A202602767 | Lead · spec §1-§4 · nộp 5 form |
| ĐOÀN DUY BÁCH | 2A202602515 | Quyết định trung tâm · AI call thật · trace log |
| TRẦN THỊ THUÝ | 2A202602960 | Evidence A/B · golden set · chấm kết quả |
| NGUYỄN VĂN SƠN | 2A202602744 | 4 đường đi UX · prototype UI · slide + video |

**Willing users (≥2, khai từ CP1):** ⬜ _điền tên thật trước khi bấm nộp form_
