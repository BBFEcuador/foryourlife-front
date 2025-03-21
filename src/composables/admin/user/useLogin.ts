import { api } from "@/api/axios";
import type { LoginApiResponse } from "@/models/ApiResponse";
import type { LoginRequest } from "@/models/Login";
import { useMutation } from "@tanstack/vue-query";

const postLogin = async (
  loginRequest: LoginRequest
): Promise<LoginApiResponse> => {
  const { data } = await api.post("/auth/login", loginRequest);
  return data;
};

const useLogin = () => {
  const postLoginMutation = useMutation({ mutationFn: postLogin });
  return {
    postLoginMutation
  };
};

export default useLogin;
    