import { api } from '@/api/axios';
import type { ContificoConfig } from '@/models/Contifico';
import { useQuery } from '@tanstack/vue-query';
import { computed, ref, toValue, watch, type MaybeRef } from 'vue';
const contificoConfig = ref<ContificoConfig>({
    id: '',
    campusId: '',
    apiKey: '',
    apiSecret: ''
})

const fetchContificoConfigByCampus = async (campusId: string): Promise<ContificoConfig> => {
    const { data } = await api.get('/config-contifico/campus/' + campusId);
    return data;
};

const useContificoConfigByCampus = (id: MaybeRef<string>) => {
    const campusId = computed(() => toValue(id))

    const { data, isError, isFetching, refetch } = useQuery({
        queryKey: ['contifico-c', campusId],
        queryFn: async () => {
            contificoConfig.value = {
                id: '',
                campusId: '',
                apiKey: '',
                apiSecret: ''
            };
            const response = await fetchContificoConfigByCampus(campusId.value);
            return response;
        },
        enabled: computed(() => !!campusId.value),
        staleTime: 0,
        gcTime: 0
    });

    watch(data, (newval) => {
        if (newval) {
            contificoConfig.value = JSON.parse(JSON.stringify(newval));
        } else {
            contificoConfig.value = {
                id: '',
                campusId: '',
                apiKey: '',
                apiSecret: ''
            };
        }
    });

    return {
        contificoConfig,
        isContificoConfigError: isError,
        isContificoConfigLoading: isFetching,
        refetchContificoConfig: refetch,
    };
};


export default useContificoConfigByCampus;