import { Injectable, signal } from "@angular/core";
import { BasicStats } from "./basic-stats.model";
import { HttpClient } from "@angular/common/http";
import { map, Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  // TODO @JoffreyLGT: fetch url from environment variable or configuration
  private BASE_URL = "https://localhost:7052/api/dashboard";

  basicStats = signal<BasicStats | undefined>(undefined);

  constructor(private http: HttpClient) {}

  getBasicStats(): Observable<BasicStats | undefined> {
    return this.http
      .get<BasicStats | undefined>(`${this.BASE_URL}/basic-stats`)
      .pipe(
        tap((result: any) => this.basicStats.set(result as BasicStats)),
        map((_) => this.basicStats()),
      );
  }
}
