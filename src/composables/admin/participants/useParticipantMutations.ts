import { api } from '@/api/axios';
import type { Participant, ParticipantLevelUpdate, ParticipantUpdate, MedicalRecord } from '@/models/Participants';
import type { RequestContactEmergency } from '@/models/ContactEmergencyParticipant';
import { useMutation } from '@tanstack/vue-query';

const updateParticipant = async (participants: Partial<ParticipantUpdate>): Promise<any> => {
  const { data } = await api.put(`/users`, participants);
  return data;
};

const setFocus = async (participants: Partial<ParticipantLevelUpdate>): Promise<any> => {
  const { data } = await api.put(`/client-module/update`, { ...participants.modules, userId: participants });
  return data;
};

const getByLvl = async (req: { lvl: string; campusId?: string }): Promise<Participant[]> => {
  const { data } = await api.post(`/users/participants-available/${req.lvl}`, req.campusId ? { campusId: req.campusId } : undefined);
  return data;
};

const promotionMasterLife = async (id: string): Promise<Participant[]> => {
  const { data } = await api.post(`/master-life/masterlife-participant/${id}`);
  return data;
};

const promotionVisionary = async (req: { userId: string; role: string }): Promise<Participant> => {
  const { data } = await api.post(`/visionary/visionary-participant`, req);
  return data;
};

const promotionStaff = async (req: { userId: string; role: string }): Promise<Participant> => {
  const { data } = await api.post(`/staff/staff-participant`, req);
  return data;
};

const globalMutate = async (req: { id: string; type: string }): Promise<Participant> => {
  const { data } = await api.post(`/global-user/mutate`, req);
  return data;
};

// cambiar contreaseña
const resetPassword = async (user: { id: string; newPassword: string }): Promise<any> => {
  const { data } = await api.put(`/users/reset-password/${user.id}`, user);
  return data;
};

const generateContract = async (req: { participantId: string; productId: string; trainingId: string }): Promise<Uint8Array> => {
  const { data } = await api.post('/users/get-contract/' + req.participantId, req, {
    responseType: 'arraybuffer'
  });
  return data;
};

//medical record
const updateMedicalRecord = async (req: { id: string; medicalRecord: Partial<MedicalRecord> }): Promise<any> => {
  const { data } = await api.put(`/medical-record/update/${req.id}`, req.medicalRecord);
  return data;
};

const createMedicalRecord = async (req: { medicalRecord: Partial<MedicalRecord> }): Promise<any> => {
  const { data } = await api.post(`/medical-record/add`, req.medicalRecord);
  return data;
};

//contactos de emergencia
const updateContactEmergency = async (contactEmergency: Partial<RequestContactEmergency>): Promise<any> => {
  const { data } = await api.put(`/contacts`, contactEmergency);
  return data;
};

const createContactEmergency = async (contactEmergency: Partial<RequestContactEmergency>): Promise<any> => {
  const { data } = await api.post(`/contacts`, contactEmergency);
  return data;
};

const deleteContact = async (id: string): Promise<any> => {
  const { data } = await api.delete(`/contacts/` + id);
  return data;
};

const changeCampus = async (req: { userId: string; campusId: string }): Promise<any> => {
  const { data } = await api.put(`/users/change-campus/${req.userId}/${req.campusId}`, req);
  return data;
};

const setParticipantLevel = async (req: { userId: string; courseLevel: string }): Promise<any> => {
  const { data } = await api.put(`/users/set-course-level/${req.userId}/${req.courseLevel}`, req);
  return data;
}

const useParticipantMutations = () => {
  const updateParticipantMutation = useMutation({ mutationFn: updateParticipant });
  const setCourseLevelMutation = useMutation({ mutationFn: setFocus });
  const getByLvlMutation = useMutation({ mutationFn: getByLvl });
  const promotionMasterLifeMutation = useMutation({ mutationFn: promotionMasterLife });
  const promotionVisionaryMutation = useMutation({ mutationFn: promotionVisionary });
  const promotionStaffMutation = useMutation({ mutationFn: promotionStaff });
  const resetPasswordMutation = useMutation({ mutationFn: resetPassword });
  const generateContractMutation = useMutation({ mutationFn: generateContract });
  const updateMedicalRecordMutation = useMutation({ mutationFn: updateMedicalRecord });
  const createMedicalRecordMutation = useMutation({ mutationFn: createMedicalRecord });
  const updateContactEmergencyMutation = useMutation({ mutationFn: updateContactEmergency });
  const createContactEmergencyMutation = useMutation({ mutationFn: createContactEmergency });
  const deleteContactMutation = useMutation({ mutationFn: deleteContact });
  const changeCampusMutation = useMutation({ mutationFn: changeCampus });
  const globalMutateMutation = useMutation({ mutationFn: globalMutate });
  const setParticipantLevelMutation = useMutation({ mutationFn: setParticipantLevel });

  return {
    updateParticipantMutation,
    setCourseLevelMutation,
    getByLvlMutation,
    promotionMasterLifeMutation,
    promotionVisionaryMutation,
    promotionStaffMutation,
    globalMutateMutation,
    resetPasswordMutation,
    generateContractMutation,
    updateMedicalRecordMutation,
    createMedicalRecordMutation,
    updateContactEmergencyMutation,
    createContactEmergencyMutation,
    deleteContactMutation,
    changeCampusMutation,
    setParticipantLevelMutation
  };
};

export default useParticipantMutations;
