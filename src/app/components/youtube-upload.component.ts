import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {YoutubeService} from '../services/youtube-service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {AlertService} from '../services/alert-service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'youtube-upload',
  template: `
    <div>
      <div fxLayout="row" fxLayoutGap="30px" *ngIf="this.youtubeService.profile$ | async as profile">
        <span>Your Connected Account is: <strong>{{profile.getEmail()}}</strong></span>
        <span class="change" *ngIf="youtubeService.isAuthInit$ | async"
              (click)="youtubeService.signIn()">change account</span>
        <hr>
      </div>
      <form *ngIf="youtubeService.profile$ | async" fxLayout="column"
            [formGroup]="this.videoForm" fxLayoutAlign="center stretch"
            (ngSubmit)="videoForm.get('privacyStatus').markAsTouched(); videoForm.valid && onSubmit()" novalidate fxFlexAlign="center"
            fxLayoutGap="10px">
        <mat-form-field style="width: 100%">
          <input matInput placeholder="Title of video" formControlName="title">
          <mat-error>Title is required</mat-error>
        </mat-form-field>
        <mat-form-field style="width: 100%">
          <textarea matInput placeholder="Description of video (optional)" formControlName="description"></textarea>
        </mat-form-field>
        <mat-radio-group formControlName="privacyStatus" style="padding-bottom: 18px">
          <mat-radio-button value="unlisted"
                            matTooltip="Only people to whom you share/email the video will be able to view your video">
            Keep my video private
          </mat-radio-button>
          <mat-radio-button value="public"
                            matTooltip="Your video will be public on YouTube and search engines will also crawl it">
            I want maximum views so make it public
          </mat-radio-button>
          <mat-error *ngIf="videoForm.get('privacyStatus').touched && videoForm.get('privacyStatus').invalid"
                     style="margin-bottom: -18px">
            Select one of the options
          </mat-error>
        </mat-radio-group>
        <div fxLayout="row" fxLayoutAlign="start center" *ngIf="loading">
          <mat-progress-bar
            color="accent"
            [value]="this.percentageUpload"
            [bufferValue]="100">
          </mat-progress-bar>
          <button mat-icon-button (click)="onCancel()">
            <mat-icon>cancel</mat-icon>
          </button>
        </div>
        <button mat-raised-button fxFlexAlign="end" *ngIf="!loading" color="accent">Upload</button>
      </form>
      <div *ngIf="(youtubeService.isAuthInit$ | async) && !(youtubeService.isSignedIn$ | async)" fxLayoutAlign="start center"
           fxLayout="column">
        <h2>Please re(Connect) your Youtube Account</h2>
        <button (click)="this.youtubeService.signIn()" mat-raised-button color="primary">Sign In</button>
      </div>
    </div>
  `,
  styles: [`
    .change {
      text-decoration: underline;
      color: #a7d2f0;
      cursor: pointer;
    }
  `]
})

export class YoutubeUploadComponent {
  videoForm: FormGroup;
  percentageUpload = 0;
  subscription: Subscription;
  videoUrl: string;
  loading = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { video: any }, public youtubeService: YoutubeService,
              public dialogRef: MatDialogRef<YoutubeUploadComponent>, private alertService: AlertService, private snackBar: MatSnackBar) {
    this.videoForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(),
      privacyStatus: new FormControl(null, [Validators.required]),
    });
  }

  onSubmit() {
    this.loading = true;
    this.dialogRef.disableClose = true;
    this.subscription = this.youtubeService
      .uploadVideo(this.data.video, this.videoForm.value).subscribe((data) => {
        if (data.type === HttpEventType.UploadProgress) {
          this.percentageUpload = Math.round(100 * data.loaded / data.total);
        } else if (data instanceof HttpResponse) {
          const response: any = data.body;
          this.videoUrl = 'https://www.youtube.com/watch?v=neIiwpaaddA' + response.id;
          this.loading = false;
          this.alertService.success('video is uploaded to youtube successfully');
          this.dialogRef.close();
          // upload to my server
        }
      }, (error => {
        this.loading = false;
        this.dialogRef.disableClose = false;
        if (error instanceof Error) {
          this.alertService.error(error.message);
        } else {
          const errorObject = JSON.parse(error.error);
          if (errorObject.error.errors[0].reason === 'youtubeSignupRequired') {
            this.snackBar.open('You need to create a youtube channel', 'Create Channel', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['alert-error']
            }).onAction().subscribe(() => {
              window.open('https://www.youtube.com/create_channel',
                '_blank');
            });
          } else {
            this.alertService.error(errorObject.error.message);
          }
        }
      }));
  }

  onCancel() {
    this.subscription.unsubscribe();
    this.loading = false;
    this.dialogRef.close();
  }
}
