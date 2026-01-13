// ✨ عداد الحب
const loveDate = new Date("2021-10-27T00:00:00");

function updateLove() {
    const now = new Date();
    let diff = now - loveDate;

    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    let minutes = Math.floor(diff / (1000 * 60)) % 60;
    let seconds = Math.floor(diff / 1000) % 60;

    document.getElementById("loveCounter").innerHTML =
        `${days} يوم<br>${hours} ساعة<br>${minutes} دقيقة<br>${seconds} ثانية`;
}

// 🎂 عداد العمر
const birthDate = new Date("2008-11-08T00:00:00"); // ← تاريخ ميلادها

function updateAge() {
    const now = new Date();
    let diff = now - birthDate;

    let years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    let months = Math.floor((diff / (1000 * 60 * 60 * 24 * 30.44)) % 12);
    let days = Math.floor((diff / (1000 * 60 * 60 * 24)) % 30);
    let hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    let minutes = Math.floor(diff / (1000 * 60)) % 60;
    let seconds = Math.floor(diff / 1000) % 60;

    document.getElementById("ageCounter").innerHTML =
        `${years} سنة<br>${months} شهر<br>${days} يوم<br>${hours} ساعة<br>${minutes} دقيقة<br>${seconds} ثانية`;
}

setInterval(() => {
    if (document.getElementById("loveCounter")) updateLove();
    if (document.getElementById("ageCounter")) updateAge();
}, 1000);