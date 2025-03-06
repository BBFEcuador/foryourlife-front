import { api } from "@/api/axios";
import type { Admin } from "@/models/Admin";
import { userStore } from "@/stores/useStore";
import { useQuery } from "@tanstack/vue-query";
import { ref, watch } from "vue";

const account = ref<Admin>({} as Admin);
const idlAccount = ref<Admin>({} as Admin);

const fetchAccount = async (): Promise<Admin> => {
  const store = userStore();
  const { data } = await api.get(`/admin/${store.user.id}`);
  return data;
};

const useAccount = () => {
  const { data, isError, isFetching } = useQuery({
    queryKey: ["account"],
    queryFn: fetchAccount,
  });

  watch(data, () => {
    if (data.value) {
      account.value = { ...data.value };
      idlAccount.value = data.value;
    }
  });
  return {
    account,
    idlAccount,
    isAccountLoading: isFetching,
    accountHasError: isError,
  };
};

export default useAccount;
