/**
 * Tạo Google Form khảo sát chuẩn A cho nhóm Dalab — chạy một lần là xong.
 *
 * CÁCH DÙNG
 *   1. Mở https://script.google.com  →  New project
 *   2. Xoá hết code mẫu, dán toàn bộ file này vào
 *   3. Bấm Run (▶)  →  Google hỏi quyền  →  Advanced  →  Go to project  →  Allow
 *   4. Mở View → Logs (hoặc Execution log) để lấy 2 link:
 *        - LINK GỬI CHO LỚP  (published URL)
 *        - LINK SỬA FORM     (edit URL)
 *   5. Câu trả lời tự đổ vào một Google Sheet cùng tên, tải về .csv rồi nhập vào
 *      evidence/survey-log.md (BẢNG LOG PHẢI GIỮ NGUYÊN VĂN — rubric R1).
 *
 * Bộ câu hỏi bám nguyên tắc Mom Test: hỏi CHUYỆN ĐÃ XẢY RA, không hỏi ý kiến.
 * Bộ câu hỏi này khớp với evidence/survey-log.md — sửa một bên thì sửa cả bên kia.
 *
 * ĐIỀU CẦN XÁC NHẬN (để tính % chuẩn A, cần ≥50%):
 *   Đã từng bấm/cuộn theo số trang AI tutor chỉ, và KHÔNG thấy nội dung đó ở trang ấy.
 */
function taoFormKhaoSat() {
  var form = FormApp.create('Khảo sát AI Tutor VLearn — Nhóm Dalab (3A)');

  form.setDescription(
    'Tụi mình đang tìm hiểu xem khi AI tutor trên VLearn trả lời kèm số trang ' +
    '(kiểu "[trang 24]"), số trang đó có mở ra đúng chỗ không.\n\n' +
    'Khoảng 2 phút. Tụi mình cần chuyện đã xảy ra thật, không cần ý kiến hay lời khen.\n' +
    'Câu trả lời chỉ dùng làm bằng chứng trong bài nộp hackathon của lớp.'
  );
  form.setCollectEmail(false);
  form.setProgressBar(true);

  // --- Trang 1: định danh + câu lọc ---
  form.addTextItem()
    .setTitle('Họ tên')
    .setHelpText('Tụi mình cần ghi nguồn cho từng câu trả lời trong tài liệu nộp bài.')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Lớp / nhóm')
    .setHelpText('Ví dụ: 3A — nhóm 5')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Bạn đã từng hỏi AI tutor trên VLearn về một chỗ trong slide chưa?')
    .setChoiceValues(['Rồi', 'Chưa bao giờ'])
    .setRequired(true);

  // --- Trang 2 ---
  form.addPageBreakItem()
    .setTitle('Lần gần nhất đó')
    .setHelpText('Nhớ được bao nhiêu ghi bấy nhiêu. Nhớ nguyên câu chữ thì càng tốt.');

  form.addParagraphTextItem()
    .setTitle('Lần gần nhất bạn hỏi tutor về một chỗ trong slide — nó trả lời xong thì bạn làm gì tiếp?')
    .setHelpText('Ví dụ: "Đọc xong rồi thôi" / "Mình cuộn lên trang nó ghi để xem thêm."')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Câu trả lời có kèm số trang không? Bạn có mở trang đó ra xem không — thấy gì ở đấy?')
    .setRequired(true);

  // Câu TRỌNG TÂM
  form.addParagraphTextItem()
    .setTitle('Có lần nào bạn mở theo trang nó chỉ mà KHÔNG thấy nội dung đó không? Kể lại lần đó.')
    .setHelpText('Chưa gặp bao giờ thì ghi "chưa" — câu trả lời đó cũng có ích cho tụi mình.')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Lúc ấy bạn làm gì tiếp — bỏ qua, tự dò lại cả bộ slide, hay đi hỏi ai?')
    .setRequired(true);

  // Câu phụ: tách "không gặp lỗi" khỏi "không dùng tới trích dẫn" — hai nhóm rất khác nhau
  form.addMultipleChoiceItem()
    .setTitle('Bình thường bạn có dùng số trang tutor đưa để mở lại tài liệu không?')
    .setChoiceValues([
      'Có — mình hay mở theo trang nó chỉ',
      'Thỉnh thoảng',
      'Không — mình chỉ đọc câu trả lời rồi thôi',
      'Mình không để ý là nó có số trang'
    ])
    .setRequired(true);

  // Câu CHỐT — dùng để tính tỷ lệ xác nhận (chuẩn A cần ≥50%)
  form.addMultipleChoiceItem()
    .setTitle('Tóm lại: đã có lần nào bạn mở theo số trang tutor chỉ mà không thấy nội dung đó chưa?')
    .setChoiceValues([
      'Rồi — mình nhớ được lần cụ thể',
      'Hình như có, nhưng không nhớ lần nào',
      'Chưa bao giờ',
      'Mình chưa từng mở theo số trang nó đưa'
    ])
    .setHelpText('Chỉ đáp án đầu tiên được tính là "xác nhận" — tụi mình cần chuyện nhớ được, không cần cảm giác.')
    .setRequired(true);

  var sheet = SpreadsheetApp.create('Khảo sát AI Tutor VLearn — câu trả lời (Dalab)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  Logger.log('================ XONG ================');
  Logger.log('LINK GỬI CHO LỚP : ' + form.getPublishedUrl());
  Logger.log('LINK SỬA FORM    : ' + form.getEditUrl());
  Logger.log('SHEET CÂU TRẢ LỜI: ' + sheet.getUrl());
  Logger.log('======================================');
}
