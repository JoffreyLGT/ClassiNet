import { Component, OnDestroy } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { SvgIconComponent } from "angular-svg-icon";
import { UserService } from "../user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ADMIN_USER_LIST_ROUTE, USER_ROLES } from "../../app.static-data";
import { UserModel } from "../user.model";
import { Subscription } from "rxjs";

@Component({
  selector: "app-edit-user",
  imports: [FormsModule, ReactiveFormsModule, SvgIconComponent],
  templateUrl: "./edit-user.component.html",
  styles: ``,
})
export class EditUserComponent implements OnDestroy {
  protected readonly USER_ROLES = USER_ROLES;
  private readonly ACTIVATED_DEFAULT_VALUE = true;
  private readonly DISABLED_DEFAULT_VALUE = false;

  editedUserSubscription: Subscription | null = null;
  errorMessage: string | null = null;
  success: boolean = false;

  userId: string | null = null;

  userForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl(""),
    company: new FormControl(""),
    role: new FormControl("User"),
    activated: new FormControl(this.ACTIVATED_DEFAULT_VALUE),
    disabled: new FormControl(this.DISABLED_DEFAULT_VALUE),
    name: new FormControl(""),
  });

  constructor(
    private userService: UserService,
    route: ActivatedRoute,
    private router: Router,
  ) {
    this.userId = route.snapshot.paramMap.get("id");
    if (this.userId !== null) {
      this.editedUserSubscription = userService.getUser(this.userId).subscribe({
        next: (result) => {
          if (result === undefined) {
            return;
          }
          this.userForm.get("email")?.setValue(result.email);
          this.userForm.get("name")?.setValue(result.userName ?? "");
          this.userForm.get("company")?.setValue(result.company ?? "");
          this.userForm.get("role")?.setValue(result.role ?? "");
          this.userForm
            .get("activated")
            ?.setValue(result.activated ?? this.ACTIVATED_DEFAULT_VALUE);
          this.userForm
            .get("disabled")
            ?.setValue(result.disabled ?? this.DISABLED_DEFAULT_VALUE);
        },
        error: (_) => {
          this.router.navigate(["/404"], { skipLocationChange: true }).then();
        },
      });
    } else {
      this.userForm.get("password")?.setValidators([Validators.required]);
    }
  }

  onSubmit() {
    const user: UserModel = {
      id: "",
      email: this.userForm.controls["email"].value ?? "",
      password: this.userForm.controls["password"].value ?? "",
      company: this.userForm.controls["company"].value ?? "",
      role: this.userForm.controls["role"].value ?? "",
      activated:
        this.userForm.controls["activated"].value ??
        this.ACTIVATED_DEFAULT_VALUE,
      disabled:
        this.userForm.controls["disabled"].value ?? this.DISABLED_DEFAULT_VALUE,
      userName: this.userForm.controls["name"].value ?? "",
    };
    this.editedUserSubscription = this.userService.postUser(user).subscribe({
      next: (_: UserModel | null | undefined) => {
        this.errorMessage = null;
        this.success = true;
        setTimeout(() => {
          this.router.navigate([ADMIN_USER_LIST_ROUTE]).then();
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error.error;
        this.success = false;
      },
    });
  }

  ngOnDestroy() {
    this.editedUserSubscription?.unsubscribe();
  }
}
