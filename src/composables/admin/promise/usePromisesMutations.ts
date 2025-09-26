import { api } from '@/api/axios';
import type { PromiseRequest } from '@/models/Promises';
import { useMutation } from '@tanstack/vue-query';

const savePromise = async (promiseReq: PromiseRequest) => {
  const { data } = await api.post('/promises', promiseReq);
  return data;
};

const usePromisesMutations = () => {
  const useSavePromiseMutation = useMutation({ mutationFn: savePromise });
  return { useSavePromiseMutation };
};

export default usePromisesMutations;
