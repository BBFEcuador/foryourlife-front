import { api } from "@/api/axios";
import type { LoginAdminRequest } from "@/models/AdminRequest";
import type { LoginApiResponse } from "@/models/ApiResponse";
import { useMutation } from "@tanstack/vue-query";

const postLogin = async (
  LoginApiResponse: LoginAdminRequest
): Promise<LoginApiResponse> => {
  const { data } = await api.post("/auth/admin/login", LoginApiResponse);
  return data;
};

const useAdminLogin = () => {
  const postLoginMutation = useMutation({ mutationFn: postLogin });
  return {
    postLoginMutation
  };
};

export default useAdminLogin;
