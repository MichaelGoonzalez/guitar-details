import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSlideToggleModule,} from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../services/audio.service';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';


@Component({
  selector: 'app-tuner',
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatCardModule ],
  templateUrl: './tuner.component.html',
  styleUrl: './tuner.component.scss',
  standalone: true,
})
export class TunerComponent  implements OnInit, OnDestroy {
  frequency: number = 0;
  note: string = '';
  isTuned: boolean = false;

  constructor(private audioService: AudioService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.audioService.startAudioCapture();
      this.detectNote();
    }
  }

  ngOnDestroy(): void {
    this.audioService.stopAudioCapture();
  }

  detectNote(): void {
    setInterval(() => {
      this.frequency = this.audioService.getFrequency();
      this.note = this.frequencyToNote(this.frequency);
      this.isTuned = this.checkIfTuned(this.note);
    }, 100);
  }

  frequencyToNote(frequency: number): string {
    // Simplificación: mapeo directo de frecuencia a notas (puedes hacerlo más preciso)
    if (frequency >= 82 && frequency <= 87) return 'E2';
    if (frequency >= 110 && frequency <= 115) return 'A2';
    if (frequency >= 146 && frequency <= 152) return 'D3';
    if (frequency >= 196 && frequency <= 202) return 'G3';
    if (frequency >= 246 && frequency <= 252) return 'B3';
    if (frequency >= 329 && frequency <= 335) return 'E4';
    return '';
  }

  checkIfTuned(note: string): boolean {
    // Comparar si la nota detectada es la esperada
    return note === 'E2' || note === 'A2' || note === 'D3' || note === 'G3' || note === 'B3' || note === 'E4';
  }
}
