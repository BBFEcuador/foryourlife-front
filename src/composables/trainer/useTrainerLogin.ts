import { api } from '@/api/axios';
import type { LoginApiResponse } from '@/models/ApiResponse';
import type { TrainerLoginRequest } from '@/models/Trainers';
import { useMutation } from '@tanstack/vue-query';

const postLogin = async (trainerLoginRequest: TrainerLoginRequest): Promise<LoginApiResponse> => {
  const { data } = await api.post('/trainer/login', trainerLoginRequest);
  return data;
};

const useTrainerLogin = () => {
  const postLoginMutation = useMutation({ mutationFn: postLogin });
  return {
    postLoginMutation
  };
};

export default useTrainerLogin;
