export type ProjectStatus = 'draft' | 'planned' | 'active' | 'on-hold' | 'completed' | 'delayed';
export type MilestoneStatus = 'pending' | 'in-progress' | 'completed';

export interface Milestone {
  id: number;
  title: string;
  dueDate: string;
  status: MilestoneStatus;
  budgetImpact: number;
  dependencies: number[];
  responsible: string;
}

export interface ProjectManagement {
  id: number;
  name: string;
  client: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  progress: number;
  budget: number;
  milestones: Milestone[];
  dependencies: number[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  name: string;
  client: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  budget: number;
}

export interface MilestonePayload {
  title: string;
  dueDate: string;
  status: MilestoneStatus;
  budgetImpact: number;
  dependencies: number[];
  responsible: string;
}
