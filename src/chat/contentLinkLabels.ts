import type { Root, PhrasingContent } from 'mdast';
import { approvedLink } from './approvedLink';

const actionLabel = /^(?:project details|view project|read blog|read article|view post)$/i;
function textOf(node: PhrasingContent): string {
  if ('value' in node) return node.value;
  return 'children' in node ? node.children.map(textOf).join('') : '';
}
function labelFor(href: string) {
  const url = approvedLink(href);
  if (url?.startsWith('/#blog/')) return 'Read blog';
  if (url?.startsWith('/#posts/')) return 'View post';
  if (url?.startsWith('/#projects/')) return 'Project details';
  return null;
}

// Correct standalone actions only; leave quoted wording, code, and prose intact.
export function contentLinkLabels() {
  return (tree: Root) => {
    for (const node of tree.children) {
      if (node.type !== 'paragraph') continue;
      const links = node.children.filter((child) => child.type === 'link');
      if (!links.length) continue;
      const otherText = node.children.filter((child) => child.type !== 'link').map(textOf).join('').trim();
      const prefix = otherText.replace(/:\s*$/, '');
      const hasPrefix = links.length === 1 && actionLabel.test(prefix);
      if (!hasPrefix && !/^[\s·|]*$/.test(otherText)) continue;
      if (hasPrefix) {
        const label = labelFor(links[0].url);
        if (label) node.children = [{ type: 'text', value: `${label}: ` }, links[0]];
      }
      for (const link of links) {
        const label = labelFor(link.url);
        if (label && actionLabel.test(link.children.map(textOf).join('').trim())) {
          link.children = [{ type: 'text', value: label }];
        }
      }
    }
  };
}
