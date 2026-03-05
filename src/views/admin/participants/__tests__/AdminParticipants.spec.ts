import { mount } from '@vue/test-utils';
import AdminParticipants from '../AdminParticipants.vue';
import { ref } from 'vue';

// Mock Vuetify
jest.mock('vuetify', () => ({
  createVuetify: jest.fn(() => ({
    install: jest.fn(),
  })),
}));

jest.mock('vuetify/components', () => ({}));
jest.mock('vuetify/directives', () => ({}));
jest.mock('vuetify/labs/VNumberInput', () => ({
  VNumberInput: { template: '<div><slot /></div>' }
}));

jest.mock('@/components/shared/BaseBreadcrumb.vue', () => ({
  template: '<div></div>'
}));
jest.mock('@/components/shared/UiParentCard.vue', () => ({
  template: '<div><slot /></div>'
}));
jest.mock('@/components/forms/InputSection.vue', () => ({
  template: '<input />'
}));

// Setup Vuetify Mock
import { createVuetify } from 'vuetify';
const vuetify = createVuetify();

// Mocks
jest.mock('vue-router', () => ({
  useRoute: jest.fn(() => ({ params: {} })),
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

jest.mock('@/stores/adminStore', () => ({
  adminStore: jest.fn(() => ({})),
}));

jest.mock('@/service/ability', () => ({
  checkPermission: jest.fn(() => true),
}));

jest.mock('@/service/sweetAlert', () => ({
  showErrorToast: jest.fn(),
}));

jest.mock('vue3-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

// Mock Composables
jest.mock('@/composables/admin/participants/useParticipants', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    participants: ref({
      content: [
        { 
          id: '1', 
          user: { name: 'John Doe', email: 'john@example.com' }, 
          team: { name: 'Team A' }, 
          participantLevel: { courseLevel: 'INIT' }, 
          profile: { dni: '123' }, 
          originalTraining: 'T1',
          campus: { city: 'Quito' }
        }
      ],
      totalElements: 1
    }),
    isParticipantsLoading: ref(false),
    isParticipantsError: ref(false),
    page: ref(1),
    perPage: ref(10),
    participantSearch: ref(''),
    refetchParticipants: jest.fn(),
    criteriaMutations: { mutate: jest.fn() }
  })),
}));

jest.mock('@/composables/admin/payments/useParticipantPayments', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    payments: ref([
        { id: 'p1', total: 100, status: 'PAID', products: [{ name: 'Curso' }], remainingBalance: 0, createdAt: '2023-01-01' }
    ]),
    isPaymentLoading: ref(false),
    isPaymentError: ref(false),
    refetchPayment: jest.fn(),
  })),
}));

jest.mock('@/composables/invitation/useInvitationMutation', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    generateInvitationMutation: { mutate: jest.fn(), isPending: ref(false) },
    generateInvitationWithQuantityMutation: { mutate: jest.fn(), isPending: ref(false) }
  })),
}));

jest.mock('@/composables/admin/useCampus', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    campusData: ref([]),
    isFetching: ref(false),
    isError: ref(false),
    refetch: jest.fn()
  })),
}));

jest.mock('@/composables/admin/participants/useParticipantMutations', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    resetPasswordMutation: { mutate: jest.fn() },
    generateContractMutation: { mutate: jest.fn() },
    changeCampusMutation: { mutate: jest.fn() }
  })),
}));

jest.mock('@/composables/admin/products/useProducts', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));

jest.mock('@/composables/admin/training/useTrainings', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));

describe('AdminParticipants.vue', () => {
  it('opens payments dialog when viewPayments is called', async () => {
    const wrapper = mount(AdminParticipants, {
      global: {
        plugins: [vuetify],
        stubs: {
          Icon: true,
          BaseBreadcrumb: true,
          UiParentCard: true,
          VDataTableServer: true,
          VNumberInput: true,
          VRow: true,
          VCol: true,
          VCard: true,
          VCardTitle: true,
          VCardText: true,
          VCardActions: true,
          VTextField: true,
          VBtn: true,
          VSpacer: true,
          VChip: true,
          VMenu: true,
          VList: true,
          VListItem: true,
          VListItemTitle: true,
          VProgressLinear: true,
          VToolbar: true,
          VAlert: true,
          VDialog: true,
          VTimeline: true,
          VTimelineItem: true,
          VExpansionPanels: true,
          VExpansionPanel: true,
          VExpansionPanelText: true,
          VProgressCircular: true
        },
        directives: {
          'auto-animate': () => {},
          'tooltip': () => {},
          'motion': () => {}
        }
      },
    });

    const vm = wrapper.vm as any;
    
    // Initial state
    expect(vm.showPaymentsDialog).toBe(false);
    expect(vm.selectedParticipantId).toBe('');

    // Trigger action
    vm.viewPayments('123');
    
    // Assertions
    expect(vm.selectedParticipantId).toBe('123');
    expect(vm.showPaymentsDialog).toBe(true);
  });
});
