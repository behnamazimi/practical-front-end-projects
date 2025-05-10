/**
 * Class to handle audio recording functionality.
 * Instantiate and call start() to begin recording, stop() to end.
 */
class Recorder {
  constructor() {
    this._mediaRecorder = null;
    this._audioChunks = [];
    this._audio = null;
    this._init();
  }

  /**
   * Initialize the media recorder by requesting microphone access.
   */
  _init() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (navigator.getUserMedia) {
      navigator.getUserMedia({ audio: true }, (stream) => {
        this._mediaRecorder = new MediaRecorder(stream);
        this._mediaRecorder.addEventListener("dataavailable", (e) => {
          this._audioChunks.push(e.data);
        });
      }, () => {
        throw new Error("Microphone access denied or not available.");
      });
    } else {
      throw new Error("Your browser does not support getUserMedia API.");
    }
  }

  /**
   * Start recording audio.
   */
  start() {
    if (!this._mediaRecorder) return;
    this._audioChunks = [];
    this._mediaRecorder.start();
  }

  /**
   * Stop recording and return an object with audio and duration.
   * @returns {Promise<{audio: HTMLAudioElement, duration: string, audioUrl: string}>}
   */
  stop() {
    return new Promise((resolve) => {
      if (!this._mediaRecorder) resolve();

      this._mediaRecorder.addEventListener("stop", async () => {
        const blob = new Blob(this._audioChunks);
        const url = URL.createObjectURL(blob);
        this._audio = new Audio(url);
        const duration = await this._calculateDuration(blob);
        resolve({ audio: this._audio, duration, audioUrl: url });
      });

      this._mediaRecorder.stop();
    });
  }

  /**
   * Calculate the duration of the recorded audio.
   * @param {Blob} blob
   * @returns {Promise<string>} - Duration in mm:ss format
   */
  _calculateDuration(blob) {
    return new Promise((resolve) => {
      const file = new File([blob], "audio.mp3");
      const reader = new FileReader();

      reader.onload = (e) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContext.decodeAudioData(e.target.result).then((buffer) => {
          const durationSec = buffer.duration;
          const minutes = Math.floor(durationSec / 60);
          const seconds = Math.floor(durationSec % 60);
          const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
          const secStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
          resolve(`${minStr}:${secStr}`);
        });
      };

      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Getter for the recorded audio element.
   * @returns {HTMLAudioElement}
   */
  get audio() {
    return this._audio;
  }

  /**
   * Static method to check if microphone is available.
   * @returns {boolean}
   */
  static isMicAvailable() {
    // Note: This method won't reliably detect mic availability synchronously.
    // For actual detection, consider attempting a getUserMedia request.
    let available = false;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (navigator.getUserMedia) {
      navigator.getUserMedia({ audio: true }, () => {
        available = true;
      }, () => {
        available = false;
      });
    }
    return available;
  }

  /**
   * Converts seconds to a mm:ss or hh:mm:ss string.
   * @param {number} seconds
   * @returns {string}
   */
  static secToTimeStr(seconds) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const hoursStr = hours > 0 ? `${hours < 10 ? '0' : ''}${hours}:` : '';
    const minsStr = `${mins < 10 ? '0' : ''}${mins}`;
    const secsStr = `${secs < 10 ? '0' : ''}${secs}`;

    return hours > 0 ? `${hoursStr}${minsStr}:${secsStr}` : `${minsStr}:${secsStr}`;
  }
}
