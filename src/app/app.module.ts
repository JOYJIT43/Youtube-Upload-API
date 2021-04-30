import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule, FlexModule} from '@angular/flex-layout';
import {MaterialModule} from './material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AlertService} from './services/alert-service';
import {UploadFromDiskComponent} from './components/upload-from-disk.component';
import {YoutubeUploadComponent} from './components/youtube-upload.component';
import {YoutubeService} from './services/youtube-service';

@NgModule({
  declarations: [
    AppComponent,
    UploadFromDiskComponent,
    YoutubeUploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FlexModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [AlertService, YoutubeService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
