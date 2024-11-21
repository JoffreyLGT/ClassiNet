import { Component } from "@angular/core";
import { NgClass } from "@angular/common";
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-login",
  imports: [ReactiveFormsModule],
  template: `
    <div class="flex min-h-screen items-center justify-center">
      <div class="card bg-base-100 w-96 shadow-xl">
        <div class="card-body">
          <h2 class="card-title mb-6 text-2xl font-bold">Login</h2>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Email</span>
              </label>
              <label
                [class.input-error]="
                  loginForm.controls['email'].touched &&
                  loginForm.controls['email'].invalid
                "
                class="input input-bordered flex items-center gap-2"
              >
                <img
                  src="email.svg"
                  alt="Email icon"
                  class="h-4 w-4 opacity-70"
                />
                <input
                  type="email"
                  formControlName="email"
                  class="grow"
                  placeholder="email@example.com"
                />
              </label>
              @if (
                loginForm.controls["email"].touched &&
                loginForm.controls["email"].invalid
              ) {
                @if (loginForm.controls["email"].hasError("required")) {
                  <p class="mt-2 text-sm italic text-red-500">
                    Email address is required.
                  </p>
                } @else {
                  <p class="mt-2 text-sm italic text-red-500">
                    Invalid email address.
                  </p>
                }
              } @else {
                <p class="mt-2 text-sm">&nbsp;</p>
              }
            </div>
            <div class="form-control mt-2">
              <label class="label">
                <span class="label-text">Password</span>
              </label>
              <label
                [class.input-error]="
                  loginForm.controls['password'].touched &&
                  loginForm.controls['password'].invalid
                "
                class="input input-bordered flex items-center gap-2"
              >
                <img
                  src="password.svg"
                  alt="Password icon"
                  class="h-4 w-4 opacity-70"
                />
                <input
                  type="password"
                  formControlName="password"
                  class="grow"
                  placeholder="Enter password"
                />
              </label>
              @if (loginForm.controls["password"].touched) {
                @if (loginForm.controls["password"].hasError("required")) {
                  <p class="mt-2 text-sm italic text-red-500">
                    Password is required.
                  </p>
                }
              } @else {
                <p class="mt-2 text-sm">&nbsp;</p>
              }
            </div>
            <div class="form-control mt-6">
              <button [disabled]="!loginForm.valid" class="btn btn-primary">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", Validators.required),
  });

  onSubmit() {
    alert(this.loginForm.value.email);
  }
}
