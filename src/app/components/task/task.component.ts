import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITask } from 'src/app/core/interfaces/task.interface';
import { ISkill } from 'src/app/core/interfaces/skills.interface';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent {
  @Input() task!: ITask;

  classStatus(class1: string, class2: string): string {
    return this.task.completed ? class1 : class2;
  }

  setSkills(skills: ISkill[]): string {
    return skills.map((skill) => skill.skill).join(', ');
  }

  completeTask(): void {
    this.task.completed = !this.task.completed;
  }
}
