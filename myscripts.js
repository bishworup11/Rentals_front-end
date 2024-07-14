// save button click by toggle , color change and locally store

const saveBtn = document.querySelector(".btn-save");
const shareBtn = document.querySelector('.btn-share');
const saveBtnMobile = document.querySelector(".btn-save-mobile");
// Load saved state
if (localStorage.getItem("isSaved") === "true") {
  saveBtn.classList.add("active");
  saveBtnMobile.classList.add("active");
}

saveBtn.addEventListener("click", () => {
  saveBtn.classList.toggle("active");
  saveBtnMobile.classList.toggle("active");
  localStorage.setItem("isSaved", saveBtn.classList.contains("active"));
  localStorage.setItem("isSaved", saveBtnMobile.classList.contains("active"));
});

saveBtnMobile.addEventListener("click", () => {
  saveBtn.classList.toggle("active");
  saveBtnMobile.classList.toggle("active");
  localStorage.setItem("isSaved", saveBtn.classList.contains("active"));
  localStorage.setItem("isSaved", saveBtnMobile.classList.contains("active"));
});

// share modal

const shareModal = document.getElementById('shareModal');
const closeBtn = document.querySelector('.close');
const copyLinkBtn = document.getElementById('copyLink');

shareBtn.addEventListener('click', () => {
  shareModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
  shareModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == shareModal) {
      shareModal.style.display = 'none';
    }
});

copyLinkBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Failed to copy: ', err));
});

document.querySelector('.show-all').addEventListener('click', () => {
    alert('Show all photos functionality would be implemented here');
});

//any where modal

const whereButton = document.getElementById("whereButton");
const regionModal = document.getElementById("regionModal");
const regionOptions = document.querySelectorAll(".region-option");

whereButton.addEventListener("click", () => {
  regionModal.style.display = "block";
});

regionOptions.forEach((option) => {
  option.addEventListener("click", () => {
    whereButton.textContent = option.textContent;
    regionModal.style.display = "none";
  });
});


window.addEventListener("click", (e) => {
  if (!regionModal.contains(e.target) && e.target !== whereButton) {
    regionModal.style.display = "none";
  }
});



// get the app hide for mobile version

const getApp = document.getElementById("get-app");
const appBanner = document.getElementById("app-banner");

getApp.addEventListener("click", () => {
  appBanner.style.display = "none";
});


// there datepicker part

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let checkInDate = null;
let checkOutDate = null;
let dateRange = 0;
let today = new Date();
today.setHours(0, 0, 0, 0);

function openModal() {
    document.getElementById('dateModal').style.display = 'block';
    renderCalendars();
}

function renderCalendars() {
    renderCalendar('calendar1', currentMonth, currentYear);
    renderCalendar('calendar2', currentMonth + 1, currentYear);
}

function renderCalendar(calendarId, month, year) {
    const calendar = document.getElementById(calendarId);
    calendar.innerHTML = '';

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const monthHeader = document.createElement('div');
    monthHeader.className = 'month-header';
    monthHeader.textContent = `${monthNames[month]} ${year}`;
    calendar.appendChild(monthHeader);

    const weekdays = document.createElement('div');
    weekdays.className = 'weekdays';
    ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        weekdays.appendChild(dayElement);
    });
    calendar.appendChild(weekdays);

    const days = document.createElement('div');
    days.className = 'days';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'empty';
        days.appendChild(emptyDay);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = i;
        
        const currentDate = new Date(year, month, i);
        if (currentDate < today) {
            dayElement.classList.add('disabled');
        } else {
            dayElement.onclick = () => selectDate(currentDate);
            
            if (isDateInRange(currentDate)) {
                dayElement.classList.add('in-range');
            }
            if (isSameDate(currentDate, checkInDate) || isSameDate(currentDate, checkOutDate)) {
                dayElement.classList.add('selected');
            }
        }
        
        days.appendChild(dayElement);
    }

    calendar.appendChild(days);
}

function selectDate(date) {
    if (!checkInDate || (checkInDate && checkOutDate)) {
        checkInDate = date;
        checkOutDate = null;
    } else {
        if (date > checkInDate) {
            checkOutDate = date;
        } else {
            checkOutDate = checkInDate;
            checkInDate = date;
        }
    }
    renderCalendars();
}

function isDateInRange(date) {
    if (checkInDate && checkOutDate) {
        return date >= checkInDate && date <= checkOutDate;
    }
    return false;
}

function isSameDate(date1, date2) {
    return date1 && date2 && 
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}

function setExactDates() {
    dateRange = 0;
    updateNavbarButton();
}

function setDateRange(range) {
    dateRange = range;
    updateNavbarButton();
}

function updateNavbarButton() {
    if (checkInDate && checkOutDate) {
        const formatDate = (date) => `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
        const checkIn = formatDate(checkInDate);
        const checkOut = formatDate(checkOutDate);
        let text = dateRange > 0 ? 
            `${checkIn} ±${dateRange} - ${checkOut} ±${dateRange}` :
            `${checkIn} - ${checkOut}`;
        document.querySelector('#any-week').textContent = text;
        document.getElementById('dateModal').style.display = 'none';
    }
}

function changeMonth(delta) {
    currentMonth += delta;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendars();
}

// // // Close modal when clicking outside
// const dateModal = document.getElementById("dateModal");
// const anyWeek = document.getElementById("any-week");

// window.addEventListener("click", (e) => {
//   if (!dateModal.contains(e.target) && e.target !== anyWeek) {
//     dateModal.style.display = "none";
//   }
// });


//   guest modal part

const addGuestsButton = document.getElementById("addGuestsButton");
const guestModal = document.getElementById("guestModal");
const guestCounts = {
  adults: 0,
  children: 0,
  infants: 0,
  pets: 0,
};

addGuestsButton.addEventListener("click", () => {
  guestModal.style.display =
    guestModal.style.display === "none" ? "block" : "none";
});

document.querySelectorAll(".guest-button").forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.type;
    const action = button.dataset.action;
    const countElement = button.parentElement.querySelector(".guest-count");
    const decrementButton = button.parentElement.querySelector(
      '[data-action="decrement"]'
    );

    if (action === "increment") {
      guestCounts[type]++;
    } else if (action === "decrement" && guestCounts[type] > 0) {
      guestCounts[type]--;
    }

    countElement.textContent = guestCounts[type];
    decrementButton.disabled = guestCounts[type] === 0;

    updateAddGuestsButton();
  });
});

function updateAddGuestsButton() {
  const totalGuests = guestCounts.adults + guestCounts.children;
  let guestText =
    totalGuests > 0
      ? `${totalGuests} guest${totalGuests > 1 ? "s" : ""}`
      : "Add guests";

  if (guestCounts.infants > 0) {
    guestText += `, ${guestCounts.infants} infant${
      guestCounts.infants > 1 ? "s" : ""
    }`;
  }
  if (guestCounts.pets > 0) {
    guestText += `, ${guestCounts.pets} pet${guestCounts.pets > 1 ? "s" : ""}`;
  }

  addGuestsButton.innerHTML = `Who<br>${guestText}`;
}

// Close modal when clicking outside

window.addEventListener("click", (e) => {
  if (!guestModal.contains(e.target) && e.target !== addGuestsButton) {
    guestModal.style.display = "none";
  }
});
