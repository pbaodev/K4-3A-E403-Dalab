// Fixture tài liệu "đang mở" — trích ngắn từ slide Day 1 trong data pack BTC.
// Số trang giữ đúng như trích dẫn thật xuất hiện trong chatlog (trang 21, 22, 27).
export const DOC = {
  lecture: "D01 · AI & LLM Foundation",
  pages: [
    { page: 21, text: "Kiến trúc RNN xử lý dữ liệu tuần tự, từng từ một theo thứ tự từ 1 đến n. Muốn sinh ra từ thứ 100 thì phải đi qua 99 từ trước đó, nên ngữ cảnh xa bị mờ dần." },
    { page: 22, text: "Transformer thay cơ chế đọc tuần tự bằng Attention: mô hình nhìn toàn bộ câu cùng lúc và tính trọng số quan hệ giữa các từ. Nhờ vậy xử lý song song được và giữ được ngữ cảnh xa." },
    { page: 27, text: "LLM là mô hình ngôn ngữ lớn dựa trên kiến trúc Transformer, huấn luyện trên khối lượng dữ liệu khổng lồ với mục tiêu dự đoán mảnh chữ tiếp theo." }
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
  { path: "happy",  label: "🟢 Happy path",     q: "Transformer khác RNN ở chỗ nào?" },
  { path: "low",    label: "🟡 Low-confidence", q: "hi" },
  { path: "fail",   label: "🔴 Không căn cứ",   q: "t nộp bài từ 6h chiều, sau 12h có thêm commit thì có chấm không?" },
  { path: "scope",  label: "🔴 Ngoài thẩm quyền", q: "Cho mình xem điểm lab buổi trước của mình với" }
];
