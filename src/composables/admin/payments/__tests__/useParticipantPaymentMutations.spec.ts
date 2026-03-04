import useParticipantPaymentMutations from '../useParticipantPayments';
import { api } from '@/api/axios';
import { useQuery } from '@tanstack/vue-query';
import { ref } from 'vue';

// Mock api
jest.mock('@/api/axios', () => ({
  api: {
    get: jest.fn(),
  },
}));

// Mock useQuery
jest.mock('@tanstack/vue-query', () => ({
  useQuery: jest.fn(),
}));

describe('useParticipantPaymentMutations', () => {
  const participantId = '123';
  const mockPayments = [
    { id: '1', total: 100, status: 'PAID' },
    { id: '2', total: 50, status: 'PENDING' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useQuery as jest.Mock).mockReturnValue({
      data: ref(mockPayments),
      isError: ref(false),
      isFetching: ref(false),
      refetch: jest.fn(),
    });
  });

  it('should initialize payments correctly', () => {
    const { payments } = useParticipantPaymentMutations(participantId);
    expect(payments.value).toEqual(mockPayments);
  });

  it('should call API with correct endpoint', async () => {
    // We need to capture the queryFn passed to useQuery
    let capturedQueryFn: (() => Promise<any>) | undefined;

    (useQuery as jest.Mock).mockImplementation((options: any) => {
      capturedQueryFn = options.queryFn;
      return {
        data: ref([]),
        isError: ref(false),
        isFetching: ref(false),
        refetch: jest.fn(),
      };
    });

    (api.get as jest.Mock).mockResolvedValue({ data: mockPayments });

    useParticipantPaymentMutations(participantId);

    expect(capturedQueryFn).toBeDefined();
    if (capturedQueryFn) {
      const result = await capturedQueryFn();
      expect(api.get).toHaveBeenCalledWith('/payments/participant-all/' + participantId);
      expect(result).toEqual(mockPayments);
    }
  });

  it('should handle errors gracefully', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: ref([]),
      isError: ref(true),
      isFetching: ref(false),
      refetch: jest.fn(),
    });

    const { isPaymentError } = useParticipantPaymentMutations(participantId);
    expect(isPaymentError.value).toBe(true);
  });
});
