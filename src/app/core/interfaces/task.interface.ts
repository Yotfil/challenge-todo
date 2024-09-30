import { IUser } from './user.interface';

export interface ITaskFromService {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export interface ITask {
  id?: number | string;
  title?: string;
  completed?: boolean;
  dueDate?: string;
  users?: IUser[];
}
