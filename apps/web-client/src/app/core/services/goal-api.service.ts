import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Goal, Milestone } from '@north/shared-types';

@Injectable({
    providedIn: 'root'
})
export class GoalApiService {
    private http = inject(HttpClient);

    getGoals(): Observable<Goal[]> {
        return this.http.get<Goal[]>('/api/goals');
    }

    registerEntry(goalId: string): Observable<void> {
        return this.http.post<void>(`/api/goals/${goalId}/entries`, {});
    }

    getGoal(goalId: string): Observable<Goal> {
        return this.http.get<Goal>(`/api/goals/${goalId}`);
    }

    updateMilestone(milestoneId: string, isCompleted: boolean): Observable<Milestone> {
        return this.http.patch<Milestone>(`/api/milestones/${milestoneId}`, { isCompleted });
    }

    createGoal(data: any): Observable<Goal> {
        return this.http.post<Goal>('/api/goals', data);
    }
}
