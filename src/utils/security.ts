export function sanitizeInput(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

export function validatePostTitle(title: string): boolean {
  if (!title || typeof title !== 'string') return false;
  if (title.length < 1 || title.length > 200) return false;
  return true;
}

export function validatePostContent(content: string): boolean {
  if (!content || typeof content !== 'string') return false;
  if (content.length < 1 || content.length > 50000) return false;
  return true;
}

export function validateAuthorName(author: string): boolean {
  if (!author || typeof author !== 'string') return false;
  if (author.length < 1 || author.length > 100) return false;
  return true;
}

export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function detectXSSAttempt(input: string): boolean {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /on\w+\s*=/gi,
    /javascript:/gi,
    /<iframe[^>]*>/gi,
    /<embed[^>]*>/gi,
    /<object[^>]*>/gi,
    /<link[^>]*>/gi,
    /expression\s*\(/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
  ];

  return xssPatterns.some(pattern => pattern.test(input));
}

export function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|SCRIPT|JAVASCRIPT|EVAL)\b)/gi,
    /(-{2}|\/\*|\*\/|;)/g,
    /(--|#|\/\*|\*\/).*?$/gm,
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

export function generatePasswordHash(password: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  return crypto.subtle.digest('SHA-256', data).then(buffer => {
    const hashArray = Array.from(new Uint8Array(buffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }).then(hash => hash);
}

export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};

export function encodeForHTML(str: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return str.replace(/[&<>"']/g, m => map[m]);
}

export function encodeForURL(str: string): string {
  return encodeURIComponent(str);
}

export function rateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
  const storage = window.localStorage;
  const now = Date.now();
  const attempts = JSON.parse(storage.getItem(`rl_${key}`) || '[]');

  const recentAttempts = attempts.filter((time: number) => now - time < windowMs);

  if (recentAttempts.length >= maxAttempts) {
    return false;
  }

  recentAttempts.push(now);
  storage.setItem(`rl_${key}`, JSON.stringify(recentAttempts));

  return true;
}

export function validatePostInput(title: string, content: string, author: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!validatePostTitle(title)) {
    errors.push('Title must be between 1 and 200 characters');
  }

  if (!validatePostContent(content)) {
    errors.push('Content must be between 1 and 50000 characters');
  }

  if (!validateAuthorName(author)) {
    errors.push('Author name must be between 1 and 100 characters');
  }

  if (detectXSSAttempt(title) || detectXSSAttempt(content) || detectXSSAttempt(author)) {
    errors.push('Input contains potentially malicious content');
  }

  if (detectSQLInjection(title) || detectSQLInjection(content) || detectSQLInjection(author)) {
    errors.push('Input contains potentially malicious SQL patterns');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
