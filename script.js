
const assets = [
  {
    id: "AST-001",
    device: "Dell Latitude 5440",
    category: "Laptop",
    assignedTo: "John Smith",
    location: "Jakarta Office",
    status: "In Use"
  },
  {
    id: "AST-002",
    device: "HP ProBook 440",
    category: "Laptop",
    assignedTo: "Sarah Johnson",
    location: "Medan Office",
    status: "In Use"
  },
  {
    id: "AST-003",
    device: "Lenovo ThinkCentre",
    category: "Desktop",
    assignedTo: "Unassigned",
    location: "Jakarta Office",
    status: "Available"
  },
  {
    id: "AST-004",
    device: "HP LaserJet Pro",
    category: "Printer",
    assignedTo: "IT Department",
    location: "Medan Office",
    status: "In Use"
  },
  {
    id: "AST-005",
    device: "Dell Latitude 5430",
    category: "Laptop",
    assignedTo: "Michael Brown",
    location: "Jakarta Office",
    status: "Maintenance"
  },
  {
    id: "AST-006",
    device: "Logitech C920",
    category: "Webcam",
    assignedTo: "Unassigned",
    location: "IT Storage",
    status: "Available"
  },
  {
    id: "AST-007",
    device: "Dell P2422H",
    category: "Monitor",
    assignedTo: "John Smith",
    location: "Jakarta Office",
    status: "In Use"
  },
  {
    id: "AST-008",
    device: "HP ProDesk 600",
    category: "Desktop",
    assignedTo: "Unassigned",
    location: "Medan Office",
    status: "Maintenance"
  },
  {
    id: "AST-009",
    device: "Cisco IP Phone 8841",
    category: "Phone",
    assignedTo: "Sarah Johnson",
    location: "Medan Office",
    status: "In Use"
  },
  {
    id: "AST-010",
    device: "Samsung T7 SSD",
    category: "Storage",
    assignedTo: "IT Department",
    location: "IT Storage",
    status: "Available"
  }
];

function loadSavedAssets() {
  try {
    const saved = localStorage.getItem("itAssets");

    if (saved !== null) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        assets.splice(0, assets.length, ...parsed);
      }
    }
  } catch (error) {
    console.error("Could not load saved assets:", error);
  }
}

function saveAssets() {
  try {
    localStorage.setItem("itAssets", JSON.stringify(assets));
  } catch (error) {
    alert("Unable to save assets in this browser.");
    console.error("Could not save assets:", error);
  }
}

loadSavedAssets();

const tableBody = document.getElementById("assetTableBody");
const searchInput = document.getElementById("searchInput");
const emptyMessage = document.getElementById("emptyMessage");

function updateDashboard() {
  document.getElementById("totalAssets").textContent = assets.length;

  document.getElementById("inUseAssets").textContent =
    assets.filter(asset => asset.status === "In Use").length;

  document.getElementById("availableAssets").textContent =
    assets.filter(asset => asset.status === "Available").length;

  document.getElementById("maintenanceAssets").textContent =
    assets.filter(asset => asset.status === "Maintenance").length;
}

function renderAssets(assetList) {
  tableBody.replaceChildren();

  assetList.forEach(asset => {
    const row = document.createElement("tr");

    const values = [
      asset.id,
      asset.device,
      asset.category,
      asset.assignedTo,
      asset.location,
      asset.status
    ];

    values.forEach((value, index) => {
      const cell = document.createElement("td");

      if (index === 0) {
        cell.className = "asset-id";
      }

      if (index === 5) {
        const badge = document.createElement("span");
        badge.className = "status";

        if (asset.status === "In Use") {
          badge.classList.add("status-in-use");
        } else if (asset.status === "Available") {
          badge.classList.add("status-available");
        } else {
          badge.classList.add("status-maintenance");
        }

        badge.textContent = value;
        cell.appendChild(badge);
      } else {
        cell.textContent = value;
      }

      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });

  emptyMessage.hidden = assetList.length > 0;
}

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.trim().toLowerCase();

  const filteredAssets = assets.filter(asset =>
    Object.values(asset).some(value =>
      value.toLowerCase().includes(keyword)
    )
  );

  renderAssets(filteredAssets);
});


const addAssetSection = document.getElementById("addAssetSection");
const assetForm = document.getElementById("assetForm");
const cancelAssetBtn = document.getElementById("cancelAssetBtn");

document.getElementById("addAssetBtn").addEventListener("click", () => {
  addAssetSection.hidden = false;
  addAssetSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

cancelAssetBtn.addEventListener("click", () => {
  assetForm.reset();
  addAssetSection.hidden = true;
});

assetForm.addEventListener("submit", event => {
  event.preventDefault();

  const formData = new FormData(assetForm);

  const newAsset = {
    id: formData.get("assetId").trim(),
    device: formData.get("deviceName").trim(),
    category: formData.get("category"),
    assignedTo: formData.get("assignedTo").trim(),
    location: formData.get("location").trim(),
    status: formData.get("assetStatus")
  };

  const duplicateId = assets.some(
    asset => asset.id.toLowerCase() === newAsset.id.toLowerCase()
  );

  if (duplicateId) {
    alert("This Asset ID already exists. Please use a unique ID.");
    return;
  }

  assets.push(newAsset);
saveAssets();

updateDashboard();

  searchInput.value = "";
  renderAssets(assets);

  assetForm.reset();
  addAssetSection.hidden = true;

  alert("Asset added successfully!");
});