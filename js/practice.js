const idToken = sessionStorage.getItem("idToken");

if (!idToken) {
  window.location.href = "/login.html";
}

const calendarDays = document.getElementById("calendar-days");
const calendarTitle = document.getElementById("calendar-title");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const selectedDateTitle = document.getElementById("selected-date-title");
const practiceEntryForm =  document.getElementById("practice-entry-form");
const practiceEntryList =  document.getElementById("practice-entry-list");
const eventEntryForm =  document.getElementById("event-entry-form");
const eventEntryList =  document.getElementById("event-entry-list");
const saveMessage = document.getElementById("save-message");
const API_URL = "https://b5tx0bljgf.execute-api.us-east-1.amazonaws.com/entries";

let entries = [];

async function loadEntries() {
  const idToken = sessionStorage.getItem("idToken");

  if (!idToken) {
    window.location.href = "/login.html";
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${idToken}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to load entries"
      );
    }

    console.log("DynamoDB entries:", data.items);

    entries = data.items || [];
    
    renderCalendar();

    entries.forEach((entry) => {
     console.log(
      entry.type,
      entry.date,
      entry.piece || entry.title
    );
  });

  } catch (error) {
    console.error("Load error:", error);
  }
}


loadEntries();


// 2026年9月からスタート
let currentDate = new Date(2026, 8, 1);

function renderCalendar() {
  calendarDays.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 月の最終日
  const lastDate = new Date(year, month + 1, 0).getDate();

  // 月の1日の曜日
  // 0 = Sun
  // 1 = Mon
  // 2 = Tue
  // ...
  const firstDay = new Date(year, month, 1).getDay();

  // タイトル
  calendarTitle.textContent =
    currentDate.toLocaleString("en-US", {
      month: "long",
      year: "numeric"
    });

  // 日付を作る
  for (let day = 1; day <= lastDate; day++) {
    const dayElement = document.createElement("div");

    dayElement.classList.add("calendar-day");
    dayElement.textContent = day;


const dateString =
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const dayEntries = entries.filter(entry => entry.date === dateString);

dayEntries.forEach(entry => {
  const entryElement = document.createElement("div");
  entryElement.classList.add("calendar-entry");

  if (entry.type === "practice") {
    entryElement.textContent = `🎹 ${entry.piece || "Practice"}`;
  } else if (entry.type === "event") {
    entryElement.textContent = `📅 ${entry.title || "Event"}`;
  }

  dayElement.appendChild(entryElement);
});









    // 1日だけ、正しい曜日の列から開始させる
    if (day === 1) {
      dayElement.style.gridColumnStart = firstDay + 1;
    }
    
dayElement.addEventListener("click", () => {

  document
    .querySelectorAll(".calendar-day")
    .forEach((el) => {
      el.classList.remove("selected");
    });

  dayElement.classList.add("selected");

  selectedDateTitle.textContent =
    `${year}年${month + 1}月${day}日`;
});


    calendarDays.appendChild(dayElement);
  }
}

prevMonthButton.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonthButton.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar();






practiceEntryForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const piece =
    document.getElementById("piece").value.trim();

  const duration =
    document.getElementById("duration").value;

  const notes =
    document.getElementById("practice-notes").value.trim();

  if (!piece || !duration) {
    return;
  }

  const selectedDate =
    selectedDateTitle.textContent;

  const match =
    selectedDate.match(
      /(\d{4})年(\d{1,2})月(\d{1,2})日/
    );

  if (!match) {
    alert("先にカレンダーの日付を選んでください。");
    return;
  }

  const year = match[1];

  const month =
    String(match[2]).padStart(2, "0");

  const day =
    String(match[3]).padStart(2, "0");

  const date =
    `${year}-${month}-${day}`;


  const practiceData = {
    type: "practice",
    date: date,
    piece: piece,
    duration: Number(duration),
    notes: notes
  };



const idToken = sessionStorage.getItem("idToken");

if (!idToken) {
  alert("ログイン情報がありません。もう一度ログインしてください。");
  window.location.href = "/login.html";
  return;
}



  try {

    const response =
      await fetch(API_URL, {
        method: "POST",


        headers: {
         "Content-Type": "application/json",
         "Authorization": `Bearer ${idToken}` 
      },


        body: JSON.stringify(practiceData)
      });

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Save failed"
      );
    }

    const entryItem =
      document.createElement("div");

    entryItem.classList.add("entry-item");

    entryItem.innerHTML = `
      <h4>${piece}</h4>
      <p>${duration} minutes</p>
      ${notes ? `<p>${notes}</p>` : ""}
    `;

    practiceEntryList.appendChild(entryItem);

    practiceEntryForm.reset();

    alert("保存できました！");

  } catch (error) {

    console.error(error);

    alert(
      "保存に失敗しました: " +
      error.message
    );
  }
});







eventEntryForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const eventType =
    document.getElementById("event-type").value;

  const eventTitle =
    document.getElementById("event-title").value.trim();

  const eventDate =
    document.getElementById("event-date").value;

  const eventHour =
    document.getElementById("event-hour").value;

  const eventMinute =
    document.getElementById("event-minute").value;

  const eventNotes =
    document.getElementById("event-notes").value.trim();

  if (!eventTitle || !eventDate) {
    alert("イベント名と日付を入力してください。");
    return;
  }

  const eventTime =
    eventHour && eventMinute
      ? `${eventHour}:${eventMinute}`
      : "";

  const eventData = {
    type: "event",
    eventType: eventType,
    title: eventTitle,
    date: eventDate,
    time: eventTime,
    notes: eventNotes
  };


const idToken = sessionStorage.getItem("idToken");

if (!idToken) {
  alert("ログイン情報がありません。もう一度ログインしてください。");
  window.location.href = "/login.html";
  return;
}




  try {
    const response =
      await fetch(API_URL, {
        method: "POST",
        
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
      },

        body: JSON.stringify(eventData)
      });

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Save failed"
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate =
      new Date(`${eventDate}T00:00:00`);

    const difference =
      targetDate.getTime() - today.getTime();

    const daysLeft =
      Math.ceil(
        difference / (1000 * 60 * 60 * 24)
      );

    let countdownText = "";

    if (daysLeft > 0) {
      countdownText = `あと${daysLeft}日`;
    } else if (daysLeft === 0) {
      countdownText = "今日";
    } else {
      countdownText =
        `${Math.abs(daysLeft)}日前`;
    }

    const eventItem =
      document.createElement("div");

    eventItem.classList.add("entry-item");

    eventItem.innerHTML = `
      <h4>${eventTitle}</h4>
      <p>${eventType}</p>
      <p>${eventDate}</p>
      ${eventTime ? `<p>${eventTime}</p>` : ""}
      <p>${countdownText}</p>
      ${eventNotes ? `<p>${eventNotes}</p>` : ""}
    `;

    eventEntryList.appendChild(eventItem);

    eventEntryForm.reset();

    alert("イベントを保存できました！");

  } catch (error) {
    console.error(error);

    alert(
      "イベント保存に失敗しました: " +
      error.message
    );
  }
});
