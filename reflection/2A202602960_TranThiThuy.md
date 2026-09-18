# Reflection — TRẦN THỊ THUÝ · 2A202602960

> ⚠️ **Bản nháp do Claude Code dựng sẵn từ lịch sử repo — người đứng tên PHẢI đọc lại, sửa cho đúng việc mình thật sự làm, và tự viết các mục ⬜ trước 17:30 18/9.**
> Phần đã điền sẵn chỉ gồm những gì kiểm chứng được trong repo (file, commit, số liệu). Phân công trong README là bản nhóm chốt; nếu bạn không làm phần nào trong đây thì xoá đi — giám khảo hỏi theo đúng file này và README (vibe-coding rule: không giải thích được → 0 điểm phần đó).

## 1 · Vai trò
Evidence & Eval lead — bằng chứng chuẩn A/B, golden set, chấm kết quả.

## 2 · Phần việc trực tiếp phụ trách
- Mining 13.494 lượt `tutor_turns.csv` → `evidence/count_citations.py` (4 phép đo, mỗi phép tự khai giới hạn)
- `evidence/mining-notes.md` — kể cả mục **§5 "chúng tôi đã đếm sai những gì"**
- Golden set 28 ca `eval/golden_set.json` — 19 ca mang `turn_id` thật, 8 ca biên khó
- Khảo sát chuẩn A: `evidence/survey-log.md` + `tao-google-form.gs` ⬜ *(tính đến 18/9 trưa: 0/20)*

**Phải giải thích được khi bị hỏi:**
- Vì sao **12,8% là sàn chứ không phải trần** (chỉ bắt được trích dẫn vượt số trang)
- Độ dài thật của bộ slide lấy từ đâu (học viên bôi trúng thanh trạng thái `"Trang 12 / 83 …pdf"`)
- Vì sao **không** dùng trường `rating` làm bằng chứng hậu quả (chỉ 177/13.494 lượt = 1,3%)

## 3 · Cách tôi ứng dụng AI trong quá trình làm
*Điền sẵn (có trong repo):* dùng **Claude Code** để viết script đếm, rà mẫu đầu ra, dựng golden set từ chatlog.

⬜ **Tự viết:** bạn rà tay bao nhiêu ca? Có lần nào con số AI đưa ra nghe hợp lý mà sai không?

## 4 · Bài học từ một ca thất bại của nhóm
**Bốn lần đếm sai, đều tự phát hiện** (`evidence/mining-notes.md` §5):
1. Regex bóc tiền tố sót dấu nháy cong → 116/150 ca cũ là khớp nhầm
2. Lấy "trang đang mở" làm chuẩn → sai, vì câu hỏi thường nói về cả bộ slide
3. Lấy số trang trong tiền tố làm chuẩn → `T00058` chứng minh **tutor đúng, phép đo sai**
4. Đếm theo `lecture_code` trần → mã không duy nhất giữa các khoá; 958 ca → **164 ca**

*Cùng loại lỗi ở khâu chấm:* lượt eval đầu tiên chấm trượt `U07` vì regex `forbid` khớp chữ "xác nhận" ngay trong một câu từ chối **đúng**.

⬜ **Tự viết (3–5 câu):** lần sau đếm bằng regex bạn sẽ làm gì khác? Con số nào trong bài bạn tin nhất — vì sao?
