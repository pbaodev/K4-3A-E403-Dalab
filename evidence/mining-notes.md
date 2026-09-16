# Evidence log — chuẩn B (mining `data/vlearn-pack/chatlog/tutor_turns.csv`)

**Người thực hiện:** TRẦN THỊ THUÝ · **Ngày:** 16/9/2026
**Nguồn:** data pack BTC, 13.494 lượt hỏi-đáp thật (22/07 → 15/09/2026), 1.617 học viên.
**Script đếm lại được:** [`count_ungrounded.py`](count_ungrounded.py) — chạy `python3 evidence/count_ungrounded.py <đường-dẫn>/tutor_turns.csv`

> ⚠️ Repo này không chứa data pack. Chỉ ghi số tổng hợp + trích đoạn ngắn kèm `turn_id` để dẫn nguồn, theo `data/README.md` của BTC.

---

## 1 · Câu hỏi đếm

> Khi học viên hỏi một câu mà **tài liệu đang mở không chứa câu trả lời**, tutor xử lý thế nào?

## 2 · Phương pháp đếm (kiểm lại được)

| Bước | Quy tắc |
|---|---|
| Tập nền | 13.494 lượt → bỏ 3.067 câu mẫu bấm sẵn (`is_preset = True`) → còn **10.427 câu học viên tự gõ** |
| Bóc ngữ cảnh | Xoá tiền tố giao diện tự chèn (`(Trang N, đoạn được chọn: "…")`, `(Đang học phần "…")`) để chỉ giữ câu học viên thật sự gõ |
| Xếp loại "ngoài phạm vi tài liệu" | Khớp regex nhóm từ khoá hành chính: hạn nộp / deadline / nộp bài / điểm danh / lịch học / học phí / chứng chỉ / zoom / discord / thi cuối / điểm số / tài liệu-slide ở đâu / bài tập về nhà… (danh sách đầy đủ trong script) |
| Xếp loại hành vi tutor | **Từ chối đúng** = câu trả lời chứa một trong các cụm: "không có thông tin", "không tìm thấy", "tài liệu không…", "rất tiếc", "không biết", "ngoài phạm vi", "vui lòng kiểm tra/liên hệ", "liên hệ giảng viên/TA". Còn lại xếp vào **"trả lời như thể biết"** |

**Giới hạn đã biết — khai báo trung thực:** đây là phép đếm bằng từ khoá, không phải đọc tay 100%. Regex có thể bỏ sót câu ngoài phạm vi diễn đạt kiểu khác, và có thể xếp nhầm một câu trả lời vừa từ chối vừa giải thích thêm. Nhóm đã rà tay 20 ca ngẫu nhiên trong nhóm "trả lời như thể biết"; danh sách `turn_id` đầy đủ do script in ra để người chấm rà lại.

## 3 · Kết quả đếm

| Chỉ số | Số | Tỷ lệ |
|---|---|---|
| Lượt học viên tự gõ (bỏ câu mẫu) | 10.427 | 77,3% tổng lượt |
| Trả lời **không có trích dẫn** tài liệu | 3.781 | **28,0%** tổng lượt |
| Câu **ngoài phạm vi tài liệu đang mở** | **150** | 1,4% câu tự gõ — **70 học viên** |
| ├─ trong đó thuộc khoá K4 (chính lớp mình) | **130** | **86,7%** |
| ├─ tutor **từ chối / chuyển hướng đúng** | 20 | **13,3%** |
| └─ tutor **trả lời như thể biết** | **130** | **86,7%** ← PAIN |
| Trong nhóm "trả lời như thể biết": có gắn `[trang N]` | 10 | **trích dẫn giả** — nguy hiểm nhất |

**Phát hiện cốt lõi:** tutor **không nhất quán**. Cùng một loại câu hỏi ngoài phạm vi, 13,3% số lần nó nói thẳng "tôi không biết", 86,7% số lần nó trả lời trôi chảy như thể có căn cứ. Học viên không có cách nào phân biệt hai trường hợp đó — vì cả hai đều được viết bằng cùng một giọng tự tin.

## 4 · Trích dẫn nguyên văn (≥5, dẫn theo `turn_id`)

### ❌ Nhóm "trả lời như thể biết"

**[T04628]** · 08/08 00:09 · `has_citation = False` — *ca đắt nhất: bịa ra chính sách chấm bài*
> **HV:** "t nộp bài từ 6h chiều, sau 12h (tức sang ngày hôm sau) có thêm commit thì có chấm các commit đó không?"
> **Tutor:** "Thông thường, các hệ thống chấm bài tự động sẽ chỉ ghi nhận trạng thái mã nguồn hoặc các commit được thực hiện trước thời điểm hạn chót… Các thay đổi được đẩy lên sau thời điểm này thường sẽ không được tính đến hoặc có thể bị coi là nộp bài muộn."

→ Tutor **không hề biết** quy chế chấm của khoá. Nó suy diễn từ kiến thức chung về "hệ thống chấm bài tự động". Học viên tin theo và bỏ commit sửa bài thì **mất điểm thật**.

**[T07094]** · 18/08 14:46 · `has_citation = True` — *trích dẫn giả*
> **HV:** "Cách tải slide ở đâu trên LMS?"
> **Tutor:** "…truy cập vào trang khoá học của mình trên hệ thống lms.vinuni.edu.vn, sau đó tìm mục chứa tài liệu học tập của ngày học 'Data Lakehouse Architecture' (Ngày 18) để tải về tệp tin tương ứng **[trang 57]**."

→ `[trang 57]` của slide bài giảng kỹ thuật **không thể** chứa hướng dẫn thao tác LMS. Trích dẫn ở đây làm câu trả lời bịa **trông đáng tin hơn** — đây là lỗi nguy hiểm nhất trong 4 lớp chỗ khó.

**[T01168]** · 29/07 14:55 · `has_citation = False`
> **Tutor:** "Tìm mục **'Tài liệu học tập' (Course Materials)** trên trang quản lý khóa học của bạn, tìm tệp PDF của bài giảng ngày hôm nay và nhấn nút tải xuống (Download)…"

→ Tutor mô tả một menu giao diện mà nó chưa từng nhìn thấy.

**[T10303]** · 09/09 23:46 · K4 · `has_citation = False`
> **HV:** *(Đang học phần "Chuẩn bị notebook và nơi nộp bài")* "hi"
> **Tutor:** "Chào [HV]… Để chuẩn bị notebook và nơi nộp bài, em hãy đảm bảo mình đã truy cập đúng nền tảng khóa học và xem kỹ hướng dẫn trong phần setup của buổi học nhé."

→ Lời khuyên rỗng, không có thông tin nào thật. Học viên hỏi xong vẫn không biết nộp ở đâu.

**[T10510]** · 10/09 16:04 · K4 · `has_citation = False` · 955 ký tự
> **HV:** *(Đang học phần "Nộp bài và đánh giá Lab")* "giải thích về các bài lab"
> **Tutor:** "Các bài lab trong môn học này được thiết kế để em nắm vững cách làm việc với LLM API… Mục tiêu chính là giúp em: Làm quen với quy trình gọi API… Hiểu sâu các tính năng quan trọng…"

→ 955 ký tự trình bày rất gọn gàng về **cách đánh giá lab** mà không dẫn được một dòng tài liệu nào.

### ✅ Nhóm "từ chối đúng" — hành vi mong muốn (13,3%)

**[T02736]** · 30/07 12:31
> **HV:** "Deadline nộp bài AI Product Hackathon là ngày nào? **Nếu tài liệu không có thì nói rõ là không biết.**"
> **Tutor:** "Tôi đã kiểm tra kỹ nội dung tài liệu của ngày học hôm nay nhưng không có thông tin về deadline… Vì vậy, tôi không biết thời hạn cụ thể cho sự kiện này."

→ Đáng chú ý: học viên **phải tự dặn** "nếu không có thì nói không biết" thì mới nhận được hành vi đúng. Hành vi đúng đang phụ thuộc vào việc học viên biết cách nhắc.

**[T02918]** · 30/07 14:11 — *mẫu chuẩn nhóm muốn tutor luôn làm*
> **Tutor:** "Rất tiếc, tôi đã kiểm tra trong tài liệu của ngày học nhưng không thấy thông tin cụ thể về deadline nộp bài cuối kỳ. **Bạn vui lòng kiểm tra lại trên Syllabus hoặc thông báo của giảng viên** trong hệ thống quản lý học tập nhé."

→ Từ chối + **chỉ đúng chỗ cần hỏi**. Đây là hành vi mục tiêu của lát cắt.

## 5 · Bằng chứng phụ trợ (từ `DATA_DICTIONARY.md`, đã tự kiểm lại)

- `move_used`: `review_concept` 12.127/13.494 (**90%**); `ask_probing_question` chỉ **28 lượt (0,2%)** → tutor gần như không bao giờ hỏi lại khi thiếu thông tin.
- Chỉ **1,3%** lượt có rating (177/13.494: 92 up / 85 down) → **49% lượt được chấm là 👎**. Học viên không có kênh phản hồi hiệu quả.
- `understanding_level` gần rỗng (20/13.494) → tutor không đo mức hiểu.

## 6 · Kế hoạch bổ sung chuẩn A (đến CP4)

Khảo sát ≥20 học viên 3A ngoài nhóm, hỏi theo Mom Test — về **lần gần nhất**, không hỏi ý kiến:

1. "Lần gần nhất bạn hỏi AI tutor trên VLearn một câu về **lịch / deadline / cách nộp bài**, nó trả lời thế nào?"
2. "Bạn có làm theo câu trả lời đó không? Sau đó có phải đi hỏi lại ai không — hỏi ai?"
3. "Có lần nào bạn phát hiện tutor nói sai không? Lúc đó bạn nhận ra bằng cách nào?"

Ghi log **nguyên văn từng câu trả lời + tên người trả lời** vào `evidence/survey-log.md`. Chỉ tiêu: ≥20 người, ≥50% xác nhận đã từng nhận câu trả lời không đúng/không có căn cứ.
