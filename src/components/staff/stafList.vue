<script setup lang="ts">
import useStaffs from '@/composables/admin/staff/useStaffs';
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { VDataTable } from 'vuetify/components';
import { ref, watch } from 'vue';
import type { StaffWriteModel } from '@/models/Staff';
import type { TeamWriteModel } from '@/models/Team';

interface props{
    team:TeamWriteModel
    staff:StaffWriteModel[],
    isVisionariesloading:boolean
}
const porps = defineProps<props>()
const search = ref('');

const headers = [
    { title: 'Nombre', value: 'user.name', sortable: false },
    { title: 'E-mail', value: 'user.email', sortable: false },
    { title: 'Rol', value: 'role', sortable: false },
    { title: 'Estado', value: 'active', sortable: false }
] as const;
</script>

<template>
    <v-data-table v-model="team.staffs" :headers="headers" :items="staff" :search="search"
        :loading="isVisionariesloading" show-select return-object class="elevation-1">
        <template v-slot:top>
            <v-toolbar flat class="bg-surface">
                <v-text-field v-model="search" hide-details placeholder="Buscar Staff" class="custom-card px-4"
                    density="compact">
                    <template #prepend-inner>
                        <Icon icon="mdi-magnify" />
                    </template>
                    <template #counter="slotProps"></template>
                </v-text-field>
                <v-spacer></v-spacer>
                <v-btn v-if="team.staffs.length" color="error" variant="tonal" size="small"
                    @click="team.staffs = []">
                    <Icon icon="mdi-close" class="mr-1" />
                    Limpiar Selección ({{ team.staffs.length }})
                </v-btn>
            </v-toolbar>
        </template>

        <template v-slot:item.rol="{ item }">
            <v-chip size="small" :color="item.rol === 'ADMIN' ? 'primary' : 'success'" class="text-capitalize">
                {{ item.rol.toLowerCase() }}
            </v-chip>
        </template>

        <template v-slot:item.active="{ item }">
            <v-chip size="small" :color="item.active ? 'success' : 'error'" variant="tonal">
                {{ item.active ? 'Activo' : 'Inactivo' }}
            </v-chip>
        </template>
    </v-data-table>
    <!-- <div v-if="isStaffError" class="error-state text-center pa-8">
        <Icon icon="mdi-alert-circle" color="error" size="48" />
        <div class="text-h6 mt-2">Error al cargar el personal</div>
    </div> -->
</template>

<style lang="scss" scoped></style>
