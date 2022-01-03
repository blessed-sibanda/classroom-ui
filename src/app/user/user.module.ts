import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../app-material.module';
import { UsersComponent } from './users/users.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ProfileComponent } from './profile/profile.component';
import { UserRoutingModule } from './user-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UserResolve } from './user.resolve';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UsersComponent, EditProfileComponent, ProfileComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    UserRoutingModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ],
  providers: [UserResolve],
})
export class UserModule {}
