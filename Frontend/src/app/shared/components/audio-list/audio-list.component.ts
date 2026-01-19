import { Component, OnInit } from '@angular/core';
import { AudioService } from '../../../core/services/audio.service';
import { Audio } from '../../../core/models/audio.model';

@Component({
    selector: 'app-audio-list',
    templateUrl: './audio-list.component.html'
})
export class AudioListComponent implements OnInit {
    listaAudios: Audio[] = [];

    constructor(private audioService: AudioService) { }

    ngOnInit(): void {
        this.audioService.getAudios().subscribe(data => {
            this.listaAudios = data;
        });
    }
}