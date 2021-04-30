import {Component, ElementRef, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {YoutubeUploadComponent} from './youtube-upload.component';

@Component({
  selector: 'youtube-upload-from-disk',
  template: `
    <div fxLayout="column" style="margin-top: 3%"
         fxLayoutAlign="center center " fxLayoutGap="30px">
      <h1>Select a video from your Computer</h1>
      <p>(Upload your video to add it to your Youtube Channel)</p>
      <div *ngIf="!this.videoSelected" fxLayoutAlign="center center" style="margin-top: 20px" fxLayout="row">
        <input #videoFile name="video" type="file" (change)="this.selectVideo($event)" hidden accept="video/*"/>
        <button (click)="this.pickFile()" mat-raised-button color="primary">
          <mat-icon>add</mat-icon>
          SELECT
        </button>
      </div>
      <div [hidden]="!this.videoSelected">
        <video *ngIf="!this.isUploaded" id="video" controls #video>
          Your Browser Does not Support it
        </video>
      </div>
      <div *ngIf="this.videoSelected" fxLayoutAlign="center center" fxLayout="row" fxLayoutGap="20px">
        <button *ngIf="!this.isUploaded" mat-raised-button color="primary" matTooltip="This will be a Private video"
                (click)="youtubeSubmit()">Upload to Youtube
        </button>
        <input type="file" #videoFile name="video" accept="video/*" (change)="selectVideo($event)" hidden>
        <button mat-raised-button color="primary" (click)="this.pickFile()">
          <mat-icon>cached</mat-icon>
          <strong>CHANGE</strong></button>
      </div>
    </div>
  `,
  styles: [`
    h1 {
      color: #538ec3;
      text-align: center;
    }

    #video {
      width: 330px;
    }

    button {
      text-transform: uppercase;
    }
  `]
})

export class UploadFromDiskComponent {
  file: File;
  videoSelected = false;
  loading = false;
  isUploaded = false;
  @ViewChild('videoFile') nativeInputFile: ElementRef;
  @ViewChild('video') video: any;
  url: string;

  constructor(private dialog: MatDialog) {
  }

  selectVideo(data) {
    this.videoSelected = true;
    if (navigator.userAgent.search('firefox')) {
      this.file = data.target.files[0];
    } else {
      this.file = data.srcElement.files[0];
    }
    this.video.nativeElement.src = window.URL.createObjectURL(this.file);
  }

  pickFile() {
    this.nativeInputFile.nativeElement.click();
  }


  youtubeSubmit() {
    const dialog = this.dialog.open(YoutubeUploadComponent, {
      data: {video: this.file}
    });
    dialog.updateSize('70%', '70%');
  }
}
