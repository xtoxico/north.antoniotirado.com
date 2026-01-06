import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GoalFacade } from '../../core/facades/goal.facade';
import { GoalCardComponent } from './components/goal-card/goal-card.component';
import { MessagingService } from '../../core/services/messaging.service';

@Component({
  selector: 'app-goal-list',
  standalone: true,
  imports: [CommonModule, GoalCardComponent, RouterLink],
  template: `
    <div class="goals-container">
      <div class="header">
        <h2>My Goals</h2>
        <div class="actions">
          <button (click)="requestPerms()" class="btn-secondary">🔔 Enable Notifications</button>
          <a routerLink="/goals/new" class="btn-primary">+ New Goal</a>
        </div>
      </div>
      
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
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    h2 { margin: 0; }
    .grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
      gap: 20px; 
    }
    .error { color: red; }
    .btn-primary { background: #000; color: #fff; padding: 0.6rem 1.2rem; border-radius: 4px; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: opacity 0.2s; }
    .btn-primary:hover { opacity: 0.8; }
    .actions { display: flex; gap: 10px; align-items: center; }
    .btn-secondary { background: #eee; color: #333; border: none; padding: 0.6rem 1.2rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem; }
    .btn-secondary:hover { background: #ddd; }
  `]
})
export class GoalListComponent implements OnInit {
  facade = inject(GoalFacade);
  messagingService = inject(MessagingService);

  ngOnInit(): void {
    this.facade.loadGoals();
  }

  requestPerms() {
    this.messagingService.requestPermission();
  }
}
