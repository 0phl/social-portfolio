import type { Root, RootContent, Paragraph, PhrasingContent } from 'mdast';
import projectLinks from '../../.generated/assistant-project-links.json';

const projectTitles = new Set(projectLinks.map(({ title }) => title));
type ProjectLinks = { title: string; url: string; repository?: string; website?: string };

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

function actionRow(project: ProjectLinks): Paragraph {
  const links = [
    { label: 'Project details', url: project.url },
    ...(project.website ? [{ label: 'Live website', url: project.website }] : []),
    ...(project.repository ? [{ label: 'Source code', url: project.repository }] : []),
  ];
  return { type: 'paragraph', children: links.flatMap(({ label, url }, index): PhrasingContent[] => [
    ...(index ? [{ type: 'text' as const, value: ' ' }] : []),
    { type: 'link', url, children: [{ type: 'text', value: label }] },
  ]) };
}

function isActionRow(node: RootContent): boolean {
  if (node.type !== 'paragraph') return false;
  // Restrict replacement to action labels, never descriptions or quoted prose.
  const text = node.children.map((child) => child.type === 'link' ? 'link' : textOf(child)).join('').trim();
  return /^(?:(?:view project|project details|live website|live site|website|source code|source|repository|repo|links?)|\s|[·|:.,]|\bat\b|\band\b)+$/i.test(text);
}

function addProjectActions(nodes: RootContent[]): RootContent[] {
  const result: RootContent[] = [];
  let current: ProjectLinks | undefined;
  let added = false;
  const addActions = () => {
    if (current && !added) { result.push(actionRow(current)); added = true; }
  };
  for (const node of nodes) {
    if (node.type === 'heading') {
      addActions();
      const title = node.children.map(textOf).join('').trim().replace(/^\d+[.)]\s+/, '');
      current = projectLinks.find((project) => project.title === title);
      added = false;
    }
    if (current && isActionRow(node)) {
      addActions();
      continue;
    }
    result.push(node);
  }
  addActions();
  return result;
}

// Only repair top-level, catalog-matched labels; never reinterpret quotes or code.
export function projectSections() {
  return (tree: Root) => {
    const sections = tree.children.flatMap((node): RootContent[] => {
      if (node.type === 'paragraph') return splitProjectLabels(node);
      if (node.type === 'list' && node.ordered && node.children.length === 1) {
        const [first, ...rest] = node.children[0].children;
        if (first?.type === 'paragraph' && projectTitles.has(first.children.map(textOf).join('').trim())) {
          return [{ type: 'heading', depth: 3, children: [{ type: 'text', value: `${node.start ?? 1}. ` }, ...first.children] }, ...rest];
        }
      }
      return [node];
    });
    tree.children = addProjectActions(sections);
  };
}
