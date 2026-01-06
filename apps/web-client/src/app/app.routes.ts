import { Route } from '@angular/router';
import { GoalListComponent } from './features/goals/goal-list.component';
import { GoalDetailComponent } from './features/goals/goal-detail/goal-detail.component';

export const appRoutes: Route[] = [
    { path: 'goals', component: GoalListComponent },
    { path: 'goals/:id', component: GoalDetailComponent },
    { path: '', redirectTo: 'goals', pathMatch: 'full' }
];
