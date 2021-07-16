import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MemberRoutingModule } from './member-routing.module';
import { MemberComponent } from './member.component';

@NgModule({
  declarations: [MemberComponent],
  imports: [CommonModule, SharedModule, MemberRoutingModule],
})
export class MemberModule {}
