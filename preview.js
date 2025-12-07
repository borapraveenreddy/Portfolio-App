// KEY HELPERS
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

// BUILDER PAGE LOGIC
const builderForm = document.getElementById("portfolioForm");
if (builderForm) {
  const currentUser = requireLogin();
  if (currentUser) {
    const info = document.getElementById("builderUserInfo");
    info.textContent = `Logged in as: ${currentUser}`;

    // Prefill if portfolio exists
    const existing = loadPortfolio(currentUser);
    if (existing) {
      document.getElementById("name").value = existing.name || "";
      document.getElementById("role").value = existing.role || "";
      document.getElementById("bio").value = existing.bio || "";
      document.getElementById("skills").value =
        existing.skills ? existing.skills.join(", ") : "";

      if (existing.projects && existing.projects[0]) {
        document.getElementById("project1Title").value =
          existing.projects[0].title || "";
        document.getElementById("project1Desc").value =
          existing.projects[0].desc || "";
        document.getElementById("project1Link").value =
          existing.projects[0].link || "";
      }
      if (existing.projects && existing.projects[1]) {
        document.getElementById("project2Title").value =
          existing.projects[1].title || "";
        document.getElementById("project2Desc").value =
          existing.projects[1].desc || "";
        document.getElementById("project2Link").value =
          existing.projects[1].link || "";
      }

      if (existing.contact) {
        document.getElementById("contactEmail").value =
          existing.contact.email || "";
        document.getElementById("contactGithub").value =
          existing.contact.github || "";
        document.getElementById("contactLinkedin").value =
          existing.contact.linkedin || "";
      }
    }

    // Save handler
    builderForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const role = document.getElementById("role").value.trim();
      const bio = document.getElementById("bio").value.trim();
      const skillsStr = document.getElementById("skills").value.trim();

      const project1 = {
        title: document.getElementById("project1Title").value.trim(),
        desc: document.getElementById("project1Desc").value.trim(),
        link: document.getElementById("project1Link").value.trim(),
      };

      const project2 = {
        title: document.getElementById("project2Title").value.trim(),
        desc: document.getElementById("project2Desc").value.trim(),
        link: document.getElementById("project2Link").value.trim(),
      };

      const contact = {
        email: document.getElementById("contactEmail").value.trim(),
        github: document.getElementById("contactGithub").value.trim(),
        linkedin: document
          .getElementById("contactLinkedin")
          .value.trim(),
      };

      const skills = skillsStr
        ? skillsStr.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const projects = [];
      if (project1.title || project1.desc || project1.link) {
        projects.push(project1);
      }
      if (project2.title || project2.desc || project2.link) {
        projects.push(project2);
      }

      const portfolio = { name, role, bio, skills, projects, contact };
      savePortfolio(currentUser, portfolio);
      alert("Portfolio saved!");
    });

    // Preview button
    document.getElementById("previewBtn").addEventListener("click", () => {
      window.location.href = "preview.html";
    });

    // Logout button
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.href = "login.html";
    });
  }
}

// PREVIEW PAGE LOGIC
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

function renderPortfolio(root, p) {
  root.innerHTML = ""; // clear

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
