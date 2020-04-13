/**
 * this class control the recording functionality.
 * it's enough to create an instance of this and call start()
 * to start recording and stop() to put the end to the recording.
 */
class Recorder {

    constructor() {
        this._recorder = null;
        this._audioChunks = [];

        this.init();
    }

    /**
     * initial the recorder and create a new instance of MediaRecorder.
     */
    init() {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        if (navigator.getUserMedia) {
            navigator.getUserMedia({audio: true}, (stream) => {

                this._recorder = new MediaRecorder(stream);

                //  we need to listen for data available for the recorder and update the audio chunk
                this._recorder.addEventListener("dataavailable", (e) => {
                    this._audioChunks.push(e.data)
                });

            }, () => {
                throw new Error("Use Media not found.")
            });
        } else {
            throw new Error("Use Media not found.")
        }
    }

    /**
     * call start method of recorder
     */
    start() {
        if (!this._recorder)
            return;

        this._audioChunks = [];
        this._recorder.start();
    }

    /**
     * call the stop method of recorder and generate the audio object and resolve it
     * @returns {Promise<unknown>}
     */
    stop() {
        return new Promise((resolve) => {

            // to create audio, we should listen for stop event of recorder
            this._recorder.addEventListener("stop", async () => {

                // to create the audio, we should make its Blob first
                // and then create a object URL for it and pass it to the Audio API
                const audioBlob = new Blob(this._audioChunks);
                const audioUrl = URL.createObjectURL(audioBlob);
                this._audio = new Audio(audioUrl);

                // calc the duration of audio
                const duration = await this.findDuration(audioBlob);

                resolve({audio: this._audio, duration, audioUrl})
            });

            // stop the recording
            this._recorder.stop();
        })
    }

    /**
     * find duration of recorded audio
     * @param blob
     * @returns {Promise<unknown>}
     */
    findDuration(blob) {
        return new Promise((resolve) => {
            const file = new File([blob], "audio.mp3");
            let reader = new FileReader();
            reader.onload = (e) => {
                let audioContext = new (window.AudioContext || window.webkitAudioContext)();

                // Asynchronously decode audio file data contained in an ArrayBuffer.
                audioContext.decodeAudioData(e.target.result, function (buffer) {
                    let floatDuration = buffer.duration;

                    let dMin = Math.floor(floatDuration / 60);
                    let dSec = Math.floor(floatDuration % 60);

                    if (dMin < 10)
                        dMin = "0" + dMin;

                    if (dSec < 10)
                        dSec = "0" + dSec;

                    resolve(`${dMin}:${dSec}`)
                });
            };

            reader.readAsArrayBuffer(file);
        })
    }

    /**
     * getter for audio objec
     * @returns {HTMLAudioElement}
     */
    get audio() {
        return this._audio;
    }

    /**
     * check if the audio device is available
     * @returns {boolean}
     */
    static isMicAvailable() {
        let isAvailable = true;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        if (navigator.getUserMedia) {
            navigator.getUserMedia({audio: true}, (stream) => {
                isAvailable = true;
            }, () => {
                isAvailable = false;
            });
        }

        return isAvailable;
    }

    /**
     * Convert numbers in second to time string like 00:00
     *
     * @param seconds
     * @returns {string}
     */
    static secToTimeStr(seconds) {
        let timeInHour = Math.floor(seconds / 3600);
        let timeInMin = Math.floor((seconds % 3600) / 60);
        let timeInSec = Math.floor(seconds % 60);

        if (timeInHour < 10)
            timeInHour = `0${timeInHour}`;

        if (timeInMin < 10)
            timeInMin = `0${timeInMin}`;

        if (timeInSec < 10)
            timeInSec = `0${timeInSec}`;

        let timeStr = `${timeInMin}:${timeInSec}`;
        if (parseInt(timeInHour))
            timeStr = `${timeInHour}:${timeStr}`;

        return timeStr;
    }

}
