export function generateFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let canvasFingerprint = '';

  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser Fingerprint', 2, 2);
    canvasFingerprint = canvas.toDataURL();
  }

  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages?.join(',') || '',
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: (navigator as any).deviceMemory || 0,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    pixelRatio: window.devicePixelRatio,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),
    canvas: canvasFingerprint.slice(0, 50),
    webgl: getWebGLFingerprint(),
    plugins: getPlugins(),
    fonts: 'not-implemented',
    localStorage: hasLocalStorage(),
    sessionStorage: hasSessionStorage(),
    indexedDB: hasIndexedDB(),
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack || 'unspecified',
  };

  return hashString(JSON.stringify(fingerprint));
}

function getWebGLFingerprint(): string {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!gl) return 'no-webgl';

  const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
  if (debugInfo) {
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    return `${vendor}~${renderer}`;
  }

  return 'webgl-available';
}

function getPlugins(): string {
  if (!navigator.plugins) return 'no-plugins';
  return Array.from(navigator.plugins)
    .map(p => p.name)
    .join(',')
    .slice(0, 100);
}

function hasLocalStorage(): boolean {
  try {
    return !!window.localStorage;
  } catch {
    return false;
  }
}

function hasSessionStorage(): boolean {
  try {
    return !!window.sessionStorage;
  } catch {
    return false;
  }
}

function hasIndexedDB(): boolean {
  try {
    return !!window.indexedDB;
  } catch {
    return false;
  }
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}
