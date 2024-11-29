import { Subject, fromEvent, filter } from "rxjs";

const startButton = document.querySelector("#start")!;
const countButton = document.querySelector("#count")!;
const errorButton = document.querySelector("#error")!;
const completeButton = document.querySelector("#complete")!;

const currentCounterLabel = document.querySelector("#currentCounter")!;
const evenCounterLabel = document.querySelector("#evenCounter")!;
const statusLabel = document.querySelector("#status")!;

let counter = 0;
let counter$: Subject<number>;

fromEvent(startButton, "click").subscribe(() => {
	//Init new Object
	counter$ = new Subject();
	//Init counter
	counter = 0;
	//Set status
	statusLabel.innerHTML = "Start counting";

	//Create even num observable
	const evenCounter$ = counter$.pipe(filter((e) => !(e & 1)));

	//Subscribe to counter and show current value
	counter$.subscribe({
		next: (data) => {
			currentCounterLabel.innerHTML = data.toString();
		},
		error: (message) => {
			statusLabel.innerHTML = `Error: ${message}`;
		},
		complete() {
			statusLabel.innerHTML = `Completed`;
		},
	});

	//Subscribe to even counter observable
	evenCounter$.subscribe((data) => {
		evenCounterLabel.innerHTML = data.toString();
	});

	//Send default value
	counter$.next(counter);
});

fromEvent(countButton, "click").subscribe(() => {
	counter$.next(++counter);
});

fromEvent(errorButton, "click").subscribe(() => {
	const reason = prompt("Input error message");
	//Call error method on counter$ to send error message to counter$
	counter$.error(reason || "error");
});

fromEvent(completeButton, "click").subscribe(() => {
	counter$.complete();
});
