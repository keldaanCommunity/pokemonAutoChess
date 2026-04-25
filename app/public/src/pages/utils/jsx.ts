/* conditional classes for JSX
see https://dev.to/victorocna/better-conditional-css-classes-in-react-2p8h
*/
export function cc(...classes: (string | Record<string, boolean>)[]): string {
  if (classes.length > 1) return classes.map((c) => cc(c)).join(" ")
  else if (typeof classes[0] === "object")
    return Object.keys(classes[0])
      .filter((c) => classes[0][c])
      .join(" ")
  else return classes[0].toString()
}

export function jsxTextContent(node: React.ReactNode | object): string {
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
    return node.toString();
  }
  if (!node) {
    return '';
  }
  if (Array.isArray(node)) {
    return node.map((entry) => jsxTextContent(entry)).join('');
  }

  // Because ReactNode includes {} in its union we need to jump through a few hoops.
  const props: { children?: React.ReactNode } = (node as any).props ? (node as any).props : {};

  if (!props || !props.children) {
    return '';
  }

  return jsxTextContent(props.children);
}

export default jsxTextContent;