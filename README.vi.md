# Nhanoki

Theme Hugo tối giản, tập trung vào nội dung, lấy cảm hứng từ [stephango.com](https://stephango.com). Hỗ trợ dark/light mode, breadcrumb thông minh, taxonomy (topics & tags), code block nâng cao (Dracula, highlight dòng, tên file, nút copy), danh sách bài viết responsive, newsletter dialog demo, và SEO tích hợp (Open Graph, Twitter Cards, JSON-LD, sitemap, robots.txt).

## Yêu cầu

- Hugo **extended** v0.146.0 trở lên (vì dùng hệ template mới `_partials`, `_markup`).

## Cài đặt

```bash
git submodule add https://github.com/thnhan1/nhanoki.git themes/nhanoki
git add .gitmodules themes/nhanoki
git commit -m "Add nhanoki theme as submodule"
```

Khai báo trong file config của site:

```toml
theme = 'nhanoki'
```

Chạy server dev:

```bash
hugo server -D
```

## Cấu hình đầy đủ

Dưới đây là `hugo.toml` hoàn chỉnh với tất cả tuỳ chọn:

```toml
baseURL = 'https://example.com/'
locale = 'en-US'
title = 'Tên của bạn'
theme = 'nhanoki'

# ── Sitemap ──────────────────────────────────────────
[sitemap]
  changefreq = 'weekly'
  priority = 0.5
  filename = 'sitemap.xml'

# ── Author & SEO params ──────────────────────────────
[params]
  author = "Tên của bạn"
  description = "Mô tả ngắn về bạn hoặc blog"

  # Social profiles — dùng trong JSON-LD structured data (Person.sameAs)
  [params.social]
    twitter = "yourhandle"      # không cần @
    github = "yourgithub"
    # linkedin = "yourlinkedin"

# ── Taxonomies ───────────────────────────────────────
[taxonomies]
  topic = "topics"
  tag = "tags"

# ── Menu điều hướng (bên phải header) ────────────────
[menu]
  [[menu.main]]
    name = "About"
    url = "/about"
    weight = 10
  [[menu.main]]
    name = "Now"
    url = "/now"
    weight = 20

# ── Markup / Code blocks ─────────────────────────────
[markup]
  [markup.goldmark.renderer]
    unsafe = true                # cho phép HTML trong markdown
  [markup.highlight]
    style = "dracula"            # Chroma style (dracula, github, monokai, ...)
    noClasses = true
    lineNos = true
    lineNumbersInTable = false
    tabWidth = 2

# ── Output formats ───────────────────────────────────
[outputs]
  home = ["HTML", "RSS"]
  page = ["HTML"]
  section = ["HTML", "RSS"]
  taxonomy = ["HTML", "RSS"]
  term = ["HTML"]

[outputFormats]
  [outputFormats.RSS]
    mediatype = "application/rss+xml"
    baseName = "feed"
```

### Tiêu đề trang & menu

- `title` trong config hiển thị bên trái header (link về trang chủ).
- Các mục trong `[menu.main]` hiển thị bên phải header, kèm nút bật/tắt dark mode.

### Social profiles & SEO

Các link trong `[params.social]` được dùng cho:

1. **JSON-LD `sameAs`** — báo cho Google biết các social profile của bạn, tăng cường nhận diện thương hiệu.
2. **Twitter card** — `twitter:site` meta tag dùng `params.social.twitter`.

## Tạo nội dung

### Bài viết (posts)

Bài viết nằm trong `content/posts/`. Front matter cơ bản:

```markdown
---
title: "Tiêu đề bài viết"
date: 2025-10-20T10:00:00Z
draft: false
topics: ["advice", "tools"]
---

Mở đầu bài viết hiển thị làm summary.
<!--more-->

Phần nội dung còn lại...
```

- `<!--more-->` xác định đoạn tóm tắt hiển thị ở trang chủ ("Keep reading →").
- `topics` gắn bài viết vào taxonomy `topics` (hiển thị dưới mỗi bài viết).
- `image` (tuỳ chọn) — đặt ảnh Open Graph / Twitter Card khi chia sẻ lên mạng xã hội.
- `tags` (tuỳ chọn) — tag phụ, có index riêng tại `/tags/`.

### Trang tĩnh

Tạo `content/about.md`, `content/now.md`... với front matter `title`. Trang nào muốn xuất hiện trên menu thì khai báo trong `[menu.main]` của config (không dùng `menu: main` trong front matter để tránh trùng lặp).

## Chèn ảnh

**Luôn dùng leaf bundle** cho bài viết có ảnh: tạo một thư mục chứa `index.md` và đặt ảnh cùng chỗ.

```
content/posts/my-post/
├── index.md
└── photo.jpg
```

Trong `index.md`:

```markdown
![Mô tả ảnh](photo.jpg)
```

> ⚠️ KHÔNG đặt `index.md` trực tiếp trong `content/posts/`. Làm vậy biến cả thư mục `posts` thành một leaf bundle và các bài viết khác sẽ biến mất. Nếu cần trang đích cho section, dùng `_index.md`.

Render hook ảnh (`_markup/render-image.html`) tự resolve đường dẫn tương đối thành resource của trang và thêm `loading="lazy"`.

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

- **`title`** — hiện thanh tên file phía trên (tuỳ chọn).
- **`hl_lines`** — tô sáng các dòng, hỗ trợ dải như `"2 5-7"` (tuỳ chọn).
- **Số dòng** và **theme màu** lấy từ `[markup.highlight]` trong config.
- **Nút copy** — xuất hiện ở góc phải trên (cần bật JavaScript).

## Header & breadcrumb

Header gồm 3 phần:

1. **Breadcrumb** (bên trái) — hiện tên trang chủ. Khi ở trong sub-section (vd: bài viết trong `/posts/`), hiện `Tên / Section`. Trang độc lập như `/about`, `/now` chỉ hiện tên (không có dấu / thừa).
2. **Menu** (bên phải) — từ `[menu.main]`.
3. **Nút theme** — chuyển dark/light mode.

Trên mobile (<600px), breadcrumb tự động xuống dòng riêng.

## Post listing (`_partials/post-listing.html`)

Partial dùng chung để hiển thị danh sách bài viết (ngày + tiêu đề), được dùng bởi cả `home.html` và `section.html`.

```go-html-template
{{ partial "post-listing.html" .Pages.ByDate.Reverse }}
```

- **Màn rộng (≥600px):** ngày hiển thị "January 2, 2006" với cột độ rộng cố định.
- **Màn hẹp (<600px):** ngày chuyển sang định dạng "2006-01-02" gọn nhẹ.
- Dùng flex layout với `gap` giữa ngày và tiêu đề.

## Trang chủ

Trang chủ (`home.html`) có cấu trúc:

1. **Latest** — bài viết mới nhất với tiêu đề, ngày, thời gian đọc, summary, link "Keep reading →".
2. **Topics** — danh sách tất cả topics theo thứ tự alphabet.
3. **Writing** — toàn bộ bài viết theo thứ tự mới nhất (dùng `post-listing.html`).

## Newsletter

Component newsletter demo nằm giữa `<main>` và `<footer>` trong `baseof.html`.

- Click **Subscribe** sẽ mở dialog cảm ơn.
- Không có email nào được gửi — đây chỉ là tính năng minh hoạ.
- Đóng dialog bằng nút **OK** hoặc click ra ngoài.
- Sửa nội dung trong `_partials/newsletter.html`.

## SEO (tích hợp sẵn)

Phần `<head>` tự động bao gồm:

| Tính năng | Chi tiết |
|---|---|
| **Meta description** | Dùng `.Description` của trang, `.Summary`, hoặc fallback về `site.Params.description` (giới hạn 160 ký tự) |
| **Canonical URL** | `<link rel="canonical">` với `.Permalink` |
| **Open Graph** | `og:title`, `og:type`, `og:url`, `og:site_name`, `og:description`, `og:author`, `og:image` |
| **Twitter Card** | `twitter:card`, `twitter:title`, `twitter:description`, `twitter:site` |
| **JSON-LD Person** | Schema.org Person với `name`, `url`, `description`, `sameAs` (từ `[params.social]`) |
| **JSON-LD BlogPosting** | Trên trang bài viết, thêm schema `BlogPosting` hoặc `Article` với headline, ngày tháng, tác giả |
| **Sitemap** | Tự động tạo `/sitemap.xml` khi có cấu hình `[sitemap]` trong `hugo.toml` |
| **robots.txt** | Đặt file `static/robots.txt` trong thư mục gốc site của bạn |

### robots.txt ví dụ

Tạo `static/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

## Dark / Light mode

- Nút toggle trong header, lưu lựa chọn vào `localStorage`.
- Mặc định: theo `prefers-color-scheme` của trình duyệt.
- Icon: `static/sun.svg` và `static/moon.svg` — thay 2 file này để đổi icon.
- CSS: dùng class `.theme-dark` / `.theme-light` trên `<body>`.

## Responsive design

| Breakpoint | Hành vi |
|---|---|
| **≥860px** | Layout desktop đầy đủ, `--wrap-normal: 37em` |
| **<860px** | Content width chuyển thành `88vw`, heading weight tăng |
| **<600px** | Mobile: breadcrumb wrap, padding body giảm, ngày chuyển dạng gọn, nav wrap |

## Cấu trúc theme

```
themes/nhanoki/
├── assets/
│   ├── css/
│   │   ├── main.css         # Tất cả style (normalize, Flexoki palette, layout, responsive)
│   │   ├── font.css          # Open Sans font face
│   │   └── components/       # CSS component riêng lẻ (không import mặc định)
│   └── js/
│       └── main.js           # Theme toggle, code copy button, newsletter dialog
├── layouts/
│   ├── baseof.html           # Khung: <head>, <header>, <main>, <newsletter>, <footer>
│   ├── home.html             # Trang chủ: latest post, topics, writing archive
│   ├── page.html             # Bài viết / trang tĩnh
│   ├── section.html          # Danh sách bài theo section (/posts)
│   ├── taxonomy.html         # Danh sách tất cả terms trong taxonomy (/topics, /tags)
│   ├── term.html             # Bài viết theo 1 term (/topics/design)
│   ├── 404.html              # Trang 404
│   ├── _partials/
│   │   ├── head.html         # <head>: meta tags, SEO, CSS, JS
│   │   ├── header.html       # Nav: breadcrumb + menu + theme toggle
│   │   ├── breadcrumb.html   # Breadcrumb thông minh (bỏ link home thừa)
│   │   ├── menu.html         # Hugo menu renderer
│   │   ├── post-listing.html # Danh sách bài dùng chung (ngày responsive)
│   │   ├── newsletter.html   # Form subscribe demo + dialog
│   │   ├── footer.html       # Nội dung footer
│   │   ├── terms.html        # Helper hiển thị terms
│   │   └── head/
│   │       ├── css.html      # Build pipeline CSS (Hugo Pipes)
│   │       └── js.html       # Build pipeline JS (Hugo Pipes)
│   └── _markup/
│       ├── render-codeblock.html  # Code block với title, hl_lines, nút copy
│       └── render-image.html      # Image lazy loading, page resource resolution
└── static/
    ├── favicon.ico
    ├── homepage.png
    ├── sun.svg               # Icon light mode
    └── moon.svg              # Icon dark mode
```

## Tuỳ biến nhanh

| Mục đích | Cách làm |
|---|---|
| **Đổi màu sắc** | Sửa biến CSS (`--flexoki-*`, `--color-*`) trong `assets/css/main.css` |
| **Độ rộng nội dung** | Chỉnh `--wrap-normal` (mặc định `37em`) và `--wrap-wide` (mặc định `54em`) |
| **Cỡ chữ** | Sửa `font-size` body và các heading trong `main.css` |
| **Theme code** | Đổi `style` trong `[markup.highlight]` (xem Chroma styles) |
| **Social links** | Cấu hình `[params.social]` trong `hugo.toml` |
| **Nội dung newsletter** | Sửa `_partials/newsletter.html` |
| **Footer** | Sửa `_partials/footer.html` |
| **Favicon** | Thay `static/favicon.ico` |

## Nguyên tắc thiết kế

Theme dùng bảng màu [Flexoki](https://github.com/kepano/flexoki) (MIT) bởi Steph Ango. Các token thiết kế chính:

- `--wrap-normal`: độ rộng nội dung mặc định (37em)
- `--wrap-wide`: độ rộng nội dung rộng (54em)
- `--font-content`: font stack hệ thống với Open Sans
- `--font-mono`: monospace stack cho code
- `--line-height`: 1.5
- `--color-tx-normal`, `--color-tx-muted`, `--color-tx-faint`: thang màu chữ
- Tất cả màu sắc thích ứng qua class `.theme-light` / `.theme-dark`

## License

Theme sử dụng CSS dựa trên thiết kế của [Steph Ango](https://stephango.com) và bảng màu [Flexoki](https://github.com/kepano/flexoki) (MIT).
