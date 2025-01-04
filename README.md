# Blog

This is a simple blog service that just works.
There are great alternatives with a lot more functionality but sometimes, all you need is a simple service that serves Markdown files in the style of a blog.

## Installation

Run the application using NPM:
```bash
npm run build && npm run preview
```

TODO: Create a `Dockerfile` and `docker-compose.yml`.

## Usage

To create a post, create a Markdown file in `content/posts`.
Optionally, include a frontmatter for metadata in YAML syntax.

For example, `content/posts/HelloWorld.md` may look as follows:
```markdown
---
title: Hello, World!
datetime: 2025-01-01 00:01
images:
  - src: example.png
    alt: Example image
    title: Example image
---

*Hello*, **World**!
```
Images referenced with relative paths such as `example.png` in the example above should be placed in `content/media`.

## Development

This application is written in SvelteKit / Svelte 5.

Install the dependencies with `npm install` (or `pnpm install` or `yarn`) and start a development server:

```bash
npm run dev
```

To build a production version of the app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.
