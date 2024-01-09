
Hàm jwt.sign thuộc thư viện jsonwebtoken và được sử dụng để tạo ra một Chuỗi Token JSON (JWT). JWT là một cách gọn nhẹ, an toàn trên URL để biểu diễn các thông tin mà bạn muốn truyền giữa hai bên.

Dưới đây là giải thích chi tiết về các tham số trong hàm jwt.sign:

{ email: userDoc.email, id: userDoc.id }: Đây là phần dữ liệu (payload) của JWT, chứa các thông tin mà bạn muốn bao gồm trong token. Trong trường hợp này, nó bao gồm địa chỉ email và ID của người dùng.

jwtSecret: Đây là khóa bí mật được sử dụng để ký (sign) JWT. Đây là một chuỗi mà chỉ máy chủ của bạn biết. Nó rất quan trọng để xác minh tính toàn vẹn và xác thực của token.

{}: Đây là một đối tượng tùy chọn. Bạn có thể truyền vào nhiều tùy chọn khác nhau, chẳng hạn như thuật toán sử dụng để ký token (algorithm: 'HS256' là lựa chọn phổ biến), thời gian hết hạn (expiresIn), và các tùy chọn khác.

(err, token) => {...}: Đây là một hàm callback được gọi sau khi JWT được tạo ra. Tham số err sẽ chứa bất kỳ lỗi nào xảy ra trong quá trình ký, và token sẽ chứa JWT đã được tạo nếu quá trình ký thành công.

res.cookie('token', token): Dòng này thiết lập một cookie có tên 'token' trong phản hồi HTTP. Cookie này thường sẽ được gửi trong các yêu cầu sau từ phía máy khách, giúp máy chủ xác định người dùng. Việc lưu trữ JWT trong một cookie là một thực hành phổ biến cho việc xác thực người dùng trong ứng dụng web.

.json('pass ok'): Dòng này gửi một phản hồi JSON đến máy khách với thông báo 'pass ok'. Đây chỉ là một ví dụ về phản hồi, và bạn có thể điều chỉnh nó dựa trên yêu cầu của ứng dụng của bạn.

Tổng cộng, hàm jwt.sign được sử dụng để tạo một token chứa thông tin người dùng, và token này được gửi lại cho máy khách để lưu trữ, thường là trong một cookie. Sau đó, máy chủ có thể xác minh tính xác thực của các yêu cầu bằng cách kiểm tra token đã nhận được so với khóa bí mật của mình. Quy trình này thường được sử dụng để xác thực người dùng trong ứng dụng web.





