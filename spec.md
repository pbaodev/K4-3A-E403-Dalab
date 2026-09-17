# AI SPEC — Tutor biết mình không biết · Nhóm Dalab · Lớp 3A · Phòng E403

**Hướng:** ✅ A — VLearn Tutor (đề **A1** · tối ưu tính năng có sẵn)
**Loại:** ✅ Tối ưu tính năng có sẵn ☐ Tính năng mới

> **Trạng thái:** CP1 ✅ (§1, §2, §4 canvas) · CP2 ✅ (§4 mức prototype, §6 bốn đường đi) · CP3 ⬜ · CP4 ⬜ (khoá quality bar §7)

---

## §1. User & Job

### Job executor
**Học viên khoá K4 đang mở một trang tài liệu trong VLearn và gõ câu hỏi vào ô AI tutor** — cụ thể là tình huống hỏi một câu *quanh* buổi học (cách nộp bài, deadline, lab được chấm thế nào, tài liệu ở đâu) chứ không phải hỏi kiến thức trong slide.

Không phải "học viên nói chung": 70 học viên có thật trong chatlog đã rơi vào đúng tình huống này, 130/150 lượt thuộc khoá K4.

### Core JTBD *(không có tên sản phẩm / chữ AI trong câu)*
> Khi đang học giữa buổi và vướng một thứ không nằm trong slide, tôi muốn **biết chắc thông tin mình vừa đọc có đáng tin không**, để **không hành động sai rồi mất điểm**.

**Job stories:**
- Khi tôi vừa nộp bài lúc 6h chiều và muốn sửa thêm, tôi muốn **biết commit sau nửa đêm có bị tính muộn không**, để tôi quyết định có sửa tiếp hay dừng lại.
- Khi tôi mở phần "Nộp bài và đánh giá Lab" mà không hiểu, tôi muốn **biết lab của mình được chấm theo tiêu chí nào**, để tôi làm đúng trọng tâm.
- Khi tôi nghỉ một buổi, tôi muốn **biết phải hỏi ai / xem ở đâu** cho phần mình lỡ, để bắt kịp lớp.

### Quy trình hiện tại — họ đang giải quyết bằng gì, fail ở đâu

| | |
|---|---|
| **Hôm nay làm gì** | Hỏi tutor trước vì nó nằm ngay trong trang học, không phải chuyển cửa sổ. Nghi ngờ thì đi hỏi TA trên Discord, tra Syllabus, hoặc hỏi bạn cùng lớp. |
| **Chỗ nó fail** | Không có tín hiệu nào cho biết **khi nào nên nghi**. Câu trả lời có căn cứ và câu bịa được viết bằng cùng một giọng tự tin. |
| **Vì sao chưa bỏ** | Vẫn là cách nhanh nhất, và phần lớn câu hỏi kiến thức tutor trả lời đúng thật — bỏ hẳn thì mất cả phần đang dùng tốt. |

**Bằng chứng học viên đã tự phòng thân** — ca `T02736`: học viên gõ *"Deadline nộp bài AI Product Hackathon là ngày nào? **Nếu tài liệu không có thì nói rõ là không biết.**"* Việc phải tự dặn trước cho thấy họ **đã từng bị lừa**. Đáng chú ý: lần đó tutor trả lời đúng — tức hành vi mong muốn **có thể kích hoạt được**, nhưng đang phụ thuộc vào việc học viên biết cách nhắc.

### Problem statement *(KHÔNG chữ AI)*
> **Học viên K4 hỏi một câu mà tài liệu đang mở không chứa câu trả lời thì 86,7% số lần nhận được một câu trả lời trôi chảy, tự tin, nhưng không dựa trên bất kỳ nguồn nào — và không có cách nào phân biệt nó với 13,3% số lần câu trả lời là thật.** Hậu quả: học viên làm theo thông tin sai về quy chế nộp bài và mất điểm, hoặc mất niềm tin rồi bỏ hẳn công cụ và quay lại đi hỏi TA từng câu một.

### Evidence
**Chuẩn B — mining (đã xong, log đầy đủ):** [`evidence/mining-notes.md`](evidence/mining-notes.md) · script đếm lại được: [`evidence/count_ungrounded.py`](evidence/count_ungrounded.py)

| Chỉ số | Số | Nguồn |
|---|---|---|
| Lượt hỏi-đáp thật trong pack | 13.494 | `tutor_turns.csv` |
| Câu học viên tự gõ (bỏ 3.067 câu mẫu) | 10.427 | `is_preset = False` |
| Trả lời không có trích dẫn | 3.781 (**28,0%**) | `has_citation = False` |
| **Câu ngoài phạm vi tài liệu** | **150** · 70 học viên | regex hành chính, xem script |
| → thuộc khoá K4 | **130 (86,7%)** | `cohort_hint = K4` |
| → tutor **từ chối đúng** | 20 (**13,3%**) | khớp cụm từ chối |
| → tutor **trả lời như thể biết** | **130 (86,7%)** | phần còn lại |
| → trong đó gắn `[trang N]` giả | **10** | `has_citation = True` |
| `ask_probing_question` (tutor hỏi lại) | **28 / 13.494 = 0,2%** | `move_used` |
| Lượt có rating | 177 (1,3%) — trong đó **85 👎 / 92 👍** | `rating` |

**≥5 quote nguyên văn:** `T04628` (bịa chính sách chấm commit) · `T07094` (trích dẫn `[trang 57]` giả cho hướng dẫn LMS) · `T01168` (mô tả menu giao diện không tồn tại) · `T10303`, `T10510` (K4 — lời khuyên rỗng về nộp bài) · `T02736`, `T02918` (hành vi đúng cần nhân rộng). Nguyên văn đầy đủ trong `evidence/mining-notes.md` §4.

**Chuẩn A — khảo sát:** kế hoạch + bộ câu hỏi Mom Test trong `evidence/mining-notes.md` §6. Chỉ tiêu ≥20 học viên ngoài nhóm, log nguyên văn, hoàn tất trước CP4. ⬜ *đang làm*

---

## §2. Impact & quyết định chọn

### Bảng impact — 4 ứng viên

| # | Ứng viên | Bao nhiêu người | Tần suất | Mỗi lần tốn gì | Build nổi? | Chọn |
|---|---|---|---|---|---|---|
| 1 | **Tutor trả lời không căn cứ khi câu hỏi ngoài tài liệu** | 70 HV có thật trong log; 130/150 ca là K4 | 150 ca / 10.427 câu tự gõ; tăng mạnh ở K4 | **Mất điểm thật** (làm sai quy chế nộp bài) + mất niềm tin vĩnh viễn vào công cụ | ✅ 1 AI call, có sẵn 150 ca thật làm golden set | ✅ **CHỌN** |
| 2 | Tutor trả lời không trích dẫn nói chung (28%) | ~1.600 HV | 3.781 / 13.494 lượt | Phải tự kiểm lại, tốn ~2-3 phút/lần | ⚠️ Quá rộng — "thêm citation" đụng toàn bộ prompt, không demo được trong 5 phút | ❌ loại |
| 3 | Tutor không hỏi lại khi câu hỏi mơ hồ (0,2% hỏi ngược) | 849 câu ≤15 ký tự | 8,1% câu tự gõ | Nhận câu trả lời lạc đề, hỏi lại 2-3 lượt | ✅ khả thi | ❌ loại |
| 4 | Trả lời quá dài so với câu hỏi | Toàn bộ | median 1.012 ký tự/câu trả lời | ~1 phút đọc thừa | ✅ dễ | ❌ loại |

### Ứng viên đã loại + lý do *(bằng số)*
- **#2 (28% không trích dẫn)** — số to nhất nhưng **không phải cùng một pain**. Rà tay cho thấy phần lớn 3.781 ca là câu trả lời kiến thức đúng chỉ thiếu gắn số trang: khó chịu, không nguy hiểm. Trộn chung sẽ làm loãng lát cắt và không đo được cải thiện. Ứng viên #1 là **tập con nguy hiểm** của #2: nơi thiếu căn cứ dẫn tới hậu quả thật.
- **#3 (không hỏi lại)** — pain thật nhưng **không phải của lớp mình**: trong 2.555 câu tự gõ của K4 chỉ có **2 câu** ≤15 ký tự (0,1%), so với 849 ca ở khoá K3 trước. K4 gõ câu hỏi dài (median 110 ký tự). Sửa cái này là sửa cho khoá đã học xong.
- **#4 (trả lời dài)** — chi phí mỗi lần chỉ là ~1 phút đọc thừa, **không ai mất điểm vì nó**. Tần suất cao nhưng impact mỗi lần thấp nhất trong 4 ứng viên.

### Ứng viên chọn + lý do *(bằng số)*
Chọn **#1**. Đây là ứng viên duy nhất mà **chi phí một lần sai là mất điểm số thật**, không phải mất thời gian. Cụ thể `T04628`: học viên hỏi commit sau nửa đêm có bị tính muộn không, tutor bịa ra một chính sách chấm bài — làm theo là hỏng bài nộp. Cộng thêm ba lợi thế thi đấu: **(a)** 130/150 ca nằm ở chính khoá **K4** → pain đang sống, không phải lịch sử (riêng trong K4, tỷ lệ tutor trả lời như thể biết là **116/130 = 89,2%**, cao hơn mức chung 86,7%); **(b)** đã có sẵn **150 ca thật** để dựng golden set, không phải bịa case; **(c)** tutor đã làm đúng 13,3% số lần → chứng minh hành vi mục tiêu **khả thi với chính mô hình đang chạy**, việc của nhóm là làm nó nhất quán chứ không phải phát minh cái mới.

---

## §3. Giải pháp tương tự đã nghiên cứu
> ⬜ Hoàn thành trước CP4 — mỗi thành viên dùng thử 1 sản phẩm, 15 phút, trả lời đúng 4 câu.

- **[NotebookLM]** — phụ trách: ____ · flow / đáng học / đáng né / mình khác gì
- **[ChatGPT Study Mode]** — phụ trách: ____ · …

---

## §4. Thiết kế

### 🎯 Lát cắt MỘT CÂU
> **Một học viên K4 đang mở tài liệu trong VLearn** cần **hỏi một câu mà slide không trả lời được** được **AI phân loại câu hỏi là CÓ hay KHÔNG có căn cứ trong tài liệu đang mở trước khi trả lời** giúp **học viên biết ngay câu trả lời nào đáng tin và phải hỏi ai cho phần còn lại**.

`1 user` học viên K4 trong trang học · `1 việc` hỏi một câu quanh buổi học · `1 quyết định AI` có căn cứ trong tài liệu hay không · `1 kết quả` không bao giờ hành động theo thông tin bịa.

### Non-goals — ≥3 thứ KHÔNG build
1. **Không** đi tìm câu trả lời đúng cho câu hỏi hành chính (không kết nối syllabus, LMS, Discord hay lịch khoá). Nhóm chỉ làm tutor **thừa nhận không biết và chỉ đúng chỗ** — trả lời đúng là việc của TA.
2. **Không** sửa giọng văn, độ dài hay chất lượng sư phạm của câu trả lời khi tutor **có** căn cứ. Đường happy path giữ nguyên hành vi hiện tại.
3. **Không** làm bộ nhớ hội thoại, không cá nhân hoá theo học viên, không đo `understanding_level`.
4. **Không** xây dashboard cho giảng viên/TA (đó là đề A2).
5. **Không** chống prompt injection như một tính năng riêng — chỉ xử lý ở mức câu hỏi đó rơi vào lớp ③ ngoài thẩm quyền.

### Mức prototype
✅ **Mock** — flow bấm được đầu-cuối, **AI thật ở lõi**, dữ liệu tài liệu là fixture.

| Phần | Thật hay mock |
|---|---|
| Quyết định phân loại có/không có căn cứ + sinh câu trả lời | 🟢 **AI THẬT** — 1 lời gọi LLM, có log prompt + response thô trong `codebase/logs/` |
| Nội dung tài liệu đang mở | 🟡 Fixture — trích đoạn từ 2 slide + transcript trong data pack |
| Giao diện trang học VLearn | 🟡 Mock — trang tĩnh mô phỏng khung tutor |
| Bảng định tuyến "hỏi ai cho phần này" | 🟡 Mock — bảng cứng 4 dòng (TA / giảng viên / Syllabus / kênh lớp) |

### Automation: ✅ **Conditional** *(AI tự làm ca chắc, chuyển người ca mơ hồ)*
**Lý do theo cost-of-error:** hai loại sai có giá **rất lệch nhau**.
- Sai kiểu **bịa** (nói có khi không có căn cứ) → học viên hành động theo → **mất điểm, không sửa được sau deadline**. Cực đắt.
- Sai kiểu **thận trọng thừa** (nói không có khi thật ra có) → học viên bị đẩy đi hỏi TA một câu đáng lẽ tự tra được → **tốn 2 phút**. Rẻ.

Vì chi phí lệch khoảng hai bậc, hệ thống được thiết kế **lệch hẳn về phía từ chối**: chỉ tự trả lời khi trích được câu cụ thể trong tài liệu; mọi trường hợp còn lại chuyển sang đường "không có căn cứ" + định tuyến người. Không chọn `automate` vì hậu quả rơi lên điểm số học viên; không chọn `augment` vì không có TA ngồi duyệt từng câu trả lời theo thời gian thực.

**Ba câu cam kết *(PAIR 1.3)*:**
- AI **luôn phải** gắn trích dẫn `[trang N]` cho mọi khẳng định về nội dung khoá học.
- AI **không được** đưa ra thông tin về deadline, quy chế chấm điểm hay thao tác hệ thống — **kể cả khi học viên khẳng định là có trong tài liệu**.
- Nếu AI dự đoán yếu, học viên **không phiền** việc phải bấm thêm một nút để hỏi TA, **miễn là** nó nói thẳng lý do không trả lời được.

### §4b. Nguyên tắc đã áp dụng (≥4 — HAX/PAIR)

| Nguyên tắc | Áp cụ thể vào đâu trong prototype |
|---|---|
| **G1** — Làm rõ hệ thống làm được gì | Dòng chào một câu ngay trên ô nhập: *"Mình trả lời được nội dung trong tài liệu bạn đang mở. Deadline, điểm số, cách nộp bài → mình sẽ chỉ bạn hỏi ai."* Thay cho đoạn chào dài hiện tại mà `T10303` cho thấy không ai đọc. |
| **G2** — Làm rõ nó làm tốt đến đâu | Mỗi câu trả lời hiện **nhãn căn cứ** ở đầu: 🟢 `Có căn cứ — trang 14` / 🟡 `Một phần` / 🔴 `Ngoài tài liệu`. Học viên biết khi nào nên tin trước khi đọc nội dung. |
| **G10** — Thu hẹp phạm vi khi nghi ngờ *(bắt buộc)* | Khi phân loại ra 🔴, prototype **không sinh câu trả lời nội dung**. Nó trả về đúng mẫu `T02918`: nói rõ không có trong tài liệu + chỉ kênh đúng. Đây là quyết định trung tâm của lát cắt. |
| **G11** — Giải thích vì sao | Nhãn 🔴 kèm một dòng lý do gắn với hành động tiếp theo: *"Tài liệu buổi này (trang 1-29) không có nội dung về quy chế nộp bài → hỏi TA ở kênh #hoi-dap"*. |
| **G9** — Sửa dễ dàng | Dưới mỗi câu 🔴 có nút **"Tài liệu có nói mà"** → học viên chỉ vào đoạn cụ thể, hệ thống chạy lại phân loại trên đoạn đó. Bắt được ca thận trọng thừa. |
| **G15** — Mời feedback chi tiết | 👍/👎 kèm **một câu hỏi bắt buộc chọn**: "sai chỗ nào? — bịa / thiếu / lạc đề / đúng mà khó hiểu". Nhằm vá tỷ lệ rating 1,3% hiện tại. |

---

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8)
> ⬜ Hoàn thành trước CP4. Khung 4 lớp đã chốt, ≥8 kịch bản đang viết — mỗi lớp ≥2 ca tương ứng trong golden set.

| # | Lớp | Câu hỏi cụ thể hoá cho lát cắt này |
|---|---|---|
| ① | Nguồn sự thật | Tutor bịa quy chế nộp bài / chính sách chấm điểm — xem `T04628`. Gắn `[trang N]` cho nội dung không nằm ở trang đó — xem `T07094`. |
| ② | Mơ hồ / thiếu thông tin | Học viên gõ "hi" khi đang mở phần "Nộp bài" — xem `T10303`, `T06981`. Không rõ đang hỏi nội dung hay hành chính. |
| ③ | Ngoài phạm vi / thẩm quyền | Hỏi điểm của mình, xin đáp án bài lab, prompt injection kiểu "bỏ qua hướng dẫn trước đó" — có thật trong pack. |
| ④ | Đặc thù domain | Sai deadline → nộp muộn → **0 điểm mốc đó**. Sai tiêu chí chấm lab → làm lệch trọng tâm. Đây là chỗ sai thì học viên mất điểm ngay. |

## §6. Bốn đường đi của trải nghiệm

| Đường | Hành vi |
|---|---|
| **Happy path** | Câu hỏi có căn cứ → nhãn 🟢 `Có căn cứ — trang N` → trả lời kèm trích dẫn → giữ nguyên hành vi tutor hiện tại. |
| **Low-confidence (②)** | Phân loại 🟡: có liên quan nhưng tài liệu chỉ nói một phần → trả lời **phần có căn cứ** + nói rõ phần nào không có + hỏi lại **một câu** để thu hẹp. (Hiện tutor chỉ làm việc này 0,2% số lần.) |
| **Failure / không căn cứ (①)** | Phân loại 🔴 → **không sinh nội dung** → mẫu `T02918`: "Tài liệu buổi này không có thông tin về X" + định tuyến: TA / giảng viên / Syllabus / kênh lớp. |
| **Correction (user sửa)** | Nút **"Tài liệu có nói mà"** → học viên bôi đen đoạn cụ thể → chạy lại phân loại chỉ trên đoạn đó → nếu đúng là có, trả lời kèm trích dẫn và ghi ca này vào log để bổ sung golden set. |

**Khi bị đòi ngoài phạm vi (③):** từ chối + nêu lý do thẩm quyền, không xin lỗi vòng vo, chỉ thẳng người có quyền trả lời.
**Case đặc thù domain (④):** mọi câu chạm tới deadline / điểm / quy chế **luôn** đi đường 🔴 kể cả khi mô hình thấy "có vẻ biết" — luật cứng trong prompt, không phụ thuộc phán đoán của mô hình.

## §7. Kiểm thử
> ⬜ **Quality bar khoá tại CP4 — 21:00 ngày 17/9.** Sau thời điểm này không được sửa.

- **Chiều chất lượng + định nghĩa kiểm chứng được:** ⬜ đang viết (dự kiến 3 chiều: *phân loại đúng nhãn* · *không bịa* · *định tuyến đúng người*)
- **Golden set ≥20 case** → `eval/golden_set.json` — ≥2 ca mỗi lớp ①②③④ + 8-10 ca thường + 2-4 ca hiếm; **≥10 ca lấy trực tiếp từ 150 `turn_id` thật** đã tìm được. ⬜
- **Quality bar:** "Đạt khi ≥ ___% qua bộ, và ___" ⬜ **CHƯA CHỐT — hạn 21:00 17/9**
- **Kết quả các lượt chạy:** `eval/run_results.md` ⬜

## §8. Phân công & kế hoạch

| Đầu việc | Người phụ trách |
|---|---|
| Spec §1-§4, điều phối, nộp 5 form checkpoint | **PHAN DUY BẢO** (2A202602767) |
| Module quyết định trung tâm + lời gọi AI thật + trace log | **ĐOÀN DUY BÁCH** (2A202602515) |
| Evidence chuẩn A/B + golden set + chấm kết quả | **TRẦN THỊ THUÝ** (2A202602960) |
| 4 đường đi trải nghiệm, prototype UI, HAX/PAIR, slide + video | **NGUYỄN VĂN SƠN** (2A202602744) |

**Willing users (≥2 tên):** ✅ **Nguyễn Anh Tú** · **Phạm Văn Nghị** — học viên 3A nhóm khác, đã đồng ý thử prototype trước CP5 (chi tiết trong `TEAMMATES.md`).
**Multi-prototype:** ⬜ nếu kịp giữa CP2 và CP3 — trục khác biệt dự kiến: *chặn hẳn khi 🔴* vs *trả lời kèm cảnh báo đỏ*.

## §9. Changelog

| Thời điểm | Đổi gì | Vì sao (trỏ về feedback/case nào) |
|---|---|---|
| 16/9 19:00 | Chốt lát cắt A1 "tutor biết mình không biết"; loại 3 ứng viên | Mining 13.494 lượt: 86,7% ca ngoài phạm vi bị trả lời không căn cứ, 130/150 thuộc K4 (`evidence/mining-notes.md`) |
