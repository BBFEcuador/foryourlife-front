import { api } from "@/api/axios";
import type { Admin } from "@/models/Admin";
import { userStore } from "@/stores/useStore";
import { useMutation } from "@tanstack/vue-query";

const store = userStore();

const updateUserAccount = async (user: Admin): Promise<any> => {
  const { data } = await api.put("/account/update", user);
  return data;
};

const updateAccountPassword = async (req: {
  oldPassword: string;
  newPassword: string;
  userId: string;
}): Promise<any> => {
  const { data } = await api.put("/account/update-password", req);
  return data;
};
const passwordReset = async (req: { email: string }): Promise<any> => {
  const { data } = await api.post("/auth/password-reset", req);
  return data;
};

const deleteAccount = async (id: number): Promise<any> => {
  const { data } = await api.delete(`/account/delete/${id}`);
  return data;
};
const companyUnsubscribe = async (id: number): Promise<any> => {
  const { data } = await api.delete(`/users/delete/${id}`);
  return data;
};

const useAccountUserMutation = () => {
  const deleteAccountMutation = useMutation({ mutationFn: deleteAccount });
  const updateAccountPasswordMutation = useMutation({
    mutationFn: updateAccountPassword,
  });
  const companyUnsubscribeMutation = useMutation({
    mutationFn: companyUnsubscribe,
  });
  const passwordResetMutation = useMutation({
    mutationFn: passwordReset,
  });
  return {

    deleteAccountMutation,
    companyUnsubscribeMutation,
    updateAccountPasswordMutation,
    passwordResetMutation,
  };
};

export default useAccountUserMutation;
