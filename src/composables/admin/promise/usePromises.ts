import { api } from "@/api/axios";
import type { PageableApiResponse } from "@/models/ApiResponse";
import { Promises } from '../../../models/Promises';
import TrainingList from '@/components/trainings/TrainingList.vue';
import { useQuery } from "@tanstack/vue-query";

const usePromises = (trainingIdRef: any) => {
    const fetchPromises = async (trainingId: String) : Promise<Promises[]> => {
        const {data} = await api.get('/promise/'+ trainingId);
        return data;
    };

    const { data, isFetching, isError, refetch } = useQuery({
        queryKey: ['promises', TrainingList.props.trainingId],
        queryFn: () => fetchPromises(TrainingList.props.trainingId),
        enabled: !!TrainingList.props.trainingId,
        initialData: [] as Promises[],
    });

    return {
        promisesData: data,
        isPromisesError: isError,
        isPromisesLoading: isFetching,
        refetchPromises: refetch,
    };
};

export default usePromises;
