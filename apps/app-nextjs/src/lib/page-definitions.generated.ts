// Auto-generated from apps/app-nextjs/definitions/pages/definition.xml
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
  'page-mockup': {
    id: 'page-mockup',
    url: '/examples/page-mockup/',
    title: 'Page Mockup',
    defaultView: 'index',
    viewTransition: 'fade',
    isMultiView: true,
    views: [
      {
        id: 'index',
        name: 'Index',
        title: 'Page Mockup',
        buttons: [
          {
            label: 'View 1',
            action: 'switchView:view1',
          },
          {
            label: 'View 2',
            action: 'switchView:view2',
          },
        ],
      },
      {
        id: 'view1',
        name: 'View 1',
        title: 'View 1 Content',
        buttons: [
          {
            label: 'Back',
            action: 'switchView:index',
          },
        ],
      },
      {
        id: 'view2',
        name: 'View 2',
        title: 'View 2 Content',
        buttons: [
          {
            label: 'Back',
            action: 'switchView:index',
          },
        ],
      },
    ],

  },
  'page1': {
    id: 'page1',
    url: '/examples/page-mockup/page1/',
    title: 'Page 1',
    defaultView: '',
    viewTransition: 'fade',
    isMultiView: false,

    buttons: [
      {
        label: 'Back',
        href: '../',
      },
    ],
  },
  'page2': {
    id: 'page2',
    url: '/examples/page-mockup/page2/',
    title: 'Page 2',
    defaultView: '',
    viewTransition: 'fade',
    isMultiView: false,

    buttons: [
      {
        label: 'Back',
        href: '../',
      },
    ],
  },
}

export function getPageDefinition(id: string): PageDefinition | undefined {
  return PAGE_DEFINITIONS[id]
}

export function getPageByUrl(url: string): PageDefinition | undefined {
  return Object.values(PAGE_DEFINITIONS).find(page => page.url === url)
}
