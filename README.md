# HỆ THỐNG DASHBOARD TỔNG HỢP BÁO CÁO - CHI CỤC QLTT AN GIANG

**Tác giả / Bản quyền**: **Võ Chí Nhân**  
**Chức vụ / Đơn vị**: KSVTT phòng TCHC - Chi Cục Quản Lý Thị Trường Tỉnh An Giang  
**Điện thoại / Zalo**: `0914.459.992`  
**Mã nguồn GitHub**: [https://github.com/chinhanqltt-maker/tkag](https://github.com/chinhanqltt-maker/tkag)

Hệ thống Dashboard web hiện đại thay thế các tập lệnh Google Apps Script thủ công, tự động hóa toàn bộ việc tổng hợp báo cáo từ Google Sheets với tốc độ xử lý siêu tốc, giao diện trực quan và khả năng trích xuất báo cáo chuẩn quy chuẩn nhà nước.

---

## 🚀 Hướng Dẫn Khởi Chạy Nhanh

1. **Khởi chạy bằng 1 click**:
   - Nhấp đúp vào file `start_dashboard.bat`.
   - Trình duyệt sẽ tự động mở tại địa chỉ: `http://localhost:3001`.

2. **Khởi chạy từ dòng lệnh (Terminal / PowerShell)**:
   ```bash
   npm run dev
   ```

---

## 🌟 Các Chức Năng Chính Của Hệ Thống

### 1. Tổng Quan Điều Hành (Executive Overview)
- Thống kê toàn tỉnh: **11.422+ cơ sở kinh doanh** được phân bổ qua **11 Đội QLTT (Đội 2 đến Đội 12)**.
- Phân loại cơ cấu: **1.800 Tổ chức (Doanh nghiệp)** vs **9.579 Cá nhân (Hộ kinh doanh)**.
- Biểu đồ phân bổ cơ sở theo từng Đội QLTT.
- Biểu đồ cơ cấu loại hình kinh doanh (Donut Chart).
- Top 10 ngành hàng kinh doanh trọng điểm (Thực phẩm, Dầu thực vật, Sữa, Thuốc lá, BVTV, Phân bón, Xăng dầu, LPG...).
- Top 10 Phường/Xã có mật độ cơ sở kinh doanh lớn nhất.

### 2. Báo Cáo Ngành Nghề (Chuẩn Sheet Công Thức BC)
- Bảng ma trận 34+ ngành hàng kinh doanh x 11 Đội QLTT + Tổng cộng toàn tỉnh.
- Bộ lọc nhóm ngành thông minh (Xăng dầu & LPG, Nông nghiệp & BVTV, Thực phẩm & Đồ uống, Y dược & Mỹ phẩm, Hàng tiêu dùng, Cơ khí & Phương tiện).
- Biểu đồ so sánh phân bổ các Đội cho từng ngành hàng được chọn.
- Chức năng **Xem ngay danh sách cơ sở thuộc ngành** chỉ với 1 click.
- Nút xuất file Excel chuẩn mẫu `Công Thức ( BC)`.

### 3. Báo Cáo Tiến Độ Thống Kê Theo Tuần (Chuẩn Sheet Số Liệu Thống Kê & Sheet13)
- Báo cáo tiến độ theo tuần (Tuần 1 -> Tuần 52+).
- Biểu đồ xu hướng tiến độ (Thống kê Mới vs Thống kê Lại qua các tuần).
- Bảng đối chiếu 3 nhóm: Tổng số thống kê, Thống kê Mới, Thống kê Lại của từng Đội.
- Lọc theo từng tuần hoặc xem toàn bộ năm.
- Nút xuất file Excel chuẩn mẫu `Số liệu thống kê`.

### 4. Tra Cứu Danh Bạ & Quản Lý Hồ Sơ Cơ Sở (Chuẩn Sheet OK & D2..D12)
- Tìm kiếm tức thì theo: Tên cơ sở, Tên bảng hiệu, Người đại diện, Mã số thuế (MST), Số CCCD/CMND, Số điện thoại, Địa chỉ, Số GCN ĐKKD.
- Bộ lọc đa chiều:
  - Lọc theo Đội (Đội 2 .. 12).
  - Lọc theo Loại hình (Tổ chức / Cá nhân).
  - Lọc theo Ngành hàng kinh doanh.
  - Lọc theo Phường / Xã.
  - Lọc theo Phân loại thống kê (Mới / Lại).
  - Lọc theo Cán bộ phụ trách.
- Bảng dữ liệu phân trang mượt mà (hàng chục nghìn dòng không giật lag).
- **Hồ sơ chi tiết cơ sở (Modal Profile)**: Đầy đủ thông tin pháp lý, GCNĐKKD, GCN đủ điều kiện, Giấy phép hành nghề, ngành hàng, cán bộ quản lý và nhập liệu.
- **Rà soát trùng lặp**: Tự động phát hiện trùng MST, CCCD, SĐT giữa các cơ sở.
- Nút xuất file Excel danh sách cơ sở đã lọc.

### 5. Báo Cáo Năng Suất Cán Bộ Địa Bàn & Nhập Liệu
- Thống kê khối lượng quản lý cơ sở và địa bàn của từng công chức.
- Biểu đồ xếp hạng cán bộ quản lý nhiều cơ sở nhất.
- Lọc theo từng Đội QLTT và tra cứu nhanh danh sách cơ sở phân công cho cán bộ.

### 6. Trung Tâm Xuất Báo Cáo & In Ấn Hành Chính
- Tải file Excel (.xlsx) chuẩn biểu mẫu cho tất cả các Sheet.
- Mẫu in khổ A4 ngang chuẩn thể thức văn bản hành chính nhà nước (Quốc hiệu tiêu ngữ, Cơ quan ban hành, Tiêu đề, Chữ ký Người lập biểu Võ Chí Nhân, Trưởng phòng TCHC, Chi cục trưởng).

---

## 🔄 Cơ Chế Đồng Bộ Dữ Liệu

1. **Đồng bộ trực tiếp từ Google Sheets**:
   - Nhấp vào nút **"Đồng bộ Google Sheets"** trên thanh tiêu đề.
   - Nhập ID hoặc URL Google Sheets (mặc định đã cấu hình sẵn bảng tính `1p9hd2pd_X85W76bLyj6iNifzTTQ7OXCV8bHAwCKbSEs`).
   - Hệ thống sẽ tải dữ liệu mới nhất, tự động tính toán lại toàn bộ báo cáo và lưu vào bộ nhớ cache.

2. **Nạp file Excel (.xlsx) ngoại tuyến**:
   - Nhấp vào nút **"Nạp Excel"** trên thanh tiêu đề và chọn bất kỳ file Excel nào.
   - Hệ thống tự động phân tích và hiển thị tức thì mà không cần kết nối Internet.

---

## 🛡️ Bản Quyền & Tác Giả

- **Người phát triển**: **Võ Chí Nhân**
- **Chức danh**: KSVTT phòng TCHC - Chi Cục Quản Lý Thị Trường Tỉnh An Giang
- **Số điện thoại / Zalo**: `0914.459.992`
- **Bản quyền**: © 2025 - 2026 Võ Chí Nhân. All rights reserved.
- **Repository**: [https://github.com/chinhanqltt-maker/tkag](https://github.com/chinhanqltt-maker/tkag)