# Nhanoki

A minimalist Hugo theme focused on content, inspired by [stephango.com](https://stephango.com). Features dark/light mode, breadcrumb navigation, taxonomies (topics & tags), advanced code blocks (Dracula, line highlighting, file names, copy button), responsive post listings, newsletter demo dialog, and built-in SEO (Open Graph, Twitter Cards, JSON-LD structured data, sitemap, robots.txt).

![](./static/homepage.png)

## Requirements

- Hugo **extended** v0.146.0 or higher (uses new template system `_partials`, `_markup`).

## Installation

```bash
git submodule add https://github.com/thnhan1/nhanoki.git themes/nhanoki
git add .gitmodules themes/nhanoki
git commit -m "Add nhanoki theme as submodule"
```

Declare in your site's config:

```toml
theme = 'nhanoki'
```

Run dev server:

```bash
hugo server -D
```

## Full configuration reference

Below is a complete `hugo.toml` with all available options:

```toml
baseURL = 'https://example.com/'
locale = 'en-US'
title = 'Your Name'
theme = 'nhanoki'

# ── Sitemap ──────────────────────────────────────────
[sitemap]
  changefreq = 'weekly'
  priority = 0.5
  filename = 'sitemap.xml'

# ── Author & SEO params ──────────────────────────────
[params]
  author = "Your Name"
  description = "A short bio or tagline for your site"

  # Social profiles — used in JSON-LD structured data (Person.sameAs)
  [params.social]
    twitter = "yourhandle"      # without @
    github = "yourgithub"
    # linkedin = "yourlinkedin"

# ── Taxonomies ───────────────────────────────────────
[taxonomies]
  topic = "topics"
  tag = "tags"

# ── Navigation menu (right side of header) ───────────
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
    unsafe = true                # allow raw HTML in markdown
  [markup.highlight]
    style = "dracula"            # Chroma style (dracula, github, monokai, etc.)
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

### Page title & menu

- `title` in config displays on the left side of the header (breadcrumb home link).
- Items in `[menu.main]` display on the right side of the header, next to the dark/light mode toggle.

### Social profiles & SEO

The social links under `[params.social]` are used for two purposes:

1. **JSON-LD `sameAs`** — tells Google your social profiles, strengthening your personal brand identity in search results.
2. **Twitter card** — `twitter:site` meta tag uses `params.social.twitter`.

## Creating content

### Posts

Posts go in `content/posts/`. Basic front matter:

```markdown
---
title: "Post title"
date: 2025-10-20T10:00:00Z
draft: false
topics: ["advice", "tools"]
---

Opening text displays as summary.
<!--more-->

Remaining content...
```

- `<!--more-->` sets the summary displayed on the homepage ("Keep reading →").
- `topics` attaches the post to the `topics` taxonomy (appears as tags below the post).
- `image` (optional) — sets the Open Graph / Twitter Card image for social sharing.

### Static pages

Create `content/about.md`, `content/now.md` etc. with `title` front matter. Pages to appear in the menu should be declared in `[menu.main]` in config (don't use `menu: main` in front matter to avoid duplication).

### Taxonomy for posts

Posts can be tagged with `topics` and `tags`:

```yaml
topics: ["design", "tools"]
tags: ["blue", "green"]
```

- `topics` are featured on the homepage and shown below each post.
- `tags` exist but are not surfaced on the homepage — they have their own `/tags/` index.

## Adding images

**Always use leaf bundles** for posts with images: create a folder containing `index.md` and place images alongside it.

```
content/posts/my-post/
├── index.md
└── photo.jpg
```

In `index.md`:

```markdown
![Image description](photo.jpg)
```

> ⚠️ DO NOT place `index.md` directly in `content/posts/`. This turns the entire `posts` directory into a leaf bundle and hides other posts. Use `_index.md` for section landing pages.

The image render hook (`_markup/render-image.html`) resolves relative paths to page resources and adds `loading="lazy"`.

## Code blocks

Use fence syntax with attributes in curly braces:

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

- **`title`** — shows a file name bar above the code block (optional).
- **`hl_lines`** — highlights specific lines; supports ranges like `"2 5-7"` (optional).
- **Line numbers** and **color theme** come from `[markup.highlight]` in config.
- **Copy button** — appears in the top-right corner (requires JavaScript).

## Header & breadcrumb

The header contains:

1. **Breadcrumb** (left side) — shows `Site Name` on all pages. When inside a sub-section (e.g., a post under `/posts/`), it shows `Site Name / Section Title`. Standalone pages like `/about` and `/now` only show the site name (no redundant slash).
2. **Navigation links** (right side) — from `[menu.main]`.
3. **Theme toggle** — dark/light mode switch.

On mobile (<600px), the breadcrumb wraps to its own line.

## Post listing (`_partials/post-listing.html`)

A reusable partial for rendering a list of posts with date + title. Used by both `home.html` and `section.html`.

```go-html-template
{{ partial "post-listing.html" .Pages.ByDate.Reverse }}
```

- **Wide screens (≥600px):** date shows as "January 2, 2006" with a fixed width column.
- **Narrow screens (<600px):** date switches to "2006-01-02" compact format.
- Uses flex layout with a `gap` between date and title.

## Homepage layout

The homepage (`home.html`) is structured as:

1. **Latest** — the most recent post with title, date, reading time, summary, and "Keep reading →" link.
2. **Topics** — an alphabetical list of all topics (from `site.Taxonomies.topics`).
3. **Writing** — a full reverse-chronological list of all posts (reuses `post-listing.html`).

## Newsletter

A demo newsletter component placed between `<main>` and `<footer>` in `baseof.html`.

- Clicking **Subscribe** opens a modal dialog with a thank-you message.
- No actual email is sent — it's purely demonstrative.
- The dialog can be dismissed by clicking **OK** or clicking outside the dialog box.
- Edit the message in `_partials/newsletter.html`.

## SEO (built-in)

The `<head>` section automatically includes:

| Feature | Details |
|---|---|
| **Meta description** | Uses page's `.Description`, `.Summary`, or falls back to `site.Params.description` (truncated to 160 chars) |
| **Canonical URL** | `<link rel="canonical">` with `.Permalink` |
| **Open Graph** | `og:title`, `og:type`, `og:url`, `og:site_name`, `og:description`, `og:author`, `og:image` |
| **Twitter Card** | `twitter:card`, `twitter:title`, `twitter:description`, `twitter:site` |
| **JSON-LD Person** | Schema.org Person with `name`, `url`, `description`, `sameAs` (from `[params.social]`) |
| **JSON-LD BlogPosting** | On post pages, an additional `BlogPosting` or `Article` schema with headline, dates, author |
| **Sitemap** | Auto-generated `/sitemap.xml` when `[sitemap]` is configured in `hugo.toml` |
| **robots.txt** | Include in your site's `static/robots.txt` |

### robots.txt example

Create `static/robots.txt` in your site root:

```
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

## Dark / Light mode

- Toggle button in the header, saves preference to `localStorage`.
- Default: follows `prefers-color-scheme`.
- Icons: `static/sun.svg` and `static/moon.svg` — replace these to change icons.
- CSS: uses `.theme-dark` / `.theme-light` classes on `<body>`.

## Responsive design

| Breakpoint | Behavior |
|---|---|
| **≥860px** | Full desktop layout with `--wrap-normal: 37em` content width |
| **<860px** | Content width switches to `88vw`; heading weight increases |
| **<600px** | Mobile layout: breadcrumb wraps, body padding reduced, post dates switch to compact format, nav wraps |

## Theme structure

```
themes/nhanoki/
├── assets/
│   ├── css/
│   │   ├── main.css         # All styles (normalize, Flexoki palette, layout, responsive)
│   │   ├── font.css          # Open Sans font face
│   │   └── components/       # Standalone component CSS (not imported by default)
│   └── js/
│       └── main.js           # Theme toggle, code copy button, newsletter dialog
├── layouts/
│   ├── baseof.html           # Frame: <head>, <header>, <main>, <newsletter>, <footer>
│   ├── home.html             # Homepage: latest post, topics, writing archive
│   ├── page.html             # Single post / static page
│   ├── section.html          # Post list by section (/posts)
│   ├── taxonomy.html         # List of all terms in a taxonomy (/topics, /tags)
│   ├── term.html             # Posts for a single term (/topics/design)
│   ├── 404.html              # 404 page
│   ├── _partials/
│   │   ├── head.html         # <head>: meta tags, SEO, CSS, JS
│   │   ├── header.html       # Nav: breadcrumb + menu + theme toggle
│   │   ├── breadcrumb.html   # Smart breadcrumb (skips home self-link)
│   │   ├── menu.html         # Hugo menu renderer
│   │   ├── post-listing.html # Reusable date+title list (responsive dates)
│   │   ├── newsletter.html   # Demo subscribe form + dialog
│   │   ├── footer.html       # Footer content
│   │   ├── terms.html        # Terms list helper
│   │   └── head/
│   │       ├── css.html      # CSS build pipeline (Hugo Pipes)
│   │       └── js.html       # JS build pipeline (Hugo Pipes)
│   └── _markup/
│       ├── render-codeblock.html  # Code block with title, hl_lines, copy button
│       └── render-image.html      # Image with lazy loading, page resource resolution
└── static/
    ├── favicon.ico
    ├── homepage.png
    ├── sun.svg               # Light mode icon
    └── moon.svg              # Dark mode icon
```

## Quick customization

| Goal | How |
|---|---|
| **Change colors** | Edit CSS variables (`--flexoki-*`, `--color-*`) in `assets/css/main.css` |
| **Content width** | Adjust `--wrap-normal` (default `37em`) and `--wrap-wide` (default `54em`) |
| **Font size** | Edit body `font-size` and heading sizes in `main.css` |
| **Code theme** | Change `style` in `[markup.highlight]` (see Chroma styles) |
| **Social links** | Set `[params.social]` in `hugo.toml` |
| **Newsletter message** | Edit `_partials/newsletter.html` |
| **Footer** | Edit `_partials/footer.html` |
| **Favicon** | Replace `static/favicon.ico` |

## Styling principles

This theme uses the [Flexoki](https://github.com/kepano/flexoki) color palette (MIT) by Steph Ango. Key design tokens:

- `--wrap-normal`: default content width (37em)
- `--wrap-wide`: wide content width (54em)
- `--font-content`: system font stack with Open Sans
- `--font-mono`: monospace stack for code
- `--line-height`: 1.5
- `--color-tx-normal`, `--color-tx-muted`, `--color-tx-faint`: text color scale
- All colors adapt via `.theme-light` / `.theme-dark` classes

## License

Theme uses CSS based on design by [Steph Ango](https://stephango.com) and color palette [Flexoki](https://github.com/kepano/flexoki) (MIT).
