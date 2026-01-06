import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GoalFacade } from '../../../core/facades/goal.facade';
import { GoalType } from '@north/shared-types';

@Component({
  selector: 'app-goal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <h2>Create New Goal</h2>
      <form [formGroup]="goalForm" (ngSubmit)="onSubmit()">
        
        <!-- Title -->
        <div class="form-group">
          <label for="title">Title</label>
          <input id="title" type="text" formControlName="title" placeholder="e.g., Quit Smoking">
        </div>

        <!-- Type -->
        <div class="form-group">
          <label for="type">Goal Type</label>
          <select id="type" formControlName="type">
            <option [value]="GoalType.ELIMINATE_HABIT">Eliminate Habit</option>
            <option [value]="GoalType.BUILD_HABIT">Build Habit</option>
            <option [value]="GoalType.ACHIEVEMENT">Achievement</option>
          </select>
        </div>

        <!-- Dynamic Fields -->
        @if (isEliminate()) {
            <div class="form-group">
                <label for="startDate">Last Incident Date</label>
                <input id="startDate" type="date" formControlName="startDate">
            </div>
        }

        @if (isBuild()) {
            <div class="form-group">
                <label for="frequencyType">Frequency</label>
                <select id="frequencyType" formControlName="frequencyType">
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                </select>
            </div>
             <!-- Start Date for Build Habit default to today -->
             <div class="form-group">
                <label for="startDateBuild">Start Date</label>
                <input id="startDateBuild" type="date" formControlName="startDate">
            </div>
        }

        @if (isAchievement()) {
             <div class="form-group">
                <label for="startDateAch">Start Date</label>
                <input id="startDateAch" type="date" formControlName="startDate">
            </div>
            <div class="form-group">
                <label for="targetDate">Target Date</label>
                <input id="targetDate" type="date" formControlName="targetDate">
            </div>

            <div class="form-group">
                <label>Milestones</label>
                <div formArrayName="milestones">
                    @for (milestone of milestones.controls; track $index) {
                        <div class="milestone-row">
                            <input [formControlName]="$index" placeholder="Milestone title">
                            <button type="button" (click)="removeMilestone($index)">-</button>
                        </div>
                    }
                </div>
                <button type="button" (click)="addMilestone()" class="btn-sm">+ Add Milestone</button>
            </div>
        }

        <div class="actions">
            <button type="submit" [disabled]="goalForm.invalid" class="btn">Create Goal</button>
            <button type="button" (click)="cancel()" class="btn btn-neutral">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container { max-width: 600px; margin: 2rem auto; padding: 2rem; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    h2 { margin-top: 0; }
    .form-group { margin-bottom: 1.5rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    input, select { width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; }
    .actions { display: flex; gap: 1rem; margin-top: 2rem; }
    .btn { padding: 0.8rem 1.5rem; background: #000; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-neutral { background: #eee; color: #333; }
    .btn-sm { padding: 0.4rem 0.8rem; font-size: 0.9rem; margin-top: 0.5rem; }
    .milestone-row { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
  `]
})
export class GoalFormComponent {
  fb = inject(FormBuilder);
  facade = inject(GoalFacade);
  router = inject(Router);
  
  GoalType = GoalType;

  goalForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    type: [GoalType.BUILD_HABIT, Validators.required],
    startDate: [new Date().toISOString().split('T')[0], Validators.required],
    targetDate: [''],
    frequencyType: ['DAILY'],
    milestones: this.fb.array([])
  });

  get typeControl() { return this.goalForm.get('type'); }
  get milestones() { return this.goalForm.get('milestones') as FormArray; }

  isEliminate() { return this.typeControl?.value === GoalType.ELIMINATE_HABIT; }
  isBuild() { return this.typeControl?.value === GoalType.BUILD_HABIT; }
  isAchievement() { return this.typeControl?.value === GoalType.ACHIEVEMENT; }

  addMilestone() {
      this.milestones.push(this.fb.control('', Validators.required));
  }

  removeMilestone(index: number) {
      this.milestones.removeAt(index);
  }

  onSubmit() {
      if (this.goalForm.valid) {
          const formValue = this.goalForm.value;
          // Construct DTO
          const dto: any = {
              title: formValue.title,
              description: formValue.description,
              type: formValue.type,
              startDate: new Date(formValue.startDate!).toISOString(),
              targetDate: formValue.targetDate ? new Date(formValue.targetDate).toISOString() : undefined,
              frequency: formValue.frequencyType ? { type: formValue.frequencyType } : undefined,
              milestones: formValue.milestones
          };
          this.facade.createGoal(dto);
      }
  }

  cancel() {
      this.router.navigate(['/']);
  }
}
