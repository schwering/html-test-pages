const child_heights = new Map();
let this_height = 0;

window.addEventListener('message', (event) => {
  if (event.data.height !== undefined) {
    child_heights.set(event.source, event.data.height);
    this_height = Math.max(this_height, 1 + event.data.height);
    if (window.parent && window.parent !== window.parent)
      window.parent.postMessage({height: this_height}, '*');
    updateIframes();
  }
}, false);

function height(win) {
  return child_heights.get(win) || 0;
}

function depth() {
  let d = 0;
  for (let w = window; w && w != w.parent; w = w.parent) {
    ++d;
  }
  return d;
}

function updateIframes() {
  for (const iframe of document.getElementsByTagName('iframe')) {
    if (iframe.classList.contains('index'))
      continue;
    //iframe.style.width = Math.max(20, 100 - depth() * 20) +'em';
    iframe.style.height = (7 + 4 * height(iframe.contentWindow)) +'ex';
    iframe.classList[iframe.sandbox.length > 0 ? 'add' : 'remove']('sandbox');
    iframe.classList[iframe.allow ? 'add' : 'remove']('allow');
  }
}

function init() {
  let origin = window.origin;
  const path = window.location.pathname;
  const file = path.substring(path.lastIndexOf('/') + 1);
  const title = (file.substring(0, file.lastIndexOf('.'))  || file).split('-').filter(s => s !== 'cc').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

  document.title = title;

  if (origin === 'null')
    document.body.style.backgroundImage = 'linear-gradient(to right, red,orange,yellow,green,blue,indigo,violet)';

  window.parent.postMessage({height: this_height}, '*');

  updateIframes();
};

window.onload = init;
