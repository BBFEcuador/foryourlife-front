import { api } from '@/api/axios';
import type { StatementCommentRequest } from '@/models/Statements';
import { useMutation } from '@tanstack/vue-query';

const saveCommentStatement = async (req: { id: string; commentRequest: StatementCommentRequest }): Promise<any> => {
  const { data } = await api.put(`/statements/${req.id}`, req.commentRequest);
  return data;
};


const useCommentStatementMutations = () => {
  const saveCommentStatementMutations = useMutation({ mutationFn: saveCommentStatement });
  return {
    saveCommentStatementMutations
  };
};

export default useCommentStatementMutations;
