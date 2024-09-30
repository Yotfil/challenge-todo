import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { v4 as uuid } from 'uuid';

import { StorageProvider } from 'src/app/core/providers/storage.provider';
import { IUser } from 'src/app/core/interfaces/user.interface';
import { MapUsersProvider } from 'src/app/core/providers/map-users.provider';
import { ISkill } from 'src/app/core/interfaces/skills.interface';
import { combineLatest } from 'rxjs';
import { MapSkillsProvider } from 'src/app/core/providers/map-skills.provider';
import * as moment from 'moment';
import { ITask } from 'src/app/core/interfaces/task.interface';
import { MapTasksProvider } from 'src/app/core/providers/map-tasks.provider';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-new-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-new-task.component.html',
  styleUrls: ['./form-new-task.component.scss'],
})
export class FormNewTaskComponent implements OnInit {
  form!: FormGroup;
  users: IUser[] = [];
  skills: ISkill[] = [];
  idUsersUsed: number[] = [];
  idSkillsUsed: number[] = [];
  error!: number | null;
  errorSkill!: number | null;
  today = moment().format('YYYY-MM-DD');

  constructor(
    private fb: FormBuilder,
    private storageProvider: StorageProvider,
    private mapUsersProvider: MapUsersProvider,
    private mapSkillsProvider: MapSkillsProvider,
    private mapTaskProvider: MapTasksProvider,
    private router: Router
  ) {
    this.initForm();
  }
  ngOnInit(): void {
    this.watchDataFromStorage();
    this.getUsers();
    this.getSKills();
  }

  initForm(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      completed: [false, Validators.required],
      dueDate: ['', Validators.required],
      users: this.fb.array([
        this.fb.group({
          name: ['', Validators.required],
          age: [null, [Validators.required, Validators.min(18)]],
          skills: this.fb.array([
            this.fb.group({
              skill: ['', Validators.required],
            }),
          ]),
        }),
      ]),
    });
  }

  getFormArray(array: string): FormArray {
    return this.form.get(array) as FormArray;
  }

  getControl(control: string): AbstractControl {
    return this.form.controls[control];
  }

  getControlsArray(controlArray: string, index: number): AbstractControl {
    return (this.form.get(controlArray) as FormArray).controls[index];
  }

  getNestedFormArray(
    mainForm: string,
    userIndex: number,
    nestedForm: string
  ): FormArray {
    const formArray = (
      (this.getFormArray(mainForm) as FormArray).at(userIndex) as FormGroup
    ).controls[nestedForm] as FormArray;
    return formArray;
  }

  createTask(): void {
    const taskToSave = this.setDataToStorage(this.form.value);
    const currentTasksValue = this.storageProvider.getState('tasksFormated');
    const newTasksValue = [taskToSave, ...currentTasksValue];
    this.mapTaskProvider.updateTasksInStorage(newTasksValue);
    this.form.reset();
    this.router.navigate(['/']);
  }

  setDataToStorage(taskFromForm: ITask): ITask {
    return {
      id: uuid(),
      title: taskFromForm.title,
      completed: taskFromForm.completed,
      dueDate: moment(taskFromForm.dueDate).format('YYYY-MM-DD'),
      users: this.formatUsers(taskFromForm.users as IUser[]),
    };
  }

  formatUsers(users: IUser[]): IUser[] {
    const usersFormated = users.map((user) => {
      return {
        id: uuid(),
        name: this.users.find((u) => u.id === user.name)?.name ?? '',
        age: user.age,
        skills: this.formatSkills(user.skills),
      };
    });
    return usersFormated;
  }

  formatSkills(skills: ISkill[]): ISkill[] {
    return skills.map((skill) => {
      return {
        id: uuid(),
        skill: this.skills.find((s) => s.id === skill.skill)?.skill ?? '',
      };
    });
  }

  addPerson(): void {
    this.getFormArray('users').push(
      this.fb.group({
        name: ['', Validators.required],
        age: [null, [Validators.required, Validators.min(18)]],
        skills: this.fb.array([
          this.fb.group({
            skill: ['', Validators.required],
          }),
        ]),
      })
    );
  }

  removePerson(index: number): void {
    this.getFormArray('users').removeAt(index);
  }

  addSkill(userIndex: number): void {
    this.getNestedFormArray('users', userIndex, 'skills').push(
      this.fb.group({
        skill: ['', Validators.required],
      })
    );
  }
  removeSkill(userIndex: number, skillIndex: number): void {
    this.getNestedFormArray('users', userIndex, 'skills').removeAt(skillIndex);
  }

  watchDataFromStorage(): void {
    const [usersFormated$, skillsFormated$] =
      this.storageProvider.getManyStatesObservable([
        'usersFormated',
        'skillsFormated',
      ]);
    combineLatest([usersFormated$, skillsFormated$]).subscribe(
      ([users, skills]) => {
        this.users = users as IUser[];
        this.skills = skills as ISkill[];
      }
    );
  }

  getUsers(): void {
    const users = this.storageProvider.getState('usersFormated');
    if (users.length === 0) {
      this.mapUsersProvider.getUsers();
    }
  }

  getSKills(): void {
    const skills = this.storageProvider.getState('skillsFormated');
    if (skills.length === 0) {
      this.mapSkillsProvider.getSkills();
    }
  }

  isNameUsed(user: Event, index: number): void {
    const value = (user.target as HTMLSelectElement).value;
    const isUsed = this.idUsersUsed.includes(parseInt(value));

    if (isUsed) {
      this.error = index;
    } else {
      this.error = null;
      this.idUsersUsed.push(parseInt(value));
    }
  }

  isSkillUsed(skill: Event, userIndex: number, skillIndex: number): void {
    const value = (skill.target as HTMLSelectElement).value;
    const idSkill = parseInt(`${value}${userIndex}`);
    const isUsed = this.idSkillsUsed.includes(idSkill);
    if (isUsed) {
      this.errorSkill = skillIndex;
    } else {
      this.errorSkill = null;
      this.idSkillsUsed.push(idSkill);
    }
  }

  isUserGroupValid(index: number): boolean {
    const userGroup = this.getFormArray('users').at(index) as FormGroup;
    const skills = this.getNestedFormArray(
      'users',
      index,
      'skills'
    ) as FormArray;
    return (
      userGroup.valid &&
      !this.isNameDuplicate(index) &&
      skills.length >= 1 &&
      skills.valid &&
      !this.errorSkill
    );
  }

  isNameDuplicate(index: number): boolean {
    const users = this.getFormArray('users').controls;
    const currentValue = this.getControlsArray('users', index).get(
      'name'
    )?.value;
    let count = 0;
    users.forEach((control) => {
      if (control.get('name')?.value === currentValue) {
        count++;
      }
    });
    return count > 1;
  }

  isSkillValid(userIndex: number, skillIndex: number): boolean {
    return (
      this.isSkillDuplicate(userIndex, skillIndex) &&
      this.getNestedFormArray('users', userIndex, 'skills').at(skillIndex).valid
    );
  }

  isSkillDuplicate(userIndex: number, skillIndex: number): boolean {
    const skills = this.getNestedFormArray(
      'users',
      userIndex,
      'skills'
    ).controls;
    const currentValue = this.getNestedFormArray('users', userIndex, 'skills')
      .at(skillIndex)
      .get('skill')?.value;
    let count = 0;
    skills.forEach((control) => {
      if (control.get('skill')?.value === currentValue) {
        count++;
      }
    });
    return count > 1;
  }

  validateError(field: string): boolean | undefined {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched;
  }

  validateErrorUser(index: number, field: string): boolean | undefined {
    return (
      this.getControlsArray('users', index).get(field)?.invalid &&
      this.getControlsArray('users', index).get(field)?.touched
    );
  }

  validateErrorSkill(
    userIndex: number,
    skillIndex: number,
    field: string
  ): boolean | undefined {
    return (
      this.getNestedFormArray('users', userIndex, 'skills')
        .at(skillIndex)
        .get(field)?.invalid &&
      this.getNestedFormArray('users', userIndex, 'skills')
        .at(skillIndex)
        .get(field)?.touched
    );
  }

  isValidForm(): boolean {
    return this.form.valid && !this.error;
  }
}
