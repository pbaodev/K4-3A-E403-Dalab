# Reflection — PHAN DUY BẢO · 2A202602767

> ⚠️ **Bản nháp do Claude Code dựng sẵn từ lịch sử repo — người đứng tên PHẢI đọc lại, sửa cho đúng việc mình thật sự làm, và tự viết các mục ⬜ trước 17:30 18/9.**
> Phần đã điền sẵn chỉ gồm những gì kiểm chứng được trong repo (file, commit, số liệu). Phân công trong README là bản nhóm chốt; nếu bạn không làm phần nào trong đây thì xoá đi — giám khảo hỏi theo đúng file này và README (vibe-coding rule: không giải thích được → 0 điểm phần đó).

## 1 · Vai trò
Đội trưởng · Product owner. Nộp form cả 5 mốc CP1–CP5 bằng mã 2A202602767.

## 2 · Phần việc trực tiếp phụ trách
- Chốt hướng A1 và lát cắt; viết `spec.md` §1–§4, §8, §9
- Quyết định **đổi problem statement ngày 17/9** — từ "tutor bịa khi bị hỏi ngoài phạm vi" sang "trích dẫn `[trang N]` không kiểm được / trỏ sai"
- Điều phối tiến độ theo checkpoint; chuẩn bị dry run và video dự phòng CP5

**Phải giải thích được khi bị hỏi:**
- Vì sao đổi problem statement giữa chừng — và vì sao lát cắt (quyết định AI ở lõi) vẫn giữ nguyên được
- Vì sao chọn *Conditional*, không *augment* hay *automate*
- Vì sao loại 3 ứng viên còn lại — bằng số (`spec.md` §2)

## 3 · Cách tôi ứng dụng AI trong quá trình làm
*Điền sẵn (có trong repo):* dùng **Claude Code** để khai thác chatlog, viết script đếm `evidence/count_citations.py`, soạn và sửa `spec.md`, dựng slide. Các commit có dòng `Co-Authored-By: Claude`.

⬜ **Tự viết:** bạn giao việc gì cho AI, việc gì tự làm? Có lần nào AI đưa kết quả sai mà bạn phải bắt lại không — bạn phát hiện bằng cách nào?

## 4 · Bài học từ một ca thất bại của nhóm
**Ca:** pain đầu tiên của nhóm (CP1) dựng trên **150 ca "ngoài phạm vi" — 116 ca là regex khớp nhầm** vào chữ giao diện tự chèn. Spec còn khẳng định *"từ chối oan là rẻ, tốn 2 phút"* mà không có số liệu nào chống lưng. Cả hai bị phát hiện và bỏ ngày 17/9 (`spec.md` §9, `evidence/mining-notes.md` §5).

⬜ **Tự viết (3–5 câu, giọng của bạn):** lúc biết số liệu CP1 sai bạn đã cân nhắc gì — giữ hay đổi? Lần sau bạn sẽ kiểm con số thế nào trước khi đưa vào spec?
