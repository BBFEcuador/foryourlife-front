export const isValidHierarchy = (sourceRole: string, targetRole: string): boolean => {
  // Normalize roles just in case
  const sRole = sourceRole?.toUpperCase();
  const tRole = targetRole?.toUpperCase();

  // Rule 1: Visionary -> Staff
  if (sRole === 'VISIONARY' && tRole === 'STAFF') return true;
  
  // Rule 2: Staff -> Participant
  if (sRole === 'STAFF' && tRole === 'PARTICIPANT') return true;
  
  // Rule 3: MasterLife -> Participant
  if (sRole === 'MASTERLIFE' && tRole === 'PARTICIPANT') return true;

  // All other connections are forbidden
  return false;
};
