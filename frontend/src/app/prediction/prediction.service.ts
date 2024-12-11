import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  PostPredictionRequestPayload,
  PostPredictionResponse,
} from "./prediction.model";
import { map, Observable, tap } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PredictionService {
  predictionResponse = signal<PostPredictionResponse | undefined>(undefined);

  constructor(private http: HttpClient) {}

  postCategoryPrediction(
    product: PostPredictionRequestPayload,
  ): Observable<PostPredictionResponse | undefined> {
    return this.http.post(`${environment.api_url}/predictions`, product).pipe(
      tap((response) =>
        this.predictionResponse.set(response as PostPredictionResponse),
      ),
      map((_) => this.predictionResponse()),
    );
  }
}
