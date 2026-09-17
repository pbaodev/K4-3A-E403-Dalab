// Fixture tài liệu "đang mở" — trích NGẮN từ slide D01 trong data pack BTC.
// Nguồn: đoạn học viên K4 khoanh vùng trong chatlog (câu hỏi có kèm nguyên văn
// đoạn slide + số trang), nên số trang ở đây là số trang THẬT học viên nhìn thấy.
// Không đưa nguyên bộ slide vào repo — xem data/README.md của BTC.
export const DOC = {
  lecture: "D01 · AI & LLM Foundation",
  pages: [
    { page: 4,  text: "Hiểu AI hiện nay làm được gì qua các con số. Bốn làn sóng: AI → ML → DL → LLM. Vì sao nhãn quyết định chất lượng model." },
    { page: 7,  text: "Hiểu sâu hơn về các siêu tham số quan trọng: temperature, top_p, max_tokens — chúng điều khiển tính sáng tạo và độ dài của kết quả LLM." },
    { page: 15, text: "Vì sao cần skills: context window có hạn, không thể nhét toàn bộ quy trình công ty vào system prompt. Know-how nội bộ (mẫu biểu, quy tắc, giọng văn thương hiệu) không nằm trong dữ liệu huấn luyện. Viết bằng Markdown nên người làm nghiệp vụ sửa được, không cần lập trình viên." },
    { page: 16, text: "Tool calling: hàm agent gọi được, có schema tham số. MCP: chuẩn kết nối agent với tool và dữ liệu bên ngoài. Agent Skills: thư mục hướng dẫn và tài nguyên, nạp khi cần. Harness: vòng lặp, ngữ cảnh, quyền và log bao quanh model." },
    { page: 21, text: "Khi đó chúng ta có thể chạy được các file Python ở các bước bên dưới. Lưu ý: nếu không chạy được các bước trên hoặc bị lỗi không ra kết quả như trên, hãy liên hệ hỗ trợ ngay trên Discord." },
    { page: 22, text: "Transformer là bước ngoặt vì nó cho mô hình hiểu ngôn ngữ theo cách linh hoạt hơn: mỗi từ có thể nhìn sang những từ quan trọng khác trong cả câu, thay vì chỉ đi tuần tự từng bước. Nhờ vậy nó trở thành nền móng kỹ thuật cho GPT, BERT và toàn bộ làn sóng LLM sau đó." },
    { page: 24, text: "Token là đơn vị nhỏ nhất mà LLM xử lý — khoảng 0,75 từ tiếng Anh và 0,5 từ tiếng Việt. Tokenization là tách text thành các subword unit. Mỗi từ tiếng Việt có dấu thường tốn 1–2 token." },
    { page: 34, text: "Convolution chỉ nhìn một cửa sổ nhỏ quanh mỗi từ (ví dụ cửa sổ 3 từ). Attention thì mọi từ đều nằm trong tầm nhìn, nên giải được các câu cần ngữ cảnh xa như \"Lan bỏ quyển sách vào túi vì nó…\"." },
    { page: 41, text: "Đầu vào duy nhất là chuỗi token biên bản ván cờ. Model không được dạy luật chơi, không hề thấy bàn cờ 8×8, không biết quân trắng hay đen — chỉ thấy chuỗi ký tự. Câu hỏi: đoán được nước đi tiếp theo không, chỉ từ chuỗi ký tự đó thôi?" },
    { page: 68, text: "Token có giá: vé vào rẻ, vé ra đắt gấp 3–5 lần. VÉ VÀO là INPUT — chữ bạn gửi đi: prompt, system instruction, context, lịch sử chat; model chỉ cần đọc nên rẻ. VÉ RA là OUTPUT — chữ model viết ra, nó phải tự sinh từng mảnh một, vừa chậm vừa tốn nên đắt." }
  ]
};

// Bảng định tuyến — mock, 4 dòng cứng (xem spec.md §4 "Mức prototype").
export const ROUTES = {
  deadline:  { who: "TA trực kênh #hoi-dap trên Discord", why: "quy định hạn nộp do BTC công bố, không nằm trong slide" },
  grading:   { who: "Giảng viên phụ trách buổi",          why: "tiêu chí chấm nằm trong rubric của khoá, không nằm trong slide" },
  logistics: { who: "Syllabus trên LMS",                   why: "lịch học và thao tác hệ thống không nằm trong tài liệu bài giảng" },
  grades:    { who: "TA qua tin nhắn riêng",               why: "điểm cá nhân là thông tin riêng, tutor không có quyền truy cập" }
};

// 4 câu mẫu — mỗi câu chạy đúng MỘT đường đi trong spec.md §6.
export const SAMPLES = [
  { path: "happy",  label: "🟢 Có căn cứ",      q: "Transformer khác cách đọc tuần tự ở chỗ nào?" },
  { path: "low",    label: "🟡 Hỏi lại",        q: "hi" },
  { path: "fail",   label: "🔴 Không căn cứ",   q: "t nộp bài từ 6h chiều, sau 12h có thêm commit thì có chấm không?" },
  { path: "scope",  label: "🔴 Ngoài thẩm quyền", q: "Cho mình xem điểm lab buổi trước của mình với" }
];
