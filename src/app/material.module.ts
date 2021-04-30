import {NgModule} from '@angular/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


const modules = [
  MatSnackBarModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressBarModule,
  MatIconModule,
  MatDialogModule,
  MatRadioModule,
  MatTooltipModule,
  MatButtonModule,
  MatProgressSpinnerModule,
];

@NgModule({
  imports: modules,
  exports: modules
})

export class MaterialModule {
}
