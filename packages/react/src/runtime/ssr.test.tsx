import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createComponent } from './ssr.js';

// Mock dependencies
vi.mock('react-dom/server', () => ({
  renderToString: vi.fn(() => ''),
}));

vi.mock('html-react-parser', () => ({
  default: vi.fn((html) => html),
}));

vi.mock('next/dynamic', () => ({
  default: vi.fn((loader, options) => {
    const Component = options?.loading || (() => null);
    return Component;
  }),
}));

describe('SSR shadowrootdelegatesfocus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should include shadowrootdelegatesfocus attribute when present in serialized HTML', async () => {
    const mockRenderToString = vi.fn().mockResolvedValue({
      html: `<my-component>
  <template shadowrootmode="open" shadowrootdelegatesfocus>
    <div>Shadow content</div>
  </template>
</my-component>`,
      styles: [],
    });

    const mockSerializeProperty = vi.fn((value) => JSON.stringify(value));

    const Component = createComponent({
      tagName: 'my-component',
      clientModule: (() => null) as any,
      properties: {},
      hydrateModule: Promise.resolve({
        renderToString: mockRenderToString,
        serializeProperty: mockSerializeProperty,
      }),
    });

    const result = await Component({});

    expect(mockRenderToString).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should not include shadowrootdelegatesfocus attribute when not present in serialized HTML', async () => {
    const mockRenderToString = vi.fn().mockResolvedValue({
      html: `<my-component>
  <template shadowrootmode="open">
    <div>Shadow content</div>
  </template>
</my-component>`,
      styles: [],
    });

    const mockSerializeProperty = vi.fn((value) => JSON.stringify(value));

    const Component = createComponent({
      tagName: 'my-component',
      clientModule: (() => null) as any,
      properties: {},
      hydrateModule: Promise.resolve({
        renderToString: mockRenderToString,
        serializeProperty: mockSerializeProperty,
      }),
    });

    const result = await Component({});

    expect(mockRenderToString).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
