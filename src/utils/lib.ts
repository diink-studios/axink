type Package = {
  type: 'script' | 'link',
  attributes: Record<string, string>
}

export const packages: Package[] = [
  {
    type: 'script',
    attributes: {
      src: 'https://cdn.jsdelivr.net/npm/vue@2',
    },
  },
  // {
  //   type: 'script',
  //   attributes: {
  //     src: 'https://kit.fontawesome.com/5cb0a3a944.js',
  //     crossorigin: 'anonymous',
  //   },
  // },
];

export const appendToHead = function(packages: Package[]) {
  for (const { type, attributes } of packages) {
    const element = document.createElement(type);
    Object.entries(attributes).forEach(([key, value]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      element[key] = value;
    });
    document.head.appendChild(element);
  }
};