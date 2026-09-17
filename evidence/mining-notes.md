# Evidence log — chuẩn B (mining `data/vlearn-pack/chatlog/tutor_turns.csv`)

**Ngày:** 17/9/2026 · **Nguồn:** data pack BTC, 13.494 lượt hỏi-đáp thật (22/07 → 15/09/2026), 1.617 học viên
**Script đếm lại được:** [`count_citations.py`](count_citations.py)
`python3 evidence/count_citations.py <đường-dẫn>/tutor_turns.csv`

> ⚠️ Repo này **không** chứa data pack. Chỉ ghi số tổng hợp + trích đoạn ngắn kèm `turn_id`, theo `data/README.md` của BTC.

---

## 1 · Câu hỏi đếm

> Tutor gắn trích dẫn `[trang N]` vào câu trả lời. **Học viên có cách nào kiểm tra N là thật không — và N có thật không?**

Đây là câu hỏi thứ hai của nhóm. Câu hỏi đầu ("tutor xử lý thế nào khi tài liệu không chứa câu trả lời") đã bị **loại bỏ vì đếm sai** — xem §5.

## 2 · Vì sao đổi sang câu hỏi này

Ngày 17/9 nhóm phát hiện giao diện K4 **đã đổi** so với K3:

| | câu hỏi có kèm số trang | trả lời có `[trang N]` |
|---|---|---|
| **K4** (khoá hiện tại, 3.097 lượt) | **0 / 3.097 · 0,0%** | 2.259 / 3.097 · **72,9%** |
| K3 (khoá trước, 10.397 lượt) | 7.284 / 10.397 · 70,1% | 7.533 / 10.397 · 72,5% |

K3 gửi `(Trang 12, đoạn được chọn: "…")` — tutor biết học viên đang ở trang nào.
K4 chỉ gửi `(Đang học phần "…")` — **97,2% lượt K4 không có bất kỳ số trang nào.**

Nghĩa là: ở K4, mọi số trang trong câu trả lời đều do hệ thống tự sinh, và học viên không có gì để đối chiếu. Đây là lát cắt đáng làm, vì nó đúng khoá đang học.

## 3 · Kết quả đếm

> **Mẫu số khác nhau ở mỗi phép đo** — đọc kỹ cột "đếm trên". Không cộng dồn các dòng.

| # | Phép đo | Số | Đếm trên | Khoá |
|---|---|---|---|---|
| 2 | Tutor **tự mâu thuẫn**: lời văn ghi trang A, trích dẫn ngay sau ghi trang B≠A | **58 lượt · 29 học viên** | toàn bộ 13.494 | K4 **51** · K3 7 |
| 3 | Trích tới **số trang không tồn tại** (vượt độ dài thật của bộ slide) | **164 / 1.284 = 12,8%** · 50 học viên | 1.284 lượt kiểm được | K3 (K4 không kiểm được) |
| 4 | Trích **sai trang** so với trang do chính học viên gõ ra | 91 / 845 = 10,8% · 73 học viên | 845 lượt | K3 833 · K4 12 |
| 4b | — trong đó **trích dẫn đầu tiên** sai (cái học viên đọc trước) | 114 / 845 = **13,5%** | 845 lượt | |

### Cơ chế lỗi đã truy ra được

Độ lệch **không ngẫu nhiên**. Mỗi bộ slide có một độ lệch **cố định riêng**:

| Bộ slide | Lời văn → trích dẫn | Độ lệch |
|---|---|---|
| D01 · `Day01-ai-ml-dl-DataLifecycle-HaiDuong` | trang 7 → `[trang 117]` | **+110** |
| D01 · `1-AICB_Ngày_1 (3)` | trang 38 → `[trang 205]`, trang 39 → `[trang 206]` | **+167** |
| D09 (K3) | 7→112, 9→114, 18→123, 20→125, 23→128 | **+105** |
| các bộ khác trong K4 | | +46 · +67 · +160 · +271 |

→ Số trong `[trang N]` là **chỉ số trang trong một kho tài liệu gộp**, không phải số trang của bộ slide học viên đang mở. Lời văn thì dùng số trang đúng. Học viên nhìn thấy cả hai và không biết tin cái nào.

## 4 · Trích đoạn nguyên văn (dẫn `turn_id` để rà lại)

**K4 — đúng khoá đang học:**

1. `T10572` · D01 · 10/9 16:36 — học viên hỏi về đoạn ở **trang 7**, tutor đáp:
   > "Chào [HV], **ở trang 7 [trang 117]** của tài liệu, nội dung này tóm tắt tiến trình phát triển của trí tuệ nhân tạo qua bốn cột mốc…"

2. `T10977` / `T10978` · D01 · 11/9 11:17 — đoạn ở **trang 38**, hỏi "Autoregressive":
   > "Chào [HV], **ở trang 38 [trang 205]**, khái niệm "Autoregressive" được dùng để mô tả cơ chế hoạt động của LLM khi sinh văn bản…"

3. `T11026` · D01 · 11/9 11:37 — (lượt này học viên còn thử prompt injection; tutor **chặn đúng** nhưng vẫn trích sai):
   > "Chúng ta hãy quay lại tập trung vào nội dung bài học nhé. **Ở trang 39 [trang 206]**, tài liệu có đề cập đến ba bước để tạo ra một LLM: Pre-training, SFT…"

**K3 — nơi đối chiếu được nên đo được:**

4. `T00506` · D01 — học viên bôi đen đúng đoạn "Phân biệt được rule-based bot, LLM chatbot, và agent" ở **trang 4**; tutor trả lời **đúng nội dung** nhưng trích `[trang 8]`. Nội dung đúng, trích dẫn sai.

5. `T00422` · D07 — tutor viết "**Tại trang 11** (trong nội dung về xác định cách sử dụng AI)…" rồi trích `[trang 50]` ngay trong cùng câu trả lời.

6. `T04316` · D01 (`COMP2010`, bộ slide **32 trang**) — tutor trích `[trang 45]`. Trang 45 không tồn tại.

7. `T09512` · D09 — "**Tại trang 18** của tài liệu **[trang 123]**, slide trình bày về KV Cache…"

## 5 · Chúng tôi đã đếm SAI những gì (ghi lại để người chấm kiểm chéo)

Phần này quan trọng ngang phần kết quả. Bốn lần đếm hỏng, đều tự phát hiện và đều đã bỏ:

**(a) Regex bóc tiền tố bỏ sót dấu nháy cong.** `strip_context_prefix` cũ chỉ khớp `"` thẳng và tiền tố tiếng Việt, bỏ sót `"` `"` và bản tiếng Anh. Hậu quả: 116/150 "ca ngoài phạm vi" là **khớp nhầm vào tiền tố giao diện**, không phải câu học viên gõ. Hai ca K4 từng trích trong spec (`T10303`, `T10510`) là false positive. → Toàn bộ dòng phân tích cũ bị bỏ, script `count_ungrounded.py` **đã xoá khỏi repo**.

**(b) Lấy "trang đang mở" làm chuẩn đối chiếu.** Sai: học viên mở trang 2 rồi hỏi "Day 1 gồm những chủ đề gì" thì tutor trích trang 7 là **đúng**. Phép đo này từng cho ra "36,4% trích sai" — con số đó **vô nghĩa**, đã bỏ.

**(c) Lấy số trang trong tiền tố làm chuẩn.** Sai: `T00058` tiền tố ghi trang 82 nhưng chữ học viên chọn ghi "đoạn bôi đen ở **Trang 6**", tutor trích trang 6 → **tutor đúng, phép đo của chúng tôi sai**. Đã chuyển sang lấy số trang do chính học viên gõ.

**(d) Đếm theo `lecture_code` trần.** Data dictionary nói rõ `lecture_code` **không duy nhất giữa các khoá**. D01 của `COMP2010` là 32 trang, D01 của `VinUni-AIInAction-3` là 42 trang. Đếm gộp cho ra 958 ca (16,6%); khoá lại theo `(course_id, lecture_code)` và chỉ giữ bộ slide có bằng chứng nhất quán thì còn **164 ca (12,8%)**. Con số trong §3 là con số sau khi sửa.

**(e) Rà tay 20 ca ngẫu nhiên** (seed 42) trong nhóm phép đo [4]: một phần nhỏ là ca học viên bôi trúng thanh trạng thái trình xem (`"Trang 1 / 44 day05-….pdf"`) làm hỏng chuẩn đối chiếu. Vì vậy 10,8% của phép đo [4] nên đọc là **ước lượng**, còn phép đo [2] (tự mâu thuẫn) mới là con số **không cãi được** — nó so tutor với chính tutor.

## 6 · Giới hạn còn lại — chưa khắc phục được

- **Không có slide K4 để đối chiếu trực tiếp.** Data pack chỉ có 2 file PDF của buổi hackathon, không phải slide bài giảng K4. Mọi kết luận về K4 dựa trên [2] (tự mâu thuẫn) và cấu trúc giao diện, không phải mở slide ra đếm.
- **12,8% là SÀN, không phải trần.** Chỉ bắt được trích dẫn **vượt** số trang. Trích sai mà vẫn nằm trong khoảng thì không phép đo nào ở đây thấy được.
- **Chưa có bằng chứng hậu quả.** Dataset có trường `rating` nhưng chỉ 177/13.494 lượt (1,3%) được chấm — nền quá nhỏ để kết luận học viên khó chịu vì trích dẫn sai. **Nhóm không dùng `rating` làm bằng chứng hậu quả.** Đây là lý do cần khảo sát chuẩn A (§7).
- **Chưa chứng minh được học viên đã làm theo thông tin sai.** Chatlog không ghi hành vi sau câu trả lời.

## 7 · Việc còn thiếu

Khảo sát chuẩn A: ≥20 học viên ngoài nhóm, hỏi thẳng "bạn có bao giờ bấm theo `[trang N]` tutor đưa mà không thấy nội dung đó không?" — đây là mảnh bằng chứng duy nhất còn thiếu để nối **lỗi đo được** với **hậu quả người dùng thật sự chịu**.
