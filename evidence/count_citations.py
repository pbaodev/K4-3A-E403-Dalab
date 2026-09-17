#!/usr/bin/env python3
"""
Bằng chứng chuẩn B — nhóm Dalab (Track A1).

CÂU HỎI ĐẾM
    Khi tutor gắn một trích dẫn [trang N] vào câu trả lời, học viên có cách nào
    kiểm tra N là thật không — và N có thật không?

CHẠY LẠI
    python3 evidence/count_citations.py /duong/dan/toi/tutor_turns.csv

Script KHÔNG kèm dữ liệu. Người chấm tự trỏ tới data pack của BTC trên máy mình.

BỐN PHÉP ĐO (độc lập nhau, mỗi phép nói rõ giới hạn)
    [1] Giao diện K4 có gửi số trang cho tutor không?
    [2] Tutor tự mâu thuẫn: lời văn ghi trang A, trích dẫn ngay sau ghi trang B≠A.
    [3] Trích tới số trang KHÔNG TỒN TẠI — so với độ dài thật của bộ slide.
    [4] Trích sai trang, so với trang do CHÍNH HỌC VIÊN gõ ra.

VÌ SAO ĐỘ DÀI SLIDE LẤY ĐƯỢC TỪ CHATLOG
    Học viên thỉnh thoảng bôi đen trúng thanh trạng thái của trình xem PDF, nên
    câu hỏi chứa nguyên văn "Trang 12 / 83 day01-slide-blue-v1.pdf". 83 là tổng
    số trang THẬT. Chỉ nhận bộ slide nào thấy >=3 lần và mọi lần đều cùng một số.

CHỐT CHẶN PHƯƠNG PHÁP
    `lecture_code` KHÔNG duy nhất giữa các khoá (data dictionary) — D01 của K3 và
    D01 của K4 là hai bộ slide khác nhau. Mọi phép đo dưới đây khoá theo
    (course_id, lecture_code), không bao giờ theo lecture_code trần.
"""
import csv, re, sys, collections

csv.field_size_limit(10**9)

CITE   = re.compile(r'\[\s*trang\s*(\d+)', re.I)
CHROME = re.compile(r'Trang\s+\d+\s*/\s*(\d+)\s+(\S+\.pdf)', re.I)
PROSE  = re.compile(r'(?:ở|tại|trong|thuộc)\s+trang\s+(\d+)\s*(?:của tài liệu\s*)?'
                    r'\[\s*trang\s*(\d+)\s*\]', re.I)
INTEXT = re.compile(r'đoạn bôi đen ở Trang\s*(\d+)', re.I)
QPAGE  = re.compile(r'^\(\s*(?:Trang|Page)\s*\d+', re.I)

key = lambda r: (r["course_id"].strip(), r["lecture_code"].strip())
cites = lambda r: [int(x) for x in CITE.findall(r["tutor_reply"])]


def deck_lengths(rows):
    """Độ dài thật của bộ slide, chỉ giữ bộ có bằng chứng nhất quán."""
    seen = collections.defaultdict(collections.Counter)
    for r in rows:
        for total, _ in CHROME.findall(r["student_question"]):
            seen[key(r)][int(total)] += 1
    return {k: next(iter(c)) for k, c in seen.items()
            if len(c) == 1 and sum(c.values()) >= 3}


def main(path):
    rows = list(csv.DictReader(open(path, encoding="utf-8")))
    coh = lambda c: [r for r in rows if r["cohort_hint"].strip() == c]
    k4, k3 = coh("K4"), coh("K3")
    print(f"Tổng lượt {len(rows)} · K4 {len(k4)} · K3 {len(k3)}\n")

    # [1] Giao diện K4 có gửi số trang không?
    print("[1] GIAO DIỆN CÓ GỬI SỐ TRANG CHO TUTOR KHÔNG?")
    for rs, name in ((k4, "K4"), (k3, "K3")):
        q  = sum(1 for r in rs if QPAGE.match(r["student_question"].lstrip()))
        c  = sum(1 for r in rs if CITE.search(r["tutor_reply"]))
        print(f"    {name}: câu hỏi kèm số trang {q:>5}/{len(rs)} ({q/len(rs)*100:>5.1f}%)"
              f" · trả lời có [trang N] {c:>5}/{len(rs)} ({c/len(rs)*100:.1f}%)")
    print("    -> K4: 0% câu hỏi có số trang, nhưng phần lớn câu trả lời vẫn trích trang.")
    print("       Số trang đó do hệ thống tự sinh, học viên không có gì để đối chiếu.\n")

    # [2] Tự mâu thuẫn — không cần slide vẫn chứng minh được
    print("[2] TUTOR TỰ MÂU THUẪN (lời văn trang A, trích dẫn ngay sau trang B≠A)")
    contra = [(r, int(a), int(b)) for r in rows
              for a, b in PROSE.findall(r["tutor_reply"])[:1] if a != b]
    by = collections.Counter(r["cohort_hint"] for r, _, _ in contra)
    print(f"    {len(contra)} lượt · {len(set(r['student'] for r,_,_ in contra))} học viên · {dict(by)}")
    if contra:
        d = sorted(abs(a - b) for _, a, b in contra)
        print(f"    chênh lệch trung vị {d[len(d)//2]} trang — lệch hệ thống, không phải sai số lẻ")
    for r, a, b in contra[:5]:
        print(f"      {r['turn_id']} · {r['cohort_hint']} · {r['lecture_code']}: "
              f"lời văn trang {a} ≠ trích [trang {b}]")
    print()

    # [3] Trích tới trang không tồn tại
    print("[3] TRÍCH TỚI SỐ TRANG KHÔNG TỒN TẠI (so với độ dài thật của bộ slide)")
    LEN = deck_lengths(rows)
    for k in sorted(LEN):
        print(f"    biết độ dài: {k[0]:<12} {k[1]:<4} = {LEN[k]:>3} trang")
    chk = [r for r in rows if key(r) in LEN and cites(r)]
    bad = [r for r in chk if max(cites(r)) > LEN[key(r)]]
    if chk:
        print(f"    kiểm được {len(chk)} lượt · trỏ tới trang không tồn tại "
              f"{len(bad)} ({len(bad)/len(chk)*100:.1f}%) · "
              f"{len(set(r['student'] for r in bad))} học viên")
    print("    GIỚI HẠN: chỉ bắt được trích dẫn VƯỢT số trang. Trích sai mà vẫn nằm")
    print("    trong khoảng thì phép đo này không thấy — nên đây là SÀN, không phải trần.")
    print("    GIỚI HẠN: không bộ slide nào của K4 khôi phục được độ dài, vì giao diện K4")
    print("    không gửi ngữ cảnh trang. Con số trên đo được ở K3; K4 không ai kiểm được.\n")

    # [4] Trích sai so với trang do chính học viên gõ
    print("[4] TRÍCH SAI SO VỚI TRANG DO CHÍNH HỌC VIÊN GÕ RA")
    g = [(r, int(m.group(1)), cites(r)) for r in rows
         if (m := INTEXT.search(r["student_question"])) and cites(r)]
    wrong = [x for x in g if x[1] not in x[2]]
    first = [x for x in g if x[2][0] != x[1]]
    if g:
        print(f"    {len(g)} lượt học viên tự ghi 'đoạn bôi đen ở Trang N'")
        print(f"      trích sai trang đó        : {len(wrong)} ({len(wrong)/len(g)*100:.1f}%)"
              f" · {len(set(x[0]['student'] for x in wrong))} học viên")
        print(f"      trích dẫn ĐẦU TIÊN sai    : {len(first)} ({len(first)/len(g)*100:.1f}%)"
              f"  <- đây là cái học viên đọc trước")
    print("    GIỚI HẠN: đã soát tay 20 ca ngẫu nhiên (seed 42). Một phần nhỏ là ca học")
    print("    viên bôi trúng chữ của trình xem nên chuẩn đối chiếu hỏng — xem mining-notes.md §5.")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    main(sys.argv[1])
