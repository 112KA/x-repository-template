#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { parseStringPromise } from 'xml2js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

function extractValue(val) {
  if (Array.isArray(val)) {
    return val[0];
  }
  return val;
}

async function generatePageTypes() {
  const xmlPath = resolve(rootDir, 'apps/app-nextjs/definitions/pages/definition.xml');
  const outputPath = resolve(rootDir, 'apps/app-nextjs/src/lib/page-definitions.generated.ts');

  const xml = readFileSync(xmlPath, 'utf8');
  const parsed = await parseStringPromise(xml);

  const pages = parsed.pages.page;

  let output = `// Auto-generated from apps/app-nextjs/definitions/pages/definition.xml
// DO NOT EDIT MANUALLY - run 'pnpm generate:pages' to regenerate

export interface Button {
  label: string
  action?: string
  href?: string
}

export interface View {
  id: string
  name: string
  title?: string
  buttons: Button[]
}

export interface PageDefinition {
  id: string
  url: string
  title?: string
  defaultView?: string
  viewTransition: string
  views?: View[]
  buttons?: Button[]
  isMultiView: boolean
}

export const PAGE_DEFINITIONS: Record<string, PageDefinition> = {
`;

  pages.forEach((page) => {
    const isMultiView = !!page.view;
    const views = page.view?.map((v) => ({
      id: v.$.id,
      name: v.$.name,
      title: v.$.title || '',
      buttons: (v.button || []).map((b) => {
        // button がattribute形式のlabel, action, hrefを持つ場合
        if (b.$) {
          return {
            label: b.$.label || '',
            action: b.$.action,
            href: b.$.href,
          };
        }
        // button が子要素を持つ場合
        return {
          label: extractValue(b.label),
          action: extractValue(b.action),
          href: extractValue(b.href),
        };
      }).filter(btn => btn.label), // Filter out empty buttons
    })) || [];

    const buttons = (page.button || []).map((b) => {
      // button がattribute形式のlabel, action, hrefを持つ場合
      if (b.$) {
        return {
          label: b.$.label || '',
          action: b.$.action,
          href: b.$.href,
        };
      }
      // button が子要素を持つ場合
      return {
        label: extractValue(b.label),
        action: extractValue(b.action),
        href: extractValue(b.href),
      };
    }).filter(btn => btn.label); // Filter out empty buttons

    const viewsJson = JSON.stringify(views, null, 6).split('\n').join('\n    ');
    const buttonsJson = JSON.stringify(buttons, null, 6).split('\n').join('\n    ');

    output += `  '${page.$.id}': {
    id: '${page.$.id}',
    url: '${page.$.url}',
    title: '${page.$.title || ''}',
    defaultView: '${page.$.defaultView || ''}',
    viewTransition: '${page.$.viewTransition || 'fade'}',
    isMultiView: ${isMultiView},
    ${isMultiView ? `views: ${viewsJson},` : ''}
    ${buttons.length > 0 ? `buttons: ${buttonsJson},` : ''}
  },
`;
  });

  output += `}

export function getPageDefinition(id: string): PageDefinition | undefined {
  return PAGE_DEFINITIONS[id]
}

export function getPageByUrl(url: string): PageDefinition | undefined {
  return Object.values(PAGE_DEFINITIONS).find(page => page.url === url)
}
`;

  writeFileSync(outputPath, output, 'utf8');
  console.log(`✓ Generated page definitions to ${outputPath}`);
}

generatePageTypes().catch((error) => {
  console.error('Error generating page types:', error);
  process.exit(1);
});
