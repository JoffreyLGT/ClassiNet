import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { LoginResponse } from "../../models/login-response";
import { LoginRequest } from "../../models/login-request";
import { User } from "../../models/user";

@Injectable({
  providedIn: "root",
})
export class UserService {
  // TODO @JoffreyLGT: fetch url from environment variable or configuration
  private BASE_URL = "https://localhost:7052/api/accounts";

  user = signal<User | null | undefined>(undefined);

  constructor(private http: HttpClient) {}

  login(login: LoginRequest): Observable<User | null | undefined> {
    return this.http
      .post<LoginResponse>(`${this.BASE_URL}/authenticate`, login)
      .pipe(
        tap((result: any) => {
          localStorage.setItem("token", result["token"]);
          this.user.set(result["user"] as User);
        }),
        map((_: any) => {
          return this.user();
        }),
      );
  }

  getInfo(): Observable<User | null | undefined> {
    return this.http.get(`${this.BASE_URL}/me`).pipe(
      tap((result: any) => this.user.set(result as User)),
      map((_) => this.user()),
    );
  }

  logout(): Observable<null> {
    // TODO @JoffreyLGT: change the API call to a proper logout
    return this.http.get("https://localhost:7052/api/status").pipe(
      tap((result: any) => {
        localStorage.removeItem("token");
        this.user.set(null);
      }),
    );
  }
}
