import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private isBrowser: boolean;

  constructor() {
    this.isBrowser = typeof window !== 'undefined';
  }

  // Inicia la captura del micrófono
  startAudioCapture(): void {
    if (!this.isBrowser) {
      console.warn('Audio capture is not supported on the server.');
      return;
    }
    if (this.audioContext) return; // Si ya está en marcha, no hace nada

    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();

    navigator.mediaDevices?.getUserMedia({ audio: true })
      .then((stream) => {
        this.microphone = this.audioContext!.createMediaStreamSource(stream);
        if (this.analyser) {
          this.microphone.connect(this.analyser);
          this.analyser.connect(this.audioContext!.destination);
        }
      })
      .catch(err => console.error('Error al acceder al micrófono: ', err));
  }


  // Obtiene la frecuencia dominante del sonido
  getFrequency(): number {
    if (!this.analyser) return 0;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    let maxIndex = 0;
    let maxValue = 0;
    for (let i = 0; i < bufferLength; i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i];
        maxIndex = i;
      }
    }

    const nyquist = this.audioContext!.sampleRate / 2;
    const frequency = maxIndex * nyquist / bufferLength;
    return frequency;
  }

  // Detiene la captura del micrófono
  stopAudioCapture(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.analyser = null;
    }
  }
}
