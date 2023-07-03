// background.js
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && /^https:\/\/foothillcollege\.instructure\.com/.test(tab.url)) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: runScript
        });
    }
});

function runScript() {
    console.log("Script is Running");
    setInterval(() => {
        let dueDates = document.querySelectorAll('.assignment-date-due span[data-tooltip]');

        dueDates.forEach(dueDate => {
            let dueDateText = dueDate.getAttribute('data-html-tooltip-title');
            let dateParts = dueDateText.match(/(\w+)\s(\d+)\s\w+\s(\d+):(\d+)(\w+)/);
            let monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            let monthIndex = monthNames.indexOf(dateParts[1]);
            let year = new Date().getFullYear();
            let dueDateTime = new Date(year, monthIndex, dateParts[2], dateParts[5] === 'pm' ? parseInt(dateParts[3]) + 12 : dateParts[3], dateParts[4]);
            let daysLeft = Math.ceil((dueDateTime - new Date()) / (1000 * 60 * 60 * 24)) - 1;
            let daysLeftText = daysLeft > 0 ? `${daysLeft} days left` : daysLeft == 0 ? 'Due today' : 'Due date passed';
            let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            let dayOfWeekText = daysOfWeek[dueDateTime.getUTCDay()];
            dueDate.textContent = `${dueDateText} (${dayOfWeekText}, ${daysLeftText})`;
        });
    }, 100);
}
