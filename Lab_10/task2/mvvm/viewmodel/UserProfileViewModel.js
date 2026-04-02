// mvvm/viewmodel/UserProfileViewModel.js
import { ViewModel } from "../base/ViewModel.js";

export class UserProfileViewModel extends ViewModel {
  constructor() {
    super();

    // Define reactive properties
    this.defineProperty("firstName", "");
    this.defineProperty("lastName", "");
    this.defineProperty("email", "");
    this.defineProperty("age", "");
    this.defineProperty("errors", {});

    // Set up computed-related validation triggers
    this.$watch("firstName", () => this.validate());
    this.$watch("lastName", () => this.validate());
    this.$watch("email", () => this.validate());
    this.$watch("age", () => this.validate());
  }

  // Computed property: full name
  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim() || "Anonymous";
  }

  get isValid() {
    return Object.keys(this.errors || {}).length === 0;
  }

  // Validation
  validate() {
    const errors = {};

    if (!this.firstName || this.firstName.length < 2) {
      errors.firstName = "Имя должно содержать минимум 2 символа";
    }

    if (!this.lastName || this.lastName.length < 2) {
      errors.lastName = "Фамилия должна содержать минимум 2 символа";
    }

    if (!this.email || !this.isValidEmail(this.email)) {
      errors.email = "Введите корректный email";
    }

    const age = parseInt(this.age, 10);
    if (this.age && (Number.isNaN(age) || age < 18 || age > 120)) {
      errors.age = "Возраст должен быть от 18 до 120";
    }

    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Simulate save
  save() {
    if (this.validate()) {
      const profile = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        age: this.age ? parseInt(this.age, 10) : null
      };

      console.log("Saving profile:", profile);
      return { success: true, profile };
    }

    return { success: false, errors: this.errors };
  }

  // Reset form
  reset() {
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.age = "";
    this.errors = {};
  }
}