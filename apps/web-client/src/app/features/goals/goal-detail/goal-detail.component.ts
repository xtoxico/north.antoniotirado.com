import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GoalFacade } from '../../../core/facades/goal.facade';

@Component({
  selector: 'app-goal-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="detail-container">
      @if (facade.isLoading()) {
        <p>Loading...</p>
      }

      @if (facade.selectedGoal(); as goal) {
        <header>
            <h1>{{ goal.title }}</h1>
            <span class="badge">{{ goal.type }}</span>
        </header>

        @if (goal.type === 'ACHIEVEMENT') {
            <section class="milestones">
                <h3>Milestones</h3>
                <ul>
                    @for (milestone of goal.milestones; track milestone.id) {
                        <li [class.completed]="milestone.isCompleted">
                            <label>
                                <input type="checkbox" 
                                    [checked]="milestone.isCompleted" 
                                    (change)="onToggle(goal.id, milestone.id, $event)">
                                {{ milestone.title }}
                            </label>
                        </li>
                    }
                </ul>
            </section>
        } @else {
            <section>
                <p>Details for this goal type are coming soon.</p>
            </section>
        }
      }

      @if (facade.error()) {
        <p class="error">{{ facade.error() }}</p>
      }
    </div>
  `,
  styles: [`
    .detail-container { padding: 2rem; max-width: 800px; margin: 0 auto; }
    header { margin-bottom: 2rem; border-bottom: 1px solid #eee; padding-bottom: 1rem; }
    h1 { margin: 0 0 0.5rem 0; }
    .badge { background: #eee; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; }
    .milestones ul { list-style: none; padding: 0; }
    .milestones li { padding: 0.5rem 0; border-bottom: 1px solid #f9f9f9; transition: opacity 0.3s; }
    .milestones li.completed { opacity: 0.5; text-decoration: line-through; }
    label { display: flex; gap: 0.5rem; align-items: center; cursor: pointer; }
    .error { color: red; }
  `]
})
export class GoalDetailComponent implements OnInit {
  facade = inject(GoalFacade);
  route = inject(ActivatedRoute);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
        this.facade.loadGoal(id);
    }
  }

  onToggle(goalId: string, milestoneId: string, event: Event): void {
      const isChecked = (event.target as HTMLInputElement).checked;
      this.facade.toggleMilestone(goalId, milestoneId, isChecked);
  }
}
