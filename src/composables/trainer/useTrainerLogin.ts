import { api } from '@/api/axios';
import type { LoginApiResponse } from '@/models/ApiResponse';
import type { TrainerLoginRequest } from '@/models/Trainers';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { computed, ref, watch } from 'vue';
import type { TrainerLoginResponse } from '@/models/TrainerLoginResponse.ts';


const postLogin = async (trainerLoginRequest: TrainerLoginRequest): Promise<TrainerLoginResponse> => {
  const { data } = await api.post('/auth/trainer/login', trainerLoginRequest);
  return data;
};

const useTrainerLogin = () => {

  const trainerLoginMutation= useMutation({
    mutationFn:postLogin
  });

  return {
    trainerLoginMutation
  };
};

export default useTrainerLogin;
