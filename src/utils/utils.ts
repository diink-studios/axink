let lastIdentifier = 1000;

export const generateId = (): string => {
  lastIdentifier += 1;
  return String(lastIdentifier);
};

export function deepUpdate(object: any, values: any) {
  for (let [key, value] of Object.entries(values)) {
    if (key === 'y') console.log('Hello Y');
    object[key] = (typeof value === 'object')
      ? deepUpdate(object, value)
      : value;
  }

  return object;
}
