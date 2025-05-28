import { api } from "@/api/axios";
import type { Program } from "@/models/Program";
import { useQuery } from "@tanstack/vue-query";

const fetchPrograms = async (): Promise<Program[]> => {
    const { data } = await api.get('/program');
    return data;
}

const usePrograms = () => {
    const { data: programs, isError, isFetching, refetch } = useQuery({ queryKey: ['programs'], queryFn: fetchPrograms });
    return {
        programs,
        isProgramsError: isError,
        isProgramsLoading: isFetching,
        refetchPrograms: () => {
            refetch();
        }
    };
};

export default usePrograms;