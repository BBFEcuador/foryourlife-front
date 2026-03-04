<script setup lang="ts">
import profileBg from '@/assets/images/backgrounds/initlevel.jpg';
import type { Team } from '@/models/Participants';
import { getInitialsAvatarUrl } from '@/service/getAvatar';


interface props {
    team: Team;
};
const props = defineProps<props>();

</script>

<template>
    <v-card elevation="0" class="tw:overflow-hidden">
        <v-img :src="profileBg" alt="profile" class="w-100 h-40" />
        <div>
            <v-row class="mt-1">
                <v-col cols="12" lg="4" sm="12" class="order-sm-second">
                    <div class="px-4 py-1">
                        <v-row class="justify-center">
                            <v-col cols="6" class="d-flex flex-column align-center">
                                <Icon icon="fluent:people-team-16-filled" height="20"></Icon>
                                <h4 class="text-h4">{{ team?.name ?? 'N/A' }}</h4>
                                <h6 class="text-h6 font-weight-regular">Equipo</h6>
                            </v-col>
                            <v-col cols="6" class="d-flex flex-column align-center">
                                <Icon icon="token:lvl" height="20"></Icon>
                                <h4 class="text-h4" >{{ team?.trainer.name }}</h4>
                                <h6 class="text-h6 font-weight-regular">Entrenador</h6>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
                <v-col cols="12" lg="4" sm="12" class="d-flex justify-center order-sml-first">
                    <div class="text-center top-spacer">
                        <div class="avatar-border">
                            <v-avatar size="100" class="userImage">
                                <v-img :src="getInitialsAvatarUrl(team?.name!, 1)" alt="Avatar" />
                            </v-avatar>
                        </div>
                        <span class="textSecondary text-h4">
                            {{ team?.trainingData?.curseLevel }}
                        </span>
                    </div>
                </v-col>
                <v-col cols="12" lg="4" sm="12" class="order-sm-second">
                    <div class="px-4 py-1">
                        <v-row class="justify-center">
                            <v-col cols="6" class="d-flex flex-column align-center">
                                <Icon icon="fluent:people-team-16-filled" height="20"></Icon>
                                <h4 class="text-h4">{{ team?.users.length ?? 'N/A' }}</h4>
                                <h6 class="text-h6 font-weight-regular">Participante(s)</h6>
                            </v-col>
                            <v-col cols="6" class="d-flex flex-column align-center">
                                <Icon icon="token:lvl" height="20"></Icon>
                                <h4 class="text-h4" >{{ team?.trainingData?.name }}</h4>
                                <h6 class="text-h6 font-weight-regular">Entrenamiento</h6>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
            </v-row>
        </div>
    </v-card>
</template>

<style lang="scss">
.avatar-border {
    background-image: linear-gradient(rgb(80, 178, 252), rgb(244, 76, 102));
    border-radius: 50%;
    width: 110px;
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;

    .userImage {
        border: 4px solid rgb(255, 255, 255);
    }
}

.top-spacer {
    margin-top: -80px;
}

.profiletab .v-slide-group__content {
    justify-content: end;

    .v-btn--variant-text .v-btn__overlay {
        background: transparent;
    }
}

@media (max-width: 1023px) {
    .order-sm-second {
        order: 2;
    }

    .order-sml-first {
        order: 1;
    }

    .order-sm-third {
        order: 3;
    }

    .order-sm-last {
        order: 4;
    }
}

.btn-brand-facebook {
    background-color: rgb(24, 119, 242) !important;
}

.btn-brand-twitter {
    background-color: rgb(29, 161, 242) !important;
}

.btn-brand-dribbble {
    background-color: rgb(234, 76, 137) !important;
}

.btn-brand-youtube {
    background-color: rgb(205, 32, 31) !important;
}
</style>
