import type { AddUsers } from "@/models/AddUsers";
import { api } from "@/api/axios";
import { useMutation } from "@tanstack/vue-query";

const saveAddMembers = async (req:{teamId: string, members: AddUsers} ): Promise<any> => {
    const { data } = await api.put(`/teams/add-users/${req.teamId}`, req.members);
    return data;
}

const useMembersMutations = () => {
    const saveAddMembersMutations = useMutation({ mutationFn: saveAddMembers });
    return {
        saveAddMembersMutations,
    };
};

export default useMembersMutations;