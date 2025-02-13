import { api } from '@/api/axios';
import type { Trainers } from '@/models/Trainers';
import { useQuery } from '@tanstack/vue-query';
import { ref, watch } from 'vue';

const trainers = ref<Trainers[]>([]);
const fetchTrainers = async (): Promise<Trainers[]> => {
  const { data } = await api.get('/trainer');
  return data;
};

const useTrainer = () => {
  const { data, isFetching, isError } = useQuery({ queryKey: ['trainers'], queryFn: fetchTrainers });
  watch(data, () => {
    if (data.value) {
      trainers.value = JSON.parse(JSON.stringify(data.value));
    }
  });
  return {
    trainers,
    isFetching,
    isError
  };
};

export default useTrainer;
