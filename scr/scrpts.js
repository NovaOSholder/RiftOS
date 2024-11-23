// SVG İkonlar
const appIcons = {
  mm: `
    <svg class="mmic" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22.93098" height="43.31773" viewBox="0,0,22.93098,43.31773">
      <g transform="translate(-228.53451,-158.34114)">
        <g data-paper-data='{"isPaintingLayer":true}' id='novaic' fill="#ffffff" fill-rule="nonzero" stroke="none" style="mix-blend-mode: normal">
          <path d="M228.68924,195.01197l-0.15473,-36.67083l19.03116,29.04225l0.00895,-17.05191l3.55036,-5.02752l0.3405,36.35491c0,0 -18.13437,-29.80707 -18.13437,-29.23736c0,5.15736 -0.30946,16.4013 -0.30946,16.4013z"/>
        </g>
      </g>
    </svg>`,
  default: `
    <svg version="1.1" viewBox="0 0 76.805 112.36" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(-201.6 -123.82)">
        <g style="mix-blend-mode:normal" data-paper-data='{"isPaintingLayer":true}'>
          <path d="m201.6 236.18v-111.56h49.097l27.707 31.512v80.051z" fill="#3f7ef6"/>
          <path d="m250.82 155.02 0.12178-31.202 27.301 31.982z" fill="#054fff"/>
          <path d="m216.73 180.4h46.531" fill="none" stroke="#9dbaff" stroke-linecap="round" stroke-width="7.5"/>
          <path d="m216.73 194.37h36.44" fill="none" stroke="#9dbaff" stroke-linecap="round" stroke-width="7.5"/>
          <path d="m216.73 207.78h42.046" fill="none" stroke="#9dbaff" stroke-linecap="round" stroke-width="7.5"/>
        </g>
      </g>
    </svg>`
};

// Tema Stilleri
const styles = {
  dark: {
    simple: { ... },
    nonSimple: { ... }
  },
  bright: {
    simple: { ... },
    nonSimple: { ... }
  }
};

// Yardımcı Fonksiyonlar
const setStyle = (element, styles) => {
  if (element) Object.assign(element.style, styles);
};

const applyStyles = (elements, styles) => {
  elements.forEach(element => setStyle(element, styles));
};

const getReadableTimestamp = () => {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const date = now.toLocaleDateString();
  return `${time} ${date}`;
};

// Tema Değiştirici
async function switchTheme(theme, simplicity) {
  const currentStyles = styles[theme][simplicity];
  applyStyles(document.querySelectorAll('[navobj]'), currentStyles.flodiv);
  setStyle(document.querySelector('#appdmod'), currentStyles.appdmod);
  setStyle(document.querySelector('#searchwindow'), currentStyles.appdmod);
  setStyle(document.querySelector('.searchinputcont'), currentStyles.searchinpe);
  setStyle(document.querySelector('#strtsearcontbtn'), currentStyles.searchnbtn);
  setStyle(document.querySelector('#bobthedropdown'), currentStyles.bob);

  const novaic = document.querySelector('#novaic');
  if (novaic) novaic.style.fill = currentStyles.novaic.fill;
}

// Basit Mod ve Karanlık Mod Denetleyicisi
async function checkMode() {
  const [uiSizing, darkMode, simpleMode] = await Promise.all([
    getSetting("UISizing"),
    getSetting("darkMode"),
    getSetting("simpleMode")
  ]);

  if (uiSizing === 1) scaleUIElements(uiSizing);

  const theme = darkMode ? "dark" : "bright";
  const simplicity = simpleMode ? "simple" : "nonSimple";
  switchTheme(theme, simplicity);
}

// HEX Renk Karanlık Kontrolü
const isDark = (hexColor) => {
  hexColor = hexColor.replace('#', '');
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance <= 0.5;
};

// Servis Çalıştırıcı
function useNovaOffline() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', { scope: '/' })
      .then(reg => console.log('Service Worker registered with scope:', reg.scope))
      .catch(err => console.error('Service Worker registration failed:', err));
  }
}

// Ayar Kontrolü ve Çalıştırıcı
async function checkAndRunFromURL() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('run') === 'erdbsfull') {
    const confirm = await justConfirm("Reset all your data?", "This action is irreversible.");
    if (confirm) erdbsfull();
  }

  const filePath = params.get('path');
  if (filePath) {
    console.log(`Opening NovaOS path: ${filePath}`);
    const fileId = await getFileByPath(filePath);
    openfile(fileId.id);
  }
}
