# Nhanoki

Theme Hugo tối giản, tập trung vào nội dung, lấy cảm hứng từ [stephango.com](https://stephango.com). Hỗ trợ dark/light mode, taxonomy (topics & tags), code block nâng cao (Dracula, highlight dòng, tên file, nút copy), và bố cục sticky footer.

![alt text](image.png)

## Yêu cầu

- Hugo **extended** v0.146.0 trở lên (vì dùng hệ template mới `_partials`, `_markup`).

## Cài đặt

Đặt theme vào thư mục `themes/nhanoki` rồi khai báo trong file config của site:

```toml
theme = 'nhanoki'
```

Chạy server dev:

```bash
hugo server -D
```

## Cấu hình

Ví dụ `hugo.toml` ở thư mục gốc của site:

```toml
baseURL = 'https://example.org/'
locale = 'en-us'
title = 'Nhan'
theme = 'nhanoki'

[params]
  author = "Nhan"
  description = "Life is short, live it well"

# Taxonomies: topics và tags
[taxonomies]
  topic = "topics"
  tag = "tags"

# Menu điều hướng (hiển thị bên phải header)
[menu]
  [[menu.main]]
    name = "About"
    url = "/about"
    weight = 10
  [[menu.main]]
    name = "Now"
    url = "/now"
    weight = 20

# Tô màu code block
[markup]
  [markup.goldmark.renderer]
    unsafe = true            # cho phép HTML trong markdown
  [markup.highlight]
    style = "dracula"        # đổi style tuỳ thích (vd: github, monokai, flexoki)
    noClasses = true
    lineNos = true
    lineNumbersInTable = false
    tabWidth = 2

# RSS
[outputs]
  home = ["HTML", "RSS"]
  section = ["HTML", "RSS"]
```

### Tiêu đề trang & menu

- `title` là tên hiển thị bên trái header.
- Các mục trong `[menu.main]` hiển thị bên phải header, kèm nút bật/tắt dark mode.

## Tạo nội dung

### Bài viết (posts)

Bài viết nằm trong `content/posts/`. Front matter cơ bản:

```markdown
---
title: "Use the saw, fear the saw"
date: 2025-10-20T10:00:00Z
draft: false
topics: ["advice", "tools", "minimalism"]
---

Mở đầu bài viết hiển thị làm summary.
<!--more-->

Phần nội dung còn lại...
```

- `<!--more-->` xác định đoạn tóm tắt hiển thị ở trang chủ ("Keep reading →").
- `topics` gắn bài viết vào taxonomy `topics`.

### Trang tĩnh

Tạo `content/about.md`, `content/now.md`... với front matter `title`. Trang nào muốn xuất hiện trên menu thì khai báo trong `[menu.main]` của config (không dùng `menu: main` trong front matter để tránh trùng lặp).

## Chèn ảnh

**Luôn dùng leaf bundle** cho bài viết có ảnh: tạo một thư mục chứa `index.md` và đặt ảnh cùng chỗ.

```
content/posts/use-the-saw-fear-the-saw/
├── index.md
└── download.jpg
```

Trong `index.md`:

```markdown
![Mô tả ảnh](download.jpg)
```

> ⚠️ KHÔNG đặt `index.md` trực tiếp trong `content/posts/`. Làm vậy biến cả thư mục `posts` thành một leaf bundle và các bài viết khác sẽ biến mất. Nếu cần trang đích cho section, dùng `_index.md`.

Render hook ảnh (`layouts/_markup/render-image.html`) tự resolve đường dẫn tương đối thành resource của trang và thêm `loading="lazy"`.

## Code block

Dùng cú pháp fence kèm thuộc tính trong dấu ngoặc nhọn:

````markdown
```java {title="A.java" hl_lines="2 5"}
public class A {
    private static String name = "Nhan";

    public static void main(String[] args) {
        System.out.println(name);
    }
}
```
````

- **`title`** → hiện thanh tên file phía trên (tuỳ chọn).
- **`hl_lines`** → tô sáng các dòng, cách nhau bằng khoảng trắng hoặc dấu phẩy; hỗ trợ dải dòng như `"2 5-7"` (tuỳ chọn).
- **Số dòng** và **theme màu** lấy từ `[markup.highlight]` trong config.
- **Nút copy** xuất hiện ở góc phải trên của mỗi code block (cần bật JavaScript).

## Dark / Light mode

- Nút toggle nằm trong header, lưu lựa chọn vào `localStorage`, mặc định theo `prefers-color-scheme`.
- Icon dùng file `static/sun.svg` và `static/moon.svg`. Thay 2 file này để đổi icon.

## Newsletter

Partial `layouts/_partials/newsletter.html` hiển thị form đăng ký (đặt giữa `main` và `footer` trong `baseof.html`). Chỉnh nội dung/endpoint form tại file partial này.

## Cấu trúc theme

```
themes/nhanoki/
├── assets/
│   ├── css/main.css        # toàn bộ style (bao gồm phần "Nhanoki component layout")
│   ├── css/font.css        # font Open Sans (tuỳ chọn import)
│   └── js/main.js          # theme toggle + nút copy code
├── layouts/
│   ├── baseof.html         # khung layout (header/main/newsletter/footer)
│   ├── home.html           # trang chủ: Latest, Topics, Writing
│   ├── page.html           # bài viết / trang đơn
│   ├── section.html        # danh sách bài theo section
│   ├── taxonomy.html       # danh sách topics/tags
│   ├── term.html           # danh sách bài theo 1 topic/tag
│   ├── _partials/          # head, header, footer, newsletter
│   └── _markup/            # render hook cho image & codeblock
└── static/                 # sun.svg, moon.svg
```

## Tuỳ biến nhanh

- **Màu sắc & layout:** sửa biến CSS và phần `/* Nhanoki component layout */` ở cuối `assets/css/main.css`.
- **Bề rộng nội dung:** dùng biến `--wrap-normal` / `--wrap-wide`.
- **Style code:** đổi `style` trong `[markup.highlight]` (xem danh sách tại Chroma styles).

## License

Theme sử dụng CSS dựa trên thiết kế của Steph Ango và bảng màu [Flexoki](https://github.com/kepano/flexoki) (MIT).
