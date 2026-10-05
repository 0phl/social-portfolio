import type { Root, RootContent, Paragraph, PhrasingContent } from 'mdast';
import catalog from '../../.generated/assistant-links.json';

const projectTitles = new Set(Object.entries(catalog)
  .filter(([url]) => url.startsWith('/#projects/'))
  .map(([, title]) => title));

function textOf(node: PhrasingContent): string {
  if ('value' in node) return node.value;
  return 'children' in node ? node.children.map(textOf).join('') : '';
}

function splitProjectLabels(paragraph: Paragraph): RootContent[] {
  const lines: PhrasingContent[][] = [[]];
  for (const child of paragraph.children) {
    if (child.type !== 'text') {
      lines[lines.length - 1].push(child);
      continue;
    }
    child.value.split('\n').forEach((value, index) => {
      if (index) lines.push([]);
      lines[lines.length - 1].push({ type: 'text', value });
    });
  }
  const result: RootContent[] = [];
  let body: PhrasingContent[] = [];
  const flush = () => {
    if (body.length) result.push({ type: 'paragraph', children: body });
    body = [];
  };
  for (const line of lines) {
    const label = line.map(textOf).join('').trim();
    const match = label.match(/^\d+[.)]\s+(.+)$/);
    if (match && projectTitles.has(match[1])) {
      flush();
      result.push({ type: 'heading', depth: 3, children: line });
    } else {
      if (body.length) body.push({ type: 'text', value: '\n' });
      body.push(...line);
    }
  }
  flush();
  return result;
}

// Only repair top-level, catalog-matched labels; never reinterpret quotes or code.
export function projectSections() {
  return (tree: Root) => {
    tree.children = tree.children.flatMap((node): RootContent[] => {
      if (node.type === 'paragraph') return splitProjectLabels(node);
      if (node.type === 'list' && node.ordered && node.children.length === 1) {
        const [first, ...rest] = node.children[0].children;
        if (first?.type === 'paragraph' && projectTitles.has(first.children.map(textOf).join('').trim())) {
          return [{ type: 'heading', depth: 3, children: [{ type: 'text', value: `${node.start ?? 1}. ` }, ...first.children] }, ...rest];
        }
      }
      return [node];
    });
  };
}
