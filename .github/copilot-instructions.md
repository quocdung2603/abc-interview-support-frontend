Dự án sử dụng React+typescript, tailwindcss, ant-design,.. đọc thêm ở package.json tổng của dự án (url: D:\Project Code\DoAnTotNghiep\abc-interview-support-frontend\package.json)

Cấu trúc thư mục của các app con ở trong thư mục apps (url: ./apps ) như sau:

trong thư mục source cơ bản (chưa bao gồm tất cả file) của mỗi app con (ví dụ url app con recruiter: apps\recruiter\src) sẽ chia thành các thư mục sau:

1. components : chứa các components dùng chung cho toàn bộ app
2. layout: chứa layout chính cho app
3. pages: chứa các trang con. Mỗi trang con sẽ là 1 thư mục riêng, trong mỗi thư mục của trang sẽ chia thành. 
Ví dụ ABCPage: [
  components: chứa các components của trang ABCPage
  ABCPage.tsx: file chính để gọi các components
]

4. routes: chứa cấu hình điều hướng 
4.1. Routing.tsx: file chứa cấu hình điều hướng trang
5. utils: chứa các tiện ích 
5.1. RouterLink.tsx: chứa cấu hình các đường dẫn path đến từng trang
6. styles.css (url: apps\recruiter\src\styles.css): chứa toàn bộ các cấu hình giao diện, các cấu hình dùng chung thì lấy ở đây, còn những cấu hình riêng thì sẽ viết trực tiếp trong trang sử dụng nó (inline styles), không viết thêm vào file này.

Dự án này được cấu hình theo monorepo, nên là các types dùng chung sẽ được cấu hình ở (url: libs\types\src\lib) để các app con khác có thể gọi ra sử dụng.





