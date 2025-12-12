import { api } from "@/api/axios";
import { useMutation } from "@tanstack/vue-query";

const excel = async (id: string): Promise<Blob> => {
    const { data } = await api.post(`/report/generate/${id}`, null, {
        responseType: 'blob'
    });
    return data;
};

const useReportsMutations = () => {
    const excelMutation = useMutation({
        mutationFn: excel
    });
    return {
        excelMutation,
    };
};

export default useReportsMutations;