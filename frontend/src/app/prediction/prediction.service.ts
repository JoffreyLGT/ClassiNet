import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  PostPredictionRequestPayload,
  PostPredictionResponse,
} from "./prediction.model";
import { map, Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PredictionService {
  // TODO: fetch url from environment variable or configuration
  private API_BASE_URL = "https://localhost:7052/api/predictions";

  predictionResponse = signal<PostPredictionResponse | undefined>(undefined);

  constructor(private http: HttpClient) {}

  postCategoryPrediction(
    product: PostPredictionRequestPayload,
  ): Observable<PostPredictionResponse | undefined> {
    return this.http.post(this.API_BASE_URL, product).pipe(
      tap((response) =>
        this.predictionResponse.set(response as PostPredictionResponse),
      ),
      map((_) => this.predictionResponse()),
    );
  }
}
