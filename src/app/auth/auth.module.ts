import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LogoutComponent } from './logout.component';
import { LoginComponent } from './login/login.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [LogoutComponent, LoginComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
})
export class AuthModule {}
