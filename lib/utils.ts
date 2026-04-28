import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validates an Indian mobile number.
 * Accepts:  9876543210 | +91-9876543210 | +91 9876543210 | 919876543210
 * Returns an error string when invalid, or null when valid (empty = valid, field is optional).
 */
export function validateIndianPhone(value: string): string | null {
  if (!value || value.trim() === '') return null;
  // Strip optional country code prefix (+91 / 91) followed by optional space/hyphen
  const stripped = value.trim().replace(/^\+?91[-\s]?/, '').replace(/\D/g, '');
  if (!/^[6-9]\d{9}$/.test(stripped)) {
    return 'Enter a valid 10-digit Indian mobile number (e.g. 98765 43210)';
  }
  return null;
}
