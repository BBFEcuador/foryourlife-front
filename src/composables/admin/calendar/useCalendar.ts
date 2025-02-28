import { ref, watch } from 'vue';
import type { Calendar } from '@/models/Calendar';
import { api } from '@/api/axios';
import { useQuery } from '@tanstack/vue-query';

const calendar = ref<Calendar[]>([
  {
    id: "6c97526a-a226-4f57-a808-fc94ef18c6c0",
    title: "Quito-99 LIFE",
    start: "2025-03-07",
    end: "2025-03-09",
    allDay: false,
    color: "#0000",
    extendedProps: {
        description: "Epic description",
        location: "Nice location",
        guests: [
            "clave",
            "valor"
        ]
    }
},
]);

const fetchCalendar = async (): Promise<Calendar[]> =>{
  const{data} = await api.get('/admin/training/calendar-event');
  return data;
} 


const useCalendar = () => {
  const {data, isFetching, isError ,refetch} = useQuery({ queryFn: fetchCalendar, queryKey: ['calendar']});
    watch(data, () =>{
      if(data.value){
        data.value = JSON.parse(JSON.stringify(data.value));
      }
    });
    return {
    data,
    refetch,
    isFetching,
    isError,
  };
}

export default useCalendar;