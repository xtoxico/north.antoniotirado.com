import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalFacade } from '../../core/facades/goal.facade';
import { GoalCardComponent } from './components/goal-card/goal-card.component';

@Component({
  selector: 'app-goal-list',
  standalone: true,
  imports: [CommonModule, GoalCardComponent],
  template: `
    <div class="goals-container">
      <h2>My Goals</h2>
      
      @if (facade.isLoading()) {
        <p>Loading...</p>
      }

      @if (facade.error()) {
        <p class="error">{{ facade.error() }}</p>
      }

      <div class="grid">
        @for (goal of facade.goals(); track goal.id) {
          <app-goal-card [goal]="goal" (action)="facade.performAction($event)"></app-goal-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .goals-container { padding: 20px; max-width: 800px; margin: 0 auto; }
    .grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
      gap: 20px; 
      margin-top: 20px;
    }
    .error { color: red; }
  `]
})
export class GoalListComponent implements OnInit {
  facade = inject(GoalFacade);

  ngOnInit(): void {
    this.facade.loadGoals();
  }
}
