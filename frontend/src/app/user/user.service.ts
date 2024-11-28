import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import {
  GetUserListResponse,
  LoginRequest,
  LoginResponse,
  UserModel,
} from "./user.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  // TODO: fetch url from environment variable or configuration
  private BASE_URL = "https://localhost:7052/api/accounts";
  // TODO: remove mock url and replace all calls with the correct route form api
  private MOCK_DB_BASE_URL = "http://localhost:3000";

  user = signal<UserModel | null | undefined>(undefined);
  userList = signal<GetUserListResponse | undefined>(undefined);
  editedUser = signal<UserModel | undefined>(undefined);

  constructor(private http: HttpClient) {}

  login(login: LoginRequest): Observable<UserModel | null | undefined> {
    return this.http
      .post<LoginResponse>(`${this.BASE_URL}/authenticate`, login)
      .pipe(
        tap((result: any) => {
          localStorage.setItem("token", result["token"]);
          this.user.set(result["user"] as UserModel);
        }),
        map((_: any) => {
          return this.user();
        }),
      );
  }

  getInfo(): Observable<UserModel | null | undefined> {
    return this.http.get(`${this.BASE_URL}/me`).pipe(
      tap((result: any) => this.user.set(result as UserModel)),
      map((_) => this.user()),
    );
  }

  logout(): Observable<null> {
    // TODO @JoffreyLGT: change the API call to a proper logout
    return this.http.get("https://localhost:7052/api/status").pipe(
      tap((_: any) => {
        localStorage.removeItem("token");
        this.user.set(null);
      }),
    );
  }

  getUserList(
    page: number,
    usersPerPage: number,
    search: string = "",
  ): Observable<GetUserListResponse | undefined> {
    const skip = page * usersPerPage;
    return this.http
      .get(
        `${this.MOCK_DB_BASE_URL}/get-user-list?skip=${skip}&take=${usersPerPage}&search=${search}`,
      )
      .pipe(
        tap((result: any) => this.userList.set(result as GetUserListResponse)),
        map((_) => this.userList()),
      );
  }

  postUser(user: UserModel): Observable<UserModel | undefined> {
    return this.http.post(`${this.MOCK_DB_BASE_URL}/users`, user).pipe(
      tap((result: any) => this.editedUser.set(result as UserModel)),
      map((_) => this.editedUser()),
    );
  }

  getUser(id: string): Observable<UserModel | undefined> {
    return this.http.get(`${this.MOCK_DB_BASE_URL}/users/${id}`).pipe(
      tap((result: any) => this.editedUser.set(result as UserModel)),
      map((_) => this.editedUser()),
    );
  }
}
