import { api } from '@/api/axios';
import type { Attendance } from '@/models/Attendance';
import { useQuery } from '@tanstack/vue-query';
import { computed, toValue, type MaybeRefOrGetter } from 'vue';

const fetchAttendances = async (id: string): Promise<Attendance[]> => {
  const { data } = await api.get('/attendance/training/' + id);
  return data;
};

const useAttendanceByTraining = (id: MaybeRefOrGetter<string | undefined | null>) => {
  const trainingId = computed(() => toValue(id));

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ['attendances-by-training', trainingId],
    queryFn: () => fetchAttendances(trainingId.value!),
    gcTime: 0,
    initialData: [],
    enabled: computed(() => !!trainingId.value)
  });

  return {
    attendances: data,
    isAttendancesLoading: isFetching,
    isAttendancesError: isError,
    refetchAttendances: refetch
  };
};

export default useAttendanceByTraining;
