import type { Participant } from '@/models/Participants.ts';

export interface MedicalRecord {
  id: string;
  medical_history_detail: string;
  psychiatric_history_detail: string;
  medication_history_detail: string;
  participant: Participant;
  lastModifiedBy: string;
  createdBy: string;
  createdDate: string;
  lastModifiedDate: string;
}
