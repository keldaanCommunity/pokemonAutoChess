
function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0, l = str.length; i < l; i++) {
    h ^= str.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24) | 0;
  }
  return h >>> 0;
}

export function insertScriptFile(doc, src) {
  const id = hash(src).toString(36);
  if (document.getElementById(id)) {
    console.log('script already exists:', src);
    return new Promise((resolve, reject) => resolve());
  }
  const script = doc.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', src);
  script.setAttribute('id', id);
  const p = new Promise((resolve, reject) => {
    script.onload = resolve;
    script.onerror = reject;
  });
  doc.getElementsByTagName('head')[0].appendChild(script);
  return p;
}
