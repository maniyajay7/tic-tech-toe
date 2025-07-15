
// SkillSwap Platform - JavaScript Implementation

// Global Variables
let currentUser = null
let isAdmin = false
let users = []
let skills = []
let swapRequests = []
let ratings = []
let isDarkMode = false
const locations = ["Remote", "New York", "London", "Tokyo", "Berlin", "Sydney", "Paris"]
const popularSkills = [
  "Graphic Design",
  "Web Development",
  "Spanish",
  "Photography",
  "Cooking",
  "Excel",
  "Photoshop",
  "Yoga",
  "Marketing",
  "Writing",
]

// DOM Elements
const views = {
  home: document.getElementById("home-view"),
  browse: document.getElementById("browse-view"),
  swaps: document.getElementById("swaps-view"),
  profile: document.getElementById("profile-view"),
  admin: document.getElementById("admin-view"),
}

const navLinks = {
  home: document.getElementById("nav-home"),
  browse: document.getElementById("nav-browse"),
  swaps: document.getElementById("nav-swaps"),
  profile: document.getElementById("nav-profile"),
  admin: document.getElementById("nav-admin"),
}

const modals = {
  login: document.getElementById("login-modal"),
  signup: document.getElementById("signup-modal"),
  swap: document.getElementById("swap-modal"),
  rating: document.getElementById("rating-modal"),
  forgotPassword: document.getElementById("forgot-password-modal"),
  editProfile: document.getElementById("edit-profile-modal"),
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Load sample data
  loadSampleData()

  // Set up event listeners
  setupEventListeners()

  // Show home view by default
  showView("home")

  // Check if user is logged in (for demo purposes)
  checkLoginStatus()

  // Initialize UI components
  initUIComponents()

  // Show floating skills animation on first visit
  showFloatingSkills()

  // Initialize theme
  initializeTheme()
})

// Theme Management
function initializeTheme() {
  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem("theme") || "light"
  isDarkMode = savedTheme === "dark"
  applyTheme()
}

function toggleTheme() {
  isDarkMode = !isDarkMode
  localStorage.setItem("theme", isDarkMode ? "dark" : "light")
  applyTheme()
}

function applyTheme() {
  const body = document.body
  const themeIcon = document.getElementById("theme-icon")

  if (isDarkMode) {
    body.setAttribute("data-theme", "dark")
    if (themeIcon) themeIcon.className = "fas fa-sun"
  } else {
    body.removeAttribute("data-theme")
    if (themeIcon) themeIcon.className = "fas fa-moon"
  }
}

// Show floating skills animation
function showFloatingSkills() {
  const floatingContainer = document.getElementById("floating-skills")
  if (floatingContainer) {
    floatingContainer.classList.add("active")

    // Hide after 5 seconds
    setTimeout(() => {
      floatingContainer.classList.remove("active")
    }, 5000)

    // Add click handlers to floating skills
    const floatingSkills = document.querySelectorAll(".floating-skill")
    floatingSkills.forEach((skill) => {
      skill.addEventListener("click", () => {
        const skillName = skill.getAttribute("data-skill")
        document.getElementById("skill-search").value = skillName
        showView("browse")
        renderBrowseView()
        floatingContainer.classList.remove("active")
      })
    })
  }
}

// Password strength checker
function checkPasswordStrength(password) {
  // Reset indicators
  const strengthIndicator = document.getElementById("strength-indicator")
  const strengthText = document.getElementById("strength-text")

  if (!strengthIndicator || !strengthText) return

  strengthIndicator.className = "strength-indicator"
  strengthText.textContent = ""

  if (!password) return

  let strength = 0

  // Length check
  if (password.length > 7) strength++
  if (password.length > 11) strength++

  // Character variety checks
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++

  if (password.length < 8) {
    strengthIndicator.className = "strength-indicator strength-weak"
    strengthText.textContent = "Too short"
    strengthText.style.color = "#ff7675"
  } else if (strength < 3) {
    strengthIndicator.className = "strength-indicator strength-weak"
    strengthText.textContent = "Weak"
    strengthText.style.color = "#ff7675"
  } else if (strength < 5) {
    strengthIndicator.className = "strength-indicator strength-medium"
    strengthText.textContent = "Medium"
    strengthText.style.color = "#fdcb6e"
  } else {
    strengthIndicator.className = "strength-indicator strength-strong"
    strengthText.textContent = "Strong"
    strengthText.style.color = "#00b894"
  }
}

// Enhanced signup validation
function validateSignupForm() {
  const name = document.getElementById("signup-name").value.trim()
  const email = document.getElementById("signup-email").value.trim()
  const password = document.getElementById("signup-password").value
  const confirmPassword = document.getElementById("signup-confirm-password").value

  // Reset errors
  document.querySelectorAll(".error-message").forEach((el) => {
    el.style.display = "none"
  })

  let isValid = true

  // Name validation
  if (!name) {
    const nameError = document.getElementById("name-error")
    if (nameError) nameError.style.display = "block"
    isValid = false
  }

  // Email validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const emailError = document.getElementById("email-error")
    if (emailError) emailError.style.display = "block"
    isValid = false
  }

  // Password validation
  const passwordError = document.getElementById("password-error")
  if (passwordError) {
    if (password.length < 8) {
      passwordError.textContent = "Password must be at least 8 characters"
      passwordError.style.display = "block"
      isValid = false
    } else if (!/[A-Z]/.test(password)) {
      passwordError.textContent = "Password must contain at least one uppercase letter"
      passwordError.style.display = "block"
      isValid = false
    } else if (!/[0-9]/.test(password)) {
      passwordError.textContent = "Password must contain at least one number"
      passwordError.style.display = "block"
      isValid = false
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      passwordError.textContent = "Password must contain at least one special character"
      passwordError.style.display = "block"
      isValid = false
    }
  }

  // Confirm password
  if (password !== confirmPassword) {
    const confirmPasswordError = document.getElementById("confirm-password-error")
    if (confirmPasswordError) confirmPasswordError.style.display = "block"
    isValid = false
  }

  return isValid
}

// Load sample data for demonstration
function loadSampleData() {
  // Extended list of real names for more users
  const realNames = [
    "James Wilson",
    "Jay Parker",
    "Jack Thompson",
    "Jalisa Rodriguez",
    "Jennifer Chen",
    "John Martinez",
    "Jessica Taylor",
    "Jordan Brown",
    "Julia Davis",
    "Justin Lee",
    "Amanda Johnson",
    "Andrew Miller",
    "Anna Garcia",
    "Anthony White",
    "Ashley Lopez",
    "Brandon Clark",
    "Brittany Hall",
    "Brian Young",
    "Brooke Allen",
    "Carlos King",
    "Catherine Wright",
    "Christopher Green",
    "Christina Adams",
    "Daniel Baker",
    "Diana Nelson",
    "David Carter",
    "Emily Mitchell",
    "Emma Perez",
    "Eric Roberts",
    "Hannah Turner",
    "Isabella Phillips",
    "Jacob Campbell",
    "Jasmine Parker",
    "Kevin Evans",
    "Lauren Edwards",
    "Madison Collins",
    "Matthew Stewart",
    "Megan Morris",
    "Michael Rogers",
    "Michelle Reed",
    "Nicholas Cook",
    "Olivia Bailey",
    "Rachel Cooper",
    "Ryan Richardson",
    "Samantha Cox",
    "Sarah Ward",
    "Steven Torres",
    "Taylor Peterson",
    "Tyler Gray",
    "Victoria Ramirez",
    "William Johnson",
    "Zoe Anderson",
    "Alexander Brown",
    "Sophia Miller",
    "Benjamin Davis",
    "Charlotte Wilson",
    "Lucas Garcia",
    "Amelia Martinez",
    "Mason Rodriguez",
    "Harper Lewis",
    "Ethan Walker",
    "Evelyn Hall",
    "Sebastian Allen",
    "Abigail Young",
    "Henry King",
    "Emily Wright",
    "Jackson Lopez",
    "Elizabeth Hill",
    "Aiden Scott",
    "Sofia Green",
    "Matthew Adams",
    "Avery Baker",
    "Samuel Nelson",
    "Ella Carter",
    "Joseph Mitchell",
    "Scarlett Perez",
    "David Roberts",
    "Grace Turner",
    "Carter Phillips",
    "Chloe Campbell",
    "Wyatt Parker",
    "Layla Evans",
    "John Edwards",
    "Aria Collins",
    "Owen Stewart",
    "Ellie Morris",
    "Luke Rogers",
    "Nora Reed",
    "Levi Cook",
    "Hazel Bailey",
    "Isaac Cooper",
    "Violet Richardson",
    "Oliver Cox",
    "Aurora Ward",
    "Eli Torres",
    "Savannah Peterson",
    "Josiah Gray",
    "Audrey Ramirez",
    "Lincoln Wood",
    "Bella Watson",
    "Mason Brooks",
    "Claire Kelly",
    "Noah Sanders",
    "Skylar Price",
    "Caleb Bennett",
    "Leah Powell",
    "Ryan Long",
    "Natalie Patterson",
    "Nathan Hughes",
    "Addison Flores",
    "Ian Washington",
    "Lillian Butler",
    "Christian Simmons",
    "Maya Foster",
    "Hunter Gonzales",
    "Penelope Bryant",
    "Connor Alexander",
    "Samantha Russell",
    "Jeremiah Griffin",
    "Aaliyah Diaz",
  ]

  // Sample users with the first few having specific data
  users = [
    {
      id: 1,
      name: "James Wilson",
      email: "james.wilson@example.com",
      password: "password123",
      location: "New York",
      bio: "Passionate web developer with 5 years of experience. Love teaching and learning new technologies.",
      profilePhoto: "https://randomuser.me/api/portraits/men/32.jpg",
      isPublic: true,
      offeredSkills: ["Web Development", "JavaScript", "React", "Node.js"],
      wantedSkills: ["Graphic Design", "Photography", "UI/UX Design"],
      availability: ["weekends", "evenings"],
      isAdmin: false,
    },
    {
      id: 2,
      name: "Jay Parker",
      email: "jay.parker@example.com",
      password: "password123",
      location: "London",
      bio: "Creative designer who loves bringing ideas to life through visual storytelling.",
      profilePhoto: "https://randomuser.me/api/portraits/men/44.jpg",
      isPublic: true,
      offeredSkills: ["Graphic Design", "Photoshop", "Illustrator", "Branding"],
      wantedSkills: ["Web Development", "Spanish", "Animation"],
      availability: ["weekdays", "evenings"],
      isAdmin: false,
    },
    {
      id: 3,
      name: "Jack Thompson",
      email: "jack.thompson@example.com",
      password: "password123",
      location: "Remote",
      bio: "Full-stack developer and tech enthusiast. Always eager to share knowledge.",
      profilePhoto: "https://randomuser.me/api/portraits/men/75.jpg",
      isPublic: true,
      offeredSkills: ["Node.js", "Python", "Database Design", "DevOps"],
      wantedSkills: ["Machine Learning", "Data Science", "Mobile Development"],
      availability: ["weekdays"],
      isAdmin: false,
    },
    {
      id: 4,
      name: "Jalisa Rodriguez",
      email: "jalisa.rodriguez@example.com",
      password: "password123",
      location: "Los Angeles",
      bio: "Digital marketing specialist and content creator with a passion for storytelling.",
      profilePhoto: "https://randomuser.me/api/portraits/women/68.jpg",
      isPublic: true,
      offeredSkills: ["Digital Marketing", "Content Writing", "Social Media", "SEO"],
      wantedSkills: ["Video Editing", "Photography", "Graphic Design"],
      availability: ["weekends", "evenings"],
      isAdmin: false,
    },
    {
      id: 5,
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      location: "Remote",
      bio: "Platform administrator and project manager.",
      profilePhoto: "https://randomuser.me/api/portraits/men/15.jpg",
      isPublic: false,
      offeredSkills: ["Project Management", "Coaching", "Leadership"],
      wantedSkills: ["Data Analysis", "Machine Learning"],
      availability: ["weekdays"],
      isAdmin: true,
    },
  ]

  // Helper function to get random skills
  function getRandomSkills(min, max) {
    const numSkills = Math.floor(Math.random() * (max - min + 1)) + min
    const selectedSkills = []
    const availableSkills = [
      ...popularSkills,
      "Mobile Development",
      "Data Science",
      "Machine Learning",
      "UI/UX Design",
      "Animation",
      "Video Editing",
      "SEO",
      "Content Writing",
      "Branding",
      "DevOps",
      "Cloud Computing",
      "Cybersecurity",
      "Game Development",
      "3D Modeling",
      "Music Production",
      "Language Teaching",
      "Fitness Training",
      "Public Speaking",
      "Project Management",
      "Leadership",
    ]

    for (let i = 0; i < numSkills; i++) {
      const randomIndex = Math.floor(Math.random() * availableSkills.length)
      selectedSkills.push(availableSkills[randomIndex])
      availableSkills.splice(randomIndex, 1)
    }
    return selectedSkills
  }

  // Helper function to get random availability
  function getRandomAvailability() {
    const availabilityOptions = ["weekdays", "weekends", "evenings"]
    const selectedAvailability = []
    for (let i = 0; i < availabilityOptions.length; i++) {
      if (Math.random() > 0.4) {
        selectedAvailability.push(availabilityOptions[i])
      }
    }
    return selectedAvailability.length > 0 ? selectedAvailability : ["weekends"]
  }

  // Generate users for all names (100+ users)
  for (let i = 5; i < realNames.length; i++) {
    const isWoman = Math.random() > 0.5
    const firstName = realNames[i].split(" ")[0]
    const lastName = realNames[i].split(" ")[1]

    users.push({
      id: i + 1,
      name: realNames[i],
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      password: `password${i + 1}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      bio: `Hi, I'm ${firstName} and I love learning and sharing new skills! I believe in the power of knowledge exchange and community building.`,
      profilePhoto: `https://randomuser.me/api/portraits/${isWoman ? "women" : "men"}/${Math.floor(Math.random() * 100)}.jpg`,
      isPublic: Math.random() > 0.15, // 85% public profiles
      offeredSkills: getRandomSkills(2, 5),
      wantedSkills: getRandomSkills(2, 4),
      availability: getRandomAvailability(),
      isAdmin: false,
    })
  }

  // Keep existing swap requests and ratings...
  swapRequests = [
    {
      id: 1,
      fromUserId: 1,
      toUserId: 2,
      offeredSkill: "Web Development",
      wantedSkill: "Graphic Design",
      message: "I can help you with web development in exchange for graphic design lessons.",
      status: "pending",
      createdAt: new Date("2023-05-15"),
    },
    {
      id: 2,
      fromUserId: 2,
      toUserId: 1,
      offeredSkill: "Photoshop",
      wantedSkill: "JavaScript",
      message: "I can teach you Photoshop basics if you help me with JavaScript.",
      status: "accepted",
      createdAt: new Date("2023-05-10"),
    },
    {
      id: 3,
      fromUserId: 1,
      toUserId: 3,
      offeredSkill: "React",
      wantedSkill: "Data Analysis",
      message: "Looking to learn data analysis in exchange for React tutoring.",
      status: "completed",
      createdAt: new Date("2023-04-20"),
      completedAt: new Date("2023-05-01"),
    },
  ]

  ratings = [
    {
      id: 1,
      swapId: 3,
      fromUserId: 1,
      toUserId: 3,
      rating: 5,
      comment: "Great teacher! Learned a lot about data analysis.",
      createdAt: new Date("2023-05-02"),
    },
    {
      id: 2,
      swapId: 3,
      fromUserId: 3,
      toUserId: 1,
      rating: 4,
      comment: "Very knowledgeable about React.",
      createdAt: new Date("2023-05-02"),
    },
  ]

  // Extract all unique skills from users
  const allSkills = new Set()
  users.forEach((user) => {
    user.offeredSkills.forEach((skill) => allSkills.add(skill))
    user.wantedSkills.forEach((skill) => allSkills.add(skill))
  })
  skills = Array.from(allSkills)
}

// Add search dropdown functionality
let searchTimeout
let currentSearchIndex = -1
let isSearching = false

function setupSearchDropdown() {
  const searchInput = document.getElementById("skill-search")
  const searchDropdown = document.getElementById("search-dropdown")

  if (!searchInput || !searchDropdown) return

  searchInput.addEventListener("input", handleSearchInput)
  searchInput.addEventListener("keydown", handleSearchKeydown)
  searchInput.addEventListener("focus", handleSearchFocus)
  searchInput.addEventListener("blur", handleSearchBlur)

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-input-container")) {
      hideSearchDropdown()
    }
  })
}

function handleSearchInput(e) {
  const query = e.target.value.trim()

  clearTimeout(searchTimeout)

  if (query.length === 0) {
    hideSearchDropdown()
    return
  }

  if (query.length >= 1) {
    isSearching = true
    showSearchLoading()

    searchTimeout = setTimeout(() => {
      showSearchResults(query)
      isSearching = false
    }, 200)
  }
}

function handleSearchKeydown(e) {
  const dropdown = document.getElementById("search-dropdown")
  const items = dropdown.querySelectorAll(".search-dropdown-item")

  if (!dropdown.classList.contains("show") || items.length === 0) {
    if (e.key === "Enter") {
      e.preventDefault()
      renderBrowseView()
    }
    return
  }

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault()
      currentSearchIndex = Math.min(currentSearchIndex + 1, items.length - 1)
      updateSearchHighlight(items)
      break
    case "ArrowUp":
      e.preventDefault()
      currentSearchIndex = Math.max(currentSearchIndex - 1, -1)
      updateSearchHighlight(items)
      break
    case "Enter":
      e.preventDefault()
      if (currentSearchIndex >= 0 && items[currentSearchIndex]) {
        items[currentSearchIndex].click()
      } else {
        hideSearchDropdown()
        renderBrowseView()
      }
      break
    case "Escape":
      hideSearchDropdown()
      e.target.blur()
      break
  }
}

function handleSearchFocus(e) {
  const query = e.target.value.trim()
  if (query.length >= 1 && !isSearching) {
    showSearchResults(query)
  }
}

function handleSearchBlur(e) {
  // Delay hiding to allow clicks on dropdown items
  setTimeout(() => {
    if (!document.querySelector(".search-dropdown:hover")) {
      hideSearchDropdown()
    }
  }, 150)
}

function showSearchLoading() {
  const dropdown = document.getElementById("search-dropdown")
  if (!dropdown) return

  dropdown.innerHTML = `
    <div class="search-loading">
      <i class="fas fa-spinner fa-spin"></i> Searching...
    </div>
  `
  dropdown.classList.add("show")
}

function showSearchResults(query) {
  const dropdown = document.getElementById("search-dropdown")
  if (!dropdown) return

  const lowerQuery = query.toLowerCase()

  // Enhanced user search with better matching
  const matchingUsers = users
    .filter((user) => {
      if (!user.isPublic || (currentUser && user.id === currentUser.id)) return false

      const nameMatch = user.name.toLowerCase().includes(lowerQuery)
      const skillMatch = [...user.offeredSkills, ...user.wantedSkills].some((skill) =>
        skill.toLowerCase().includes(lowerQuery),
      )
      const locationMatch = user.location && user.location.toLowerCase().includes(lowerQuery)
      const bioMatch = user.bio && user.bio.toLowerCase().includes(lowerQuery)

      return nameMatch || skillMatch || locationMatch || bioMatch
    })
    .sort((a, b) => {
      // Prioritize exact name matches
      const aNameMatch = a.name.toLowerCase().startsWith(lowerQuery)
      const bNameMatch = b.name.toLowerCase().startsWith(lowerQuery)
      if (aNameMatch && !bNameMatch) return -1
      if (!aNameMatch && bNameMatch) return 1
      return 0
    })
    .slice(0, 8)

  // Enhanced skill search
  const matchingSkills = skills
    .filter((skill) => skill.toLowerCase().includes(lowerQuery))
    .sort((a, b) => {
      // Prioritize exact matches and starts-with matches
      const aExact = a.toLowerCase() === lowerQuery
      const bExact = b.toLowerCase() === lowerQuery
      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1

      const aStarts = a.toLowerCase().startsWith(lowerQuery)
      const bStarts = b.toLowerCase().startsWith(lowerQuery)
      if (aStarts && !bStarts) return -1
      if (!aStarts && bStarts) return 1

      return a.localeCompare(b)
    })
    .slice(0, 6)

  let html = ""

  // Users section
  if (matchingUsers.length > 0) {
    html += `
      <div class="search-dropdown-section">
        <div class="search-dropdown-header">
          <i class="fas fa-users"></i> People (${matchingUsers.length})
        </div>
    `

    matchingUsers.forEach((user) => {
      const matchingSkills = [...user.offeredSkills, ...user.wantedSkills]
        .filter((skill) => skill.toLowerCase().includes(lowerQuery))
        .slice(0, 2)

      html += `
        <div class="search-dropdown-item" data-type="user" data-id="${user.id}">
          <img src="${user.profilePhoto}" alt="${user.name}" class="search-dropdown-avatar">
          <div class="search-dropdown-info">
            <div class="search-dropdown-name">${highlightMatch(user.name, query)}</div>
            <div class="search-dropdown-meta">
              <div class="search-dropdown-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${user.location || "Remote"}</span>
              </div>
              ${matchingSkills
                .map((skill) => `<span class="search-dropdown-skill">${highlightMatch(skill, query)}</span>`)
                .join("")}
            </div>
          </div>
        </div>
      `
    })

    html += "</div>"
  }

  // Skills section
  if (matchingSkills.length > 0) {
    html += `
      <div class="search-dropdown-section">
        <div class="search-dropdown-header">
          <i class="fas fa-star"></i> Skills (${matchingSkills.length})
        </div>
    `

    matchingSkills.forEach((skill) => {
      const userCount = users.filter(
        (u) => u.isPublic && (u.offeredSkills.includes(skill) || u.wantedSkills.includes(skill)),
      ).length

      html += `
        <div class="search-dropdown-item" data-type="skill" data-value="${skill}">
          <div class="search-dropdown-avatar" style="background: var(--gradient-primary); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.8rem;">
            ${skill.charAt(0)}
          </div>
          <div class="search-dropdown-info">
            <div class="search-dropdown-name">${highlightMatch(skill, query)}</div>
            <div class="search-dropdown-meta">
              <span>${userCount} ${userCount === 1 ? "person" : "people"}</span>
            </div>
          </div>
        </div>
      `
    })

    html += "</div>"
  }

  if (html === "") {
    html = `
      <div class="search-no-results">
        <i class="fas fa-search"></i>
        <p>No results found for "${query}"</p>
        <small>Try searching for skills, names, or locations</small>
      </div>
    `
  }

  dropdown.innerHTML = html
  dropdown.classList.add("show")
  currentSearchIndex = -1

  // Add click handlers
  dropdown.querySelectorAll(".search-dropdown-item").forEach((item) => {
    item.addEventListener("click", handleSearchItemClick)
  })
}

function handleSearchItemClick(e) {
  const item = e.currentTarget
  const type = item.getAttribute("data-type")
  const searchInput = document.getElementById("skill-search")

  if (type === "user") {
    const userId = item.getAttribute("data-id")
    const user = users.find((u) => u.id === Number.parseInt(userId))
    if (user) {
      searchInput.value = user.name
      hideSearchDropdown()
      showView("browse")
      renderBrowseView()
    }
  } else if (type === "skill") {
    const skill = item.getAttribute("data-value")
    searchInput.value = skill
    hideSearchDropdown()
    showView("browse")
    renderBrowseView()
  }
}

function updateSearchHighlight(items) {
  items.forEach((item, index) => {
    if (index === currentSearchIndex) {
      item.classList.add("highlighted")
      item.scrollIntoView({ block: "nearest" })
    } else {
      item.classList.remove("highlighted")
    }
  })
}

function hideSearchDropdown() {
  const dropdown = document.getElementById("search-dropdown")
  if (dropdown) {
    dropdown.classList.remove("show")
    currentSearchIndex = -1
  }
}

function highlightMatch(text, query) {
  if (!query) return text

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  return text.replace(
    regex,
    '<strong style="color: var(--primary); background: rgba(67, 97, 238, 0.1); padding: 0.1rem 0.2rem; border-radius: 3px;">$1</strong>',
  )
}

// Set up all event listeners
function setupEventListeners() {
  // Theme toggle
  const themeToggleBtn = document.getElementById("theme-toggle-btn")
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", toggleTheme)
  }

  // Navigation links
  if (navLinks.home) {
    navLinks.home.addEventListener("click", (e) => {
      e.preventDefault()
      showView("home")
    })
  }

  if (navLinks.browse) {
    navLinks.browse.addEventListener("click", (e) => {
      e.preventDefault()
      showView("browse")
      renderBrowseView()
    })
  }

  if (navLinks.swaps) {
    navLinks.swaps.addEventListener("click", (e) => {
      e.preventDefault()
      if (!currentUser) {
        openModal("login")
        return
      }
      showView("swaps")
      renderSwapsView()
    })
  }

  if (navLinks.profile) {
    navLinks.profile.addEventListener("click", (e) => {
      e.preventDefault()
      if (!currentUser) {
        openModal("login")
        return
      }
      showView("profile")
      renderProfileView()
    })
  }

  if (navLinks.admin) {
    navLinks.admin.addEventListener("click", (e) => {
      e.preventDefault()
      showView("admin")
      renderAdminView()
    })
  }

  // User profile button
  const userProfileBtn = document.getElementById("user-profile-btn")
  if (userProfileBtn) {
    userProfileBtn.addEventListener("click", (e) => {
      e.preventDefault()
      if (currentUser) {
        showView("profile")
        renderProfileView()
      } else {
        openModal("login")
      }
    })
  }

  // Logout button
  const logoutBtn = document.getElementById("logout-btn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout)
  }

  // Auth buttons
  const loginBtn = document.getElementById("login-btn")
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      openModal("login")
    })
  }

  const signupBtn = document.getElementById("signup-btn")
  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      openModal("signup")
    })
  }

  const getStartedBtn = document.getElementById("get-started-btn")
  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", () => {
      openModal("signup")
    })
  }

  // Modal close buttons
  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", closeAllModals)
  })

  // Auth forms
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  const signupForm = document.getElementById("signup-form")
  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup)
  }

  const showSignupLink = document.getElementById("show-signup-link")
  if (showSignupLink) {
    showSignupLink.addEventListener("click", (e) => {
      e.preventDefault()
      closeAllModals()
      openModal("signup")
    })
  }

  const showLoginLink = document.getElementById("show-login-link")
  if (showLoginLink) {
    showLoginLink.addEventListener("click", (e) => {
      e.preventDefault()
      closeAllModals()
      openModal("login")
    })
  }

  // Forgot password functionality
  const forgotPasswordLink = document.getElementById("forgot-password-link")
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault()
      closeAllModals()
      openModal("forgotPassword")
    })
  }

  const forgotPasswordForm = document.getElementById("forgot-password-form")
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", handleForgotPassword)
  }

  const backToLoginLink = document.getElementById("back-to-login-link")
  if (backToLoginLink) {
    backToLoginLink.addEventListener("click", (e) => {
      e.preventDefault()
      closeAllModals()
      openModal("login")
    })
  }

  // Edit profile functionality
  const editProfileBtn = document.getElementById("edit-profile-btn")
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", openEditProfileModal)
  }

  const editProfileForm = document.getElementById("edit-profile-form")
  if (editProfileForm) {
    editProfileForm.addEventListener("submit", handleEditProfile)
  }

  const cancelEditProfile = document.getElementById("cancel-edit-profile")
  if (cancelEditProfile) {
    cancelEditProfile.addEventListener("click", (e) => {
      e.preventDefault()
      closeAllModals()
    })
  }

  // Password strength checking
  const signupPassword = document.getElementById("signup-password")
  if (signupPassword) {
    signupPassword.addEventListener("input", function () {
      checkPasswordStrength(this.value)
    })
  }

  // Profile actions
  const toggleStatusBtn = document.getElementById("toggle-status-btn")
  if (toggleStatusBtn) {
    toggleStatusBtn.addEventListener("click", toggleProfileStatus)
  }

  const addOfferedSkillBtn = document.getElementById("add-offered-skill")
  if (addOfferedSkillBtn) {
    addOfferedSkillBtn.addEventListener("click", addOfferedSkill)
  }

  const addWantedSkillBtn = document.getElementById("add-wanted-skill")
  if (addWantedSkillBtn) {
    addWantedSkillBtn.addEventListener("click", addWantedSkill)
  }

  const changePhotoBtn = document.getElementById("change-photo-btn")
  const photoUpload = document.getElementById("photo-upload")
  if (changePhotoBtn && photoUpload) {
    changePhotoBtn.addEventListener("click", () => {
      photoUpload.click()
    })
    photoUpload.addEventListener("change", handlePhotoUpload)
  }

  // Browse view actions
  const searchBtn = document.getElementById("search-btn")
  if (searchBtn) {
    searchBtn.addEventListener("click", renderBrowseView)
  }

  const skillSearch = document.getElementById("skill-search")
  if (skillSearch) {
    skillSearch.addEventListener("keyup", (e) => {
      if (e.key === "Enter") renderBrowseView()
    })
  }

  const resetFilters = document.getElementById("reset-filters")
  if (resetFilters) {
    resetFilters.addEventListener("click", resetFiltersHandler)
  }

  // Swaps view actions
  document.querySelectorAll(".swaps-tabs .tab-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const tab = e.target.getAttribute("data-tab")
      switchSwapsTab(tab)
    })
  })

  // Admin view actions
  document.querySelectorAll(".admin-tabs .tab-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const tab = e.target.getAttribute("data-tab")
      switchAdminTab(tab)
    })
  })

  const adminSearchBtn = document.getElementById("admin-search-btn")
  if (adminSearchBtn) {
    adminSearchBtn.addEventListener("click", renderAdminUsers)
  }

  const exportUsersBtn = document.getElementById("export-users-btn")
  if (exportUsersBtn) {
    exportUsersBtn.addEventListener("click", exportUserData)
  }

  const sendMessageBtn = document.getElementById("send-message-btn")
  if (sendMessageBtn) {
    sendMessageBtn.addEventListener("click", sendPlatformMessage)
  }

  const generateReportBtn = document.getElementById("generate-report-btn")
  if (generateReportBtn) {
    generateReportBtn.addEventListener("click", generateReport)
  }

  const downloadReportBtn = document.getElementById("download-report-btn")
  if (downloadReportBtn) {
    downloadReportBtn.addEventListener("click", downloadReport)
  }

  // Click outside modal to close
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      closeAllModals()
    }
  })

  // Availability checkboxes
  const availabilityCheckboxes = ["weekends-availability", "evenings-availability", "weekdays-availability"]
  availabilityCheckboxes.forEach((id) => {
    const checkbox = document.getElementById(id)
    if (checkbox) {
      checkbox.addEventListener("change", updateAvailability)
    }
  })

  // Setup search dropdown
  setupSearchDropdown()
}

// View management
function showView(viewName) {
  // Hide all views
  Object.values(views).forEach((view) => {
    if (view) view.style.display = "none"
  })

  // Deactivate all nav links
  Object.values(navLinks).forEach((link) => {
    if (link) link.classList.remove("active")
  })

  // Show selected view and activate nav link
  if (views[viewName]) {
    views[viewName].style.display = "block"
  }
  if (navLinks[viewName]) {
    navLinks[viewName].classList.add("active")
  }

  // Special handling for certain views
  if (viewName === "home") {
    renderHomeView()
  }
}

// Modal management
function openModal(modalName) {
  closeAllModals()
  if (modals[modalName]) {
    modals[modalName].style.display = "block"
  }
}

function closeAllModals() {
  Object.values(modals).forEach((modal) => {
    if (modal) modal.style.display = "none"
  })
}

// Check login status (for demo purposes)
function checkLoginStatus() {
  // For demo, we'll consider no one logged in initially
  updateAuthUI()
}

// Update UI based on authentication status
function updateAuthUI() {
  const loginBtn = document.getElementById("login-btn")
  const signupBtn = document.getElementById("signup-btn")
  const logoutBtn = document.getElementById("logout-btn")
  const userProfileBtn = document.getElementById("user-profile-btn")
  const navAdmin = document.getElementById("nav-admin")

  if (currentUser) {
    if (loginBtn) loginBtn.style.display = "none"
    if (signupBtn) signupBtn.style.display = "none"
    if (logoutBtn) logoutBtn.style.display = "inline-flex"
    if (userProfileBtn) {
      userProfileBtn.style.display = "block"
      const img = userProfileBtn.querySelector("img")
      if (img) {
        img.src = currentUser.profilePhoto
        img.alt = currentUser.name
      }
    }

    if (currentUser.isAdmin) {
      if (navAdmin) navAdmin.style.display = "block"
      isAdmin = true
    } else {
      if (navAdmin) navAdmin.style.display = "none"
      isAdmin = false
    }
  } else {
    if (loginBtn) loginBtn.style.display = "inline-flex"
    if (signupBtn) signupBtn.style.display = "inline-flex"
    if (logoutBtn) logoutBtn.style.display = "none"
    if (userProfileBtn) userProfileBtn.style.display = "none"
    if (navAdmin) navAdmin.style.display = "none"
    isAdmin = false
  }
}

// Authentication handlers
function handleLogin(e) {
  e.preventDefault()

  const emailInput = document.getElementById("login-email")
  const passwordInput = document.getElementById("login-password")

  if (!emailInput || !passwordInput) return

  const email = emailInput.value
  const password = passwordInput.value

  // Find user
  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    currentUser = user
    updateAuthUI()
    closeAllModals()
    showView("home")
    renderHomeView()
    showToast("Welcome back!", "success")
  } else {
    showToast("Invalid email or password", "error")
  }
}

function handleSignup(e) {
  e.preventDefault()

  if (!validateSignupForm()) {
    return
  }

  const nameInput = document.getElementById("signup-name")
  const emailInput = document.getElementById("signup-email")
  const passwordInput = document.getElementById("signup-password")

  if (!nameInput || !emailInput || !passwordInput) return

  const name = nameInput.value
  const email = emailInput.value
  const password = passwordInput.value

  if (users.some((u) => u.email === email)) {
    showToast("Email already in use", "error")
    return
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    location: "",
    bio: "",
    profilePhoto: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
    isPublic: false,
    offeredSkills: [],
    wantedSkills: [],
    availability: [],
    isAdmin: false,
  }

  users.push(newUser)
  currentUser = newUser
  updateAuthUI()
  closeAllModals()
  showView("profile")
  renderProfileView()
  showToast("Account created successfully!", "success")
}

function handleLogout() {
  currentUser = null
  updateAuthUI()
  showView("home")
  renderHomeView()
  showToast("Logged out successfully", "info")
}

function handleForgotPassword(e) {
  e.preventDefault()

  const emailInput = document.getElementById("forgot-email")
  if (!emailInput) return

  const email = emailInput.value.trim()

  // Reset error
  const emailError = document.getElementById("forgot-email-error")
  if (emailError) emailError.style.display = "none"

  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (emailError) emailError.style.display = "block"
    return
  }

  // Check if user exists
  const user = users.find((u) => u.email === email)

  if (user) {
    // In a real app, this would send an actual email
    showToast("Password reset link sent to your email!", "success")

    // For demo purposes, show the temporary password
    setTimeout(() => {
      showToast(`Demo: Your temporary password is "temp123" for ${email}`, "info")
    }, 2000)
  } else {
    showToast("No account found with this email address", "error")
  }

  closeAllModals()
}

// Edit Profile functionality
function openEditProfileModal() {
  if (!currentUser) return

  // Populate form with current user data
  const editName = document.getElementById("edit-name")
  const editEmail = document.getElementById("edit-email")
  const editLocation = document.getElementById("edit-location")
  const editBio = document.getElementById("edit-bio")

  if (editName) editName.value = currentUser.name
  if (editEmail) editEmail.value = currentUser.email
  if (editLocation) editLocation.value = currentUser.location || ""
  if (editBio) editBio.value = currentUser.bio || ""

  openModal("editProfile")
}

function handleEditProfile(e) {
  e.preventDefault()

  if (!currentUser) return

  const editName = document.getElementById("edit-name")
  const editEmail = document.getElementById("edit-email")
  const editLocation = document.getElementById("edit-location")
  const editBio = document.getElementById("edit-bio")

  if (!editName || !editEmail) return

  const name = editName.value.trim()
  const email = editEmail.value.trim()
  const location = editLocation ? editLocation.value.trim() : ""
  const bio = editBio ? editBio.value.trim() : ""

  // Validate
  if (!name || !email) {
    showToast("Name and email are required", "error")
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast("Please enter a valid email", "error")
    return
  }

  // Check if email is already in use by another user
  if (users.some((u) => u.email === email && u.id !== currentUser.id)) {
    showToast("Email already in use by another user", "error")
    return
  }

  // Update user
  currentUser.name = name
  currentUser.email = email
  currentUser.location = location
  currentUser.bio = bio

  // Update in users array
  const userIndex = users.findIndex((u) => u.id === currentUser.id)
  if (userIndex !== -1) {
    users[userIndex] = currentUser
  }

  closeAllModals()
  renderProfileView()
  showToast("Profile updated successfully!", "success")
}

// Profile view functions
function renderProfileView() {
  if (!currentUser) {
    showView("home")
    return
  }

  // Basic info
  const profileName = document.getElementById("profile-name")
  const profilePic = document.getElementById("profile-pic")

  if (profileName) profileName.textContent = currentUser.name
  if (profilePic) profilePic.src = currentUser.profilePhoto

  // Location
  const locationText = document.getElementById("location-text")
  if (locationText) {
    locationText.textContent = currentUser.location || "Not specified"
  }

  // Profile status
  const statusBadge = document.getElementById("profile-status")
  const toggleBtn = document.getElementById("toggle-status-btn")

  if (statusBadge && toggleBtn) {
    if (currentUser.isPublic) {
      statusBadge.textContent = "Public"
      statusBadge.className = "status-badge status-public"
      toggleBtn.textContent = "Make Private"
    } else {
      statusBadge.textContent = "Private"
      statusBadge.className = "status-badge status-private"
      toggleBtn.textContent = "Make Public"
    }
  }

  // Offered skills
  renderSkillsList("offered-skills", currentUser.offeredSkills, true)

  // Wanted skills
  renderSkillsList("wanted-skills", currentUser.wantedSkills, true)

  // Availability
  const weekendsAvailability = document.getElementById("weekends-availability")
  const eveningsAvailability = document.getElementById("evenings-availability")
  const weekdaysAvailability = document.getElementById("weekdays-availability")

  if (weekendsAvailability) weekendsAvailability.checked = currentUser.availability.includes("weekends")
  if (eveningsAvailability) eveningsAvailability.checked = currentUser.availability.includes("evenings")
  if (weekdaysAvailability) weekdaysAvailability.checked = currentUser.availability.includes("weekdays")

  // Ratings
  renderUserRatings()
}

function renderSkillsList(containerId, skillsList, editable = false) {
  const container = document.getElementById(containerId)
  if (!container) return

  container.innerHTML = ""

  if (skillsList.length === 0) {
    container.innerHTML = '<p class="no-skills">No skills added yet</p>'
    return
  }

  skillsList.forEach((skill) => {
    const skillItem = document.createElement("div")
    skillItem.className = "skill-item"
    skillItem.innerHTML = `
            <span>${skill}</span>
            ${editable ? '<button class="remove-skill" data-skill="' + skill + '">&times;</button>' : ""}
        `
    container.appendChild(skillItem)
  })

  // Add event listeners to remove buttons
  if (editable) {
    container.querySelectorAll(".remove-skill").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const skill = e.target.getAttribute("data-skill")
        removeSkill(containerId, skill)
      })
    })
  }
}

function removeSkill(containerId, skill) {
  if (containerId === "offered-skills") {
    currentUser.offeredSkills = currentUser.offeredSkills.filter((s) => s !== skill)
  } else {
    currentUser.wantedSkills = currentUser.wantedSkills.filter((s) => s !== skill)
  }

  // Update in users array
  const userIndex = users.findIndex((u) => u.id === currentUser.id)
  if (userIndex !== -1) {
    users[userIndex] = currentUser
  }

  renderProfileView()
  showToast("Skill removed!", "success")
}

function toggleProfileStatus() {
  if (!currentUser) return

  currentUser.isPublic = !currentUser.isPublic

  // Update in users array
  const userIndex = users.findIndex((u) => u.id === currentUser.id)
  if (userIndex !== -1) {
    users[userIndex] = currentUser
  }

  renderProfileView()
  showToast(`Profile is now ${currentUser.isPublic ? "public" : "private"}`, "info")
}

function addOfferedSkill() {
  const input = document.getElementById("new-offered-skill")
  if (!input || !currentUser) return

  const skill = input.value.trim()

  if (skill && !currentUser.offeredSkills.includes(skill)) {
    currentUser.offeredSkills.push(skill)

    // Update in users array
    const userIndex = users.findIndex((u) => u.id === currentUser.id)
    if (userIndex !== -1) {
      users[userIndex] = currentUser
    }

    input.value = ""
    renderProfileView()
    showToast("Skill added!", "success")
  }
}

function addWantedSkill() {
  const input = document.getElementById("new-wanted-skill")
  if (!input || !currentUser) return

  const skill = input.value.trim()

  if (skill && !currentUser.wantedSkills.includes(skill)) {
    currentUser.wantedSkills.push(skill)

    // Update in users array
    const userIndex = users.findIndex((u) => u.id === currentUser.id)
    if (userIndex !== -1) {
      users[userIndex] = currentUser
    }

    input.value = ""
    renderProfileView()
    showToast("Skill added!", "success")
  }
}

function handlePhotoUpload(e) {
  const file = e.target.files[0]
  if (file && currentUser) {
    const reader = new FileReader()
    reader.onload = (event) => {
      currentUser.profilePhoto = event.target.result

      // Update in users array
      const userIndex = users.findIndex((u) => u.id === currentUser.id)
      if (userIndex !== -1) {
        users[userIndex] = currentUser
      }

      // Update profile picture in UI
      const profilePic = document.getElementById("profile-pic")
      const profilePicSmall = document.querySelector(".profile-pic-small")

      if (profilePic) profilePic.src = event.target.result
      if (profilePicSmall) profilePicSmall.src = event.target.result

      showToast("Profile photo updated!", "success")
    }
    reader.readAsDataURL(file)
  }
}

function updateAvailability() {
  if (!currentUser) return

  const availability = []

  const weekends = document.getElementById("weekends-availability")
  const evenings = document.getElementById("evenings-availability")
  const weekdays = document.getElementById("weekdays-availability")

  if (weekends && weekends.checked) availability.push("weekends")
  if (evenings && evenings.checked) availability.push("evenings")
  if (weekdays && weekdays.checked) availability.push("weekdays")

  currentUser.availability = availability

  // Update in users array
  const userIndex = users.findIndex((u) => u.id === currentUser.id)
  if (userIndex !== -1) {
    users[userIndex] = currentUser
  }
}

function renderUserRatings() {
  const container = document.getElementById("user-ratings")
  if (!container || !currentUser) return

  container.innerHTML = ""

  // Get ratings for current user
  const userRatings = ratings.filter((r) => r.toUserId === currentUser.id)

  if (userRatings.length === 0) {
    container.innerHTML = "<p>No ratings yet</p>"
    return
  }

  userRatings.forEach((rating) => {
    const fromUser = users.find((u) => u.id === rating.fromUserId)
    const swap = swapRequests.find((s) => s.id === rating.swapId)

    if (!fromUser) return

    const ratingElement = document.createElement("div")
    ratingElement.className = "rating"
    ratingElement.innerHTML = `
            <div class="rating-stars">
                ${"★".repeat(rating.rating)}${"☆".repeat(5 - rating.rating)}
            </div>
            <div class="rating-user">From ${fromUser.name}</div>
            <div class="rating-skill">For ${swap ? swap.offeredSkill : "a skill swap"}</div>
            <div class="rating-comment">"${rating.comment}"</div>
        `
    container.appendChild(ratingElement)
  })
}

// Home view functions
function renderHomeView() {
  renderPopularSkills()
}

function renderPopularSkills() {
  const container = document.getElementById("popular-skills")
  if (!container) return

  container.innerHTML = ""

  popularSkills.forEach((skill) => {
    const skillCard = document.createElement("div")
    skillCard.className = "skill-card"
    skillCard.innerHTML = `
            <i class="fas fa-${getSkillIcon(skill)}"></i>
            <h4>${skill}</h4>
            <p>${Math.floor(Math.random() * 50) + 10} people offering this skill</p>
        `
    skillCard.addEventListener("click", () => {
      const skillSearch = document.getElementById("skill-search")
      if (skillSearch) skillSearch.value = skill
      showView("browse")
      renderBrowseView()
    })
    container.appendChild(skillCard)
  })
}

function getSkillIcon(skill) {
  const skillIcons = {
    "Graphic Design": "palette",
    "Web Development": "code",
    Spanish: "language",
    Photography: "camera",
    Cooking: "utensils",
    Excel: "file-excel",
    Photoshop: "image",
    Yoga: "spa",
    Marketing: "bullhorn",
    Writing: "pen",
  }

  return skillIcons[skill] || "star"
}

// Browse view functions
let currentPage = 1
const itemsPerPage = 12
let totalFilteredUsers = []

function renderBrowseView() {
  const skillSearch = document.getElementById("skill-search")
  const locationFilter = document.getElementById("location-filter")
  const availabilityFilter = document.getElementById("availability-filter")

  const searchTerm = skillSearch ? skillSearch.value.toLowerCase() : ""
  const locationFilterValue = locationFilter ? locationFilter.value : ""
  const availabilityFilterValue = availabilityFilter ? availabilityFilter.value : ""

  // Filter users with enhanced search
  totalFilteredUsers = users.filter((user) => {
    if (!user.isPublic || (currentUser && user.id === currentUser.id)) return false

    // Enhanced search logic
    if (searchTerm) {
      const nameMatch = user.name.toLowerCase().includes(searchTerm)
      const skillMatch = [...user.offeredSkills, ...user.wantedSkills].some((skill) =>
        skill.toLowerCase().includes(searchTerm),
      )
      const locationMatch = user.location && user.location.toLowerCase().includes(searchTerm)
      const bioMatch = user.bio && user.bio.toLowerCase().includes(searchTerm)

      if (!nameMatch && !skillMatch && !locationMatch && !bioMatch) return false
    }

    // Location filter
    if (locationFilterValue && locationFilterValue !== "remote" && user.location !== locationFilterValue) {
      return false
    }
    if (locationFilterValue === "remote" && user.location.toLowerCase() !== "remote") {
      return false
    }

    // Availability filter
    if (availabilityFilterValue && !user.availability.includes(availabilityFilterValue)) {
      return false
    }

    return true
  })

  // Sort results for better relevance
  if (searchTerm) {
    totalFilteredUsers.sort((a, b) => {
      const aNameMatch = a.name.toLowerCase().includes(searchTerm)
      const bNameMatch = b.name.toLowerCase().includes(searchTerm)
      if (aNameMatch && !bNameMatch) return -1
      if (!aNameMatch && bNameMatch) return 1
      return 0
    })
  }

  // Calculate pagination
  const totalPages = Math.ceil(totalFilteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPageUsers = totalFilteredUsers.slice(startIndex, endIndex)

  // Update results count
  const resultsCount = document.getElementById("results-count")
  if (resultsCount) {
    resultsCount.textContent = totalFilteredUsers.length
  }

  // Render results
  const container = document.getElementById("search-results")
  if (!container) return

  container.innerHTML = ""

  if (totalFilteredUsers.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search" style="font-size: 3rem; color: var(--gray); margin-bottom: 1rem;"></i>
        <h3>No users found</h3>
        <p>Try adjusting your search criteria or filters</p>
        <button class="btn btn-outline" onclick="resetFiltersHandler()">Reset Filters</button>
      </div>
    `
    return
  }

  currentPageUsers.forEach((user) => {
    const userCard = document.createElement("div")
    userCard.className = "user-card"
    userCard.innerHTML = `
      <div class="user-card-header">
        <img src="${user.profilePhoto}" alt="${user.name}" class="user-card-pic">
        <div class="user-card-info">
          <h3>${user.name}</h3>
          <div class="user-card-location">
            <i class="fas fa-map-marker-alt"></i> ${user.location || "Location not specified"}
          </div>
        </div>
      </div>
      <div class="user-card-body">
        <div class="user-card-bio">
          <p>${user.bio ? user.bio.substring(0, 100) + (user.bio.length > 100 ? "..." : "") : "No bio available"}</p>
        </div>
        <div class="user-card-skills">
          <h4>Offers:</h4>
          <div class="skills-container">
            ${user.offeredSkills
              .slice(0, 3)
              .map((skill) => `<span class="skill-tag offer">${skill}</span>`)
              .join("")}
            ${user.offeredSkills.length > 3 ? `<span class="skill-tag more">+${user.offeredSkills.length - 3} more</span>` : ""}
          </div>
          <h4>Wants:</h4>
          <div class="skills-container">
            ${user.wantedSkills
              .slice(0, 3)
              .map((skill) => `<span class="skill-tag want">${skill}</span>`)
              .join("")}
            ${user.wantedSkills.length > 3 ? `<span class="skill-tag more">+${user.wantedSkills.length - 3} more</span>` : ""}
          </div>
        </div>
      </div>
      <div class="user-card-footer">
        <div class="availability-badge">
          <i class="fas fa-clock"></i> ${user.availability.join(", ") || "Not specified"}
        </div>
        <button class="btn btn-primary btn-small request-swap-btn" data-user-id="${user.id}">
          <i class="fas fa-handshake"></i> Request Swap
        </button>
      </div>
    `
    container.appendChild(userCard)
  })

  // Render pagination
  renderPagination(totalPages)

  // Add event listeners to swap buttons
  document.querySelectorAll(".request-swap-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const userId = e.target.getAttribute("data-user-id")
      openSwapModal(userId)
    })
  })
}

function renderPagination(totalPages) {
  const paginationContainer = document.querySelector(".pagination")
  if (!paginationContainer) return

  if (totalPages <= 1) {
    paginationContainer.style.display = "none"
    return
  }

  paginationContainer.style.display = "flex"
  paginationContainer.innerHTML = ""

  // Previous button
  const prevBtn = document.createElement("button")
  prevBtn.className = `btn btn-outline pagination-btn ${currentPage === 1 ? "disabled" : ""}`
  prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i> Previous'
  prevBtn.disabled = currentPage === 1
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--
      renderBrowseView()
      scrollToTop()
    }
  })
  paginationContainer.appendChild(prevBtn)

  // Page numbers
  const pageNumbers = generatePageNumbers(currentPage, totalPages)
  pageNumbers.forEach((pageNum) => {
    if (pageNum === "...") {
      const ellipsis = document.createElement("span")
      ellipsis.className = "pagination-ellipsis"
      ellipsis.textContent = "..."
      paginationContainer.appendChild(ellipsis)
    } else {
      const pageBtn = document.createElement("button")
      pageBtn.className = `btn pagination-btn ${pageNum === currentPage ? "btn-primary active" : "btn-outline"}`
      pageBtn.textContent = pageNum
      pageBtn.addEventListener("click", () => {
        currentPage = pageNum
        renderBrowseView()
        scrollToTop()
      })
      paginationContainer.appendChild(pageBtn)
    }
  })

  // Next button
  const nextBtn = document.createElement("button")
  nextBtn.className = `btn btn-outline pagination-btn ${currentPage === totalPages ? "disabled" : ""}`
  nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>'
  nextBtn.disabled = currentPage === totalPages
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++
      renderBrowseView()
      scrollToTop()
    }
  })
  paginationContainer.appendChild(nextBtn)

  // Page info
  const pageInfo = document.getElementById("page-info")
  if (pageInfo) {
    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalFilteredUsers.length)
    pageInfo.textContent = `Showing ${startItem}-${endItem} of ${totalFilteredUsers.length} users`
  }
}

function generatePageNumbers(current, total) {
  const pages = []
  const maxVisible = 7

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)

    if (current > 4) {
      pages.push("...")
    }

    const start = Math.max(2, current - 2)
    const end = Math.min(total - 1, current + 2)

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }

    if (current < total - 3) {
      pages.push("...")
    }

    if (!pages.includes(total)) {
      pages.push(total)
    }
  }

  return pages
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

function resetFiltersHandler() {
  const skillSearch = document.getElementById("skill-search")
  const locationFilter = document.getElementById("location-filter")
  const availabilityFilter = document.getElementById("availability-filter")

  if (skillSearch) skillSearch.value = ""
  if (locationFilter) locationFilter.value = ""
  if (availabilityFilter) availabilityFilter.value = ""

  currentPage = 1
  renderBrowseView()
}

function openSwapModal(userId) {
  if (!currentUser) {
    openModal("login")
    return
  }

  const user = users.find((u) => u.id === Number.parseInt(userId))
  if (!user) return

  // Set modal title
  const modalTitle = document.getElementById("swap-modal-title")
  if (modalTitle) {
    modalTitle.textContent = "Skill Swap Request"
  }

  // Prepare modal content
  const modalContent = document.getElementById("swap-modal-content")
  if (!modalContent) return

  modalContent.innerHTML = `
    <div class="swap-request-container">
      <!-- Users Section -->
      <div class="swap-users-section">
        <div class="user-profile-card">
          <img src="${currentUser.profilePhoto}" alt="${currentUser.name}">
          <h3>${currentUser.name}</h3>
          <div class="location">
            <i class="fas fa-map-marker-alt"></i>
            <span>${currentUser.location || "Location not set"}</span>
          </div>
        </div>
        
        <div class="swap-arrow-section">
          <i class="fas fa-exchange-alt"></i>
        </div>
        
        <div class="user-profile-card">
          <img src="${user.profilePhoto}" alt="${user.name}">
          <h3>${user.name}</h3>
          <div class="location">
            <i class="fas fa-map-marker-alt"></i>
            <span>${user.location || "Location not set"}</span>
          </div>
        </div>
      </div>

      <!-- Skills Selection Section -->
      <div class="skills-selection-section">
        <div class="skill-selection-group">
          <h4>Choose one of your offered skills:</h4>
          <select id="offered-skill-select" class="skill-dropdown">
            <option value="">Select a skill you offer...</option>
            ${currentUser.offeredSkills.map((skill) => `<option value="${skill}">${skill}</option>`).join("")}
          </select>
        </div>
        
        <div class="skill-selection-group">
          <h4>Choose one of their wanted skills:</h4>
          <select id="wanted-skill-select" class="skill-dropdown">
            <option value="">Select a skill they want...</option>
            ${user.wantedSkills.map((skill) => `<option value="${skill}">${skill}</option>`).join("")}
          </select>
        </div>
      </div>

      <!-- Message Section -->
      <div class="message-section">
        <label for="swap-message">Message to ${user.name}:</label>
        <textarea id="swap-message" placeholder="Explain what you'd like to learn and teach, your availability, and any other details..."></textarea>
      </div>

      <!-- Actions Section -->
      <div class="swap-actions-section">
        <button class="btn btn-outline" id="cancel-swap-btn">Cancel</button>
        <button class="btn btn-primary" id="send-swap-btn" data-user-id="${user.id}">Send Request</button>
      </div>
    </div>
  `

  // Add event listeners
  const cancelSwapBtn = document.getElementById("cancel-swap-btn")
  const sendSwapBtn = document.getElementById("send-swap-btn")

  if (cancelSwapBtn) {
    cancelSwapBtn.addEventListener("click", closeAllModals)
  }

  if (sendSwapBtn) {
    sendSwapBtn.addEventListener("click", sendEnhancedSwapRequest)
  }

  openModal("swap")
}

function sendEnhancedSwapRequest(e) {
  const userId = e.target.getAttribute("data-user-id")
  const messageTextarea = document.getElementById("swap-message")
  const offeredSkillSelect = document.getElementById("offered-skill-select")
  const wantedSkillSelect = document.getElementById("wanted-skill-select")

  const message = messageTextarea ? messageTextarea.value.trim() : ""
  const offeredSkill = offeredSkillSelect ? offeredSkillSelect.value : ""
  const wantedSkill = wantedSkillSelect ? wantedSkillSelect.value : ""

  if (!currentUser) return

  // Validation
  if (!offeredSkill) {
    showToast("Please select a skill you offer", "warning")
    return
  }

  if (!wantedSkill) {
    showToast("Please select a skill they want", "warning")
    return
  }

  if (!message) {
    showToast("Please add a message to your request", "warning")
    return
  }

  // Create new swap request
  const newRequest = {
    id: swapRequests.length + 1,
    fromUserId: currentUser.id,
    toUserId: Number.parseInt(userId),
    offeredSkill,
    wantedSkill,
    message,
    status: "pending",
    createdAt: new Date(),
  }

  swapRequests.push(newRequest)
  closeAllModals()

  // Show success message
  showToast("Swap request sent successfully!", "success")

  // Update swaps view if we're on it
  if (views.swaps && views.swaps.style.display === "block") {
    renderSwapsView()
  }
}

// Swaps view functions
function renderSwapsView() {
  if (!currentUser) {
    showView("home")
    return
  }

  // Show pending tab by default
  switchSwapsTab("pending")
}

function switchSwapsTab(tab) {
  // Update active tab
  document.querySelectorAll(".swaps-tabs .tab-btn").forEach((btn) => {
    btn.classList.remove("active")
    if (btn.getAttribute("data-tab") === tab) {
      btn.classList.add("active")
    }
  })

  // Hide all tab contents
  document.querySelectorAll(".swaps-list").forEach((list) => {
    list.style.display = "none"
  })

  // Show selected tab content
  const containerId = `${tab}-swaps`
  const container = document.getElementById(containerId)
  if (!container) return

  container.style.display = "block"
  container.innerHTML = ""

  // Get swaps for this tab
  let swaps = []
  if (tab === "pending") {
    swaps = swapRequests.filter(
      (req) => req.status === "pending" && (req.fromUserId === currentUser.id || req.toUserId === currentUser.id),
    )
  } else if (tab === "accepted") {
    swaps = swapRequests.filter(
      (req) => req.status === "accepted" && (req.fromUserId === currentUser.id || req.toUserId === currentUser.id),
    )
  } else if (tab === "completed") {
    swaps = swapRequests.filter(
      (req) => req.status === "completed" && (req.fromUserId === currentUser.id || req.toUserId === currentUser.id),
    )
  }

  if (swaps.length === 0) {
    container.innerHTML = `<p class="no-swaps">No ${tab} swaps found</p>`
    return
  }

  swaps.forEach((swap) => {
    const fromUser = users.find((u) => u.id === swap.fromUserId)
    const toUser = users.find((u) => u.id === swap.toUserId)

    if (!fromUser || !toUser) return

    const isCurrentUserSender = swap.fromUserId === currentUser.id
    const otherUser = isCurrentUserSender ? toUser : fromUser

    const swapCard = document.createElement("div")
    swapCard.className = `swap-status-card status-${swap.status}`
    swapCard.innerHTML = `
      <div class="swap-card-header">
        <div class="swap-participants">
          <img src="${fromUser.profilePhoto}" alt="${fromUser.name}">
          <div class="swap-arrow"><i class="fas fa-exchange-alt"></i></div>
          <img src="${toUser.profilePhoto}" alt="${toUser.name}">
        </div>
        <div class="swap-status-badge ${swap.status}">
          ${swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
        </div>
      </div>

      <div class="swap-details-section">
        <div class="swap-skills-info">
          <div class="skill-offer">
            <strong>${fromUser.name}</strong> offers
            <div class="skill-tag offer">${swap.offeredSkill}</div>
          </div>
          <div class="swap-arrow"><i class="fas fa-exchange-alt"></i></div>
          <div class="skill-want">
            <strong>${toUser.name}</strong> wants
            <div class="skill-tag want">${swap.wantedSkill}</div>
          </div>
        </div>

        ${swap.message ? `<div class="swap-message-preview">"${swap.message}"</div>` : ""}
        
        <div class="swap-date">
          <i class="fas fa-calendar-alt"></i> ${formatDate(swap.createdAt)}
        </div>
      </div>

      <div class="swap-actions-row">
        ${
          swap.status === "pending" && swap.toUserId === currentUser.id
            ? `
            <button class="btn btn-primary btn-small accept-swap-btn" data-swap-id="${swap.id}">Accept</button>
            <button class="btn btn-outline btn-small reject-swap-btn" data-swap-id="${swap.id}">Reject</button>
        `
            : ""
        }
        ${
          swap.status === "pending" && swap.fromUserId === currentUser.id
            ? `
            <button class="btn btn-outline btn-small cancel-swap-btn" data-swap-id="${swap.id}">Cancel</button>
        `
            : ""
        }
        ${
          swap.status === "accepted"
            ? `
            <button class="btn btn-primary btn-small complete-swap-btn" data-swap-id="${swap.id}">Mark Complete</button>
        `
            : ""
        }
        ${
          swap.status === "completed" && !ratings.some((r) => r.swapId === swap.id && r.fromUserId === currentUser.id)
            ? `
            <button class="btn btn-primary btn-small rate-swap-btn" data-swap-id="${swap.id}" data-user-id="${otherUser.id}">Rate Swap</button>
        `
            : ""
        }
      </div>
    `
    container.appendChild(swapCard)
  })

  // Add pagination if there are many swaps
  if (swaps.length > 5) {
    addPagination(container, swaps, 5)
  }

  // Re-add event listeners for action buttons
  addSwapActionListeners()
}

function addPagination(container, items, itemsPerPage) {
  const totalPages = Math.ceil(items.length / itemsPerPage)

  if (totalPages <= 1) return

  const paginationContainer = document.createElement("div")
  paginationContainer.className = "pagination-container"

  paginationContainer.innerHTML = `
    <button class="pagination-btn" id="prev-page" disabled>
      <i class="fas fa-chevron-left"></i>
    </button>
    <span class="pagination-info">Page 1 of ${totalPages}</span>
    <button class="pagination-btn" id="next-page" ${totalPages === 1 ? "disabled" : ""}>
      <i class="fas fa-chevron-right"></i>
    </button>
  `

  container.appendChild(paginationContainer)
}

function addSwapActionListeners() {
  // Add event listeners to action buttons
  document.querySelectorAll(".accept-swap-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const swapId = Number.parseInt(e.target.getAttribute("data-swap-id"))
      acceptSwapRequest(swapId)
    })
  })

  document.querySelectorAll(".reject-swap-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const swapId = Number.parseInt(e.target.getAttribute("data-swap-id"))
      rejectSwapRequest(swapId)
    })
  })

  document.querySelectorAll(".cancel-swap-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const swapId = Number.parseInt(e.target.getAttribute("data-swap-id"))
      cancelSwapRequest(swapId)
    })
  })

  document.querySelectorAll(".complete-swap-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const swapId = Number.parseInt(e.target.getAttribute("data-swap-id"))
      completeSwapRequest(swapId)
    })
  })

  document.querySelectorAll(".rate-swap-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const swapId = Number.parseInt(e.target.getAttribute("data-swap-id"))
      const userId = Number.parseInt(e.target.getAttribute("data-user-id"))
      openRatingModal(swapId, userId)
    })
  })
}

function acceptSwapRequest(swapId) {
  const swapIndex = swapRequests.findIndex((s) => s.id === swapId)
  if (swapIndex !== -1) {
    swapRequests[swapIndex].status = "accepted"
    renderSwapsView()
    showToast("Swap request accepted!", "success")
  }
}

function cancelSwapRequest(swapId) {
  const swapIndex = swapRequests.findIndex((s) => s.id === swapId)
  if (swapIndex !== -1) {
    const swap = swapRequests[swapIndex]

    // Show confirmation dialog
    if (confirm("Are you sure you want to cancel this swap request?")) {
      swapRequests.splice(swapIndex, 1)
      renderSwapsView()
      showToast("Swap request cancelled successfully", "info")
    }
  }
}

function rejectSwapRequest(swapId) {
  const swapIndex = swapRequests.findIndex((s) => s.id === swapId)
  if (swapIndex !== -1) {
    const swap = swapRequests[swapIndex]

    // Show confirmation dialog
    if (confirm("Are you sure you want to reject this swap request?")) {
      swapRequests.splice(swapIndex, 1)
      renderSwapsView()
      showToast("Swap request rejected", "info")
    }
  }
}

function completeSwapRequest(swapId) {
  const swapIndex = swapRequests.findIndex((s) => s.id === swapId)
  if (swapIndex !== -1) {
    swapRequests[swapIndex].status = "completed"
    swapRequests[swapIndex].completedAt = new Date()
    renderSwapsView()
    showToast("Swap marked as completed!", "success")
  }
}

function openRatingModal(swapId, userId) {
  const user = users.find((u) => u.id === userId)
  if (!user) return

  const modalTitle = document.getElementById("rating-modal-title")
  if (modalTitle) {
    modalTitle.textContent = `Rate Your Swap with ${user.name}`
  }

  const modalContent = document.getElementById("rating-modal-content")
  if (!modalContent) return

  modalContent.innerHTML = `
        <div class="rating-form">
            <div class="rating-input">
                <i class="fas fa-star" data-rating="1"></i>
                <i class="fas fa-star" data-rating="2"></i>
                <i class="fas fa-star" data-rating="3"></i>
                <i class="fas fa-star" data-rating="4"></i>
                <i class="fas fa-star" data-rating="5"></i>
            </div>
            <input type="hidden" id="selected-rating" value="0">
            <div class="form-group">
                <label for="rating-comment">Your Feedback (optional)</label>
                <textarea id="rating-comment" placeholder="How was your experience?"></textarea>
            </div>
            <div class="rating-actions">
                <button class="btn btn-outline" id="cancel-rating-btn">Cancel</button>
                <button class="btn btn-primary" id="submit-rating-btn" data-swap-id="${swapId}" data-user-id="${userId}">Submit Rating</button>
            </div>
        </div>
    `

  // Set up star rating interaction
  const stars = modalContent.querySelectorAll(".rating-input i")
  stars.forEach((star) => {
    star.addEventListener("click", (e) => {
      const rating = Number.parseInt(e.target.getAttribute("data-rating"))
      const selectedRating = document.getElementById("selected-rating")
      if (selectedRating) selectedRating.value = rating

      stars.forEach((s, index) => {
        if (index < rating) {
          s.classList.add("active")
        } else {
          s.classList.remove("active")
        }
      })
    })

    star.addEventListener("mouseover", (e) => {
      const rating = Number.parseInt(e.target.getAttribute("data-rating"))

      stars.forEach((s, index) => {
        if (index < rating) {
          s.classList.add("hover")
        } else {
          s.classList.remove("hover")
        }
      })
    })

    star.addEventListener("mouseout", () => {
      stars.forEach((s) => s.classList.remove("hover"))
    })
  })

  const cancelRatingBtn = document.getElementById("cancel-rating-btn")
  const submitRatingBtn = document.getElementById("submit-rating-btn")

  if (cancelRatingBtn) {
    cancelRatingBtn.addEventListener("click", closeAllModals)
  }

  if (submitRatingBtn) {
    submitRatingBtn.addEventListener("click", submitRating)
  }

  openModal("rating")
}

function submitRating(e) {
  const swapId = Number.parseInt(e.target.getAttribute("data-swap-id"))
  const userId = Number.parseInt(e.target.getAttribute("data-user-id"))
  const selectedRating = document.getElementById("selected-rating")
  const ratingComment = document.getElementById("rating-comment")

  const rating = selectedRating ? Number.parseInt(selectedRating.value) : 0
  const comment = ratingComment ? ratingComment.value : ""

  if (rating === 0) {
    showToast("Please select a rating", "warning")
    return
  }

  const newRating = {
    id: ratings.length + 1,
    swapId,
    fromUserId: currentUser.id,
    toUserId: userId,
    rating,
    comment,
    createdAt: new Date(),
  }

  ratings.push(newRating)
  closeAllModals()
  renderSwapsView()
  showToast("Thank you for your rating!", "success")
}

// Admin view functions
function renderAdminView() {
  if (!currentUser || !currentUser.isAdmin) {
    showView("home")
    return
  }

  // Show users tab by default
  switchAdminTab("admin-users")
}

function switchAdminTab(tab) {
  // Update active tab
  document.querySelectorAll(".admin-tabs .tab-btn").forEach((btn) => {
    btn.classList.remove("active")
    if (btn.getAttribute("data-tab") === tab) {
      btn.classList.add("active")
    }
  })

  // Hide all tab contents
  document.querySelectorAll(".admin-tab-content").forEach((content) => {
    content.style.display = "none"
  })

  // Show selected tab content
  const containerId = `${tab}-tab`
  const container = document.getElementById(containerId)
  if (container) {
    container.style.display = "block"
  }

  // Load content for the tab
  if (tab === "admin-users") {
    renderAdminUsers()
  } else if (tab === "admin-content") {
    renderPendingSkills()
  }
}

function renderAdminUsers() {
  const searchInput = document.getElementById("admin-user-search")
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : ""

  let filteredUsers = users
  if (searchTerm) {
    filteredUsers = users.filter(
      (user) => user.name.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm),
    )
  }

  const tableBody = document.getElementById("admin-users-table")
  if (!tableBody) return

  tableBody.innerHTML = ""

  filteredUsers.forEach((user) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${user.id}</td>
            <td>
                <div class="user-info">
                    <img src="${user.profilePhoto}" alt="${user.name}" class="user-table-pic">
                    ${user.name}
                </div>
            </td>
            <td>${user.email}</td>
            <td>
                <span class="status-badge ${user.isPublic ? "status-public" : "status-private"}">
                    ${user.isPublic ? "Public" : "Private"}
                </span>
                ${user.isAdmin ? '<span class="badge badge-primary">Admin</span>' : ""}
            </td>
            <td>
                <div class="admin-actions">
                    <button class="btn btn-outline btn-small admin-edit-btn" data-user-id="${user.id}">Edit</button>
                    ${
                      !user.isAdmin
                        ? `
                        <button class="btn btn-danger btn-small admin-ban-btn" data-user-id="${user.id}">
                            ${user.isBanned ? "Unban" : "Ban"}
                        </button>
                    `
                        : ""
                    }
                </div>
            </td>
        `
    tableBody.appendChild(row)
  })

  // Add event listeners to action buttons
  document.querySelectorAll(".admin-edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const userId = Number.parseInt(e.target.getAttribute("data-user-id"))
      editUser(userId)
    })
  })

  document.querySelectorAll(".admin-ban-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const userId = Number.parseInt(e.target.getAttribute("data-user-id"))
      toggleBanUser(userId)
    })
  })
}

function renderPendingSkills() {
  // Get all skills that need approval (in a real app, these would be flagged)
  const pendingSkills = []
  users.forEach((user) => {
    user.offeredSkills.forEach((skill) => {
      if (!skills.includes(skill)) {
        pendingSkills.push({
          userId: user.id,
          userName: user.name,
          skill,
        })
      }
    })
    user.wantedSkills.forEach((skill) => {
      if (!skills.includes(skill)) {
        pendingSkills.push({
          userId: user.id,
          userName: user.name,
          skill,
        })
      }
    })
  })

  const container = document.getElementById("pending-skills-list")
  if (!container) return

  container.innerHTML = ""

  if (pendingSkills.length === 0) {
    container.innerHTML = "<p>No skills pending approval</p>"
    return
  }

  pendingSkills.forEach((item) => {
    const skillItem = document.createElement("div")
    skillItem.className = "pending-skill-item"
    skillItem.innerHTML = `
            <div class="skill-info">
                <h4>${item.skill}</h4>
                <p>Submitted by: ${item.userName}</p>
            </div>
            <div class="skill-actions">
                <button class="btn btn-primary btn-small approve-skill-btn" data-skill="${item.skill}" data-user-id="${item.userId}">Approve</button>
                <button class="btn btn-outline btn-small reject-skill-btn" data-skill="${item.skill}" data-user-id="${item.userId}">Reject</button>
            </div>
        `
    container.appendChild(skillItem)
  })

  // Add event listeners to action buttons
  document.querySelectorAll(".approve-skill-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const skill = e.target.getAttribute("data-skill")
      const userId = Number.parseInt(e.target.getAttribute("data-user-id"))
      approveSkill(skill, userId)
    })
  })

  document.querySelectorAll(".reject-skill-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const skill = e.target.getAttribute("data-skill")
      const userId = Number.parseInt(e.target.getAttribute("data-user-id"))
      rejectSkill(skill, userId)
    })
  })
}

function editUser(userId) {
  const user = users.find((u) => u.id === userId)
  if (!user) return

  showToast(`Edit user: ${user.name} - This would open an edit form in a real implementation.`, "info")
}

function toggleBanUser(userId) {
  const userIndex = users.findIndex((u) => u.id === userId)
  if (userIndex !== -1) {
    users[userIndex].isBanned = !users[userIndex].isBanned
    renderAdminUsers()
    showToast(`User ${users[userIndex].isBanned ? "banned" : "unbanned"}`, "info")
  }
}

function approveSkill(skill, userId) {
  if (!skills.includes(skill)) {
    skills.push(skill)
  }

  showToast(`Skill "${skill}" approved`, "success")
  renderPendingSkills()
}

function rejectSkill(skill, userId) {
  showToast(`Skill "${skill}" rejected`, "info")
  renderPendingSkills()
}

function exportUserData() {
  showToast("User data exported successfully", "success")
}

function sendPlatformMessage() {
  const subjectInput = document.getElementById("message-subject")
  const contentInput = document.getElementById("message-content")
  const urgentInput = document.getElementById("urgent-message")

  const subject = subjectInput ? subjectInput.value : ""
  const content = contentInput ? contentInput.value : ""
  const isUrgent = urgentInput ? urgentInput.checked : false

  if (!subject || !content) {
    showToast("Please enter both subject and content", "warning")
    return
  }

  showToast(`Message sent to all users${isUrgent ? " (urgent)" : ""}`, "success")

  // Clear form
  if (subjectInput) subjectInput.value = ""
  if (contentInput) contentInput.value = ""
  if (urgentInput) urgentInput.checked = false
}

function generateReport() {
  const reportTypeSelect = document.getElementById("report-type")
  const startDateInput = document.getElementById("report-start-date")
  const endDateInput = document.getElementById("report-end-date")

  const reportType = reportTypeSelect ? reportTypeSelect.value : "swaps"
  const startDate = startDateInput ? startDateInput.value : ""
  const endDate = endDateInput ? endDateInput.value : ""

  let reportData = ""

  if (reportType === "swaps") {
    reportData = `
            <h3>Swap Statistics</h3>
            <p>Total swaps: ${swapRequests.length}</p>
            <p>Pending: ${swapRequests.filter((s) => s.status === "pending").length}</p>
            <p>Accepted: ${swapRequests.filter((s) => s.status === "accepted").length}</p>
            <p>Completed: ${swapRequests.filter((s) => s.status === "completed").length}</p>
        `
  } else if (reportType === "users") {
    reportData = `
            <h3>User Activity</h3>
            <p>Total users: ${users.length}</p>
            <p>Active users: ${users.filter((u) => !u.isBanned).length}</p>
            <p>Banned users: ${users.filter((u) => u.isBanned).length}</p>
            <p>Admins: ${users.filter((u) => u.isAdmin).length}</p>
        `
  } else if (reportType === "feedback") {
    const avgRating =
      ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1) : "0"
    reportData = `
            <h3>Feedback Summary</h3>
            <p>Total ratings: ${ratings.length}</p>
            <p>Average rating: ${avgRating}</p>
        `
  }

  const reportResults = document.getElementById("report-results")
  if (reportResults) {
    reportResults.innerHTML = reportData
  }

  showToast("Report generated", "success")
}

function downloadReport() {
  showToast("Report downloaded as CSV", "success")
}

// Utility functions
function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function showToast(message, type) {
  const toast = document.createElement("div")
  toast.className = `toast toast-${type}`
  toast.innerHTML = `
        <i class="fas fa-${getToastIcon(type)}"></i>
        <span>${message}</span>
    `

  document.body.appendChild(toast)

  setTimeout(() => {
    toast.classList.add("show")
  }, 100)

  setTimeout(() => {
    toast.classList.remove("show")
    setTimeout(() => {
      toast.remove()
    }, 300)
  }, 3000)
}

function getToastIcon(type) {
  const icons = {
    success: "check-circle",
    error: "exclamation-circle",
    warning: "exclamation-triangle",
    info: "info-circle",
  }
  return icons[type] || "info-circle"
}

// Initialize any UI components
function initUIComponents() {
  // Populate location filter dropdown
  const locationFilter = document.getElementById("location-filter")
  if (locationFilter) {
    locations.forEach((location) => {
      const option = document.createElement("option")
      option.value = location
      option.textContent = location
      locationFilter.appendChild(option)
    })
  }

  // Add scroll event listener for header effect
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".app-header")
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add("scrolled")
      } else {
        header.classList.remove("scrolled")
      }
    }
  })
}
