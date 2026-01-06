import { Component, Input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Goal, GoalType } from '@north/shared-types';

@Component({
    selector: 'app-goal-card',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="goal-card" [ngClass]="goal.type">
      <div class="header">
        <h3>{{ goal.title }}</h3>
        <span class="type-badge">{{ goal.type | titlecase }}</span>
      </div>

      <div class="content">
        @switch (goal.type) {
          @case ('ELIMINATE_HABIT') {
             <div class="stat-large" [class.danger]="(goal.daysSinceLastIncident || 0) === 0">
               {{ goal.daysSinceLastIncident }} <small>Days Free</small>
             </div>
             <p class="subtitle">Keep it up!</p>
             <button class="btn btn-danger" (click)="onAction()">He fallado</button>
          }
          @case ('BUILD_HABIT') {
             <div class="stat-large flame">
               {{ goal.currentStreak }} 🔥
             </div>
             <p class="subtitle">Current Streak • {{ goal.frequency?.type }}</p>
             <button class="btn btn-success" (click)="onAction()">Completar hoy</button>
          }
          @case ('ACHIEVEMENT') {
             <div class="progress-container">
               <div class="progress-bar" [style.width.%]="goal.progressPercentage"></div>
             </div>
             <p class="subtitle text-right">{{ goal.progressPercentage }}% Completed</p>
             <button class="btn btn-neutral" [routerLink]="['/goals', goal.id]">Ver Detalles</button>
          }
        }
      </div>
    </div>
  `,
    styles: [`
    .goal-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      border: 1px solid #eee;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      h3 { margin: 0; font-size: 1.1rem; }
    }
    .type-badge {
      font-size: 0.75rem;
      background: #f3f4f6;
      padding: 4px 8px;
      border-radius: 4px;
      color: #666;
    }
    .stat-large {
      font-size: 2.5rem;
      font-weight: bold;
      color: #10b981; // Green default
      line-height: 1;
      small { font-size: 1rem; color: #666; font-weight: normal; }
      &.danger { color: #ef4444; } // Red
      &.flame { color: #f59e0b; } // Orange
    }
    .subtitle { margin: 0; color: #6b7280; font-size: 0.9rem; }
    
    .progress-container {
      height: 10px;
      background: #e5e7eb;
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }
    .progress-bar {
      height: 100%;
      background: #3b82f6; // Blue
      transition: width 0.3s ease;
    }
    .text-right { text-align: right; }
    
    .btn {
       width: 100%;
       padding: 8px 12px;
       border: none;
       border-radius: 6px;
       font-weight: 500;
       cursor: pointer;
       margin-top: 1rem;
       transition: background 0.2s;
       
       &.btn-danger { background: #fee2e2; color: #ef4444; &:hover { background: #fecaca; } }
       &.btn-success { background: #d1fae5; color: #10b981; &:hover { background: #a7f3d0; } }
       &.btn-neutral { background: #f3f4f6; color: #4b5563; &:hover { background: #e5e7eb; } }
    }
  `]
})
export class GoalCardComponent {
    @Input({ required: true }) goal!: Goal;
    action = output<string>();

    onAction() {
        if (this.goal.type === 'ELIMINATE_HABIT') {
            if (!confirm('¿Seguro que quieres registrar una recaída? Esto reseteará tu contador.')) {
                return;
            }
        }
        this.action.emit(this.goal.id);
    }
}
