import { userApi } from '@/api/userAxios';
import type { LoginRequest } from '@/models/Login';
import type { Participant } from '@/models/Participants';
import { useMutation } from '@tanstack/vue-query';

const postLogin = async (
  loginRequest: LoginRequest
): Promise<{
  user: Participant;
  token: string;
}> => {
  const { data } = await userApi.post('/auth/login', loginRequest);
  return data;
};

const useLogin = () => {
  const postLoginMutation = useMutation({ mutationFn: postLogin });
  return {
    postLoginMutation
  };
};

export default useLogin;
