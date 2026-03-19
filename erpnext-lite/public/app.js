const state = {
  modules: {},
  activeModule: null
};

async function fetchMeta() {
  const res = await fetch("/api/meta");
  return res.json();
}

async function fetchItems(resource) {
  const res = await fetch(`/api/${resource}`);
  return res.json();
}

async function createItem(resource, payload) {
  const res = await fetch(`/api/${resource}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

async function updateItem(resource, id, payload) {
  const res = await fetch(`/api/${resource}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

async function deleteItem(resource, id) {
  const res = await fetch(`/api/${resource}/${id}`, { method: "DELETE" });
  return res.json();
}

function buildNav(modules) {
  const nav = document.getElementById("nav");
  nav.innerHTML = "";
  Object.keys(modules).forEach((moduleName, index) => {
    const button = document.createElement("button");
    button.textContent = moduleName;
    if (index === 0) {
      button.classList.add("active");
      state.activeModule = moduleName;
    }
    button.addEventListener("click", () => {
      state.activeModule = moduleName;
      [...nav.children].forEach((child) => child.classList.remove("active"));
      button.classList.add("active");
      renderModules();
    });
    nav.appendChild(button);
  });
}

function resourceForm(resource) {
  return `
    <form class="form" data-resource="${resource}">
      <input name="title" placeholder="Title" required />
      <input name="status" placeholder="Status (e.g. Open)" />
      <input name="amount" placeholder="Amount (optional)" type="number" step="0.01" />
      <input name="event_date" placeholder="Date (optional)" type="date" />
      <textarea name="notes" placeholder="Notes"></textarea>
      <button type="submit">Add</button>
    </form>
  `;
}

function resourceTable(rows, resource) {
  const body = rows
    .map(
      (row) => `
        <tr>
          <td>${row.id}</td>
          <td>${row.title || ""}</td>
          <td>${row.status || ""}</td>
          <td>${row.amount ?? ""}</td>
          <td>${row.event_date ? row.event_date.substring(0, 10) : ""}</td>
          <td>${row.notes || ""}</td>
          <td class="actions">
            <button data-action="edit" data-id="${row.id}" data-resource="${resource}">Edit</button>
            <button data-action="delete" data-id="${row.id}" data-resource="${resource}">Delete</button>
          </td>
        </tr>
      `
    )
    .join("");
  return `
    <div class="list">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>${body}</tbody>
      </table>
    </div>
  `;
}

async function renderModules() {
  const container = document.getElementById("modules");
  container.innerHTML = "";

  for (const [moduleName, resources] of Object.entries(state.modules)) {
    if (state.activeModule && state.activeModule !== moduleName) continue;

    const moduleSection = document.createElement("section");
    moduleSection.className = "module";
    moduleSection.innerHTML = `<h2>${moduleName}</h2>`;

    const grid = document.createElement("div");
    grid.className = "grid";

    for (const resource of resources) {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${resource.label}</h3>
        ${resourceForm(resource.name)}
        <div class="table" data-table="${resource.name}">Loading...</div>
      `;
      grid.appendChild(card);
      loadTable(resource.name);
    }

    moduleSection.appendChild(grid);
    container.appendChild(moduleSection);
  }
}

async function loadTable(resource) {
  const rows = await fetchItems(resource);
  const tableEl = document.querySelector(`[data-table="${resource}"]`);
  if (tableEl) tableEl.innerHTML = resourceTable(rows, resource);
}

document.addEventListener("submit", async (event) => {
  const form = event.target.closest("form[data-resource]");
  if (!form) return;
  event.preventDefault();
  const resource = form.dataset.resource;
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  payload.amount = payload.amount ? Number(payload.amount) : null;
  payload.event_date = payload.event_date || null;
  await createItem(resource, payload);
  form.reset();
  loadTable(resource);
});

document.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  const resource = button.dataset.resource;
  const id = button.dataset.id;

  if (action === "delete") {
    await deleteItem(resource, id);
    loadTable(resource);
  }

  if (action === "edit") {
    const title = prompt("Title");
    if (title === null) return;
    const status = prompt("Status") || "";
    const amountRaw = prompt("Amount (optional)") || "";
    const eventDate = prompt("Date (YYYY-MM-DD, optional)") || "";
    const notes = prompt("Notes") || "";

    const payload = {
      title,
      status,
      amount: amountRaw ? Number(amountRaw) : null,
      event_date: eventDate || null,
      notes
    };
    await updateItem(resource, id, payload);
    loadTable(resource);
  }
});

async function init() {
  const meta = await fetchMeta();
  state.modules = meta.modules;
  buildNav(meta.modules);
  renderModules();
}

init();
