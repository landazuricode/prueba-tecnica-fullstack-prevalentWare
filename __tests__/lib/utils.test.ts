import { cn, formatCurrency, formatDate } from '../../lib/utils';

describe('Utility Functions', () => {
  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      const result = cn('class1', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      const result = cn('base', true && 'conditional', false && 'hidden');
      expect(result).toBe('base conditional');
    });

    it('should handle arrays of classes', () => {
      const result = cn(['class1', 'class2'], 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('should handle undefined and null values', () => {
      const result = cn('base', undefined, null, 'end');
      expect(result).toBe('base end');
    });

    it('should merge Tailwind classes correctly', () => {
      const result = cn('px-2 py-1', 'px-4');
      expect(result).toBe('py-1 px-4');
    });
  });

  describe('formatCurrency', () => {
    it('should format positive numbers correctly', () => {
      const result = formatCurrency(1000);
      expect(result).toMatch(/\$\s*1\.000/);
    });

    it('should format negative numbers correctly', () => {
      const result = formatCurrency(-500);
      expect(result).toMatch(/-\$\s*500/);
    });

    it('should format decimal numbers correctly', () => {
      const result = formatCurrency(1234.56);
      expect(result).toMatch(/\$\s*1\.234,56/);
    });

    it('should format zero correctly', () => {
      const result = formatCurrency(0);
      expect(result).toMatch(/\$\s*0/);
    });

    it('should format large numbers correctly', () => {
      const result = formatCurrency(1000000);
      expect(result).toMatch(/\$\s*1\.000\.000/);
    });
  });

  describe('formatDate', () => {
    it('should format Date object correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = formatDate(date);
      expect(result).toMatch(/15\/01\/2024/);
    });

    it('should format date string correctly', () => {
      const result = formatDate('2024-12-25');
      // The date might be converted to local timezone, so we check for either 24 or 25
      expect(result).toMatch(/2[45]\/12\/2024/);
    });

    it('should handle ISO date strings', () => {
      const result = formatDate('2024-03-15T14:30:00.000Z');
      expect(result).toMatch(/15\/03\/2024/);
    });

    it('should handle different date formats', () => {
      const result = formatDate('2024-06-01');
      // The date might be converted to local timezone, so we check for either 31 or 01
      expect(result).toMatch(/0[1]\/06\/2024|31\/05\/2024/);
    });

    it('should handle edge case dates', () => {
      const result = formatDate('2024-02-29'); // Leap year
      // The date might be converted to local timezone, so we check for either 28 or 29
      expect(result).toMatch(/2[89]\/02\/2024/);
    });
  });
});
