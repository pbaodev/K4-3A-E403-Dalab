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
 *   5. Câu trả lời tự đổ vào một Google Sheet cùng tên, tải về .csv rồi đưa Claude
 *      để sinh evidence/survey-log.md
 *
 * Bộ câu hỏi bám nguyên tắc Mom Test: hỏi CHUYỆN ĐÃ XẢY RA, không hỏi ý kiến.
 */
function taoFormKhaoSat() {
  var form = FormApp.create('Khảo sát AI Tutor VLearn — Nhóm Dalab (3A)');

  form.setDescription(
    'Tụi mình đang tìm hiểu xem AI tutor trên VLearn trả lời thế nào khi bị hỏi ' +
    'những thứ không có trong slide — deadline, cách nộp bài, cách chấm lab.\n\n' +
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

  var loc = form.addMultipleChoiceItem()
    .setTitle('Bạn đã từng hỏi AI tutor trên VLearn về lịch học, deadline, cách nộp bài, hay cách chấm điểm chưa?')
    .setRequired(true);

  // --- Trang 2: chỉ hiện cho người đã từng hỏi ---
  var trangSau = form.addPageBreakItem()
    .setTitle('Lần gần nhất đó')
    .setHelpText('Nhớ được bao nhiêu ghi bấy nhiêu. Nhớ nguyên câu chữ thì càng tốt.');

  form.addParagraphTextItem()
    .setTitle('Lần gần nhất đó, tutor trả lời thế nào?')
    .setHelpText('Ví dụ: "Nó trả lời dài lắm, đọc xong vẫn không biết nộp ở đâu."')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Bạn có làm theo câu trả lời đó không? Sau đó có phải đi hỏi lại ai nữa không — hỏi ai?')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Có lần nào bạn phát hiện tutor nói sai không? Lúc đó bạn nhận ra bằng cách nào?')
    .setHelpText('Chưa gặp bao giờ thì ghi "chưa" — câu trả lời đó cũng có ích cho tụi mình.')
    .setRequired(true);

  // Câu CHỐT — dùng để tính tỷ lệ xác nhận (chuẩn A cần ≥50%)
  form.addMultipleChoiceItem()
    .setTitle('Tóm lại: đã có lần nào bạn PHẢI ĐI HỎI LẠI người khác, hoặc PHÁT HIỆN câu trả lời của tutor không đúng chưa?')
    .setChoiceValues(['Có, từng gặp', 'Không, luôn tin được', 'Không nhớ rõ'])
    .setRequired(true);

  // Rẽ nhánh: "Chưa bao giờ" → nộp luôn, không phải trả lời 4 câu trên
  loc.setChoices([
    loc.createChoice('Rồi', trangSau),
    loc.createChoice('Chưa bao giờ', FormApp.PageNavigationType.SUBMIT)
  ]);

  // Sheet nhận câu trả lời
  var sheet = SpreadsheetApp.create('Khảo sát AI Tutor VLearn — câu trả lời (Dalab)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  Logger.log('================ XONG ================');
  Logger.log('LINK GỬI CHO LỚP : ' + form.getPublishedUrl());
  Logger.log('LINK SỬA FORM    : ' + form.getEditUrl());
  Logger.log('SHEET CÂU TRẢ LỜI: ' + sheet.getUrl());
  Logger.log('======================================');
}
