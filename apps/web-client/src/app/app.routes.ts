import { Route } from '@angular/router';
import { GoalListComponent } from './features/goals/goal-list.component';
import { GoalDetailComponent } from './features/goals/goal-detail/goal-detail.component';
import { GoalFormComponent } from './features/goals/goal-form/goal-form.component';

import { LoginComponent } from './features/auth/login/login.component';
import { AuthCallbackComponent } from './features/auth/auth-callback/auth-callback.component';
import { authGuard } from './core/guards/auth.guard';

export const appRoutes: Route[] = [
    { path: 'login', component: LoginComponent },
    { path: 'auth/callback', component: AuthCallbackComponent },
    { 
        path: 'goals', 
        canActivate: [authGuard],
        children: [
            { path: '', component: GoalListComponent },
            { path: 'new', component: GoalFormComponent },
            { path: ':id', component: GoalDetailComponent }
        ]
    },
    { path: '', redirectTo: 'goals', pathMatch: 'full' }
];
