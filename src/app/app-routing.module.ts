import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SummaryComponent } from './summary/summary.component';
import { BoardComponent } from './board/board.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { ContactsComponent } from './contacts/contacts.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { HelpPageComponent } from './help-page/help-page.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { AddTaskMenuComponent } from './add-task-menu/add-task-menu.component';
import { EditContactComponent } from './edit-contact/edit-contact.component';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'sign-up', component: SignUpComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'summary', component: SummaryComponent},
  { path: 'board', component: BoardComponent},
  { path: 'add-task', component: AddTaskComponent},
  { path: 'add-task-menu', component: AddTaskMenuComponent},
  { path: 'contacts', component: ContactsComponent},
  { path: 'legal-notice', component: LegalNoticeComponent},
  { path: 'help-page', component: HelpPageComponent},
  { path: 'add-contact', component: AddContactComponent},
  { path: 'edit-contact/:id', component: EditContactComponent},
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
