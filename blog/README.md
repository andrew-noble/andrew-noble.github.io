# Blog

## Adding a post

1. Create `blog/your-post-slug.html` (copy an existing post as template)
2. Copy your Obsidian note into `blog/posts/`:
   ```bash
   cp /path/to/vault/your-note.md blog/posts/your-post-slug.md
   ```
3. Add the post to `blog/index.html`

The HTML file is just boilerplate (title, date, nav). All content lives in the `.md` file and is rendered client-side by marked.js.
