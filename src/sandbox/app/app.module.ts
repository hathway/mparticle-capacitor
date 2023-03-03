import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { MParticleCapacitorWeb } from '../../web';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    MParticleCapacitorWeb,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
