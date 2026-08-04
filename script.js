console.log("Let's Write Java Script");

let currentSong = new Audio();
let songs;

// 1. Time Format Helper Function
function formatTime(totalSeconds) {
    if (isNaN(totalSeconds) || totalSeconds < 0) return "00:00";

    const seconds = Math.floor(totalSeconds);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// 2. Global SVG Icons
const playSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="black" fill="none">
    <path d="M15.75 12L8.25 16.5V7.5L15.75 12Z" stroke="currentColor" stroke-width="1.5" fill="currentColor" stroke-linejoin="round" />
</svg>`;

const pauseSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="black" fill="none">
    <path d="M8 6V18M16 6V18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// 3. Fetch Songs Array
async function getSongs() {
    let songs = [
        "song1.mp3",
        "song2.mp3",
        "song3.mp3",
        "song4.mp3",
        "song5.mp3",
        "song6.mp3",
        "song7.mp3",
        "song8.mp3",
        "song9.mp3",
        "song10.mp3"
    ];
    return songs;
}

// 4. Play Music Function
const playMusic = (track) => {
    currentSong.src = "songs/" + track.trim();
    currentSong.play();

    // Song Name Update
    let songInfo = document.querySelector(".songinfo");
    if (songInfo) {
        songInfo.innerHTML = decodeURIComponent(track);
    }

    // Initial Time Set
    let songTime = document.querySelector(".songtime");
    if (songTime) {
        songTime.innerHTML = "00:00 / 00:00";
    }

    // Play Button -> Pause Icon Change
    let playBtn = document.getElementById("play");
    if (playBtn) {
        playBtn.innerHTML = pauseSVG;
    }
}

async function main() {
    songs = await getSongs();

    // Render Song List in Sidebar Safely
    let songUL = document.querySelector(".songlist ul");
    if (songUL) {
        songUL.innerHTML = ""; // Clear existing list items

        for (const song of songs) {
            songUL.innerHTML += `<li>
                <svg width="25" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18V5l12-2v13" stroke="#1ed760" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <circle cx="6" cy="18" r="3" stroke="#1ed760" stroke-width="1.5" />
                    <circle cx="18" cy="16" r="3" stroke="#1ed760" stroke-width="1.5" />
                </svg>

                <div class="info">
                    <div>${song}</div>
                    <div>Alishba</div>
                </div>
                <div class="playNow">
                    <span>Play Now</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 4v16l13-8L7 4z" />
                    </svg>
                </div>
            </li>`;
        }

        // Song Click Listener (After rendering)
        Array.from(songUL.getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", () => {
                let songName = e.querySelector(".info").firstElementChild.innerHTML.trim();
                playMusic(songName);
            });
        });
    }

    // DOM Controls Variables
    let playBtn = document.getElementById("play");
    let previous = document.getElementById("previous");
    let next = document.getElementById("next");

    // Play / Pause Master Button Click
    if (playBtn) {
        playBtn.addEventListener("click", () => {
            if (currentSong.paused) {
                currentSong.play();
                playBtn.innerHTML = pauseSVG;
            } else {
                currentSong.pause();
                playBtn.innerHTML = playSVG;
            }
        });
    }

    // REAL-TIME TIMER UPDATE
    currentSong.addEventListener("timeupdate", () => {
        let current = formatTime(currentSong.currentTime);
        let duration = "00:00";

        if (currentSong.duration && !isNaN(currentSong.duration)) {
            duration = formatTime(currentSong.duration);
        }

        let songTime = document.querySelector(".songtime");
        if (songTime) {
            songTime.innerHTML = `${current} / ${duration}`;
        }
        let circle = document.querySelector(".circle");
        if (circle) {
            circle.style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        }
    });

    // Seekbar Click
    let seekbar = document.querySelector(".seekbar");
    if (seekbar) {
        seekbar.addEventListener("click", e => {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            let circle = document.querySelector(".circle");
            if (circle) circle.style.left = percent + "%";
            currentSong.currentTime = ((currentSong.duration) * percent) / 100;
        });
    }

    // Hamburger Mobile Menu
    let hamburger = document.querySelector(".hamburger");
    if (hamburger) {
        hamburger.addEventListener("click", () => {
            document.querySelector(".left").style.left = "0";
        });
    }

    // Close Mobile Menu
    let closeBtn = document.querySelector(".close");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            document.querySelector(".left").style.left = "-110%";
        });
    }

    // Previous Song Listener
    if (previous) {
        previous.addEventListener("click", () => {
            let currentFileName = currentSong.src.split("/").slice(-1)[0];
            let index = songs.indexOf(currentFileName);
            if ((index - 1) >= 0) {
                playMusic(songs[index - 1]);
            }
        });
    }

    // Next Song Listener
    if (next) {
        next.addEventListener("click", () => {
            let currentFileName = currentSong.src.split("/").slice(-1)[0];
            let index = songs.indexOf(currentFileName);
            if ((index + 1) < songs.length) {
                playMusic(songs[index + 1]);
            }
        });
    }

    // Volume Slider Listener
    let rangeInput = document.querySelector(".range input");
    if (rangeInput) {
        rangeInput.addEventListener("input", (e) => {
            let value = parseInt(e.target.value);
            currentSong.volume = value / 100;

            let volumeSvg = document.querySelector(".volume-icon");
            let muteSvg = document.querySelector(".mute-icon");

            if (value > 0) {
                if (volumeSvg && muteSvg) {
                    volumeSvg.classList.remove("hidden");
                    muteSvg.classList.add("hidden");
                }
            } else {
                if (volumeSvg && muteSvg) {
                    volumeSvg.classList.add("hidden");
                    muteSvg.classList.remove("hidden");
                }
            }
        });
    }

    // Mute / Unmute Button Listener
    let volumeBtn = document.querySelector(".volume");
    if (volumeBtn) {
        volumeBtn.addEventListener("click", (e) => {
            let volumeSvg = document.querySelector(".volume-icon");
            let muteSvg = document.querySelector(".mute-icon");
            let range = document.querySelector(".range input");

            if (e.target.tagName === "INPUT") return;

            if (volumeSvg && !volumeSvg.classList.contains("hidden")) {
                volumeSvg.classList.add("hidden");
                if (muteSvg) muteSvg.classList.remove("hidden");
                currentSong.volume = 0;
                if (range) range.value = 0;
            } else {
                if (muteSvg) muteSvg.classList.add("hidden");
                if (volumeSvg) volumeSvg.classList.remove("hidden");
                currentSong.volume = 0.10;
                if (range) range.value = 10;
            }
        });
    }

    // Cards Click Listener
    Array.from(document.querySelectorAll(".card")).forEach(card => {
        card.addEventListener("click", () => {
            let songTrack = card.dataset.song;
            if (songTrack) {
                playMusic(songTrack);
            }
        });
    });
}

main();
