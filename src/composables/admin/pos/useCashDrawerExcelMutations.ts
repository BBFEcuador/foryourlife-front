import { api } from "@/api/axios";
import { useMutation } from "@tanstack/vue-query";

const excel = async (id: string): Promise<Blob> => {
    const { data } = await api.post(`/cash-drawer/generate-excel-report`, null, {
         params: {
            id: id
        },
        responseType: 'blob'
    });
    return data;
};

const useCashDrawerExcelMutations = () => {
    const excelMutation = useMutation({
        mutationFn: excel
    });
    return {
        excelMutation,
    };
};

export default useCashDrawerExcelMutations;