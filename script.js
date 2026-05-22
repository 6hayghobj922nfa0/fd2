const songsList = [
	{
		name: "30장 BGM 피아노 연주",
		artist: "하네",
		src: "https://6hayghobj922nfa0.github.io/fd2/music/LastStage_Piano.mp3",
		cover: "https://6hayghobj922nfa0.github.io/fd2/cover/cover.png"
	},
	{
		name: "교회",
		artist: "용의기사2 BGM",
		src: "https://6hayghobj922nfa0.github.io/fd2/music/church.mp3",
		cover: "https://6hayghobj922nfa0.github.io/fd2/cover/church.png"
	},
	{
		name: "도구점",
		artist: "용의기사2 BGM",
		src: "https://6hayghobj922nfa0.github.io/fd2/music/herb_store.mp3",
		cover: "https://6hayghobj922nfa0.github.io/fd2/cover/herb_store.png"
	},
	{
		name: "주점",
		artist: "용의기사2 BGM",
		src: "https://6hayghobj922nfa0.github.io/fd2/music/bar.mp3",
		cover: "https://6hayghobj922nfa0.github.io/fd2/cover/bar.png"
	},
	{
		name: "상점 입구",
		artist: "용의기사2 BGM",
		src: "https://6hayghobj922nfa0.github.io/fd2/music/store.mp3",
		cover: "https://6hayghobj922nfa0.github.io/fd2/cover/store.png"
	},
	{
		name: "무기점",
		artist: "용의기사2 BGM",
		src: "https://6hayghobj922nfa0.github.io/fd2/music/weapon_store.mp3",
		cover: "https://6hayghobj922nfa0.github.io/fd2/cover/weapon_store.png"
	},
	{
		name: "메인 화면",
		artist: "용의기사2 BGM",
		src: "https://6hayghobj922nfa0.github.io/fd2/music/title.mp3",
		cover: "https://6hayghobj922nfa0.github.io/fd2/cover/title.png"
	},
	{
		name: "30장",
		artist: "용의기사2 BGM",
		src: "https://6hayghobj922nfa0.github.io/fd2/music/stage30.mp3",
		cover: "https://6hayghobj922nfa0.github.io/fd2/cover/stage30.png"
	},
	{
		name: "전투1",
		artist: "용의기사2 BGM",
		src: "https://6hayghobj922nfa0.github.io/fd2/music/battle1.mp3",
		cover: "https://6hayghobj922nfa0.github.io/fd2/cover/cover.png"
	},
	{
		name: "전투2",
		artist: "용의기사2 BGM",
		src: "https://6hayghobj922nfa0.github.io/fd2/music/battle2.mp3",
		cover: "https://6hayghobj922nfa0.github.io/fd2/cover/cover.png"
	},
	{
		name: "30장 전설의 종결 BGM 기타 커버",
		artist: "kus137",
		src: "https://6hayghobj922nfa0.github.io/fd2/music/LastStage_Guitar.mp3",
		cover: "https://6hayghobj922nfa0.github.io/fd2/cover/cover.png"
	},
	{
		name: "오보에로 BGM듣고 따라하기",
		artist: "메모장",
		src: "https://6hayghobj922nfa0.github.io/fd2/music/Oboe cover.mp3",
		cover: "https://6hayghobj922nfa0.github.io/fd2/cover/cover.png"
	},
]

const artistName = document.querySelector('.artist-name');
const musicName = document.querySelector('.song-name');
const fillBar = document.querySelector('.fill-bar');
const startTime = document.querySelector('.start-time');
const endTime = document.querySelector('.end-time');
const prog = document.querySelector('.progress-bar');
const cover = document.getElementById('cover');
const playModeBtn = document.getElementById('playModeBtn');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const playlistBtn = document.getElementById('playlistBtn');
const playlistPanel = document.getElementById('playlistPanel');
const playlistItems = document.getElementById('playlistItems');

const shuffleOffIcon = "icon/shuffle_off.png";
const shuffleIcon = "icon/shuffle.png";
const repeatOneIcon = "icon/repeat1.png";

let playMode = 0;

const playIcon = "icon/play.png";
const pauseIcon = "icon/pause.png";

let song = new Audio();
shuffleArray(songsList);
let currentSong = 0;
let playing = false;

document.addEventListener('DOMContentLoaded', () => {
	loadSong(currentSong);
	song.addEventListener('timeupdate', updateProgress);
	song.addEventListener('ended', nextSong);
	playModeBtn.addEventListener('click', changePlayMode);
	prevBtn.addEventListener('click',prevSong);
	nextBtn.addEventListener('click', nextSong);
	playBtn.addEventListener('click',togglePlayPause);
	prog.addEventListener('click',seek);
	playlistBtn.addEventListener('click', togglePlaylist);
	createPlaylist();

	document.addEventListener('click', (e) => {
		const insidePlaylist =
			playlistPanel.contains(e.target);
		const clickedButton =
			playlistBtn.contains(e.target);
		if (!insidePlaylist && !clickedButton) {
			playlistPanel.classList.remove('show');
		}
	});
})

function loadSong(index) {
	const { name, artist, src, cover: thumb } = songsList[index];
	artistName.innerText = artist;
	musicName.innerText = name;
	song.src = src;
	cover.style.backgroundImage = `url(${thumb})`;
}

function updateProgress() {
	if (song.duration) {
		const pos = (song.currentTime / song.duration) * 100;
		fillBar.style.width = `${pos}%`;

		startTime.innerText = formatTime(song.currentTime);
		endTime.innerText = formatTime(song.duration);
	}
}

function formatTime(seconds) {
	const minutes = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
}

function updatePlayButton() {
	playBtn.src = playing ? pauseIcon : playIcon;
	playBtn.alt = playing ? "pause" : "play";
	playBtn.id = "play";
}

function togglePlayPause() {
	playing ? song.pause() : song.play();

	playing = !playing;
	updatePlayButton();
}

function nextSong() {
	// repeat1
	if (playMode === 2) {
		song.currentTime = 0;
		song.play();
		return;
	}

	// shuffle
	if (playMode === 1) {
		if (songsList.length > 1) {
			let next;
			do {
				next = Math.floor(Math.random() * songsList.length);
			}
			while (next === currentSong);
				currentSong = next;
		}
	}

	// sequential
	else {
		currentSong =
		(currentSong + 1) % songsList.length;
	}

	playMusic();
	createPlaylist();
}

function prevSong() {
	// repeat1
	if (playMode === 2) {
		song.currentTime = 0;
		song.play();
		return;
	}

	// shuffle
	if (playMode === 1) {
		if (songsList.length > 1) {
			let prev;
			do {
				prev = Math.floor(Math.random() * songsList.length);
			}
			while (prev === currentSong);
				currentSong = prev;
		}
	}

	// sequential or repeat1
	else {
		currentSong =
		(currentSong - 1 + songsList.length)
		% songsList.length;
	}

	playMusic();
	createPlaylist();
}

function playMusic() {
	loadSong(currentSong);
	song.play();

	playing = true;
	updatePlayButton();
}

function seek(e) {
	const pos = (e.offsetX / prog.clientWidth) * song.duration;
	song.currentTime = pos;
}

function togglePlaylist() {
	playlistPanel.classList.toggle('show');
}

function createPlaylist() {
	playlistItems.innerHTML = '';

	songsList.forEach((songData, index) => {
		const item = document.createElement('div');
		item.className = 'playlist-item';

		if (index === currentSong) {
			item.classList.add('active');
		}

		const coverImg = document.createElement('div');
		coverImg.className = 'playlist-cover';
		coverImg.style.backgroundImage = `url(${songData.cover})`;

		const info = document.createElement('div');
		info.className = 'playlist-info';

		const title = document.createElement('div');
		title.className = 'playlist-title';
		title.innerText = songData.name;

		const duration = document.createElement('div');
		duration.className = 'playlist-duration';
		duration.innerText = 'Loading...';

		info.appendChild(title);
		info.appendChild(duration);

		item.appendChild(coverImg);
		item.appendChild(info);

		item.addEventListener('click', () => {
			currentSong = index;
			playMusic();
			createPlaylist();
		});

		playlistItems.appendChild(item);

		const tempAudio = new Audio(songData.src);

		tempAudio.addEventListener('loadedmetadata', () => {
			duration.innerText = formatTime(tempAudio.duration);
		});
	});
}

function changePlayMode() {
	playMode = (playMode + 1) % 3;
	updatePlayModeButton();
}

function updatePlayModeButton() {
	if (playMode === 0) {
		playModeBtn.src = shuffleOffIcon;
	}
	else if (playMode === 1) {
		playModeBtn.src = shuffleIcon;
	}
	else {
		playModeBtn.src = repeatOneIcon;
	}
}

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j =
		Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] =
		[array[j], array[i]];
	}
}