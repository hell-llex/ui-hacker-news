export interface News {
  id: number;
  deleted?: boolean;
  type: 'job' | 'story' | 'comment' | 'poll' | 'pollopt';
  by: string;
  time: number; 
  text?: string;
  dead?: boolean;
  parent?: number;
  poll?: number; 
  kids?: number[]; 
  url: string; 
  score: number; 
  title: string; 
  parts?: number[]; 
  descendants?: number; 
}
export interface IComment {
  by: string;
  id: number;
  kids?: number[];
  parent?: number;
  text: string;
  time: number;
  type: string;
  children?: IComment[];
}

