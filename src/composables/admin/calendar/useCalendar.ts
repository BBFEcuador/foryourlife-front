import { ref, watch, type MaybeRef } from 'vue';
import type { Calendar } from '@/models/Calendar';
import { api } from '@/api/axios';
import { useQuery } from '@tanstack/vue-query';
import { adminStore } from '@/stores/adminStore';
import type { PageableApiResponse } from '@/models/ApiResponse';

const store = adminStore()
const page = ref(0);
const perPage = ref(10);
const search = ref('');
const startDate = ref('');
const endDate = ref('');

const fetchCalendar = async (): Promise<PageableApiResponse<Calendar[]>> => {
  const { data } = await api.get('/admin/training/calendar-event', {
    params: {
      page: page.value,
      perPage: perPage.value,
      search: search.value,
      campusId: store.selectCampusId,
      startDate: startDate.value,
      endDate: endDate.value
    }
  });
  return data;
};

const useCalendar = (originCalendar: boolean) => {

  if (!originCalendar) {
    startDate.value = ''
    endDate.value = ''
    perPage.value = 10
  } else {
    search.value = ''
  }

  const { data, isError, refetch, isLoading } = useQuery({
    queryFn: fetchCalendar,
    queryKey: ['trainings-calendar', page, perPage, endDate],
    initialData: {
      totalElements: 0,
      content: [] as Calendar[]
    } as PageableApiResponse<Calendar[]>,
    enabled: !originCalendar
  });

  return {
    trainingsData: data,
    page,
    isLoading,
    perPage,
    search,
    startDate,
    endDate,
    refetch,
    isError,
  };
};

export default useCalendar;
