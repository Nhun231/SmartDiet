// utils/generateSchedule.js
function toMinutes(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}

function toTimeStr(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function generateSchedule(wakeUp, sleep, gap) {
    const start = toMinutes(wakeUp);
    const end = toMinutes(sleep);
    const schedule = [];

    for (let t = start + 5; t < end; t += gap) {
        schedule.push({ time: toTimeStr(t), amount: 250 });
    }
    return schedule;
}

module.exports = { generateSchedule };
