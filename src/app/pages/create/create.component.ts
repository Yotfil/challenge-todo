import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormNewTaskComponent } from '../../components/form-new-task/form-new-task.component';
import { AppModule } from 'src/app/app.module';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormNewTaskComponent, SharedModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
  title = 'Crear tarea';
  constructor() {}
}
