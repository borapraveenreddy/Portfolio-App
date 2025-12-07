// ==== COMMON HELPERS ====
function requireLogin() {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return null;
  }
  return currentUser;
}

function getPortfolioKey(username) {
  return `portfolio_${username}`;
}

function loadPortfolio(username) {
  const key = getPortfolioKey(username);
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

function savePortfolio(username, portfolio) {
  const key = getPortfolioKey(username);
  localStorage.setItem(key, JSON.stringify(portfolio));
}

// ==== DYNAMIC BLOCK CREATORS ====

// skill input row
function createSkillRow(value = "") {
  const row = document.createElement("div");
  row.className = "skill-row";
  row.innerHTML = `
    <input class="skill-input" type="text"
           placeholder="Skill (e.g., HTML, React, Node.js)" value="${value}" />
    <button type="button" class="remove-skill-btn">X</button>
  `;
  row.querySelector(".remove-skill-btn").addEventListener("click", () => {
    row.remove();
  });
  return row;
}

// project block
function createProjectBlock(index, data = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = "project-block";

  wrapper.innerHTML = `
    <h3>Project ${index + 1}</h3>
    <input class="project-title" type="text"
           placeholder="Project title" value="${data.title || ""}" />
    <textarea class="project-desc" rows="2"
           placeholder="Project description">${data.desc || ""}</textarea>
    <input class="project-link" type="url"
           placeholder="Project link (GitHub/live)" value="${data.link || ""}" />
    <button type="button" class="remove-project-btn">Remove</button>
  `;

  wrapper
    .querySelector(".remove-project-btn")
    .addEventListener("click", () => {
      wrapper.remove();
    });

  return wrapper;
}

// ==== BUILDER PAGE LOGIC ====
const builderForm = document.getElementById("portfolioForm");
if (builderForm) {
  const currentUser = requireLogin();
  if (currentUser) {
    const info = document.getElementById("builderUserInfo");
    info.textContent = `Logged in as: ${currentUser}`;

    const existing = loadPortfolio(currentUser);

    // Basic info
    if (existing) {
      document.getElementById("name").value = existing.name || "";
      document.getElementById("role").value = existing.role || "";
      document.getElementById("bio").value = existing.bio || "";
      if (existing.contact) {
        document.getElementById("contactEmail").value =
          existing.contact.email || "";
        document.getElementById("contactGithub").value =
          existing.contact.github || "";
        document.getElementById("contactLinkedin").value =
          existing.contact.linkedin || "";
      }
    }

    // Skills
    const skillsContainer = document.getElementById("skillsContainer");
    const addSkillBtn = document.getElementById("addSkillBtn");

    if (existing && existing.skills && existing.skills.length) {
      existing.skills.forEach((skill) => {
        skillsContainer.appendChild(createSkillRow(skill));
      });
    } else {
      skillsContainer.appendChild(createSkillRow());
    }

    addSkillBtn.addEventListener("click", () => {
      skillsContainer.appendChild(createSkillRow());
    });

    // Projects
    const projectsContainer = document.getElementById("projectsContainer");
    const addProjectBtn = document.getElementById("addProjectBtn");

    if (existing && existing.projects && existing.projects.length) {
      existing.projects.forEach((proj, idx) => {
        const block = createProjectBlock(idx, proj);
        projectsContainer.appendChild(block);
      });
    } else {
      const block = createProjectBlock(0);
      projectsContainer.appendChild(block);
    }

    addProjectBtn.addEventListener("click", () => {
      const currentCount = projectsContainer.querySelectorAll(
        ".project-block"
      ).length;
      const block = createProjectBlock(currentCount);
      projectsContainer.appendChild(block);
    });

    // Save portfolio
    builderForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const role = document.getElementById("role").value.trim();
      const bio = document.getElementById("bio").value.trim();

      const contact = {
        email: document.getElementById("contactEmail").value.trim(),
        github: document.getElementById("contactGithub").value.trim(),
        linkedin: document
          .getElementById("contactLinkedin")
          .value.trim(),
      };

      // Collect skills
      const skillInputs = skillsContainer.querySelectorAll(".skill-input");
      const skills = [];
      skillInputs.forEach((inp) => {
        const v = inp.value.trim();
        if (v) skills.push(v);
      });

      // Collect projects
      const projectBlocks = projectsContainer.querySelectorAll(
        ".project-block"
      );
      const projects = [];
      projectBlocks.forEach((block) => {
        const title = block
          .querySelector(".project-title")
          .value.trim();
        const desc = block
          .querySelector(".project-desc")
          .value.trim();
        const link = block
          .querySelector(".project-link")
          .value.trim();
        if (title || desc || link) {
          projects.push({ title, desc, link });
        }
      });

      const portfolio = { name, role, bio, skills, projects, contact };
      savePortfolio(currentUser, portfolio);
      alert("Portfolio saved!");
      // After saving, go to saved portfolios
      window.location.href = "portfolios.html";
    });

    // Preview
    document.getElementById("previewBtn").addEventListener("click", () => {
      window.location.href = "preview.html";
    });

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.href = "login.html";
    });
  }
}

// ==== PREVIEW PAGE LOGIC ====
const portfolioRoot = document.getElementById("portfolioRoot");
if (portfolioRoot) {
  const currentUser = requireLogin();
  if (currentUser) {
    const data = loadPortfolio(currentUser);
    if (!data) {
      portfolioRoot.innerHTML =
        "<p>No portfolio saved yet. Go back and create one.</p>";
    } else {
      renderPortfolio(portfolioRoot, data);
    }
  }
}

// Render one portfolio object
function renderPortfolio(root, p) {
  root.innerHTML = "";

  const hero = document.createElement("section");
  hero.innerHTML = `
    <h1>${p.name || "Your Name"}</h1>
    <h3>${p.role || ""}</h3>
    <p>${p.bio || ""}</p>
  `;

  const skillsSec = document.createElement("section");
  skillsSec.innerHTML = "<h2>Skills</h2>";
  const skillsList = document.createElement("ul");
  if (p.skills && p.skills.length) {
    p.skills.forEach((s) => {
      const li = document.createElement("li");
      li.textContent = s;
      skillsList.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "No skills added yet.";
    skillsList.appendChild(li);
  }
  skillsSec.appendChild(skillsList);

  const projSec = document.createElement("section");
  projSec.innerHTML = "<h2>Projects</h2>";
  if (p.projects && p.projects.length) {
    p.projects.forEach((proj) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${proj.title || "Untitled project"}</h3>
        <p>${proj.desc || ""}</p>
        ${
          proj.link
            ? `<a href="${proj.link}" target="_blank" rel="noreferrer">View</a>`
            : ""
        }
      `;
      projSec.appendChild(card);
    });
  } else {
    const msg = document.createElement("p");
    msg.textContent = "No projects added yet.";
    projSec.appendChild(msg);
  }

  const contactSec = document.createElement("section");
  contactSec.innerHTML = "<h2>Contact</h2>";
  const contactList = document.createElement("ul");
  if (p.contact?.email) {
    const li = document.createElement("li");
    li.textContent = `Email: ${p.contact.email}`;
    contactList.appendChild(li);
  }
  if (p.contact?.github) {
    const li = document.createElement("li");
    li.innerHTML = `GitHub: <a href="${p.contact.github}" target="_blank" rel="noreferrer">${p.contact.github}</a>`;
    contactList.appendChild(li);
  }
  if (p.contact?.linkedin) {
    const li = document.createElement("li");
    li.innerHTML = `LinkedIn: <a href="${p.contact.linkedin}" target="_blank" rel="noreferrer">${p.contact.linkedin}</a>`;
    contactList.appendChild(li);
  }
  if (!contactList.children.length) {
    const li = document.createElement("li");
    li.textContent = "No contact info added yet.";
    contactList.appendChild(li);
  }
  contactSec.appendChild(contactList);

  root.appendChild(hero);
  root.appendChild(skillsSec);
  root.appendChild(projSec);
  root.appendChild(contactSec);
}

// ==== PORTFOLIO LIST PAGE LOGIC (portfolios.html) ====
const portfolioList = document.getElementById("portfolioList");
if (portfolioList) {
  const usersData = localStorage.getItem("users");
  const users = usersData ? JSON.parse(usersData) : [];

  if (!users.length) {
    portfolioList.innerHTML =
      "<p>No users found. Create an account and build a portfolio first.</p>";
  } else {
    users.forEach((user) => {
      const data = loadPortfolio(user.username);
      const card = document.createElement("div");
      card.className = "card";
      if (!data) {
        card.innerHTML = `
          <h3>${user.username}</h3>
          <p>No portfolio created yet.</p>
        `;
      } else {
        card.innerHTML = `
          <h3>${data.name || user.username}</h3>
          <p>${data.role || ""}</p>
          <button type="button" class="view-portfolio-btn">
            View as ${user.username}
          </button>
        `;
        card
          .querySelector(".view-portfolio-btn")
          .addEventListener("click", () => {
            localStorage.setItem("currentUser", user.username);
            window.location.href = "preview.html";
          });
      }
      portfolioList.appendChild(card);
    });
  }
}
