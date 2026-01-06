import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GoalListComponent } from './features/goals/goal-list.component';

@Component({
  imports: [RouterModule, GoalListComponent],
  selector: 'app-root',
  template: `
    <app-goal-list></app-goal-list>
    <router-outlet></router-outlet>
  `,
  styleUrl: './app.scss',
})
export class App {
  protected title = 'web-client';
}
