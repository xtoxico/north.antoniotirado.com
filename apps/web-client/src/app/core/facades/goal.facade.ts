import { Injectable, inject, signal } from '@angular/core';
import { GoalApiService } from '../services/goal-api.service';
import { Goal } from '@north/shared-types';

@Injectable({
    providedIn: 'root'
})
export class GoalFacade {
    private goalApiService = inject(GoalApiService);

    // State Signals
    goals = signal<Goal[]>([]);
    selectedGoal = signal<Goal | null>(null);
    isLoading = signal<boolean>(false);
    error = signal<string | null>(null);

    loadGoals(): void {
        this.isLoading.set(true);
        this.error.set(null);

        this.goalApiService.getGoals().subscribe({
            next: (data) => {
                this.goals.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading goals', err);
                this.error.set('Failed to load goals.');
                this.isLoading.set(false);
            }
        });
    }

    performAction(goalId: string): void {
        this.goalApiService.registerEntry(goalId).subscribe({
            next: () => {
                this.loadGoals();
            },
            error: (err) => {
                console.error('Error performing action', err);
                alert('Action failed');
            }
        });
    }

    loadGoal(goalId: string): void {
        this.isLoading.set(true);
        this.error.set(null);
        this.goalApiService.getGoal(goalId).subscribe({
            next: (data) => {
                this.selectedGoal.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading goal', err);
                this.error.set('Failed to load goal.');
                this.isLoading.set(false);
            }
        });
    }

    toggleMilestone(goalId: string, milestoneId: string, isCompleted: boolean): void {
        const currentGoals = this.goals();
        
        const goalIndex = currentGoals.findIndex(g => g.id === goalId);
        if (goalIndex === -1) return;

        const updatedGoal = { ...currentGoals[goalIndex] };
        if (!updatedGoal.milestones) return;

        const milestoneIndex = updatedGoal.milestones.findIndex(m => m.id === milestoneId);
        if (milestoneIndex === -1) return;

        const updatedMilestones = [...updatedGoal.milestones];
        updatedMilestones[milestoneIndex] = { ...updatedMilestones[milestoneIndex], isCompleted };
        updatedGoal.milestones = updatedMilestones;

        const completedCount = updatedMilestones.filter(m => m.isCompleted).length;
        updatedGoal.progressPercentage = Math.round((completedCount / updatedMilestones.length) * 100);

        const newGoals = [...currentGoals];
        newGoals[goalIndex] = updatedGoal;
        this.goals.set(newGoals);

        if (this.selectedGoal()?.id === goalId) {
            this.selectedGoal.set(updatedGoal);
        }

        this.goalApiService.updateMilestone(milestoneId, isCompleted).subscribe({
            error: (err) => {
                console.error('Failed to toggle milestone', err);
                this.loadGoals();
                if (this.selectedGoal()) this.loadGoal(goalId);
            }
        });
    }

    createGoal(data: any): void {
        this.isLoading.set(true);
        this.goalApiService.createGoal(data).subscribe({
            next: () => {
                this.loadGoals();
                this.isLoading.set(false);
                // Ideally navigate here or emit success
                window.location.href = '/'; // Simple redirect for now, consider Router later
            },
            error: (err) => {
                console.error('Error creating goal', err);
                this.error.set('Failed to create goal.');
                this.isLoading.set(false);
            }
        });
    }
}
