import { ISkill } from './skills.interface';

export interface IUser {
  id: string;
  name: string;
  age: number;
  skills: ISkill[];
}
