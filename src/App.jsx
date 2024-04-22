import './App.css';
import AlarmSound from './assets/BeepSound.wav';
import { MdArrowCircleDown, MdArrowCircleUp, MdOutlinePlayCircleOutline, MdOutlinePauseCircle, MdFastRewind } from 'react-icons/md';
import { useEffect, useState } from 'react';

function App() {
	const defaultBreakLength = 5 * 60;
	const defaultSessionLength = 25 * 60;
	const min = 60;
	const max = 60 * 60;

	const [breakLength, setBreakLength] = useState(defaultBreakLength);
	const [sessionLength, setSessionLength] = useState(defaultSessionLength);
	const [display, setDisplay] = useState({
		time: sessionLength,
		timeType: 'Session',
		timerRunning: false,
	});

	//helper functions
	function timeSetFormatter(time) {
		return Math.floor(time / 60);
	}
	function timeDisplayFormatter(time_left) {
		const minutes = Math.floor(time_left / 60);
		const seconds = Math.floor(time_left % 60);
		return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
	}

	//update Display
	useEffect(() => {
		setDisplay((prev) => ({
			...prev,
			time: sessionLength,
		}));
	}, [sessionLength]);

	useEffect(() => {
		let timerID;
		if (!display.timerRunning) return;

		function decrementTimer() {
			setDisplay((prev) => ({
				...prev,
				time: prev.time - 1,
			}));
		}
		if (display.timerRunning) {
			timerID = window.setInterval(decrementTimer, 1000);
		}

		return () => {
			window.clearInterval(timerID);
		};
	}, [display.time, display.timerRunning]);

	useEffect(() => {
		if (display.time === 0) {
			const audio = document.getElementById('beep');
			audio.currentTime = 0;
			audio.play().catch((err) => console.log(err));
			setDisplay((prev) => ({
				...prev,
				timeType: prev.timeType === 'Session' ? 'Break' : 'Session',
				time: prev.timeType === 'Session' ? breakLength : sessionLength,
			}));
		}
	}, [display, breakLength, sessionLength]);

	//handler function
	const handleSetBreakLength = (value) => {
		setBreakLength((prev) => {
			switch (value) {
				case '-':
					if (breakLength > min && !display.timerRunning) {
						return prev - 60;
					} else {
						return breakLength;
					}
				case '+':
					if (breakLength < max && !display.timerRunning) {
						return prev + 60;
					} else {
						return breakLength;
					}
				default:
					return console.log('Oops...something went wrong.');
			}
		});
	};
	const handleSetSessionLength = (value) => {
		setSessionLength((prev) => {
			switch (value) {
				case '-':
					if (sessionLength > min && !display.timerRunning) {
						return prev - 60;
					} else {
						return sessionLength;
					}
				case '+':
					if (sessionLength < max && !display.timerRunning) {
						return prev + 60;
					} else {
						return sessionLength;
					}
				default:
					return console.log('Oops...something went wrong.');
			}
		});
	};
	const handleStartStopTimer = () => {
		setDisplay((prev) => ({
			...prev,
			timerRunning: !prev.timerRunning,
		}));
	};
	const handleResetTimer = () => {
		setBreakLength(defaultBreakLength);
		setSessionLength(defaultSessionLength);
		setDisplay({ time: sessionLength, timeType: 'Session', timerRunning: false });
		const audio = document.getElementById('beep');
		audio.currentTime = 0;
		audio.pause();
	};
	return (
		<div className="container">
			<h1 className="app-name">25 + 5 Clock</h1>
			<div className="app-control">
				<div className="control border-top border-bottom border-rounded">
					<div id="break-label">Break Length</div>
					<div className="break-control">
						<button onClick={() => handleSetBreakLength('-')} className="btn" id="break-decrement">
							<MdArrowCircleDown />
						</button>
						<div className="control-display" id="break-length">
							{timeSetFormatter(breakLength)}
						</div>
						<button onClick={() => handleSetBreakLength('+')} className="btn" id="break-increment">
							<MdArrowCircleUp />
						</button>
					</div>
				</div>
				<div className="control border-top border-bottom border-rounded">
					<div id="session-label">Session Length</div>
					<div className="session-control">
						<button onClick={() => handleSetSessionLength('-')} className="btn" id="session-decrement" value="-">
							<MdArrowCircleDown />
						</button>
						<div className="control-display" id="session-length">
							{timeSetFormatter(sessionLength)}
						</div>
						<button onClick={() => handleSetSessionLength('+')} className="btn" id="session-increment" value="+">
							<MdArrowCircleUp />
						</button>
					</div>
				</div>
			</div>
			<div className="timer-display border-top border-bottom border-rounded">
				<h3 className="timer" id="timer-label">
					{display.timeType}
				</h3>
				<div className="timer" id="time-left">
					{timeDisplayFormatter(display.time)}
				</div>
			</div>
			<div className="timer-control">
				<button id="start_stop" onClick={handleStartStopTimer}>
					<MdOutlinePlayCircleOutline />
					<MdOutlinePauseCircle />
				</button>
				<button onClick={handleResetTimer} id="reset">
					<MdFastRewind />
				</button>
			</div>
			<audio id="beep" src={AlarmSound}></audio>
		</div>
	);
}

export default App;
