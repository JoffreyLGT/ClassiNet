export interface ModelEntity {
  id:string;
  name: string;
  description?: string;
  startDate:Date;
  endDate?:Date;
  status: 1 | 2 | 3;
  isActive?: boolean;
  fileName: string;
}

export interface PostModel {
  startDate:Date;
  name: string;
  description?: string;
  endDate?:Date;
  status: 1 | 2 | 3;
  isActive?: boolean;
  fileName?: string;
}

export interface PatchModel {
  id:string;
  name?: string;
  description?: string;
  startDate?:Date;
  endDate?:Date;
  status?: 1 | 2 | 3;
  isActive?: boolean;
  fileName?: string;
}
