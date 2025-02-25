import { ref, watch } from 'vue';
import type { Calendar } from '@/models/Calendar';
import { api } from '@/api/axios';
import { useQuery } from '@tanstack/vue-query';

// const calendar = ref<Calendar[]>([
//   {
//     id: '1',
//     title: 'Focus-96',
//     start: '2025-02-14',
//     end: '2025-02-17',
//     allDay: true,
//     color: '#2196F3',
//     extendedProps: {
//       description: 'This is a meeting',
//       location: 'Conference Room',
//       guests: ['John Doe', 'Jane Smith'],
//     },
//   },
// ]);

const fetchCalendar = async (): Promise<Calendar[]> =>{
  const{data} = await api.get('/admin/training');
  return data;
} 

const useCalendar = () => {
  const {data, isFetching, isError} = useQuery({ queryFn: fetchCalendar, queryKey: ['calendar']});
    watch(data, () =>{
      if(data.value){
        data.value = [...data.value];
      }
    });
    return {
    data,
    isFetching,
    isError,
  };
}

export default useCalendar;