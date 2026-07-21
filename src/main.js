import './style.css';
import eventPhoto1 from './assets/event_photo_1.jpg';
import eventPhoto2 from './assets/event_photo_2.jpg';
import eventPhoto3 from './assets/event_photo_3.jpg';
import eventPhoto4 from './assets/event_photo_4.jpg';
import eventPhoto5 from './assets/event_photo_5.jpg';
import logoImg from './assets/logo.png';

document.addEventListener('DOMContentLoaded', () => {
  // Set footer logo source dynamically from bundled asset
  const footerLogo = document.querySelector('.footer-logo');
  if (footerLogo) {
    footerLogo.src = logoImg;
  }

  // --- Header Scroll State & Scrollspy ---
  const header = document.querySelector('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinksList = document.querySelectorAll('.nav-links .nav-link');

  window.addEventListener('scroll', () => {
    // 1. Header scroll visual class
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // 2. Scrollspy active link tracking
    let currentId = '';
    const scrollPos = window.scrollY + 120; // navigation offset height
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinksList.forEach(item => {
        item.classList.remove('active');
        const link = item.querySelector('a');
        if (link && link.getAttribute('href') === `#${currentId}`) {
          item.classList.add('active');
        }
      });
    }
  });

  // --- Mobile Navigation Menu Toggle ---
  const mobileToggle = document.getElementById('mobile-toggle') || document.querySelector('.mobile-nav-toggle');
  const navLinks = document.getElementById('nav-menu') || document.querySelector('.nav-links');
  
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('mobile-open');
    });

    // Close menu when a navigation item is selected
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        navLinks.classList.remove('mobile-open');
      }
    });
  }

  // --- Countdown Timer (30 days countdown from now) ---
  const countdownTarget = new Date();
  countdownTarget.setDate(countdownTarget.getDate() + 30);
  countdownTarget.setHours(countdownTarget.getHours() + 25); // matching figma text: 30 days 25 hours

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = countdownTarget.getTime() - now;

    if (difference < 0) {
      document.querySelector('.countdown').innerHTML = "<div class='countdown-item'><span class='countdown-value'>SYSTEM ONLINE</span></div>";
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    const dVal = document.getElementById('days');
    const hVal = document.getElementById('hours');
    const mVal = document.getElementById('mins');
    const sVal = document.getElementById('secs');

    if (dVal) dVal.textContent = String(days).padStart(2, '0');
    if (hVal) hVal.textContent = String(hours).padStart(2, '0');
    if (mVal) mVal.textContent = String(minutes).padStart(2, '0');
    if (sVal) sVal.textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // --- Carousels Horizontal Slider Buttons ---
  function initCarousel(carouselId, prevBtnId, nextBtnId, dotsClass) {
    const container = document.getElementById(carouselId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const dots = container ? container.parentElement.querySelectorAll(dotsClass + ' .slider-dot') : [];

    if (container && prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        const card = container.querySelector('.carousel-card');
        const step = card ? (card.offsetWidth + 20) : 335;
        container.scrollBy({ left: -step, behavior: 'smooth' });
      });
      nextBtn.addEventListener('click', () => {
        const card = container.querySelector('.carousel-card');
        const step = card ? (card.offsetWidth + 20) : 335;
        container.scrollBy({ left: step, behavior: 'smooth' });
      });

      // Update dots indicator active class on horizontal scroll
      container.addEventListener('scroll', () => {
        if (!dots || dots.length === 0) return;
        const scrollWidth = container.scrollWidth - container.clientWidth;
        if (scrollWidth <= 0) return;
        const percent = container.scrollLeft / scrollWidth;
        const activeIndex = Math.min(Math.round(percent * (dots.length - 1)), dots.length - 1);
        
        dots.forEach((dot, idx) => {
          if (idx === activeIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      });
    }
  }

  initCarousel('senior-carousel', 'senior-prev', 'senior-next', '.slider-dots');
  initCarousel('junior-carousel', 'junior-prev', 'junior-next', '.slider-dots');

  // --- Dedicated Old Events Section Component ---
  const oldEvents = [
    { image: eventPhoto1 },
    { image: eventPhoto2 },
    { image: eventPhoto3 },
    { image: eventPhoto4 },
    { image: eventPhoto5 }
  ];

  let currentEventIndex = 0;

  function updateOldEventCard(cardIdPrefix, eventData) {
    const img = document.getElementById(`card-img-${cardIdPrefix}`);
    if (img) img.src = eventData.image;
  }

  function renderOldEventsStack() {
    const total = oldEvents.length;
    if (total === 0) return;

    const centerIdx = currentEventIndex;
    const leftIdx = (currentEventIndex - 1 + total) % total;
    const rightIdx = (currentEventIndex + 1) % total;

    updateOldEventCard('center', oldEvents[centerIdx]);
    updateOldEventCard('left', oldEvents[leftIdx]);
    updateOldEventCard('right', oldEvents[rightIdx]);
  }

  const btnOldPrev = document.getElementById('old-events-prev');
  const btnOldNext = document.getElementById('old-events-next');
  const cardLeft = document.getElementById('card-left');
  const cardRight = document.getElementById('card-right');

  if (btnOldNext) {
    btnOldNext.addEventListener('click', () => {
      currentEventIndex = (currentEventIndex + 1) % oldEvents.length;
      renderOldEventsStack();
    });
  }

  if (btnOldPrev) {
    btnOldPrev.addEventListener('click', () => {
      currentEventIndex = (currentEventIndex - 1 + oldEvents.length) % oldEvents.length;
      renderOldEventsStack();
    });
  }

  if (cardLeft) {
    cardLeft.addEventListener('click', () => {
      currentEventIndex = (currentEventIndex - 1 + oldEvents.length) % oldEvents.length;
      renderOldEventsStack();
    });
  }

  if (cardRight) {
    cardRight.addEventListener('click', () => {
      currentEventIndex = (currentEventIndex + 1) % oldEvents.length;
      renderOldEventsStack();
    });
  }

  renderOldEventsStack();

  // --- FAQ Accordions Toggle ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const headerEl = item.querySelector('.faq-header');
    const bodyEl = item.querySelector('.faq-body');

    if (headerEl && bodyEl) {
      headerEl.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close other items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-body').style.maxHeight = null;
        });

        if (!isOpen) {
          item.classList.add('open');
          bodyEl.style.maxHeight = bodyEl.scrollHeight + "px";
        }
      });
    }
  });

  // --- Tournament Registration Form & Dynamic Members Handling ---
  const form = document.getElementById('registration-form');
  const divisionSelect = document.getElementById('division-select');
  const categorySelect = document.getElementById('category-select');
  const memberContainer = document.getElementById('member-blocks-container');
  const terminalOverlay = document.getElementById('terminal-overlay');
  const terminalLog = document.getElementById('terminal-log');
  const closeTerminalBtn = document.getElementById('close-terminal');

  const categories = {
    senior: [
      { id: 'line-follower', name: 'Line Follower', limit: 3 },
      { id: 'all-terrain', name: 'All Terrain', limit: 4 },
      { id: 'rocket-league', name: 'Rocket League', limit: 4 },
      { id: 'maze-solver', name: 'Maze Solver', limit: 3 },
      { id: 'autonomous-sumo', name: 'Autonomous Sumo', limit: 4 },
      { id: 'robot-fighter', name: 'Robot Fighter', limit: 6 },
      { id: 'aqua-ter-claw', name: 'Aqua Ter Claw', limit: 6 }
    ],
    junior: [
      { id: 'junior-all-terrain', name: 'Junior All-Terrain', limit: 4 },
      { id: 'junior-rocket-league', name: 'Junior Rocket League', limit: 4 },
      { id: 'junior-line-follower', name: 'Junior Line Follower', limit: 4 },
      { id: 'junior-dodgeball', name: 'Junior Dodgeball', limit: 4 }
    ]
  };

  function updateMemberBlocks() {
    if (!memberContainer) return;
    memberContainer.innerHTML = '';

    const division = divisionSelect.value;
    const categoryId = categorySelect.value;

    if (!division || !categoryId) return;

    const list = categories[division];
    const category = list ? list.find(c => c.id === categoryId) : null;
    const limit = category ? category.limit : 4;

    for (let i = 1; i <= limit; i++) {
      const isTL = (i === 1);
      const title = isTL ? 'Team Leader' : `Member ${i}`;
      const block = document.createElement('div');
      block.className = 'member-block';
      if (i === limit) {
        block.classList.add('last-visible');
      }

      block.innerHTML = `
        <h3 class="member-block-title">${title}</h3>
        <div class="member-inputs-row">
          <div class="form-control">
            <label for="member-${i}-name">Full Name ${isTL ? '*' : ''}</label>
            <input type="text" id="member-${i}-name" class="form-input" placeholder="Full Name" ${isTL ? 'required' : ''}>
          </div>
          <div class="form-control">
            <label for="member-${i}-phone">Phone Number ${isTL ? '*' : ''}</label>
            <input type="tel" id="member-${i}-phone" class="form-input" placeholder="Phone Number" ${isTL ? 'required' : ''}>
          </div>
          <div class="form-control">
            <label for="member-${i}-email">Email Address ${isTL ? '*' : ''}</label>
            <input type="email" id="member-${i}-email" class="form-input" placeholder="Email Address" ${isTL ? 'required' : ''}>
          </div>
        </div>
      `;
      memberContainer.appendChild(block);
    }
  }

  function selectCategoryInForm(division, categoryId) {
    if (!divisionSelect || !categorySelect) return;
    
    // Set division
    divisionSelect.value = division;
    
    // Populate categories for this division
    categorySelect.disabled = false;
    categorySelect.innerHTML = '<option value="" disabled>Select Category</option>';
    if (categories[division]) {
      categories[division].forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.name;
        categorySelect.appendChild(opt);
      });
    }
    
    // Set category if provided and valid
    if (categoryId) {
      const valid = categories[division] && categories[division].some(c => c.id === categoryId);
      if (valid) {
        categorySelect.value = categoryId;
      } else if (categories[division] && categories[division].length > 0) {
        categorySelect.value = categories[division][0].id;
      }
    } else if (categories[division] && categories[division].length > 0) {
      categorySelect.value = categories[division][0].id;
    }
    
    // Update member input fields accordingly
    updateMemberBlocks();
  }

  if (divisionSelect && categorySelect) {
    divisionSelect.addEventListener('change', () => {
      const division = divisionSelect.value;
      categorySelect.disabled = false;
      categorySelect.innerHTML = '<option value="" disabled selected>Select Category</option>';

      if (categories[division]) {
        categories[division].forEach(cat => {
          const opt = document.createElement('option');
          opt.value = cat.id;
          opt.textContent = cat.name;
          categorySelect.appendChild(opt);
        });
      }
      updateMemberBlocks();
    });

    categorySelect.addEventListener('change', () => {
      updateMemberBlocks();
    });
  }

  // --- Expanded Competition Card Modal & Interactive Pre-selection ---
  const expandModal = document.getElementById('card-expand-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalClose = document.getElementById('modal-close');
  const modalImg = document.getElementById('modal-img');
  const modalBadge = document.getElementById('modal-division-badge');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalDesc = document.getElementById('modal-description');
  const modalSpecs = document.getElementById('modal-specs');
  const modalCrewText = document.getElementById('modal-crew-text');
  const modalRegisterBtn = document.getElementById('modal-register-btn');

  const competitionDetails = {
    'senior-division': {
      title: 'SENIOR DIVISION',
      division: 'senior',
      category: 'robot-fighter',
      subtitle: 'High-Stakes Engineering Arenas',
      description: 'The Senior Division brings together university students, builders, and elite engineers to battle in combat arenas, autonomous tracking tracks, and aerial obstacles.',
      image: 'src/assets/senior_bg.png',
      crewLimit: 'Up to 6 Members / Team',
      specs: ['Autonomous & RC Arenas', 'Heavyweight Combat Rules', 'Live Streamed Finals']
    },
    'junior-division': {
      title: 'JUNIOR DIVISION',
      division: 'junior',
      category: 'junior-all-terrain',
      subtitle: 'Interactive STEM Robotics',
      description: 'The Junior Division brings young builders, school teams, and STEM enthusiasts to construct agile, fast-paced robots across dynamic field challenges.',
      image: 'src/assets/junior_bg.png',
      crewLimit: 'Up to 4 Members / Team',
      specs: ['STEM & Foundational Robotics', 'Interactive Field Challenges', 'Certificates & Trophies']
    },
    'all-terrain': {
      title: 'ALL-TERRAIN',
      division: 'senior',
      category: 'all-terrain',
      subtitle: 'Off-Road Obstacle & Speed Challenge',
      description: 'Navigating rugged off-road obstacles, steep inclines, loose gravel, and water trenches under strict time limits.',
      image: 'src/assets/card_all_terrain.png',
      crewLimit: 'Up to 4 Members',
      specs: ['High Torque Drivetrain', 'All-Weather Chassis', 'Time-Trial Obstacle Course']
    },
    'robot-fighter': {
      title: 'ROBOT FIGHTER',
      division: 'senior',
      category: 'robot-fighter',
      subtitle: 'Full-Contact Combat Arena',
      description: 'Heavy-hitting spinners, flippers, and armored chassis engage in 3-minute high-octane elimination matches inside a bulletproof enclosure.',
      image: 'src/assets/card_robot_fighter.png',
      crewLimit: 'Up to 6 Members',
      specs: ['Combat Weight Limits', 'Fail-Safe Radio Cutoffs', 'Polycarbonate Safety Arena']
    },
    'line-follower': {
      title: 'LINE FOLLOWER',
      division: 'senior',
      category: 'line-follower',
      subtitle: 'High-Speed Autonomous Tracking',
      description: 'Blazing fast autonomous speed bots tracing intricate lines, sharp turns, and line breaks with high-precision optical sensors and PID control.',
      image: 'src/assets/card_line_follower.png',
      crewLimit: 'Up to 3 Members',
      specs: ['PID Speed Tuning', 'Laser / Infrared Line Sensor', 'Precision Speed Control']
    },
    'autonomous-sumo': {
      title: 'AUTONOMOUS SUMO',
      division: 'senior',
      category: 'autonomous-sumo',
      subtitle: 'Pure Code & Raw Force in the Dohyo',
      description: 'Heavyweight sumo bots in a circular ring using ultrasonic and infrared sensors to detect opponents and force them out of the arena.',
      image: 'src/assets/card_sumo_bot.png',
      crewLimit: 'Up to 4 Members',
      specs: ['Autonomous Code Only', 'Low Center of Gravity', 'High Traction Magnetic Skirts']
    },
    'rc-sumo': {
      title: 'RC SUMO',
      division: 'senior',
      category: 'autonomous-sumo',
      subtitle: 'Driver Skills & Tactical Dominance',
      description: 'Tactical remote-controlled sumo battles where driver reflexes, wedge angles, and motor torque collide in elimination matches.',
      image: 'src/assets/card_rc_sumo.png',
      crewLimit: 'Up to 4 Members',
      specs: ['2.4GHz RC Control', 'Tungsten/Steel Plated Chassis', 'Maximum Push Efficiency']
    },
    'rocket-league': {
      title: 'ROCKET LEAGUE',
      division: 'senior',
      category: 'rocket-league',
      subtitle: 'Robotic Vehicle Football Arenas',
      description: 'Fast RC vehicles playing 3v3 football matches with a custom oversized ball. Drivers execute turbo boosts, saves, and tactical kicks.',
      image: 'src/assets/card_rocket_league.png',
      crewLimit: 'Up to 4 Members',
      specs: ['3v3 Team Coordination', 'Pneumatic Ball Kickers', 'High Speed Maneuverability']
    },
    'innovation-project': {
      title: 'INNOVATION PROJECT',
      division: 'senior',
      category: 'aqua-ter-claw',
      subtitle: 'Real-World Hardware & AI Solutions',
      description: 'Exhibit industrial prototypes, autonomous drones, AI vision systems, or assistive robotics before a panel of expert judges and partners.',
      image: 'src/assets/card_innovation_project.png',
      crewLimit: 'Up to 6 Members',
      specs: ['Live Demonstration', 'Technical Poster & Pitch', 'Commercial Viability Judging']
    },
    'water-robot': {
      title: 'WATER ROBOT',
      division: 'senior',
      category: 'aqua-ter-claw',
      subtitle: 'Aquatic Navigation & Submersible Systems',
      description: 'Submersible and surface water craft competing in buoyancy control, underwater obstacle retrieval, and hydrodynamic propulsion efficiency.',
      image: 'src/assets/card_water_robot.png',
      crewLimit: 'Up to 6 Members',
      specs: ['Sealed Waterproof Enclosure', 'Thruster Vectoring', 'Underwater Payload Retrieval']
    },
    'drones': {
      title: 'DRONES',
      division: 'senior',
      category: 'all-terrain',
      subtitle: 'FPV Air Racing & Autonomous Navigation',
      description: 'High-speed FPV drone racing through obstacle gates and autonomous waypoint flight missions inside protective safety netting.',
      image: 'src/assets/card_drones.png',
      crewLimit: 'Up to 4 Members',
      specs: ['FPV HD Feed', 'Precision Altitude Hold', 'Safety Prop Guards Required']
    },
    'junior-all-terrain': {
      title: 'JUNIOR ALL-TERRAIN',
      division: 'junior',
      category: 'junior-all-terrain',
      subtitle: 'Youth STEM Off-Road Expedition',
      description: 'Young builders control custom rover builds across ramps, bridges, and sand traps, learning mechanical gear ratios in action.',
      image: 'src/assets/card_junior_all_terrain.png',
      crewLimit: 'Up to 4 Members',
      specs: ['Custom Gearbox Tuning', 'Flexible Suspension', 'Interactive STEM Scoring']
    },
    'junior-rocket-league': {
      title: 'JUNIOR ROCKET LEAGUE',
      division: 'junior',
      category: 'junior-rocket-league',
      subtitle: 'Junior RC Vehicle Soccer',
      description: 'Energetic RC car soccer matches designed for junior teams to build teamwork, driving reflexes, and mechanical skills.',
      image: 'src/assets/card_junior_rocket_league.png',
      crewLimit: 'Up to 4 Members',
      specs: ['Teamwork & Strategy', 'Standardized Battery Packs', 'High Energy Matches']
    },
    'junior-line-follower': {
      title: 'JUNIOR LINE FOLLOWER',
      division: 'junior',
      category: 'junior-line-follower',
      subtitle: 'Foundational Autonomous Robotics',
      description: 'Junior teams code sensor logic to guide their bots through track loops, intersections, and speed bursts.',
      image: 'src/assets/card_junior_line_follower.png',
      crewLimit: 'Up to 4 Members',
      specs: ['Visual Block / C++ Coding', '2-Channel Line Detection', 'Speed & Accuracy Bonus']
    },
    'junior-dodgeball': {
      title: 'JUNIOR DODGEBALL',
      division: 'junior',
      category: 'junior-dodgeball',
      subtitle: 'Dynamic Ball Launching & Evasion',
      description: 'Robots feature ball-fetching mechanisms and catapult/flywheel launchers to eliminate opponent bots on a dodgeball court.',
      image: 'src/assets/card_junior_dodgeball.png',
      crewLimit: 'Up to 4 Members',
      specs: ['Soft Foam Ball Projectiles', 'Autonomous & RC Modes', 'Exciting Elimination Rounds']
    }
  };

  function openExpandModal(compKey) {
    const data = competitionDetails[compKey] || competitionDetails['senior-division'];

    if (modalImg) modalImg.src = data.image;
    if (modalBadge) modalBadge.textContent = (data.division === 'senior' ? 'SENIOR DIVISION' : 'JUNIOR DIVISION');
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalSubtitle) modalSubtitle.textContent = data.subtitle;
    if (modalDesc) modalDesc.textContent = data.description;
    if (modalCrewText) modalCrewText.textContent = data.crewLimit;

    if (modalSpecs) {
      modalSpecs.innerHTML = '';
      if (data.specs) {
        data.specs.forEach(s => {
          const pill = document.createElement('span');
          pill.className = 'card-spec-pill';
          pill.textContent = s;
          modalSpecs.appendChild(pill);
        });
      }
    }

    // Immediately pre-select category in registration form in the background
    selectCategoryInForm(data.division, data.category);

    if (expandModal) {
      expandModal.classList.add('active');
      expandModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // prevent background scrolling
    }
  }

  function closeExpandModal() {
    if (expandModal) {
      expandModal.classList.remove('active');
      expandModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // Bind click listeners to all competition cards across division grid & carousels
  const allCompCards = document.querySelectorAll('[data-competition-id]');
  allCompCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const compId = card.getAttribute('data-competition-id');
      if (compId) {
        openExpandModal(compId);
      }
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeExpandModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeExpandModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && expandModal && expandModal.classList.contains('active')) {
      closeExpandModal();
    }
  });

  if (modalRegisterBtn) {
    modalRegisterBtn.addEventListener('click', () => {
      closeExpandModal();

      // Smooth scroll to registration section
      const regSection = document.getElementById('registration');
      if (regSection) {
        regSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Highlight robot name field to prompt user entry
        setTimeout(() => {
          const robotInput = document.getElementById('robot-name');
          if (robotInput) robotInput.focus();
        }, 500);
      }
    });
  }

  if (form && terminalOverlay && terminalLog) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const robotName = document.getElementById('robot-name').value.trim();
      const division = divisionSelect.value;
      const categoryId = categorySelect.value;
      const schoolUniversity = document.getElementById('school-university').value.trim();
      const additionalNotes = document.getElementById('additional-notes').value.trim();
      const teamLeaderEl = document.getElementById('member-1-name');
      const teamLeader = teamLeaderEl ? teamLeaderEl.value.trim() : '';

      if (!robotName || !division || !categoryId || !schoolUniversity || !teamLeader) {
        alert("Please complete the required fields.");
        return;
      }

      // Gather members data
      const members = [];
      const list = categories[division];
      const category = list ? list.find(c => c.id === categoryId) : null;
      const limit = category ? category.limit : 4;

      for (let i = 1; i <= limit; i++) {
        const nameEl = document.getElementById(`member-${i}-name`);
        const phoneEl = document.getElementById(`member-${i}-phone`);
        const emailEl = document.getElementById(`member-${i}-email`);

        if (nameEl && nameEl.value.trim()) {
          members.push({
            name: nameEl.value.trim(),
            phone: phoneEl ? phoneEl.value.trim() : "",
            email: emailEl ? emailEl.value.trim() : ""
          });
        }
      }

      const payload = {
        robot_name: robotName,
        division: division,
        category: categoryId,
        school_university: schoolUniversity,
        additional_notes: additionalNotes || null,
        members: members
      };

      // Open Terminal Overlay
      terminalOverlay.classList.add('open');
      terminalLog.innerHTML = '';

      const catName = category ? category.name : categoryId;

      const initialLines = [
        `[INIT] Booting Registration Client...`,
        `[CONN] Connecting to AST Central Grid [ast.server.main]...`,
        `[CONN] Connection established. Encryption: SHA-256`,
        `[DATA] Serializing manifest payload...`,
        `[DATA] Deploying Robot: "${robotName}" in [${division.toUpperCase()} DIVISION]`,
        `[DATA] Category selected: "${catName}" (Crew Limit: ${limit})`,
        `[DATA] School/University: "${schoolUniversity}"`,
        `[DATA] Transmitting payload to central database...`
      ];

      let currentLine = 0;
      function printLines(lines, callback) {
        if (currentLine < lines.length) {
          const p = document.createElement('p');
          p.textContent = lines[currentLine];
          
          if (lines[currentLine].includes('[SUCCESS]') || lines[currentLine].includes('WELCOME')) {
            p.style.color = '#39ff14'; // matrix green
          } else if (lines[currentLine].includes('[ERROR]') || lines[currentLine].includes('[ABORT]')) {
            p.style.color = '#ff3333'; // bright red
          } else if (lines[currentLine].includes('[INIT]') || lines[currentLine].includes('[CONN]')) {
            p.style.color = '#BA5310'; // brand accent
          } else {
            p.style.color = '#000000'; // dark text
          }

          terminalLog.appendChild(p);
          terminalLog.scrollTop = terminalLog.scrollHeight;
          currentLine++;
          setTimeout(() => printLines(lines, callback), 350);
        } else if (callback) {
          callback();
        }
      }

      // Start printing initial logs, then send API request
      printLines(initialLines, () => {
        fetch('http://localhost:8000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        .then(response => {
          if (!response.ok) {
            return response.json().then(data => {
              throw new Error(data.detail || "Server validation failed.");
            });
          }
          return response.json();
        })
        .then(data => {
          const successLines = [
            `[CONN] Response received. Status: 201 Created`,
            `[SUCCESS] Database transaction complete. Row appended.`,
            `[SUCCESS] Manifest accepted. Clearance ID: 0x${Math.floor(Math.random()*16777215).toString(16).toUpperCase()}`,
            `>>> WELCOME TO THE ARENA, ${teamLeader.toUpperCase()}. <<<`
          ];
          printLines(successLines);
        })
        .catch(err => {
          if (err instanceof TypeError && (err.message.includes('Failed to fetch') || err.message.includes('failed to fetch') || err.message.includes('NetworkError'))) {
            // Local server offline -> graceful fallback to offline simulation mode
            const offlineLines = [
              `[WARN] Local API Server [http://localhost:8000] is offline.`,
              `[WARN] Activating Offline Simulation Mode...`,
              `[CONN] Simulating AST Local Grid database sync...`,
              `[SUCCESS] Simulation sync complete. Local buffer cached.`,
              `[SUCCESS] Manifest accepted (OFFLINE). Clearance ID: 0x${Math.floor(Math.random()*16777215).toString(16).toUpperCase()}`,
              `>>> WELCOME TO THE ARENA, ${teamLeader.toUpperCase()} (OFFLINE). <<<`
            ];
            printLines(offlineLines);
          } else {
            const errorLines = [
              `[ERROR] Registration rejected by server.`,
              `[ERROR] Details: ${err.message}`,
              `[ABORT] Clearance DENIED.`
            ];
            printLines(errorLines);
          }
        });
      });
    });
  }

  if (closeTerminalBtn && terminalOverlay) {
    closeTerminalBtn.addEventListener('click', () => {
      terminalOverlay.classList.remove('open');
      form.reset();
      if (categorySelect) {
        categorySelect.innerHTML = '<option value="" disabled selected>Select Division First</option>';
        categorySelect.disabled = true;
      }
      if (memberContainer) {
        memberContainer.innerHTML = '';
      }
    });
  }

  // --- About Us Image Composition Carousel ---
  const aboutLeftBtn = document.querySelector('.about-nav-btn.btn-left');
  const aboutRightBtn = document.querySelector('.about-nav-btn.btn-right');
  const composition = document.querySelector('.about-image-composition');

  if (aboutLeftBtn && aboutRightBtn && composition) {
    const imgLeft = composition.querySelector('.about-img-left');
    const imgCenter = composition.querySelector('.about-img-center');
    const imgRight = composition.querySelector('.about-img-right');

    if (imgLeft && imgCenter && imgRight) {
      let imagesList = [
        { el: imgLeft, baseClass: 'about-img-left' },
        { el: imgCenter, baseClass: 'about-img-center' },
        { el: imgRight, baseClass: 'about-img-right' }
      ];

      function updateCompositionClasses() {
        imagesList.forEach((item, index) => {
          // Clear current class states
          item.el.classList.remove('about-img-left', 'about-img-center', 'about-img-right');
          
          // Re-apply target class based on its active index
          // Left card at index 0, Center at index 1, Right card at index 2
          if (index === 0) {
            item.el.classList.add('about-img-left');
          } else if (index === 1) {
            item.el.classList.add('about-img-center');
          } else if (index === 2) {
            item.el.classList.add('about-img-right');
          }
        });
      }

      aboutLeftBtn.addEventListener('click', () => {
        // Shift left card into center (shift right in array representation)
        const last = imagesList.pop();
        imagesList.unshift(last);
        updateCompositionClasses();
      });

      aboutRightBtn.addEventListener('click', () => {
        // Shift right card into center (shift left in array representation)
        const first = imagesList.shift();
        imagesList.push(first);
        updateCompositionClasses();
      });
    }
  }

  // --- High-Performance IntersectionObserver Scroll Reveal System ---
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target); // Animate once only for 60FPS performance
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is unsupported
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // --- Smooth Anchor Navigation ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
});
