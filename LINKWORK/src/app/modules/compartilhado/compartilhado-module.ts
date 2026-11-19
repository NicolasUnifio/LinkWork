import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Avatar } from './avatar/avatar';
import { Logo } from './logo/logo';

@NgModule({
  declarations: [Logo, Avatar],
  imports: [CommonModule],
  exports: [Logo, Avatar],
})
export class CompartilhadoModule {}
