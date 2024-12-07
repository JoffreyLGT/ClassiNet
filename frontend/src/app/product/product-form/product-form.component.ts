import { Component, input, model, output } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Category, ProductForm } from "../product.model";

@Component({
  selector: "app-product-form",
  imports: [ReactiveFormsModule],
  templateUrl: "./product-form.component.html",
  styles: ``,
})
export class ProductFormComponent {
  // Categories to add in the selector
  categories = input<Category[]>();
  // Callback triggered when the user clicks on Submit
  onSubmit = output<void>();
  // Two-way data binding to hold the content of the form
  product = model<ProductForm>();
  // Form group to control the form
  productForm = new FormGroup({
    designation: new FormControl(this.product()?.designation ?? "", [
      Validators.required,
      Validators.maxLength(256),
    ]),
    description: new FormControl(""),
    category: new FormControl("", Validators.required),
  });
  // Subscription
  designationSubscription: any;
  descriptionSubscription: any;
  categorySubscription: any;

  /**
   * Initializes a new instance of the constructor and sets up the necessary form controls.
   * Calls the `subscribeFormControls` method as part of the initialization process.
   * @return {Object} The instance of the object created by the constructor.
   */
  constructor() {
    this.subscribeFormControls();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Lifecycle hook that is called when any data-bound property of a directive changes.
   * This method is used to update the form controls with the current product values whenever changes are detected.
   * It first checks if the product is defined, and if so, updates the controls for designation, description, and category
   * with the product's current values. The category value is converted to a string if it exists; otherwise, it defaults to "-1".
   * It also manages form control subscriptions by unsubscribing and re-subscribing them during the update process.
   *
   * @return {void} No return value.
   */
  ngOnChanges(): void {
    if (this.product() === undefined) return;
    this.unsubscribeFormControls();
    this.productForm.controls["designation"].setValue(
      this.product()?.designation ?? "",
    );
    this.productForm.controls["description"].setValue(
      this.product()?.description ?? "",
    );
    this.productForm.controls["category"].setValue(
      (this.product()?.categoryId ?? -1).toString(),
    );
    this.subscribeFormControls();
  }

  /**
   * Subscribes to the value changes of form controls within the product form and updates the product state accordingly.
   * Each control's value change triggers an update to the product's corresponding property.
   * It manages subscriptions for designation, description, and category form controls.
   *
   * @return {void} Does not return any value.
   */
  subscribeFormControls(): void {
    // Subscribe to all control changes to propagate the new values to the parent component
    this.designationSubscription = this.productForm.controls[
      "designation"
    ].valueChanges.subscribe((value) => {
      this.product.set({ ...this.product(), designation: value ?? "" });
    });
    this.descriptionSubscription = this.productForm.controls[
      "description"
    ].valueChanges.subscribe((value) => {
      this.product.set({ ...this.product(), description: value ?? "" });
    });
    this.categorySubscription = this.productForm.controls[
      "category"
    ].valueChanges.subscribe((value) => {
      this.product.set({
        ...this.product(),
        categoryId: Number(value) ?? undefined,
      });
    });
  }

  /**
   * Unsubscribes from the form control subscriptions, if they exist.
   *
   * This method is responsible for cleaning up resources by terminating
   * any active subscriptions related to form controls. Specifically, it
   * will unsubscribe from `designationSubscription`, `descriptionSubscription`,
   * and `categorySubscription` if these subscriptions are present.
   *
   * @return {void} Does not return any value.
   */
  unsubscribeFormControls() {
    this.designationSubscription?.unsubscribe();
    this.descriptionSubscription?.unsubscribe();
    this.categorySubscription?.unsubscribe();
  }
}
