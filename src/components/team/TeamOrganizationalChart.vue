<script setup lang="ts">
import TeamBanner from '@/components/team/TeamBanner.vue';
import type { Team } from '@/models/Participants';
import type { OrgNode, OrgChartPayload } from '@/models/OrganizationalChart';
import { ref, computed, watch, onMounted } from 'vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import useOrganizationalChartByTraining from '@/composables/admin/organizational/useOrganizationalChartByTraining';
import useOrganizationalChartMutations from '@/composables/admin/organizational/useOrganizationalChartMutations';
import { toast } from 'vue3-toastify';
import type { AxiosError } from 'axios';

interface Props {
  team: Team;
  isTeamLoading: boolean;
  isTeamError: boolean;
  isForEdit: boolean;
}
const { saveOrganizationalChartMutations, updateOrganizationalChartMutations } = useOrganizationalChartMutations();
const props = defineProps<Props>();
const searchVisionary = ref('');
const searchStaff = ref('');
const searchParticipant = ref('');
const organizationalChart = useOrganizationalChartByTraining(props.team?.training?.id);
// Zoom controls
const zoomLevel = ref(1);
const minZoom = 0.5;
const maxZoom = 1.5;

// Dialogs
const visionaryDialog = ref(false);
const staffDialog = ref(false);
const participantDialog = ref(false);
const selectedParentForStaff = ref<string | null>(null);
const selectedParentForParticipant = ref<string | null>(null);

// Selections for dialogs
const selectedVisionaries = ref<string[]>([]);
const selectedStaffs = ref<string[]>([]);
const selectedParticipants = ref<string[]>([]);

// JSON payload que se enviará al backend
const orgChartPayload = ref<OrgChartPayload>({
  id: '',
  teamId: '',
  masterLives: [],
  visionaries: [],
  staff: []
});

// Computed data
const rootNode = computed(() => {
  if (!organizationalChart.data.value) return null;
  if (!organizationalChart.data.value['OrganizationChart']?.nodes?.length) return null;
  return organizationalChart.data.value['OrganizationChart'].nodes[0];
});

// Inicializar el payload con los datos del organigrama existente
const initializePayload = () => {
  if (!props.team) return;

  // Siempre inicializamos al menos la estructura vacía con teamId
  orgChartPayload.value.teamId = props.team.id;
  orgChartPayload.value.masterLives = [];
  orgChartPayload.value.visionaries = [];
  orgChartPayload.value.staff = [];
  // Si no hay nodos en el organizationalChart, dejamos el payload vacío
  const nodes: OrgNode[] = organizationalChart.data.value?.['OrganizationChart']?.nodes || [];
  if (!nodes.length) return;

  // Procesar todos los nodos raíz. Puede haber múltiples visionarios a nivel raíz.
  nodes.forEach((node: OrgNode) => {
    if (node.level === 'VISIONARY') {
      const visionaryData: any = {
        userId: node.members.id,
        staff: []
      };

      // Recorrer los staff del visionario
      node.children?.forEach((staffNode: OrgNode) => {
        if (staffNode.level === 'STAFF') {
          const participantsIds = staffNode.children?.filter((p) => p.level === 'PARTICIPANT').map((p) => p.members.id) || [];

          visionaryData.staff.push({
            userId: staffNode.members.id,
            participantsIds
          });
        }
      });

      orgChartPayload.value.visionaries.push(visionaryData);
    } else if (node.level === 'STAFF') {
      // Soporte para staff independientes que estén en el nivel raíz
      const participantsIds = node.children?.filter((p) => p.level === 'PARTICIPANT').map((p) => p.members.id) || [];
      orgChartPayload.value.staff.push({ userId: node.members.id, participantsIds });
    }
  });

  console.log('Payload inicializado desde organigrama existente:', orgChartPayload.value);
};

// Watch para inicializar cuando carguen los datos
watch(
  () => organizationalChart.data?.value,
  (newData) => {
    console.log('OrganizationalChart change detected:', newData);
    // Inicializar payload ya sea que haya nodos o no (si no hay nodos se prepara estructura vacía)
    initializePayload();
  },
  { immediate: true }
);

watch(
  () => visionaryDialog.value,
  (val) => {
    if (!val) {
      searchVisionary.value = '';
    }
  }
);

watch(
  () => staffDialog.value,
  (val) => {
    if (!val) {
      searchStaff.value = '';
    }
  }
);

watch(
  () => participantDialog.value,
  (val) => {
    if (!val) {
      searchParticipant.value = '';
    }
  }
);

// Get all members IDs currently in the org chart (from payload)
const getMembersInChart = computed(() => {
  const ids = new Set<string>();

  // Agregar visionarios
  orgChartPayload.value.visionaries.forEach((v) => {
    ids.add(v.userId);

    // Agregar staff del visionario
    v.staff.forEach((s) => {
      ids.add(s.userId);

      // Agregar participantes del staff
      s.participantsIds.forEach((p) => ids.add(p));
    });
  });

  // Agregar staff independientes
  orgChartPayload.value.staff.forEach((s) => {
    ids.add(s.userId);
    s.participantsIds.forEach((p) => ids.add(p));
  });

  return ids;
});

// Available members for each dialog
const availableVisionaries = computed(() => {
  const list =
    props.team.visionaries?.map((v) => ({
      ...v,
      isInChart: getMembersInChart.value.has(v.user.id)
    })) || [];

  const q = String(searchVisionary.value || '')
    .trim()
    .toLowerCase();
  if (!q) return list;

  return list.filter((v) => {
    const name = String(v.user?.name || '').toLowerCase();
    const email = String(v.user?.email || '').toLowerCase();
    return name.includes(q) || email.includes(q);
  });
});

const availableStaffs = computed(() => {
  const list =
    props.team.staffs?.map((s) => ({
      ...s,
      isInChart: getMembersInChart.value.has(s.user.id)
    })) || [];
  const q = String(searchStaff.value || '')
    .trim()
    .toLowerCase();
  if (!q) return list;
  return list.filter((s) => {
    const name = String(s.user?.name || '').toLowerCase();
    const email = String(s.user?.email || '').toLowerCase();
    return name.includes(q) || email.includes(q);
  });
});

const availableParticipants = computed(() => {
  const list =
    props.team.users?.map((u) => ({
      ...u,
      isInChart: getMembersInChart.value.has(u.user.id)
    })) || [];
  const q = String(searchParticipant.value || '')
    .trim()
    .toLowerCase();
  if (!q) return list;
  return list.filter((u) => {
    const name = String(u.user?.name || '').toLowerCase();
    const email = String(u.user?.email || '').toLowerCase();
    return name.includes(q) || email.includes(q);
  });
});

// Zoom functions
const zoomIn = () => {
  if (zoomLevel.value < maxZoom) {
    zoomLevel.value = Math.min(zoomLevel.value + 0.1, maxZoom);
  }
};

const zoomOut = () => {
  if (zoomLevel.value > minZoom) {
    zoomLevel.value = Math.max(zoomLevel.value - 0.1, minZoom);
  }
};

const resetZoom = () => {
  zoomLevel.value = 1;
};

// Panning (drag to move) state
const chartRef = ref<HTMLElement | null>(null);
const panX = ref(0);
const panY = ref(0);
const isPanning = ref(false);
const pointerStart = { x: 0, y: 0 };
const panStart = { x: 0, y: 0 };

const onPointerDown = (e: PointerEvent) => {
  const target = e.target as HTMLElement;
  if (target.closest('button, a, input, textarea, select, .v-btn')) return;

  isPanning.value = true;
  pointerStart.x = e.clientX;
  pointerStart.y = e.clientY;
  panStart.x = panX.value;
  panStart.y = panY.value;
  try {
    (e.currentTarget as HTMLElement)?.setPointerCapture?.(e.pointerId);
  } catch (err) {}
};

const onPointerMove = (e: PointerEvent) => {
  if (!isPanning.value) return;
  const dx = e.clientX - pointerStart.x;
  const dy = e.clientY - pointerStart.y;
  panX.value = panStart.x + dx;
  panY.value = panStart.y + dy;
};

const onPointerUp = (e: PointerEvent) => {
  if (!isPanning.value) return;
  isPanning.value = false;
  try {
    (e.currentTarget as HTMLElement)?.releasePointerCapture?.(e.pointerId);
  } catch (err) {}
};

// Dialog functions
const openVisionaryDialog = () => {
  selectedVisionaries.value = orgChartPayload.value.visionaries.map((v) => v.userId);
  visionaryDialog.value = true;
};

const openStaffDialog = (visionaryId: string) => {
  selectedParentForStaff.value = visionaryId;

  const visionary = orgChartPayload.value.visionaries.find((v) => v.userId === visionaryId);
  selectedStaffs.value = visionary?.staff.map((s) => s.userId) || [];

  staffDialog.value = true;
};

const openParticipantDialog = (staffId: string) => {
  selectedParentForParticipant.value = staffId;

  // Buscar el staff en todos los visionarios
  let participants: string[] = [];

  for (const visionary of orgChartPayload.value.visionaries) {
    const staff = visionary.staff.find((s) => s.userId === staffId);
    if (staff) {
      participants = staff.participantsIds;
      break;
    }
  }

  // Si no se encontró en visionarios, buscar en staff independiente
  if (participants.length === 0) {
    const independentStaff = orgChartPayload.value.staff.find((s) => s.userId === staffId);
    if (independentStaff) {
      participants = independentStaff.participantsIds;
    }
  }

  // IMPORTANT: copy the array so modifications to `selectedParticipants`
  // do not mutate the original `orgChartPayload` structure immediately.
  selectedParticipants.value = participants ? participants.slice() : [];
  participantDialog.value = true;
};

// Toggle selection functions
const toggleVisionarySelection = (visionaryId: string) => {
  const index = selectedVisionaries.value.indexOf(visionaryId);
  if (index > -1) {
    selectedVisionaries.value.splice(index, 1);
  } else {
    selectedVisionaries.value.push(visionaryId);
  }
};

// Helpers para hallar el owner de un miembro en el payload
const getStaffOwnerVisionary = (staffUserId: string): string | null => {
  for (const v of orgChartPayload.value.visionaries) {
    if (v.staff.find((s) => s.userId === staffUserId)) return v.userId;
  }
  // Si está en la lista de staff independiente, devolver una marca
  if (orgChartPayload.value.staff.find((s) => s.userId === staffUserId)) return 'INDEPENDENT';
  return null;
};

const getParticipantOwnerStaff = (participantUserId: string): string | null => {
  for (const v of orgChartPayload.value.visionaries) {
    for (const s of v.staff) {
      if (s.participantsIds.includes(participantUserId)) return s.userId;
    }
  }
  for (const s of orgChartPayload.value.staff) {
    if (s.participantsIds.includes(participantUserId)) return s.userId;
  }
  return null;
};

const toggleStaffSelection = (staffId: string) => {
  const index = selectedStaffs.value.indexOf(staffId);
  if (index > -1) {
    selectedStaffs.value.splice(index, 1);
  } else {
    selectedStaffs.value.push(staffId);
  }
};

const toggleParticipantSelection = (participantUserId: string) => {
  const index = selectedParticipants.value.indexOf(participantUserId);
  if (index > -1) {
    selectedParticipants.value.splice(index, 1);
  } else {
    selectedParticipants.value.push(participantUserId);
  }
  console.log('Participante seleccionado/desseleccionado:', participantUserId);
  console.log('actual:', JSON.stringify(orgChartPayload.value, null, 2));
};

// Accept functions
const acceptVisionaries = () => {
  // Actualizar el listado de visionarios: aplicar altas y bajas basadas en selectedVisionaries
  const currentIds = orgChartPayload.value.visionaries.map((v) => v.userId);

  // Visionarios a eliminar (estaban en payload pero fueron desmarcados)
  const toRemove = currentIds.filter((id) => !selectedVisionaries.value.includes(id));

  if (toRemove.length > 0) {
    orgChartPayload.value.visionaries = orgChartPayload.value.visionaries.filter((v) => !toRemove.includes(v.userId));
  }

  // Visionarios a agregar
  const toAdd = selectedVisionaries.value.filter((id) => !currentIds.includes(id));
  toAdd.forEach((visionaryId) => {
    orgChartPayload.value.visionaries.push({ userId: visionaryId, staff: [] });
  });

  console.log('Visionarios actualizados:', orgChartPayload.value);
  visionaryDialog.value = false;

  // Recargar el organigrama con el nuevo payload
  refreshOrgChart();
};

const acceptStaffs = () => {
  if (!selectedParentForStaff.value) return;
  const visionary = orgChartPayload.value.visionaries.find((v) => v.userId === selectedParentForStaff.value);
  if (!visionary) return;

  const currentStaffIds = visionary.staff.map((s) => s.userId);

  // Staffs a remover (desmarcados)
  const toRemove = currentStaffIds.filter((id) => !selectedStaffs.value.includes(id));
  if (toRemove.length > 0) {
    visionary.staff = visionary.staff.filter((s) => !toRemove.includes(s.userId));
  }

  // Staffs a agregar
  const toAdd = selectedStaffs.value.filter((id) => !currentStaffIds.includes(id));
  toAdd.forEach((staffId) => {
    visionary.staff.push({ userId: staffId, participantsIds: [] });
  });

  console.log('Staffs actualizados:', orgChartPayload.value);
  staffDialog.value = false;

  // Recargar el organigrama con el nuevo payload
  refreshOrgChart();
};

const acceptParticipants = () => {
  if (!selectedParentForParticipant.value) return;
  // Buscar el staff en visionarios
  let staffRef: { userId: string; participantsIds: string[] } | undefined;
  for (const visionary of orgChartPayload.value.visionaries) {
    const staff = visionary.staff.find((s) => s.userId === selectedParentForParticipant.value);
    if (staff) {
      staffRef = staff;
      break;
    }
  }

  // Si no se encontró en visionarios, buscar en staff independiente
  if (!staffRef) {
    staffRef = orgChartPayload.value.staff.find((s) => s.userId === selectedParentForParticipant.value);
  }

  if (!staffRef) return;

  const currentParticipants = staffRef.participantsIds.slice();

  // Participants to remove
  const toRemove = currentParticipants.filter((id) => !selectedParticipants.value.includes(id));
  if (toRemove.length > 0) {
    staffRef.participantsIds = staffRef.participantsIds.filter((p) => !toRemove.includes(p));
  }

  // Participants to add
  const toAdd = selectedParticipants.value.filter((id) => !currentParticipants.includes(id));
  toAdd.forEach((pid) => staffRef!.participantsIds.push(pid));

  console.log('Participantes actualizados:', orgChartPayload.value);
  participantDialog.value = false;

  // Recargar el organigrama con el nuevo payload
  refreshOrgChart();
};
// Helper para obtener datos de miembro
const getMemberData = (memberId: string, type: 'visionary' | 'staff' | 'participant') => {
  if (type === 'visionary') {
    return props.team.visionaries?.find((v) => v.user.id === memberId);
  } else if (type === 'staff') {
    return props.team.staffs?.find((s) => s.user.id === memberId);
  } else {
    return props.team.users?.find((u) => u.user.id === memberId);
  }
};

// Computed para generar los árboles visuales (uno por cada visionario) desde el payload
const visualRoots = computed(() => {
  if (!orgChartPayload.value.visionaries.length) return [];

  return orgChartPayload.value.visionaries
    .map((v) => {
      const visionaryMember = getMemberData(v.userId, 'visionary');

      if (!visionaryMember) return null;

      return {
        id: v.userId,
        members: visionaryMember,
        level: 'VISIONARY',
        children: v.staff.map((staffData) => {
          const staffMember = getMemberData(staffData.userId, 'staff');
          return {
            id: staffData.userId,
            members: staffMember,
            level: 'STAFF',
            children: staffData.participantsIds.map((participantId) => {
              const participantMember = getMemberData(participantId, 'participant');
              return {
                id: participantId,
                members: participantMember,
                level: 'PARTICIPANT',
                children: []
              };
            })
          };
        })
      };
    })
    .filter(Boolean) as any[];
});

// Función para refrescar el organigrama visual basado en el payload
const refreshOrgChart = () => {
  console.log('Payload actual para enviar al backend:', JSON.stringify(orgChartPayload.value, null, 2));

  // Forzar nuevas referencias para que Vue detecte los cambios profundamente
  orgChartPayload.value = {
    ...orgChartPayload.value,
    visionaries: orgChartPayload.value.visionaries ? orgChartPayload.value.visionaries.slice() : [],
    staff: orgChartPayload.value.staff ? orgChartPayload.value.staff.slice() : [],
    masterLives: orgChartPayload.value.masterLives ? orgChartPayload.value.masterLives.slice() : []
  };
};

// Funcion para guardar en el backend
const saveOrgChart = async (payload: OrgChartPayload) => {
  try {
    if (props.team?.id) {
      payload.teamId = props.team.id;
    }

    if (organizationalChart.data.value['OrganizationChart']?.id) {
      payload.id = organizationalChart.data.value['OrganizationChart']?.id; 
      await updateOrganizationalChartMutations.mutateAsync(payload, {
        onSuccess: () => {
          toast.success('El organigrama se ha actualizado correctamente');
          // refetchProducts();
        },
        onError(error) {
          const err = error as AxiosError<{ message: string }>;
          toast.error(err.response?.data?.message || 'Error al actualizar el organigrama');
        }
      });
      console.log('Organigrama actualizado con éxito');
    } else {
      await saveOrganizationalChartMutations.mutateAsync(payload, {
        onSuccess: () => {
          toast.success('El organigrama se ha creado correctamente');
          // refetchProducts();
        },
        onError(error) {
          const err = error as AxiosError<{ message: string }>;
          toast.error(err.response?.data?.message || 'Error al crear el organigrama');
        }
      });
      console.log('Organigrama guardado con éxito');
    }
  } catch (error) {
    console.error('Error al guardar/actualizar el organigrama:', error);
  }
};

const getLevelColor = (level: string): string => {
  const colors: Record<string, string> = {
    VISIONARY: '#1E3A8A',
    STAFF: '#0D9488',
    PARTICIPANT: '#e29f2c'
  };
  return colors[level] || '#64748B';
};

const getLevelIcon = (level: string): string => {
  const icons: Record<string, string> = {
    VISIONARY: 'mdi:crown',
    STAFF: 'mdi:account-tie',
    PARTICIPANT: 'mdi:account'
  };
  return icons[level] || 'mdi:account';
};
</script>

<template>
  <div>
    <TeamBanner :team class="mb-6" />

    <v-card variant="outlined" elevation="0" class="bg-surface p-6" rounded="lg">
      <!-- Controles superiores -->
      <v-card-title class="px-6 tw:bg-gray-100">
        <v-row class="align-center" no-gutters>
          <!-- Acciones principales: en una fila, hacen wrap en pantallas pequeñas -->
          <v-col cols="12" md="12">
            <div class="d-flex align-center gap-3 flex-wrap">
              <v-btn class="ma-1" @click="openVisionaryDialog" color="secondary" variant="elevated">
                <Icon icon="mdi:crown" width="20" class="mr-2" />
                Agregar Visionario
              </v-btn>
              <v-spacer />
              <v-btn class="ma-1" @click="saveOrgChart(orgChartPayload)" color="primary" variant="elevated">
                <Icon icon="mdi:content-save" width="20" class="mr-2" />
                Guardar Cambios
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text>
        <div class="zoom-controls align-center tw:text-end gap-2">
          <v-btn @click="zoomOut" :disabled="zoomLevel <= minZoom" icon variant="outlined" size="small" class="ma-0">
            <Icon icon="mdi:magnify-minus" width="20" />
          </v-btn>

          <v-chip size="small" variant="outlined" class="ma-0"> {{ Math.round(zoomLevel * 100) }}% </v-chip>

          <v-btn @click="zoomIn" :disabled="zoomLevel >= maxZoom" icon variant="outlined" size="small" class="ma-0">
            <Icon icon="mdi:magnify-plus" width="20" />
          </v-btn>

          <v-btn @click="resetZoom" icon variant="outlined" size="small" class="ma-0" title="Restablecer zoom">
            <Icon icon="mdi:restore" width="20" />
          </v-btn>
        </div>
        <!-- Diagrama Organizacional -->
        <div v-if="organizationalChart.isLoading.value" class="text-center py-12">
          <v-progress-circular indeterminate color="primary" size="64" />
          <p class="mt-4 text-medium-emphasis">Cargando organigrama...</p>
        </div>

        <div v-else-if="visualRoots && visualRoots.length" class="org-chart-container">
          <div
            class="org-chart"
            ref="chartRef"
            :class="{ grabbing: isPanning }"
            :style="{ transform: `translate(${panX}px, ${panY}px) scale(${zoomLevel})` }"
            @pointerdown.prevent="onPointerDown"
            @pointermove.passive="onPointerMove"
            @pointerup="onPointerUp"
            @pointerleave="onPointerUp"
          >
            <div v-for="root in visualRoots" :key="root.id" class="org-level">
              <!-- Nodo raíz (VISIONARY) -->
              <div class="org-node-wrapper">
                <div class="org-node" :style="{ borderColor: getLevelColor(root.level) }">
                  <div class="node-header" :style="{ backgroundColor: getLevelColor(root.level) }">
                    <div class="d-flex align-center gap-2">
                      <Icon :icon="getLevelIcon(root.level)" width="24" />
                      <span class="node-role">{{ root.level }}</span>
                    </div>
                    <v-btn @click="openStaffDialog(root.id)" icon size="x-small" variant="text" color="white">
                      <Icon icon="mdi:account-plus" width="18" />
                    </v-btn>
                  </div>
                  <div class="node-content">
                    <h3 class="node-name">{{ root.members.user.name }}</h3>
                    <p class="node-email">{{ root.members.user.email }}</p>
                  </div>
                </div>

                <!-- Línea conectora vertical mejorada -->
                <div v-if="root.children?.length" class="connector-vertical-modern">
                  <div class="connector-arrow"></div>
                </div>
              </div>

              <!-- Nivel STAFF para este visionario -->
              <div v-if="root.children?.length" class="participants-container org-level staff-level">
                <div class="connector-horizontal-modern" v-if="root.children.length > 1">
                  <div class="connector-line"></div>
                  <div
                    v-for="(_, index) in root.children"
                    :key="index"
                    class="connector-branch"
                    :style="{ left: `${(index / (root.children.length - 1)) * 100}%` }"
                  >
                    <div class="connector-dot"></div>
                  </div>
                </div>

                <div class="staff-container">
                  <div v-for="staffNode in root.children" :key="staffNode.id" class="org-node-wrapper">
                    <div class="org-node" :style="{ borderColor: getLevelColor(staffNode.level) }">
                      <div class="node-header" :style="{ backgroundColor: getLevelColor(staffNode.level) }">
                        <div class="d-flex align-center gap-2">
                          <Icon :icon="getLevelIcon(staffNode.level)" width="20" />
                          <span class="node-role">{{ staffNode.level }}</span>
                        </div>
                        <v-btn @click="openParticipantDialog(staffNode.id)" icon size="x-small" variant="text" color="white">
                          <Icon icon="mdi:account-plus" width="18" />
                        </v-btn>
                      </div>
                      <div class="node-content">
                        <h3 class="node-name">{{ staffNode.members?.user?.name }}</h3>
                        <p class="node-email">{{ staffNode.members?.user?.email }}</p>
                      </div>
                    </div>

                    <!-- Línea conectora para participantes -->
                    <div v-if="staffNode.children?.length" class="connector-vertical-modern">
                      <div class="connector-arrow"></div>
                    </div>

                    <!-- Nivel PARTICIPANT -->
                    <div v-if="staffNode.children?.length" class="participants-container">
                      <div class="connector-horizontal-modern" v-if="staffNode.children.length > 1">
                        <div class="connector-line"></div>
                        <div
                          v-for="(_, index) in staffNode.children"
                          :key="index"
                          class="connector-branch"
                          :style="{ left: `${(index / (staffNode.children.length - 1)) * 100}%` }"
                        >
                          <div class="connector-dot"></div>
                        </div>
                      </div>

                      <div class="participants-grid">
                        <div
                          v-for="participant in staffNode.children"
                          :key="participant.id"
                          class="org-node participant-node"
                          :style="{ borderColor: getLevelColor(participant.level) }"
                        >
                          <div class="node-header" :style="{ backgroundColor: getLevelColor(participant.level) }">
                            <Icon :icon="getLevelIcon(participant.level)" width="18" />
                            <span class="node-role">{{ participant.level }}</span>
                          </div>
                          <div class="node-content">
                            <h3 class="node-name">{{ participant.members?.user?.name }}</h3>
                            <p class="node-email">{{ participant.members?.user?.email }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="organizationalChart.isError.value" class="text-center py-12">
          <div class="d-flex flex-column align-center py-5">
            <Icon icon="mdi:alert-circle" height="80" color="secondary" class="mb-1 icon-gray" />
            <p class="mb-3">Error al cargar el organigrama</p>
          </div>

          <!-- <Icon icon="mdi:alert-circle" class="text-error" width="64" />
          <p class="mt-4 text-error">Error al cargar el organigrama</p> -->
        </div>
        <div v-else class="text-center py-12">
          <div class="d-flex flex-column align-center py-5">
            <Icon icon="mdi:file-tree" height="80" color="secondary" class="mb-1 icon-gray" />
            <p class="mb-3">No existen organigramas creados</p>
          </div>

          <!-- <Icon icon="mdi:file-tree" class="text-medium-emphasis" width="64" />
          <p class="mt-4 text-medium-emphasis">Sin organigrama</p>
          <p class="mt-4 text-medium-emphasis">Empiece creando un organigrama</p> -->
        </div>
      </v-card-text>
    </v-card>

    <!-- Dialog para agregar Visionario -->
    <v-dialog v-model="visionaryDialog" max-width="600">
      <v-card class="rounded-xl">
        <v-card-title class="d-flex align-center text-white bg-primary">
          <Icon icon="mdi:crown" class="mr-2" />
          <span class="text-h6 text-white">Agregar Visionario</span>
          <v-spacer />
          <v-btn icon variant="text" @click="visionaryDialog = false">
            <Icon icon="mdi:close" class="" width="24" />
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-0">
          <v-toolbar class="px-6 tw:bg-gradient-to-r tw:from-white tw:to-gray-50/50" flat v-motion>
            <VTextField
              v-model="searchVisionary"
              placeholder="Buscar Participantes..."
              variant="outlined"
              density="compact"
              class="tw:rounde d-lg tw:bg-white/80 backdrop-blur-sm"
              clearable
              hide-details
            >
              <template #prepend-inner>
                <div class="tw:relative">
                  <Icon icon="mdi:magnify" height="18" class="tw:text-primary tw:relative tw:z-10" />
                  <div class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full"></div>
                </div>
              </template>
            </VTextField>
          </v-toolbar>
          <div v-if="availableVisionaries.length === 0">
            <div class="d-flex flex-column align-center py-5">
              <Icon icon="mdi:user-remove" height="80" color="secondary" class="mb-1 icon-gray" />
              <p class="mb-3">No se encontraron visionarios</p>
            </div>
          </div>
          <div v-else>
            <v-list>
              <v-list-item
                v-for="visionary in availableVisionaries"
                :key="visionary.id"
                @click="toggleVisionarySelection(visionary.user.id)"
                :disabled="visionary.isInChart"
                :class="{ 'bg-grey-lighten-4': visionary.isInChart }"
              >
                <template v-slot:prepend>
                  <v-checkbox
                    :model-value="selectedVisionaries.includes(visionary.user.id)"
                    :disabled="visionary.isInChart"
                    readonly
                    hide-details
                  />
                </template>
                <v-list-item-title>{{ visionary.user?.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ visionary.user?.email }}</v-list-item-subtitle>
                <template v-slot:append v-if="visionary.isInChart">
                  <v-chip color="secondary">En diagrama</v-chip>
                </template>
              </v-list-item>
            </v-list>
          </div>
        </v-card-text>

        <v-card-actions class="tw:border-t tw:border-gray-300 tw:sticky">
          <v-spacer />
          <v-btn color="error" variant="flat" @click="visionaryDialog = false"> Cancelar </v-btn>
          <v-btn color="primary" class="text-white" variant="flat" @click="acceptVisionaries"> Aceptar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog para agregar Staff -->
    <v-dialog v-model="staffDialog" max-width="600">
      <v-card class="rounded-xl">
        <VCardTitle class="d-flex flex-shrink-0 align-center text-white bg-primary">
          <Icon icon="mdi:account-tie" class="mr-2" />
          <span class="text-h6 text-white">Agregar Staff</span>
          <v-spacer />
          <v-btn icon variant="text" @click="staffDialog = false">
            <Icon icon="mdi:close" class="" width="24" />
          </v-btn>
        </VCardTitle>
        <v-card-text class="pa-0 flex-grow-1 tw:overflow-y-auto">
          <v-toolbar class="px-6 tw:bg-gradient-to-r tw:from-white tw:to-gray-50/50" flat v-motion>
            <VTextField
              v-model="searchStaff"
              placeholder="Buscar Staff..."
              variant="outlined"
              density="compact"
              class="tw:rounde d-lg tw:bg-white/80 backdrop-blur-sm"
              clearable
              hide-details
            >
              <template #prepend-inner>
                <div class="tw:relative">
                  <Icon icon="mdi:magnify" height="18" class="tw:text-primary tw:relative tw:z-10" />
                  <div class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full"></div>
                </div>
              </template>
            </VTextField>
          </v-toolbar>
          <v-list>
            <v-list-item
              v-for="staff in availableStaffs"
              :key="staff.id"
              @click="toggleStaffSelection(staff.user.id)"
              :disabled="staff.isInChart && getStaffOwnerVisionary(staff.user.id) !== selectedParentForStaff"
              :class="{ 'bg-grey-lighten-4': staff.isInChart }"
            >
              <template v-slot:prepend>
                <v-checkbox
                  :model-value="selectedStaffs.includes(staff.user.id)"
                  :disabled="staff.isInChart && getStaffOwnerVisionary(staff.user.id) !== selectedParentForStaff"
                  readonly
                  hide-details
                />
              </template>
              <v-list-item-title>{{ staff.user?.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ staff.user?.email }}</v-list-item-subtitle>
              <template v-slot:append v-if="staff.isInChart">
                <v-chip color="secondary">En diagrama</v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions class="tw:border-t tw:border-gray-300 tw:sticky">
          <v-spacer />
          <v-btn color="error" variant="flat" @click="staffDialog = false"> Cancelar </v-btn>
          <v-btn color="primary" class="text-white" variant="flat" @click="acceptStaffs"> Aceptar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog para agregar Participante -->
    <v-dialog v-model="participantDialog" max-width="600">
      <v-card class="rounded-xl">
        <VCardTitle class="d-flex flex-shrink-0 align-center text-white bg-primary">
          <Icon icon="mdi:account" class="mr-2" />
          <span class="text-h6 text-white">Agregar Participante</span>
          <v-spacer />
          <v-btn icon variant="text" @click="participantDialog = false">
            <Icon icon="mdi:close" class="" width="24" />
          </v-btn>
        </VCardTitle>
        <v-card-text class="pa-0 flex-grow-1 tw:overflow-y-auto">
          <v-toolbar class="px-6 tw:bg-gradient-to-r tw:from-white tw:to-gray-50/50" flat v-motion>
            <VTextField
              v-model="searchParticipant"
              placeholder="Buscar Participantes..."
              variant="outlined"
              density="compact"
              class="tw:rounde d-lg tw:bg-white/80 backdrop-blur-sm"
              clearable
              hide-details
            >
              <template #prepend-inner>
                <div class="tw:relative">
                  <Icon icon="mdi:magnify" height="18" class="tw:text-primary tw:relative tw:z-10" />
                  <div class="tw:absolute tw:inset-0 tw:bg-primary tw:opacity-20 tw:blur-sm tw:rounded-full"></div>
                </div>
              </template>
            </VTextField>
          </v-toolbar>
          <div v-if="availableVisionaries.length === 0">
            <div class="d-flex flex-column align-center py-5">
              <Icon icon="mdi:user-remove" height="80" color="secondary" class="mb-1 icon-gray" />
              <p class="mb-3">No se encontraron participantes</p>
            </div>
          </div>
          <div v-else>
            <v-list>
              <v-list-item
                v-for="participant in availableParticipants"
                :key="participant.id"
                @click="toggleParticipantSelection(participant.user.id)"
                :disabled="participant.isInChart && getParticipantOwnerStaff(participant.user.id) !== selectedParentForParticipant"
                :class="{ 'bg-grey-lighten-4': participant.isInChart }"
              >
                <template v-slot:prepend>
                  <v-checkbox
                    :model-value="selectedParticipants.includes(participant.user.id)"
                    :disabled="participant.isInChart && getParticipantOwnerStaff(participant.user.id) !== selectedParentForParticipant"
                    readonly
                    hide-details
                  />
                </template>
                <v-list-item-title>{{ participant.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ participant.email }}</v-list-item-subtitle>
                <template v-slot:append v-if="participant.isInChart">
                  <v-chip color="secondary">En diagrama</v-chip>
                </template>
              </v-list-item>
            </v-list>
          </div>
        </v-card-text>

        <v-card-actions class="tw:border-t tw:border-gray-300 tw:sticky">
          <v-spacer />
          <v-btn color="error" variant="flat" @click="participantDialog = false"> Cancelar </v-btn>
          <v-btn color="primary" class="text-white" variant="flat" @click="acceptParticipants"> Aceptar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.zoom-controls {
  /* background: rgba(255, 255, 255, 0.9); */
  border-radius: 8px;
  padding: 4px;
}

.org-chart-container {
  width: 100%;
  overflow: auto;
  padding: 2rem 0;
}

.org-chart {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: fit-content;
  gap: 3rem;
  flex-wrap: nowrap;
  transform-origin: top center;
  transition: transform 0.3s ease;
}

.org-chart {
  cursor: grab;
}
.org-chart.grabbing {
  cursor: grabbing;
}

.org-level {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 20px;
  background-color: aliceblue;
}

.org-chart > .org-level {
  /*flex: 0 0 900px;*/
  min-width: 900px;
  margin-right: 1.5rem;
}

.org-node-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.org-node {
  background: white;
  border: 2px solid;
  border-radius: 12px;
  overflow: hidden;
  width: 280px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.org-node:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.participant-node {
  width: 260px;
}

.node-header {
  padding: 0.75rem 1rem;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  font-size: 0.875rem;
}

.node-role {
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.75rem;
}

.node-content {
  padding: 1rem;
}

.node-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.node-email {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  word-break: break-word;
}

/* Conectores */
.connector-vertical-modern {
  width: 3px;
  height: 3rem;
  background: linear-gradient(to bottom, #94a3b8, #cbd5e1);
  position: relative;
  border-radius: 2px;
}

.connector-arrow {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid #cbd5e1;
}

.connector-horizontal-modern {
  position: absolute;
  top: -1rem;
  height: 3px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 140px);
  max-width: 600px;
}

.connector-line {
  width: 100%;
  height: 3px;
  background: linear-gradient(to right, #cbd5e1, #94a3b8, #cbd5e1);
  border-radius: 2px;
}

.connector-branch {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
}

.connector-dot {
  width: 10px;
  height: 10px;
  background: white;
  border: 3px solid #94a3b8;
  border-radius: 50%;
  margin-top: -3.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.staff-level {
  width: 100%;
}

.staff-container {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  justify-content: flex-start;
  position: relative;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.staff-container > .org-node-wrapper {
  flex: 0 0 auto;
}

.participants-container {
  margin-top: 1rem;
  position: relative;
}

.participants-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  justify-items: start;
  width: 100%;
  max-width: 100%;
}

.participants-container .connector-horizontal-modern {
  width: calc(100% - 130px);
  max-width: 450px;
}

@media (max-width: 768px) {
  .org-node {
    width: 240px;
  }

  .participant-node {
    width: 100%;
  }

  .staff-container {
    gap: 2rem;
  }

  .participants-grid {
    gap: 1rem;
  }
}

.icon-gray {
  color: gray;
}
</style>
