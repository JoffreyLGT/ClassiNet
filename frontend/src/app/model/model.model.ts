export interface ModelEntity {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  status: 0 | 1 | 2;
  isActive?: boolean;
  fileName: string;
}

export interface PostModel {
  startDate: Date;
  name: string;
  description?: string;
  endDate?: Date;
  status: 0 | 1 | 2;
  isActive?: boolean;
  fileName?: string;
}

export interface PatchModel {
  id: string;
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: 0 | 1 | 2;
  isActive?: boolean;
  fileName?: string;
}

/**
 * Defines the response from the model service when sending a request
 * to get a list of models.
 */
export interface GetModelListResponse {
  nbTotal: number;
  nbPages: number;
  data: ModelEntity[];
}
