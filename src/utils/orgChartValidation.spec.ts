import { describe, it, expect } from 'vitest';
import { isValidHierarchy } from './orgChartValidation';

describe('Organizational Chart Hierarchy Validation', () => {
  // Valid Connections
  it('allows VISIONARY -> STAFF connection', () => {
    expect(isValidHierarchy('VISIONARY', 'STAFF')).toBe(true);
  });

  it('allows STAFF -> PARTICIPANT connection', () => {
    expect(isValidHierarchy('STAFF', 'PARTICIPANT')).toBe(true);
  });

  it('allows MASTERLIFE -> PARTICIPANT connection', () => {
    expect(isValidHierarchy('MASTERLIFE', 'PARTICIPANT')).toBe(true);
  });

  // Invalid Connections (Direct Jumps)
  it('denies VISIONARY -> PARTICIPANT connection', () => {
    expect(isValidHierarchy('VISIONARY', 'PARTICIPANT')).toBe(false);
  });

  // Invalid Connections (Reverse Hierarchy)
  it('denies STAFF -> VISIONARY connection', () => {
    expect(isValidHierarchy('STAFF', 'VISIONARY')).toBe(false);
  });

  it('denies PARTICIPANT -> STAFF connection', () => {
    expect(isValidHierarchy('PARTICIPANT', 'STAFF')).toBe(false);
  });

  // Invalid Connections (Siblings/Same Role)
  it('denies VISIONARY -> VISIONARY connection', () => {
    expect(isValidHierarchy('VISIONARY', 'VISIONARY')).toBe(false);
  });

  it('denies STAFF -> STAFF connection', () => {
    expect(isValidHierarchy('STAFF', 'STAFF')).toBe(false);
  });

  it('denies PARTICIPANT -> PARTICIPANT connection', () => {
    expect(isValidHierarchy('PARTICIPANT', 'PARTICIPANT')).toBe(false);
  });
});
