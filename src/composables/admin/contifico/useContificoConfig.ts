import { api } from '@/api/axios';
import type { ContificoConfig } from '@/models/Contifico';
import { useQuery } from '@tanstack/vue-query';
import { computed, ref, toValue, watch, type MaybeRef } from 'vue';
const contificoConfig = ref<ContificoConfig>({
    id: '',
    campusId: '',
    apiKey: '',
    apiSecret: '',
    ruc: '',
    address: '',
    razonSocial: '',
    phone: ''
})

const fetchContificoConfigByCampus = async (campusId: string): Promise<ContificoConfig> => {
    const { data } = await api.get('/config-contifico/campus/' + campusId);
    return data;
};

const useContificoConfigByCampus = (id: MaybeRef<string>) => {
    const campusId = computed(() => toValue(id))

    const { data, isError, isLoading, refetch } = useQuery({
        queryKey: ['contifico-c', campusId],
        queryFn: async () => fetchContificoConfigByCampus(campusId.value),
        enabled: computed(() => !!campusId.value),
        gcTime: 0,
        staleTime: 0,
        retry: false,
        initialData: {} as ContificoConfig
    });

    watch(data, (newval) => {
        if (newval) {
            contificoConfig.value = JSON.parse(JSON.stringify(newval));
        }
    });

    return {
        contificoConfig,
        isContificoConfigError: isError,
        isContificoConfigLoading: isLoading,
        refetchContificoConfig: refetch,
    };
};


export default useContificoConfigByCampus;