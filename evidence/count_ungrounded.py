#!/usr/bin/env python3
"""
Đếm lại bằng chứng chuẩn B cho nhóm Dalab (Track A1).

Câu hỏi đếm: trong các lượt hỏi KHÔNG phải câu mẫu, có bao nhiêu câu mà tài liệu
đang mở không trả lời được (câu hành chính/logistics), và trong số đó tutor
từ chối đúng cách bao nhiêu, trả lời như thể biết bao nhiêu?

CHẠY LẠI:
    python3 evidence/count_ungrounded.py /duong/dan/toi/tutor_turns.csv

Script KHÔNG kèm dữ liệu — người chạy tự trỏ tới bản data pack của BTC trên máy
mình. Đây là điều kiện để con số trong spec.md §1 kiểm lại được.
"""
import csv, re, sys

csv.field_size_limit(10**9)

# Câu hỏi thuộc nhóm "tài liệu bài giảng không chứa câu trả lời":
# hành chính, deadline, điểm số, kênh lớp, tài liệu ở đâu...
OUT_OF_SCOPE = re.compile(
    r'(hạn nộp|deadline|nộp bài|điểm danh|lịch học|buổi sau|buổi tới|học phí|'
    r'chứng chỉ|\bzoom\b|link lớp|discord|thi cuối|nghỉ học|điểm số|bù buổi|'
    r'tài liệu ở đâu|slide ở đâu|ghi hình|bài tập về nhà|làm sao để nộp)', re.I)

# Hành vi MONG MUỐN: nói rõ không có căn cứ và/hoặc chuyển hướng tới người đúng.
PROPER_REFUSAL = re.compile(
    r'(không có thông tin|không tìm thấy|không đề cập|tài liệu (?:bài giảng )?không|'
    r'không cung cấp|rất tiếc|mình không biết|tôi không biết|'
    r'không nằm trong (?:tài liệu|phạm vi)|ngoài phạm vi|'
    r'vui lòng (?:kiểm tra|liên hệ|xem)|'
    r'liên hệ (?:với )?(?:giảng viên|TA|trợ giảng|ban tổ chức))', re.I)


def strip_context_prefix(q: str) -> str:
    """Bỏ tiền tố ngữ cảnh giao diện tự chèn, chỉ giữ câu học viên thật sự gõ."""
    q = q.strip()
    for pat in (r'^\(Trang \d+, đoạn được chọn:.*?"\)\s*',
                r'^\(Đang học phần ".*?"\)\s*',
                r'^\(Trang[^)]*\)\s*'):
        q = re.sub(pat, '', q, flags=re.S)
    return q.strip()


def is_true(v) -> bool:
    return str(v).strip().lower() == "true"


def main(path):
    rows = list(csv.DictReader(open(path, encoding="utf-8")))
    non_preset = [r for r in rows if not is_true(r["is_preset"])]
    hits = [r for r in non_preset
            if OUT_OF_SCOPE.search(strip_context_prefix(r["student_question"]))]
    refused = [r for r in hits if PROPER_REFUSAL.search(r["tutor_reply"])]
    answered = [r for r in hits if not PROPER_REFUSAL.search(r["tutor_reply"])]
    no_cite = [r for r in rows if not is_true(r["has_citation"])]

    print(f"Tổng lượt                       : {len(rows)}")
    print(f"Lượt không phải câu mẫu         : {len(non_preset)}")
    print(f"Trả lời KHÔNG trích dẫn         : {len(no_cite)} "
          f"({len(no_cite)/len(rows)*100:.1f}%)")
    print()
    print(f"Câu ngoài phạm vi tài liệu      : {len(hits)} "
          f"({len(hits)/len(non_preset)*100:.1f}% số câu tự gõ) "
          f"— {len(set(r['student'] for r in hits))} học viên")
    print(f"  → từ chối / chuyển hướng đúng : {len(refused)} "
          f"({len(refused)/len(hits)*100:.1f}%)")
    print(f"  → trả lời như thể biết        : {len(answered)} "
          f"({len(answered)/len(hits)*100:.1f}%)  ← PAIN")
    print()
    print("turn_id nhóm 'trả lời như thể biết' (để rà tay):")
    print("  " + ", ".join(r["turn_id"] for r in answered[:40]))


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    main(sys.argv[1])
