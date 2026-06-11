import { defineStore } from 'pinia';
import { ResourcePlanningApi } from '../infrastructure/resource-planning-api';
import { ResourcePlanningAssembler } from '../infrastructure/resource-planning.assembler';

export const useResourcePlanningStore = defineStore('resource-planning', {
    state: () => ({
        plans: [],
        loading: false
    }),
    actions: {
        async fetchPlans() {
            this.loading = true;
            const data = await ResourcePlanningApi.getAll();
            this.plans = data.map(ResourcePlanningAssembler.toDomain);
            this.loading = false;
        }
    }
});