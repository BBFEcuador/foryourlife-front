<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { VueFlow, useVueFlow, Position, type Node, type Edge, type Connection, Panel } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import dagre from 'dagre';
import { Icon } from '@iconify/vue';
import { toast } from 'vue3-toastify';
import type { Team } from '@/models/Participants';
import type { OrgNode, OrgChartPayload } from '@/models/OrganizationalChart';
import useOrganizationalChartByTraining from '@/composables/admin/organizational/useOrganizationalChartByTraining';
import useOrganizationalChartMutations from '@/composables/admin/organizational/useOrganizationalChartMutations';
import { getDicebearAvatarUrl, getInitialsAvatarUrl } from '@/service/getAvatar';
import OrgChartNode from './OrgChartNode.vue';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/minimap/dist/style.css';
import Swal from 'sweetalert2';
import type { AxiosError } from 'axios';
import type { ErrorApiResponse } from '@/models/ApiResponse';
import { isValidHierarchy } from '@/utils/orgChartValidation';

interface Props {
  team: Team;
  isTeamLoading: boolean;
  isTeamError: boolean;
  isForEdit: boolean;
}

const props = defineProps<Props>();
const { saveOrganizationalChartMutations, updateOrganizationalChartMutations } = useOrganizationalChartMutations();
const organizationalChart = useOrganizationalChartByTraining(props.team?.training?.id || '');

// Vue Flow State
const { findNode, addEdges, addNodes, project, vueFlowRef, onConnect, removeNodes, removeEdges } = useVueFlow();
const nodes = ref<Node[]>([]);
const edges = ref<Edge[]>([]);

// Sidebar State
const activeTab = ref('');
const searchQuery = ref('');

const courseLevel = computed(() => props.team.training?.courseLevel?.toUpperCase() || '');

const showVisionary = computed(() => courseLevel.value === 'FOCUS');
const showStaff = computed(() => courseLevel.value === 'FOCUS' || courseLevel.value === 'YOUR');
const showMasterLife = computed(() => courseLevel.value === 'LIFE');
const showParticipant = computed(() => true);

watch(() => courseLevel.value, () => {
  if (showVisionary.value) activeTab.value = 'visionary';
  else if (showStaff.value) activeTab.value = 'staff';
  else if (showMasterLife.value) activeTab.value = 'masterlife';
  else activeTab.value = 'participant';
}, { immediate: true });
const draggedItem = ref<any>(null);

// Computed properties for Sidebar Lists
const availableVisionaries = computed(() => filterMembers(props.team.visionaries || [], 'VISIONARY'));
const availableStaffs = computed(() => filterMembers(props.team.staffs || [], 'STAFF'));
const availableParticipants = computed(() => filterMembers(props.team.users || [], 'PARTICIPANT'));
const availableMasterLifes = computed(() => {
  // MasterLife usually comes from props.team.masterLife (array)
  // Adjust based on actual data structure in Team interface
  return filterMembers(props.team.masterLife || [], 'MASTERLIFE');
});

// Helper to filter and map members
const filterMembers = (list: any[], role: string) => {
  const query = searchQuery.value.toLowerCase();
  const currentNodes = nodes.value; // Reactive dependency
  return list
    .filter((item) => {
      const name = item.user?.name?.toLowerCase() || '';
      const email = item.user?.email?.toLowerCase() || '';
      return name.includes(query) || email.includes(query);
    })
    .map((item) => ({
      id: item.user.id,
      name: item.user.name,
      email: item.user.email,
      role: role,
      avatar: getDicebearAvatarUrl(item.user.name), // or item.user.photo
      isInGraph: currentNodes.some(n => n.id === item.user.id),
      original: item
    }));
};

// Colors for roles
const getRoleColor = (role: string) => {
  switch (role) {
    case 'VISIONARY': return '#8b5cf6'; // Purple
    case 'STAFF': return '#3b82f6'; // Blue
    case 'PARTICIPANT': return '#10b981'; // Green
    case 'MASTERLIFE': return '#f59e0b'; // Amber
    default: return '#64748b';
  }
};

// Drag & Drop Handlers
const onDragStart = (event: DragEvent, item: any) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', JSON.stringify(item));
    event.dataTransfer.effectAllowed = 'move';
  }
  draggedItem.value = item;
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
};

const onDrop = (event: DragEvent) => {
  event.preventDefault();
  const dataStr = event.dataTransfer?.getData('application/vueflow');
  if (!dataStr) return;

  const item = JSON.parse(dataStr);

  // Check if node already exists
  if (findNode(item.id)) {
    toast.warning(`${item.name} ya está en el organigrama.`);
    return;
  }

  // Get position
  const { left, top } = vueFlowRef.value?.getBoundingClientRect() || { left: 0, top: 0 };
  const position = project({
    x: event.clientX - left,
    y: event.clientY - top,
  });

  // Add Node
  const newNode: Node = {
    id: item.id,
    type: 'custom',
    position,
    data: {
      label: item.name,
      email: item.email,
      role: item.role,
      avatar: item.avatar,
      color: getRoleColor(item.role),
      isRoot: item.role === 'VISIONARY' || item.role === 'MASTERLIFE',
      id: item.id, // Inject ID for reference
    },
  };

  addNodes([newNode]);

  // Auto-connect logic? 
  // For now, let user connect manually or use "Auto Layout" to organize
};

// Recursive function to find all descendants
const getDescendants = (nodeId: string): string[] => {
  const descendants: string[] = [];
  const stack = [nodeId];

  while (stack.length > 0) {
    const currentId = stack.pop()!;
    const childrenEdges = edges.value.filter(e => e.source === currentId);
    
    childrenEdges.forEach(edge => {
      if (!descendants.includes(edge.target)) {
        descendants.push(edge.target);
        stack.push(edge.target);
      }
    });
  }
  return descendants;
};

// Remove Node Logic
const removeNodeHandler = (nodeData: any) => {
  Swal.fire({
    title: '¿Eliminar miembro?',
    text: `Se eliminará a ${nodeData.label} y a todos sus subordinados del organigrama.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
  }).then((result) => {
    if (result.isConfirmed) {
      const descendants = getDescendants(nodeData.id);
      const nodesToRemove = [nodeData.id, ...descendants];
      
      removeNodes(nodesToRemove);
      toast.success(`${nodeData.label} y sus subordinados eliminados.`);
    }
  });
};

// Batch Add Logic
const showBatchDialog = ref(false);
const parentNodeForBatch = ref<any>(null);
const batchSearchQuery = ref('');
const selectedMembersForBatch = ref<string[]>([]);

const availableBatchMembers = computed(() => {
  if (!parentNodeForBatch.value) return [];
  const role = parentNodeForBatch.value.role;
  let rawList: any[] = [];
  let targetRole = '';

  if (role === 'VISIONARY') {
    rawList = props.team.staffs || [];
    targetRole = 'STAFF';
  } else if (role === 'STAFF') {
    rawList = props.team.users || [];
    targetRole = 'PARTICIPANT';
  } else if (role === 'MASTERLIFE') {
    rawList = props.team.users || [];
    targetRole = 'PARTICIPANT';
  }

  const query = batchSearchQuery.value.toLowerCase();

  return rawList
    .filter(item => {
      const name = item.user?.name?.toLowerCase() || '';
      const email = item.user?.email?.toLowerCase() || '';
      const matchesQuery = name.includes(query) || email.includes(query);
      const id = item.user?.id;
      // Check if already in graph
      const notInGraph = !findNode(id);
      return matchesQuery && notInGraph;
    })
    .map(item => ({
      id: item.user.id,
      name: item.user.name,
      email: item.user.email,
      role: targetRole,
      avatar: getDicebearAvatarUrl(item.user.name),
      original: item
    }));
});

const openBatchDialog = (nodeData: any) => {
  parentNodeForBatch.value = nodeData;
  selectedMembersForBatch.value = [];
  batchSearchQuery.value = '';
  showBatchDialog.value = true;
};

const addBatchMembers = () => {
  if (!parentNodeForBatch.value || selectedMembersForBatch.value.length === 0) return;

  const membersToAdd = availableBatchMembers.value.filter(m => selectedMembersForBatch.value.includes(m.id));

  // Using current nodes value length or unique ID generation strategy if needed
  // But we use member ID as node ID so it's fine.

  const newNodes: Node[] = [];
  const newEdges: Edge[] = [];

  membersToAdd.forEach(item => {
    // Create Node
    const newNode: Node = {
      id: item.id,
      type: 'custom',
      position: { x: 0, y: 0 }, // Will be fixed by layout
      data: {
        label: item.name,
        email: item.email,
        role: item.role,
        avatar: item.avatar,
        color: getRoleColor(item.role),
        isRoot: false,
        id: item.id
      },
    };
    newNodes.push(newNode);

    // Create Edge
    newEdges.push({
      id: `e-${parentNodeForBatch.value.id}-${item.id}`,
      source: parentNodeForBatch.value.id,
      target: item.id,
      type: 'smoothstep',
      animated: true,
    });
  });

  addNodes(newNodes);
  addEdges(newEdges);

  showBatchDialog.value = false;
  toast.success(`${newNodes.length} miembros agregados correctamente.`);

  nextTick(() => {
    layoutGraph();
  });
};

const selectAllBatchMembers = () => {
  if (selectedMembersForBatch.value.length === availableBatchMembers.value.length) {
    selectedMembersForBatch.value = [];
  } else {
    selectedMembersForBatch.value = availableBatchMembers.value.map(m => m.id);
  }
};

// Swap Logic
const showSwapDialog = ref(false);
const nodeToSwap = ref<any>(null);
const swapSearchQuery = ref('');
const selectedSwapMemberId = ref<string | null>(null);

const availableSwapMembers = computed(() => {
  if (!nodeToSwap.value) return [];

  const role = nodeToSwap.value.role;
  let rawList: any[] = [];

  // Determine source list based on role
  if (role === 'VISIONARY') rawList = props.team.visionaries || [];
  else if (role === 'STAFF') rawList = props.team.staffs || [];
  else if (role === 'MASTERLIFE') rawList = props.team.masterLife || [];
  else if (role === 'PARTICIPANT') rawList = props.team.users || [];

  const query = swapSearchQuery.value.toLowerCase();
  const currentNodes = nodes.value;

  return rawList
    .filter(item => {
      const name = item.user?.name?.toLowerCase() || '';
      const email = item.user?.email?.toLowerCase() || '';
      const isInGraph = currentNodes.some(n => n.id === item.user.id);
      return (name.includes(query) || email.includes(query)) && !isInGraph;
    })
    .map(item => ({
      id: item.user.id,
      name: item.user.name,
      email: item.user.email,
      role: role,
      avatar: getDicebearAvatarUrl(item.user.name),
      original: item
    }));
});

const openSwapDialog = (nodeData: any) => {
  nodeToSwap.value = nodeData;
  selectedSwapMemberId.value = null;
  swapSearchQuery.value = '';
  showSwapDialog.value = true;
};

const performSwap = () => {
  if (!nodeToSwap.value || !selectedSwapMemberId.value) return;

  const newMember = availableSwapMembers.value.find(m => m.id === selectedSwapMemberId.value);
  if (!newMember) return;

  const oldNodeId = nodeToSwap.value.id;
  const oldNode = findNode(oldNodeId);

  if (!oldNode) {
    toast.error('No se encontró el nodo original');
    return;
  }

  // Get connected edges
  const connectedEdges = edges.value.filter(e => e.source === oldNodeId || e.target === oldNodeId);

  // Remove old node (edges are removed automatically by VueFlow usually, but we need them for reconstruction)
  removeNodes([oldNodeId]);

  // Create new node
  const newNode: Node = {
    id: newMember.id,
    type: 'custom',
    position: oldNode.position,
    data: {
      ...oldNode.data,
      id: newMember.id,
      label: newMember.name,
      email: newMember.email,
      avatar: newMember.avatar,
      role: newMember.role,
      color: getRoleColor(newMember.role),
    }
  };

  // Recreate edges pointing to new node
  const newEdges = connectedEdges.map(e => ({
    ...e,
    id: `e-${e.source === oldNodeId ? newMember.id : e.source}-${e.target === oldNodeId ? newMember.id : e.target}`,
    source: e.source === oldNodeId ? newMember.id : e.source,
    target: e.target === oldNodeId ? newMember.id : e.target,
  }));

  addNodes([newNode]);
  addEdges(newEdges);

  showSwapDialog.value = false;
  toast.success(`Intercambio realizado: ${nodeToSwap.value.label} -> ${newMember.name}`);
};

// Layout Logic (Dagre)
const layoutGraph = (direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setGraph({ rankdir: direction, ranksep: 100, nodesep: 80 });
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Add nodes to dagre
  nodes.value.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 220, height: 120 }); // Approx dimensions of OrgChartNode
  });

  // Add edges to dagre
  edges.value.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // Apply positions
  nodes.value = nodes.value.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: { x: nodeWithPosition.x - 110, y: nodeWithPosition.y - 60 }, // Center anchor
    };
  });
};

// Validation Logic
const isValidConnection = (connection: Connection | Edge) => {
  const sourceNode = findNode(connection.source);
  const targetNode = findNode(connection.target);

  if (!sourceNode || !targetNode) return false;
  
  // Prevent self-connection
  if (connection.source === connection.target) return false;

  // Rule: Hierarchy check
  if (!isValidHierarchy(sourceNode.data.role, targetNode.data.role)) return false;

  // Rule: Single Parent Check (Indegree <= 1)
  // A participant or staff can only belong to a single entity (one parent)
  // Check if target already has an incoming edge from a different source
  const existingIncomingEdge = edges.value.find(e => 
    e.target === connection.target && 
    e.id !== (connection as Edge).id // Ignore if we are re-validating the same edge object
  );

  if (existingIncomingEdge) {
    // If the new connection is just "updating" the existing one (same source), it's fine (though unlikely in this context)
    // If source is different, it's a violation of single parent rule
    if (existingIncomingEdge.source !== connection.source) {
      return false;
    }
  }

  return true;
};

// Validate and Fix Graph (Migration)
const validateAndFixGraph = () => {
  let edgesToRemove: string[] = [];
  
  // 1. Check Hierarchy Rules
  const invalidHierarchyEdges = edges.value.filter(edge => {
      const sourceNode = findNode(edge.source);
      const targetNode = findNode(edge.target);
      if (!sourceNode || !targetNode) return true; // Remove broken edges
      return !isValidHierarchy(sourceNode.data.role, targetNode.data.role);
  });

  if (invalidHierarchyEdges.length > 0) {
      invalidHierarchyEdges.forEach(edge => {
        const source = findNode(edge.source);
        const target = findNode(edge.target);
        if (source && target) {
            console.warn(`[Auditoría] Jerarquía inválida eliminada: ${source.data.role} -> ${target.data.role}`);
        }
      });
      edgesToRemove = [...edgesToRemove, ...invalidHierarchyEdges.map(e => e.id)];
  }

  // 2. Check Single Parent Rule (Indegree <= 1)
  // Map targetId -> edgeId[]
  const incomingEdgesMap = new Map<string, Edge[]>();
  edges.value.forEach(edge => {
      if (edgesToRemove.includes(edge.id)) return; // Skip already marked for removal
      const target = edge.target;
      if (!incomingEdgesMap.has(target)) {
          incomingEdgesMap.set(target, []);
      }
      incomingEdgesMap.get(target)!.push(edge);
  });

  incomingEdgesMap.forEach((incomingEdges, targetId) => {
      if (incomingEdges.length > 1) {
          // Keep the first one, remove others
          // Ideally we might want to keep the one that matches the current context or random
          // For now, keep the first one encountered in the list (index 0)
          const edgesToDelete = incomingEdges.slice(1);
          edgesToDelete.forEach(edge => {
              const source = findNode(edge.source);
              const target = findNode(edge.target);
               if (source && target) {
                  console.warn(`[Auditoría] Múltiples padres detectados. Eliminando conexión extra: ${source.data.label} -> ${target.data.label}`);
              }
          });
          edgesToRemove = [...edgesToRemove, ...edgesToDelete.map(e => e.id)];
      }
  });
  
  if (edgesToRemove.length > 0) {
    removeEdges(edgesToRemove);
    toast.warning(`Se eliminaron ${edgesToRemove.length} conexiones inválidas (Jerarquía o Múltiples Padres).`);
  }
};

// Initialize from existing data
const initializeGraph = () => {
  if (!organizationalChart.data.value?.OrganizationChart?.nodes) return;

  const apiNodes = organizationalChart.data.value.OrganizationChart.nodes;
  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];

  // Helper to process nodes recursively
  const processNode = (node: OrgNode, parentId: string | null = null) => {
    // Add Node
    if (!initialNodes.find(n => n.id === node.members.id)) {
      initialNodes.push({
        id: node.members.id,
        type: 'custom',
        position: { x: 0, y: 0 }, // Will be set by layout
        data: {
          label: node.members.name,
          email: node.members.email,
          role: node.level,
          avatar: getDicebearAvatarUrl(node.members.name),
          color: getRoleColor(node.level),
          id: node.members.id,
        }
      });
    }

    // Add Edge
    if (parentId) {
      initialEdges.push({
        id: `e-${parentId}-${node.members.id}`,
        source: parentId,
        target: node.members.id,
        type: 'smoothstep',
        animated: true,
      });
    }

    // Process Children
    if (node.children) {
      node.children.forEach(child => processNode(child, node.members.id));
    }
  };

  apiNodes.forEach((root: OrgNode) => processNode(root));

  nodes.value = initialNodes;
  edges.value = initialEdges;

  nextTick(() => {
    layoutGraph();
    validateAndFixGraph(); // Validate loaded data
  });
};

watch(() => organizationalChart.data.value, initializeGraph, { immediate: true });

// Handle Connections
onConnect((params) => {
  const sourceNode = findNode(params.source);
  const targetNode = findNode(params.target);
  
  // Custom check for specific error messages
  if (sourceNode && targetNode) {
     if (params.source === params.target) {
         toast.error('No se permiten autoconexiones.');
         return;
     }
     
     if (!isValidHierarchy(sourceNode.data.role, targetNode.data.role)) {
         toast.error(`Jerarquía no permitida: ${sourceNode.data.role} no puede conectar con ${targetNode.data.role}`);
         return;
     }

     const existingIncomingEdge = edges.value.find(e => e.target === params.target);
     if (existingIncomingEdge) {
         const existingParent = findNode(existingIncomingEdge.source);
         toast.error(`${targetNode.data.label} ya pertenece a ${existingParent?.data.label || 'otra entidad'}.`);
         return;
     }
  }

  if (isValidConnection(params)) {
    addEdges([{ ...params, type: 'smoothstep', animated: true }]);
  } else {
    // Fallback generic error if isValidConnection fails but above checks passed (unlikely)
    toast.error('Conexión no permitida.');
  }
});

// Save Logic
const saveOrgChart = async () => {
  // We need to reconstruct the hierarchical payload from the graph
  // 1. Identify Roots (Nodes with no incoming edges)
  const incomingEdges = new Set(edges.value.map(e => e.target));
  const rootNodes = nodes.value.filter(n => !incomingEdges.has(n.id));

  const payload: OrgChartPayload = {
    id: null,
    teamId: props.team.id,
    masterLifes: [],
    visionaries: [],
    staff: []
  };

  // Helper to find children of a node
  const getChildren = (parentId: string) => {
    const childrenIds = edges.value.filter(e => e.source === parentId).map(e => e.target);
    return nodes.value.filter(n => childrenIds.includes(n.id));
  };

  // Process Roots
  for (const root of rootNodes) {
    if (root.data.role === 'VISIONARY') {
      const staffChildren = getChildren(root.id);
      const staffList = staffChildren.map(s => {
        const participants = getChildren(s.id);
        return {
          userId: s.id,
          participantsIds: participants.map(p => p.id)
        };
      });
      payload.visionaries.push({
        userId: root.id,
        staff: staffList
      });
    } else if (root.data.role === 'MASTERLIFE') {
      const participants = getChildren(root.id);
      payload.masterLifes.push({
        userId: root.id,
        participantsIds: participants.map(p => p.id)
      });
    } else if (root.data.role === 'STAFF') {
      // Root Staff
      const participants = getChildren(root.id);
      payload.staff.push({
        userId: root.id,
        participantsIds: participants.map(p => p.id)
      });
    }
  }

  // Handle errors / Validation?
  // E.g. Participants at root level? (Should not happen ideally, or ignore)

  try {
    if (organizationalChart.data.value?.OrganizationChart?.id) {
      payload.id = organizationalChart.data.value.OrganizationChart.id;
      await updateOrganizationalChartMutations.mutateAsync(payload);
      toast.success('Organigrama actualizado correctamente');
    } else {
      await saveOrganizationalChartMutations.mutateAsync(payload);
      toast.success('Organigrama guardado correctamente');
    }
  } catch (e) {
    console.error(e);
    toast.error((e as AxiosError<ErrorApiResponse>).response?.data?.message || 'Error al guardar el organigrama');
  }
};

const clearGraph = () => {
  Swal.fire({
    title: '¿Estás seguro de limpiar todo el organigrama?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, limpiar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      nodes.value = [];
      edges.value = [];
    }
  });
};

const fitView = () => {
  // VueFlow exposes fitView via useVueFlow, but we can also use the ref if needed
  // useVueFlow handles it
  const { fitView } = useVueFlow();
  fitView();
};

</script>

<template>
  <v-card class="h-100 d-flex flex-column rounded-lg overflow-hidden">
    <v-row no-gutters class="h-100">
      <!-- Sidebar -->
      <v-col cols="12" md="3" class="border-e bg-grey-lighten-5 d-flex flex-column h-100">
        <div class="pa-4 border-b bg-white">
          <h2 class="text-h6 font-weight-bold mb-2">Miembros</h2>
          <v-text-field v-model="searchQuery" placeholder="Buscar..." density="compact" variant="outlined" hide-details>
            <template #prepend-inner>
              <Icon icon="mdi:magnify"></Icon>
            </template>
          </v-text-field>
        </div>

        <v-tabs v-model="activeTab" density="compact" grow color="primary" class="border-b bg-white">
          <v-tab v-if="showVisionary" value="visionary" class="text-caption">Visionarios</v-tab>
          <v-tab v-if="showStaff" value="staff" class="text-caption">Staff</v-tab>
          <v-tab v-if="showMasterLife" value="masterlife" class="text-caption">Master</v-tab>
          <v-tab v-if="showParticipant" value="participant" class="text-caption">Partic.</v-tab>
        </v-tabs>

        <v-window v-model="activeTab" class="flex-grow-1 overflow-y-auto">
          <!-- Visionaries List -->
          <v-window-item value="visionary" class="h-100">
            <v-list lines="two" class="bg-transparent pa-2">
              <v-list-item v-for="item in availableVisionaries" :key="item.id" :draggable="!item.isInGraph"
                @dragstart="!item.isInGraph && onDragStart($event, item)"
                class="mb-2 rounded border bg-white elevation-1"
                :class="{ 'opacity-50 bg-grey-lighten-4': item.isInGraph, 'cursor-move': !item.isInGraph }">
                <template v-slot:prepend>
                  <v-avatar size="40">
                    <v-img :src="item.avatar" cover></v-img>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-bold">{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.email }}</v-list-item-subtitle>
                <template v-slot:append>
                  <Icon v-if="!item.isInGraph" icon="mdi:drag" class="text-grey" />
                  <v-chip v-else size="x-small" color="success" variant="flat" class="font-weight-bold">En uso</v-chip>
                </template>
              </v-list-item>
              <div v-if="availableVisionaries.length === 0" class="text-center pa-4 text-grey">
                No hay visionarios disponibles
              </div>
            </v-list>
          </v-window-item>

          <!-- Staff List -->
          <v-window-item value="staff" class="h-100">
            <v-list lines="two" class="bg-transparent pa-2">
              <v-list-item v-for="item in availableStaffs" :key="item.id" :draggable="!item.isInGraph"
                @dragstart="!item.isInGraph && onDragStart($event, item)"
                class="mb-2 rounded border bg-white elevation-1"
                :class="{ 'opacity-50 bg-grey-lighten-4': item.isInGraph, 'cursor-move': !item.isInGraph }">
                <template v-slot:prepend>
                  <v-avatar size="40">
                    <v-img :src="item.avatar" cover></v-img>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-bold">{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.email }}</v-list-item-subtitle>
                <template v-slot:append>
                  <Icon v-if="!item.isInGraph" icon="mdi:drag" class="text-grey" />
                  <v-chip v-else size="x-small" color="success" variant="flat" class="font-weight-bold">En uso</v-chip>
                </template>
              </v-list-item>
              <div v-if="availableStaffs.length === 0" class="text-center pa-4 text-grey">
                No hay staff disponible
              </div>
            </v-list>
          </v-window-item>

          <!-- MasterLife List -->
          <v-window-item value="masterlife" class="h-100">
            <v-list lines="two" class="bg-transparent pa-2">
              <v-list-item v-for="item in availableMasterLifes" :key="item.id" :draggable="!item.isInGraph"
                @dragstart="!item.isInGraph && onDragStart($event, item)"
                class="mb-2 rounded border bg-white elevation-1"
                :class="{ 'opacity-50 bg-grey-lighten-4': item.isInGraph, 'cursor-move': !item.isInGraph }">
                <template v-slot:prepend>
                  <v-avatar size="40">
                    <v-img :src="item.avatar" cover></v-img>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-bold">{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.email }}</v-list-item-subtitle>
                <template v-slot:append>
                  <Icon v-if="!item.isInGraph" icon="mdi:drag" class="text-grey" />
                  <v-chip v-else size="x-small" color="success" variant="flat" class="font-weight-bold">En uso</v-chip>
                </template>
              </v-list-item>
              <div v-if="availableMasterLifes.length === 0" class="text-center pa-4 text-grey">
                No hay MasterLife disponible
              </div>
            </v-list>
          </v-window-item>

          <!-- Participants List -->
          <v-window-item value="participant" class="h-100">
            <v-list lines="two" class="bg-transparent pa-2">
              <v-list-item v-for="item in availableParticipants" :key="item.id" :draggable="!item.isInGraph"
                @dragstart="!item.isInGraph && onDragStart($event, item)"
                class="mb-2 rounded border bg-white elevation-1"
                :class="{ 'opacity-50 bg-grey-lighten-4': item.isInGraph, 'cursor-move': !item.isInGraph }">
                <template v-slot:prepend>
                  <v-avatar size="40">
                    <v-img :src="item.avatar" cover></v-img>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-bold">{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.email }}</v-list-item-subtitle>
                <template v-slot:append>
                  <Icon v-if="!item.isInGraph" icon="mdi:drag" class="text-grey" />
                  <v-chip v-else size="x-small" color="success" variant="flat" class="font-weight-bold">En uso</v-chip>
                </template>
              </v-list-item>
              <div v-if="availableParticipants.length === 0" class="text-center pa-4 text-grey">
                No hay participantes disponibles
              </div>
            </v-list>
          </v-window-item>
        </v-window>

        <!-- Legend/Instructions Panel (Moved to Sidebar Bottom) -->
        <div class="pa-4 border-t">
            <div class="d-flex align-center justify-space-between mb-2">
                <span class="font-weight-bold text-subtitle-2">Leyenda</span>
                <Icon icon="mdi:help-circle-outline" size="small" color="grey"></Icon>
            </div>
            <v-divider class="mb-2"></v-divider>
            
            <div class="d-flex align-center mb-2">
                <v-btn icon size="x-small" variant="text" color="error" class="mr-2">
                    <Icon icon="mdi:close" height="25" />
                </v-btn>
                <span class="text-caption">Eliminar miembro (y sus conexiones)</span>
            </div>

            <div class="d-flex align-center mb-2">
                  <v-btn icon size="x-small" variant="text" color="warning" class="mr-2">
                    <Icon icon="mdi:account-switch" height="25" />
                </v-btn>
                <span class="text-caption">Intercambiar miembro (mantiene jerarquía)</span>
            </div>

            <div class="d-flex align-center mb-2">
                  <v-btn icon size="x-small" variant="flat" class="text-primary mr-2">
                    <Icon icon="mdi:plus" height="25" />
                </v-btn>
                <span class="text-caption">Agregar subordinados (lote)</span>
            </div>

            <div class="text-caption text-grey mt-2 font-italic">
                * Arrastra desde el panel izquierdo para agregar nuevos miembros.
            </div>
        </div>
      </v-col>

      <!-- Main Canvas -->
      <v-col cols="12" md="9" class="h-100 position-relative bg-slate-50">
        <div class="d-flex align-center justify-space-between px-4 py-2 bg-white border-b"
          style="z-index: 10; position: relative;">
          <div class="d-flex align-center tw:gap-2">
            <h3 class="text-subtitle-1 font-weight-bold">Organigrama</h3>
            <v-chip size="small" color="info" variant="tonal">Arrastra y suelta miembros</v-chip>
          </div>
          <div class="d-flex gap-2">
            <v-btn color="secondary" variant="text" size="small" prepend-icon="mdi:refresh" @click="layoutGraph('TB')">
              Auto-Layout
            </v-btn>
            <v-btn color="error" variant="text" size="small" prepend-icon="mdi:delete-outline" @click="clearGraph">
              Limpiar
            </v-btn>
            <v-btn color="primary" size="small" @click="saveOrgChart"
              :loading="updateOrganizationalChartMutations.isPending.value || saveOrganizationalChartMutations.isPending.value">
              <Icon icon="mdi:content-save" class="mr-2" height="20" />
              Guardar
            </v-btn>
          </div>
        </div>

        <div class="w-100 h-100" @drop="onDrop" @dragover="onDragOver">
          <VueFlow v-model:nodes="nodes" v-model:edges="edges" :default-viewport="{ zoom: 1 }" :min-zoom="0.2"
            :max-zoom="4" fit-view-on-init :is-valid-connection="isValidConnection">
            <template #node-custom="props">
              <OrgChartNode :data="props.data" @add-children="openBatchDialog" @remove-node="removeNodeHandler"
                @swap-node="openSwapDialog" />
            </template>

            <Background pattern-color="#aaa" :gap="16" />

            <Controls />

            <MiniMap />
          </VueFlow>
        </div>
      </v-col>
    </v-row>

    <!-- Batch Add Dialog -->
    <v-dialog v-model="showBatchDialog" max-width="500px" scrollable>
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between text-h6 font-weight-bold">
          Agregar Miembros
          <v-btn icon="mdi:close" variant="text" size="small" @click="showBatchDialog = false"></v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="max-height: 400px;">
          <div class="mb-4">
            <v-text-field v-model="batchSearchQuery" prepend-inner-icon="mdi:magnify" label="Buscar miembro..."
              variant="outlined" density="compact" hide-details></v-text-field>
          </div>

          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-caption text-grey">Seleccionados: {{ selectedMembersForBatch.length }}</span>
            <div>
              <v-btn
                v-if="availableBatchMembers.length > 0 && selectedMembersForBatch.length < availableBatchMembers.length"
                variant="text" size="x-small" color="primary" class="mr-2" @click="selectAllBatchMembers">Seleccionar
                todos</v-btn>
              <v-btn v-if="selectedMembersForBatch.length > 0" variant="text" size="x-small" color="error"
                @click="selectedMembersForBatch = []">Limpiar</v-btn>
            </div>
          </div>

          <v-list v-if="availableBatchMembers.length > 0" lines="one" select-strategy="classic" class="border rounded">
            <v-list-item v-for="member in availableBatchMembers" :key="member.id" :value="member.id" @click="selectedMembersForBatch.includes(member.id)
              ? selectedMembersForBatch = selectedMembersForBatch.filter(id => id !== member.id)
              : selectedMembersForBatch.push(member.id)">
              <template v-slot:prepend>
                <v-checkbox-btn :model-value="selectedMembersForBatch.includes(member.id)" @click.stop
                  @update:model-value="selectedMembersForBatch.includes(member.id)
                    ? selectedMembersForBatch = selectedMembersForBatch.filter(id => id !== member.id)
                    : selectedMembersForBatch.push(member.id)"></v-checkbox-btn>
              </template>
              <v-list-item-title class="font-weight-medium">{{ member.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ member.email }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <div v-else class="text-center pa-8 text-grey bg-grey-lighten-5 rounded border border-dashed">
            <Icon icon="mdi:account-off-outline" width="40" class="mb-2 opacity-50" />
            <div>No hay miembros disponibles para agregar en este nivel.</div>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="showBatchDialog = false">Cancelar</v-btn>
          <v-btn color="primary" variant="elevated" @click="addBatchMembers"
            :disabled="selectedMembersForBatch.length === 0" prepend-icon="mdi:plus">
            Agregar ({{ selectedMembersForBatch.length }})
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Swap Dialog -->
    <v-dialog v-model="showSwapDialog" max-width="500px" scrollable>
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between text-h6 font-weight-bold">
          Intercambiar {{ nodeToSwap?.role }}
          <v-btn icon="mdi:close" variant="text" size="small" @click="showSwapDialog = false"></v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="max-height: 400px;">
          <div class="mb-4">
            <v-text-field v-model="swapSearchQuery" prepend-inner-icon="mdi:magnify" label="Buscar miembro..."
              variant="outlined" density="compact" hide-details></v-text-field>
          </div>

          <v-list v-if="availableSwapMembers.length > 0" lines="one" select-strategy="single-leaf"
            class="border rounded">
            <v-list-item v-for="member in availableSwapMembers" :key="member.id" :value="member.id"
              @click="selectedSwapMemberId = member.id" :active="selectedSwapMemberId === member.id" color="warning"
              class="mb-1">
              <template v-slot:prepend>
                <v-avatar size="32">
                  <v-img :src="member.avatar" cover></v-img>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-medium">{{ member.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ member.email }}</v-list-item-subtitle>
              <template v-slot:append>
                <Icon v-if="selectedSwapMemberId === member.id" icon="mdi:check-circle" class="text-warning" />
              </template>
            </v-list-item>
          </v-list>
          <div v-else class="text-center pa-8 text-grey bg-grey-lighten-5 rounded border border-dashed">
            <Icon icon="mdi:account-off-outline" width="40" class="mb-2 opacity-50" />
            <div>No hay miembros disponibles para intercambio.</div>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="showSwapDialog = false">Cancelar</v-btn>
          <v-btn color="warning" variant="elevated" @click="performSwap" :disabled="!selectedSwapMemberId"
            prepend-icon="mdi:account-switch">
            Intercambiar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<style scoped>
.cursor-move {
  cursor: move;
}
</style>