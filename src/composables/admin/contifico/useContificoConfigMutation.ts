import { api } from "@/api/axios";
import type { ContificoConfigRequest } from "@/models/Contifico";
import { useMutation } from "@tanstack/vue-query";

const saveContificoSettings = async (configReq: ContificoConfigRequest): Promise<any> => {
    const { data } = await api.post('/config-contifico', configReq)
    return data
}

const useContificoSettingsMutations = () => {
    const saveContificoSettingsMutation = useMutation({
        mutationFn: saveContificoSettings
    })
    return {
        saveContificoSettingsMutation
    }
}

export default useContificoSettingsMutations