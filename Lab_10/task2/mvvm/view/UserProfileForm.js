// mvvm/view/UserProfileForm.js
export class UserProfileForm {
  constructor(containerId, viewModel) {
    this.container = document.getElementById(containerId);
    this.viewModel = viewModel;
    this.isSubscribed = false;
  }

  render() {
    const vm = this.viewModel;

    this.container.innerHTML = `
      <div class="mvvm-form">
        <h1>User Profile (MVVM)</h1>

        <div class="form-group">
          <label>First Name:</label>
          <input
            type="text"
            data-field="firstName"
            value="${vm.firstName}"
            class="${vm.errors?.firstName ? "invalid" : ""}"
          />
          <span class="error">${vm.errors?.firstName || ""}</span>
        </div>

        <div class="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            data-field="lastName"
            value="${vm.lastName}"
            class="${vm.errors?.lastName ? "invalid" : ""}"
          />
          <span class="error">${vm.errors?.lastName || ""}</span>
        </div>

        <div class="form-group">
          <label>Email:</label>
          <input
            type="email"
            data-field="email"
            value="${vm.email}"
            class="${vm.errors?.email ? "invalid" : ""}"
          />
          <span class="error">${vm.errors?.email || ""}</span>
        </div>

        <div class="form-group">
          <label>Age:</label>
          <input
            type="number"
            data-field="age"
            value="${vm.age}"
            class="${vm.errors?.age ? "invalid" : ""}"
          />
          <span class="error">${vm.errors?.age || ""}</span>
        </div>

        <div class="preview">
          <h3>Preview</h3>
          <p><strong>Full Name:</strong> ${vm.fullName}</p>
          <p><strong>Valid:</strong> ${vm.isValid ? "Yes" : "No"}</p>
        </div>

        <div class="actions">
          <button id="saveBtn" ${!vm.isValid ? "disabled" : ""}>Save</button>
          <button id="resetBtn">Reset</button>
        </div>

        <div id="message"></div>
      </div>
    `;

    this.attachEventListeners();

    if (!this.isSubscribed) {
      this.subscribeToChanges();
      this.isSubscribed = true;
    }
  }

  attachEventListeners() {
    this.container.oninput = (e) => {
      if (e.target.dataset.field) {
        const field = e.target.dataset.field;
        this.viewModel[field] = e.target.value;
      }
    };

    const saveBtn = this.container.querySelector("#saveBtn");
    const resetBtn = this.container.querySelector("#resetBtn");
    const message = this.container.querySelector("#message");

    saveBtn?.addEventListener("click", () => {
      const result = this.viewModel.save();

      if (result.success) {
        message.textContent = "Профиль успешно сохранен";
        message.className = "success";
      } else {
        message.textContent = "Исправьте ошибки в форме";
        message.className = "error";
      }
    });

    resetBtn?.addEventListener("click", () => {
      this.viewModel.reset();
      const msg = this.container.querySelector("#message");
      if (msg) {
        msg.textContent = "";
        msg.className = "";
      }
    });
  }

  subscribeToChanges() {
    ["firstName", "lastName", "email", "age", "errors"].forEach((field) => {
      this.viewModel.$watch(field, () => this.render());
    });
  }
}