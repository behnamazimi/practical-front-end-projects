class Recorder {

    constructor() {
        this._recorder = null;
        this._audioChunks = [];

        this.init();
    }

    init() {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        if (navigator.getUserMedia) {
            navigator.getUserMedia({audio: true}, (stream) => {

                this._recorder = new MediaRecorder(stream);
                this._recorder.addEventListener("dataavailable", (e)=>{
                    this._audioChunks.push(e.data)
                });

            }, () => {
                throw new Error("Use Media not found.")
            });
        } else {
            throw new Error("Use Media not found.")
        }
    }

    start() {
        if (!this._recorder)
            return;

        this._audioChunks = [];
        this._recorder.start();
    }

    stop() {
        return new Promise((resolve) => {
            this._recorder.addEventListener("stop", () => {
                const audioBlob = new Blob(this._audioChunks);
                const audioUrl = URL.createObjectURL(audioBlob);
                this._audio = new Audio(audioUrl);
                resolve({audio: this._audio, audioUrl})
            });

            this._recorder.stop();
        })
    }

    get audio() {
        return this._audio;
    }

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

}
