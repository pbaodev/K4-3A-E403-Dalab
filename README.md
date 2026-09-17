# K4-3A-E403-Dalab — Mini Hackathon AI · Batch 04 · Lớp 3A

**SPEC → Prototype → Demo.** Đây không phải cuộc thi code — đây là cuộc thi **tư duy sản phẩm AI**.

**Track:** A — VLearn Tutor · **Đề:** A1 (tối ưu AI tutor hiện có)
**Lát cắt:** Tutor phân loại câu hỏi **có / không có căn cứ trong tài liệu đang mở** trước khi trả lời — không có căn cứ thì nói rõ và chỉ chỗ hỏi đúng, thay vì bịa.

### ▶ Bấm thử prototype: **https://pbaodev.github.io/K4-3A-E403-Dalab/**

Không cần clone, không cần cài. Bốn nút mẫu chạy đúng bốn đường đi trải nghiệm trong `spec.md` §6.

## 👥 Thành viên nhóm & Phân công vai trò

**Lớp:** 3A · **Phòng:** E403 · **Cụm:** ____ · **Track:** A (A1)

| Họ và Tên | Mã Học Viên | Vai trò chính | Phần việc đảm nhiệm trong dự án |
|---|---|---|---|
| PHAN DUY BẢO | 2A202602767 | Team lead · Product owner | Đội trưởng — nộp form cả 5 mốc CP1–CP5; chốt lát cắt & non-goals; viết `spec.md` §1–§4; điều phối tiến độ theo checkpoint |
| ĐOÀN DUY BÁCH | 2A202602515 | AI engineer | Module quyết định trung tâm trong `codebase/`; tích hợp lời gọi AI thật (Gemini API); thiết kế prompt phân loại có/không căn cứ; logging trace prompt–response |
| TRẦN THỊ THUÝ | 2A202602960 | Evidence & Eval lead | Mining `tutor_turns.csv` (chuẩn B) + khảo sát ≥20 học viên (chuẩn A); dựng golden set ≥20 ca trong `eval/`; chấm kết quả & viết `eval/run_results.md` |
| NGUYỄN VĂN SƠN | 2A202602744 | UX & Demo lead | Thiết kế 4 đường đi trải nghiệm; dựng prototype UI trong `codebase/`; đối chiếu 4 nguyên tắc HAX/PAIR; slide 6 trang + video demo dự phòng |

> Mỗi thành viên phải giải thích được phần có tên mình — giám khảo hỏi ngẫu nhiên tại CP6 (**vibe-coding rule**: không giải thích được → 0 điểm phần cá nhân liên quan).

## 📁 Cấu trúc repo

| Đường dẫn | Nội dung |
|---|---|
| `spec.md` | AI Spec 8 phần — deliverable trung tâm (45/67 điểm chấm bài) |
| `evidence/` | Log mining + khảo sát, script đếm kiểm lại được (chuẩn A/B) |
| `codebase/` | Prototype có ≥1 lời gọi AI thật ở quyết định trung tâm |
| `eval/` | Golden set ≥20 ca + bảng kết quả các lượt chạy |
| `validation/` | Nhật ký thử nghiệm người dùng ngoài nhóm (R6) |
| `reflection/` | Thu hoạch cá nhân từng thành viên |
| `demo-slides.pdf` | Slide báo cáo 6 trang (nộp tại CP5) |

## 🗓️ Tiến độ checkpoint

| Mốc | Hạn | Trạng thái |
|---|---|---|
| CP1 · Canvas + repo công khai | 19:30 · 16/9 | ✅ |
| CP2 · Flow bấm được | 21:00 · 16/9 | ✅ |
| CP3 · AI thật + đo lượt 1 | 16:00 · 17/9 | ✅ **27/28 = 96%** · `qwen3.8-27b` trên Groq · [kết quả](eval/run_results.md) |
| CP4 · Chốt spec + khoá quality bar | 21:00 · 17/9 | ⬜ |
| CP5 · Slide PDF + video dự phòng | 13:00 · 18/9 | ⬜ |
| CP6 · Thuyết trình | 17:30 · 18/9 | ⬜ |

## 🔒 Bảo mật dữ liệu

Repo này **không chứa** bất kỳ tệp nào từ `data/` của repo đề bài. Mọi bằng chứng mining chỉ ghi **số liệu tổng hợp** và **trích đoạn ngắn kèm `turn_id`** để dẫn nguồn — đúng quy định trong `data/README.md` của BTC. Script đếm trong `evidence/` đọc data từ đường dẫn cục bộ do người chạy tự trỏ tới, không kèm dữ liệu.
