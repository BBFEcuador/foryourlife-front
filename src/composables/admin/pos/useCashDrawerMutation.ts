import { api } from '@/api/axios';
import { adminStore } from '@/stores/adminStore';
import { useMutation } from '@tanstack/vue-query';

const adminSt = adminStore();

const openCashDrawer = async (idsReq: { cashBoxId: string; openingBalance: number; detail: string }): Promise<any> => {
  const { data } = await api.put('/cash-drawer/open/' + idsReq.cashBoxId, null, {
    params: {
      userId: adminSt.user.user.id,
      openingBalance: idsReq.openingBalance,
      detail: idsReq.detail
    }
  });
  return data;
};

const closeCashDrawer = async (idsReq: { cashDrawerId: string; userId: string }): Promise<Uint8Array> => {
  const { data } = await api.put('/cash-drawer/close/' + idsReq.cashDrawerId, null, {
    params: {
      userId: idsReq.userId
    },
    responseType: 'arraybuffer'
  });
  return data;
};

const toggleLockCashDrawer = async (idsReq: { cashDrawerId: string; pin: string }): Promise<any> => {
  const { data } = await api.put('/cash-drawer/lock/' + idsReq.cashDrawerId, null, {
    params: {
      pin: idsReq.pin
    }
  });
  return data;
};

const forgetPinCashDrawer = async (id: string): Promise<any> => {
  const { data } = await api.put('/cash-drawer/forget-pin/' + id);
  return data;
};

const useCashDrawerMutation = () => {
  const openCashDrawerMutation = useMutation({
    mutationFn: openCashDrawer
  });
  const closeCashDrawerMutation = useMutation({
    mutationFn: closeCashDrawer
  });
  const toggleLockCashDrawerMutation = useMutation({
    mutationFn: toggleLockCashDrawer
  });
  const forgetPinMutation = useMutation({
    mutationFn: forgetPinCashDrawer
  });
  return { openCashDrawerMutation, closeCashDrawerMutation, toggleLockCashDrawerMutation, forgetPinMutation };
};

export default useCashDrawerMutation;
