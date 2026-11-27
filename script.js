 // Demo-only PIN. This is not secure authentication; see README.md.
    const LEADER_PIN = "1234";
    const STORAGE_KEY = "community_waste_reports_v1";
    const VALID_STATUSES = ["Pending", "In Progress", "Resolved"];
    let isLeader = false;
    let reports = loadReports();

    function sampleReports() {
      return [{
        id: 1700000000001,
        title: "Overflowing Plastic Bags",
        category: "Plastic Waste",
        location: "Corner 5th Street & Main Ave",
        description: "Several torn plastic sacks left near the drainage canal.",
        date: "Nov 25, 2026",
        status: "Pending"
      }];
    }

    function loadReports() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === null) return sampleReports();
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return [];
        return parsed.map((report) => ({
          ...report,
          status: VALID_STATUSES.includes(report.status) ? report.status : "Pending"
        }));
      } catch (error) {
        console.error("Unable to read saved reports:", error);
        return [];
      }
    }

    function saveReports() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
        return true;
      } catch (error) {
        console.error("Unable to save reports:", error);
        showMessage("Your browser could not save this change. Check your browser storage settings.", "warning");
        return false;
      }
    }

    function showMessage(message, type = "success") {
      const messageEl = document.getElementById("appMessage");
      messageEl.textContent = message;
      messageEl.className = `app-message ${type}`;
    }

    function clearMessage() {
      const messageEl = document.getElementById("appMessage");
      messageEl.textContent = "";
      messageEl.className = "app-message";
    }

    function createElement(tag, className, text) {
      const element = document.createElement(tag);
      if (className) element.className = className;
      if (text !== undefined) element.textContent = text;
      return element;
    }

    function statusClass(status) {
      return status.toLowerCase().replaceAll(" ", "-");
    }

    function renderStats() {
      document.getElementById("totalCount").textContent = reports.length;
      document.getElementById("pendingCount").textContent = reports.filter((r) => r.status === "Pending").length;
      document.getElementById("progressCount").textContent = reports.filter((r) => r.status === "In Progress").length;
      document.getElementById("resolvedCount").textContent = reports.filter((r) => r.status === "Resolved").length;
    }

    function createReportCard(report) {
      const item = createElement("article", `report-item status-${statusClass(report.status)}`);
      const header = createElement("div", "report-header");
      const title = createElement("span", "report-title", report.title || "Untitled report");
      const badges = createElement("div", "badges");
      badges.appendChild(createElement("span", "badge", report.category || "Other"));
      badges.appendChild(createElement("span", `badge status-badge ${statusClass(report.status)}`, report.status));
      header.append(title, badges);

      const meta = createElement("div", "report-meta", `📍 ${report.location || "Location not provided"}  •  📅 ${report.date || "Date unavailable"}`);
      const body = createElement("p", "report-body", report.description || "No description provided.");
      item.append(header, meta, body);

      if (isLeader) {
        const actions = createElement("div", "leader-actions");
        const statusWrap = createElement("div", "status-control");
        const statusLabel = createElement("label", "", `Update status for ${report.title || "report"}`);
        const statusSelect = createElement("select");
        statusSelect.setAttribute("aria-label", `Update status for ${report.title || "report"}`);
        VALID_STATUSES.forEach((status) => {
          const option = createElement("option", "", status);
          option.value = status;
          statusSelect.appendChild(option);
        });
        statusSelect.value = report.status;
        statusSelect.addEventListener("change", () => updateReportStatus(report.id, statusSelect.value));
        statusWrap.append(statusLabel, statusSelect);

        const editButton = createElement("button", "btn-edit", "Modify");
        editButton.type = "button";
        editButton.addEventListener("click", () => startEdit(report.id));
        const deleteButton = createElement("button", "btn-delete", "Delete");
        deleteButton.type = "button";
        deleteButton.addEventListener("click", () => deleteReport(report.id));
        actions.append(statusWrap, editButton, deleteButton);
        item.appendChild(actions);
      }
      return item;
    }

    function renderReports() {
      const listEl = document.getElementById("reportList");
      listEl.replaceChildren();
      renderStats();

      const search = document.getElementById("searchInput").value.trim().toLowerCase();
      const category = document.getElementById("categoryFilter").value;
      const status = document.getElementById("statusFilter").value;
      const visibleReports = [...reports]
        .sort((a, b) => Number(b.id) - Number(a.id))
        .filter((report) => {
          const searchable = `${report.title} ${report.category} ${report.location} ${report.description}`.toLowerCase();
          return (!search || searchable.includes(search))
            && (!category || report.category === category)
            && (!status || report.status === status);
        });

      if (visibleReports.length === 0) {
        const emptyText = reports.length === 0
          ? "No waste reports yet. Submit the first report using the form above."
          : "No reports match your search or selected filters.";
        listEl.appendChild(createElement("p", "empty-state", emptyText));
        return;
      }
      visibleReports.forEach((report) => listEl.appendChild(createReportCard(report)));
    }

    document.getElementById("wasteForm").addEventListener("submit", (event) => {
      event.preventDefault();
      clearMessage();

      const editId = document.getElementById("editReportId").value;
      const title = document.getElementById("title").value.trim();
      const category = document.getElementById("category").value;
      const location = document.getElementById("location").value.trim();
      const description = document.getElementById("description").value.trim();
      if (!title || !category || !location || !description) return;

      if (editId && isLeader) {
        const index = reports.findIndex((report) => Number(report.id) === Number(editId));
        if (index !== -1) reports[index] = { ...reports[index], title, category, location, description };
        const saved = saveReports();
        if (saved) showMessage("Report details updated.");
      } else {
        reports.unshift({
          id: Date.now(), title, category, location, description,
          date: new Date().toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }),
          status: "Pending"
        });
        const saved = saveReports();
        if (saved) showMessage("Your waste report has been submitted with Pending status.");
      }
      resetForm();
      renderReports();
    });

    function updateReportStatus(id, newStatus) {
      if (!isLeader || !VALID_STATUSES.includes(newStatus)) return;
      const report = reports.find((item) => Number(item.id) === Number(id));
      if (!report) return;
      report.status = newStatus;
      const saved = saveReports();
      renderReports();
      if (saved) showMessage(`Report status updated to ${newStatus}.`);
    }

    function startEdit(id) {
      if (!isLeader) return;
      const report = reports.find((item) => Number(item.id) === Number(id));
      if (!report) return;
      document.getElementById("editReportId").value = report.id;
      document.getElementById("title").value = report.title;
      document.getElementById("category").value = report.category;
      document.getElementById("location").value = report.location;
      document.getElementById("description").value = report.description;
      document.getElementById("formHeading").textContent = "Modify Waste Report";
      document.getElementById("submitBtn").textContent = "Save Changes";
      document.getElementById("cancelEditBtn").hidden = false;
      clearMessage();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function deleteReport(id) {
      if (!isLeader) return;
      if (!window.confirm("Are you sure you want to delete this report? This cannot be undone.")) return;
      reports = reports.filter((report) => Number(report.id) !== Number(id));
      if (Number(document.getElementById("editReportId").value) === Number(id)) resetForm();
      const saved = saveReports();
      renderReports();
      if (saved) showMessage("Report deleted.");
    }

    function resetForm() {
      document.getElementById("wasteForm").reset();
      document.getElementById("editReportId").value = "";
      document.getElementById("formHeading").textContent = "Report Waste Problem";
      document.getElementById("submitBtn").textContent = "Submit Report";
      document.getElementById("cancelEditBtn").hidden = true;
    }

    function openPinModal() {
      document.getElementById("pinInput").value = "";
      document.getElementById("pinError").style.display = "none";
      document.getElementById("pinModal").style.display = "flex";
      document.getElementById("pinInput").focus();
    }

    function closePinModal() {
      document.getElementById("pinModal").style.display = "none";
    }

    function verifyPin() {
      const entered = document.getElementById("pinInput").value;
      if (entered === LEADER_PIN) {
        isLeader = true;
        closePinModal();
        updateRoleUI();
        showMessage("Leader portal unlocked. You can now manage report statuses.");
      } else {
        document.getElementById("pinError").style.display = "block";
      }
    }

    function updateRoleUI() {
      const button = document.getElementById("leaderToggleBtn");
      const banner = document.getElementById("leaderBanner");
      if (isLeader) {
        button.textContent = "EXIT LEADER";
        button.classList.add("active-leader");
        banner.style.display = "flex";
      } else {
        button.textContent = "LEADER";
        button.classList.remove("active-leader");
        banner.style.display = "none";
        resetForm();
      }
      renderReports();
    }

    document.getElementById("leaderToggleBtn").addEventListener("click", () => {
      if (isLeader) {
        isLeader = false;
        updateRoleUI();
        showMessage("You have returned to community member view.");
      } else {
        openPinModal();
      }
    });
    document.getElementById("unlockBtn").addEventListener("click", verifyPin);
    document.getElementById("closePinBtn").addEventListener("click", closePinModal);
    document.getElementById("pinInput").addEventListener("keyup", (event) => {
      if (event.key === "Enter") verifyPin();
    });
    document.getElementById("cancelEditBtn").addEventListener("click", () => {
      resetForm();
      showMessage("Editing cancelled.");
    });
    ["searchInput", "categoryFilter", "statusFilter"].forEach((id) => {
      document.getElementById(id).addEventListener("input", renderReports);
      document.getElementById(id).addEventListener("change", renderReports);
    });

    // Persist the initial sample record on first visit when browser storage is available.
    try {
      if (localStorage.getItem(STORAGE_KEY) === null) saveReports();
    } catch (error) {
      showMessage("Browser storage is unavailable. Reports may not remain after refreshing this page.", "warning");
    }
    renderReports();