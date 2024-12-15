import { Injectable, signal } from "@angular/core";
import { GetModelListResponse, ModelEntity } from "./model.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { map, tap } from "rxjs";
import { HEADER_PAGINATOR_KEY } from "../app.static-data";

@Injectable({
  providedIn: "root",
})
export class ModelService {
  modelList = signal<GetModelListResponse | undefined>(undefined);

  constructor(private http: HttpClient) {}

  getModelList(
    page: number = 1,
    usersPerPage: number = 10,
    search: string = "",
  ) {
    const skip = (page - 1) * usersPerPage;
    return this.http
      .get(
        `${environment.api_url}/models?skip=${skip}&take=${usersPerPage}&search=${search}`,
        { observe: "response" },
      )
      .pipe(
        tap((result: any) => {
          const pagination = JSON.parse(
            result.headers.get(HEADER_PAGINATOR_KEY),
          );
          return this.modelList.set({
            nbPages: pagination.TotalPages,
            nbTotal: pagination.TotalRecords,
            data: result.body,
          });
        }),
        map((_) => this.modelList()),
      );
  }

  setAsActiveModel(id: string) {
    return this.http.post(
      `${environment.api_url}/models/${id}/set-active`,
      null,
    );
  }
}
