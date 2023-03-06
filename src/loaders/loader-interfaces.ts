class InterfacesLoader {
  private _interfaces: Map<string, string>;

  constructor() {
    this._interfaces = new Map();
  }

  get interfaces() {
    return this._interfaces;
  }

  addInterfaces(interfaces: any): void {
    [...interfaces].forEach(([key, value]) => {
      this._interfaces.set(key, value.html);
      const link = document.createElement('link');
      link.href = value.css;
      link.rel = 'stylesheet';

      document.head.appendChild(link);
    });
  }
}

export const interfacesLoader = new InterfacesLoader();
