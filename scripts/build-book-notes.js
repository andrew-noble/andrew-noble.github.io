const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const notesDir = "/home/andrew/Documents/obsidian-vault/media-notes/books";
const outputFile = "./books/book-note-snippets.html";

let allCards = "";

function walk(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith(".md")) {
      const raw = fs.readFileSync(fullPath, "utf-8");
      const match = raw.match(/---\n([\s\S]*?)\n---\n([\s\S]*)/);
      if (!match) return;

      const frontmatter = yaml.load(match[1]);
      const content = frontmatter["website-blurb"]
        .replace(/```mermaid[\s\S]*?```/g, "")
        .replace(/!?(\[\[.*?\]\])/g, "")
        .replace(/\n\n/g, "</p><p>");

      const card = `
  <div class="note-card">
    <h2 class="title">${frontmatter.title}</h2>
    <p class="author">Author: ${frontmatter.author}</p>
    <p class="rating">Rating: ${frontmatter.rating}</p>
    <div class="website-blurb">
      ${
        frontmatter["website-blurb"]
          ?.replace(/```mermaid[\s\S]*?```/g, "")
          .replace(/!?(\[\[.*?\]\])/g, "")
          .split("\n")
          .map((line) => `<p class="blurb-paragraph">${line}</p>`)
          .join("\n") || ""
      }
    </div>
  </div>
`;

      allCards += card + "\n";
    }
  });
}

walk(notesDir);

fs.writeFileSync(
  outputFile,
  `<div class="notes-container">\n${allCards}</div>`,
);
