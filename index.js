// Selecting DOM elements by their IDs
const currentTime = document.querySelector("#current-time");
const setHours = document.querySelector("#hours");
const setMinutes = document.querySelector("#minutes");
const setSeconds = document.querySelector("#seconds");
const setAmPm = document.querySelector("#am-pm");
const setAlarmButton = document.querySelector("#submitButton");
const alarmContainer = document.querySelector("#alarms-container");

// Function to create drop-down menus for hours, minutes, and seconds
function dropDownMenu(start, end, element) {
  for (let i = start; i <= end; i++) {
    const dropDown = document.createElement("option");
    dropDown.value = i < 10 ? "0" + i : i;
    dropDown.innerHTML = i < 10 ? "0" + i : i;
    element.appendChild(dropDown);
  }
}

// Event listener for when the page is fully loaded
window.addEventListener("DOMContentLoaded", (event) => {
  // Populate drop-down menus for hours, minutes, and seconds
  dropDownMenu(1, 12, setHours);
  dropDownMenu(0, 59, setMinutes);
  dropDownMenu(0, 59, setSeconds);
  
  // Update the current time every second
  setInterval(getCurrentTime, 1000);
  
  // Fetch and display any saved alarms from local storage
  fetchAlarm();
});

// Event listener for the "Set Alarm" button
setAlarmButton.addEventListener("click", getInput);

// Function to get the current time and update the display
function getCurrentTime() {
  let time = new Date();
  time = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  currentTime.innerHTML = time;
  return time;
}

// Function to handle the "Set Alarm" button click
function getInput(e) {
  e.preventDefault();
  const hourValue = setHours.value;
  const minuteValue = setMinutes.value;
  const secondValue = setSeconds.value;
  const amPmValue = setAmPm.value;
  const alarmTime = convertToTime(hourValue, minuteValue, secondValue, amPmValue);
  setAlarm(alarmTime);
}

// Function to convert time to 24-hour format
function convertToTime(hour, minute, second, amPm) {
  return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}

// Function to set an alarm
function setAlarm(time, fetching = false) {
  const alarm = setInterval(() => {
    if (time === getCurrentTime()) {
      alert("Alarm Ringing");
    }
    console.log("running");
  }, 500);

  addAlaramToDom(time, alarm);

  if (!fetching) {
    saveAlarm(time);
  }
}

// Function to add an alarm to the DOM
function addAlaramToDom(time, intervalId) {
  const alarm = document.createElement("div");
  alarm.classList.add("alarm", "mb", "d-flex");
  alarm.innerHTML = `
    <div class="time">${time}</div>
    <button class="btn delete-alarm" data-id=${intervalId}>Delete</button>
  `;
  const deleteButton = alarm.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));
  alarmContainer.prepend(alarm);
}

// Function to check if alarms are present in local storage
function checkAlarams() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) alarms = JSON.parse(isPresent);
  return alarms;
}

// Function to save an alarm to local storage
function saveAlarm(time) {
  const alarms = checkAlarams();
  alarms.push(time);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

// Function to fetch alarms from local storage
function fetchAlarm() {
  const alarms = checkAlarams();
  alarms.forEach((time) => {
    setAlarm(time, true);
  });
}

// Function to delete an alarm
function deleteAlarm(event, time, intervalId) {
  const self = event.target;
  clearInterval(intervalId);
  const alarm = self.parentElement;
  deleteAlarmFromLocal(time);
  alarm.remove();
}

// Function to delete an alarm from local storage
function deleteAlarmFromLocal(time) {
  const alarms = checkAlarams();
  const index = alarms.indexOf(time);
  alarms.splice(index, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}