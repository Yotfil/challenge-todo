import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewComponent } from './pages/view/view.component';
import { HeaderComponent } from './sharedStandalone/components/header/header.component';
import { TaskComponent } from './components/task/task.component';
import { CreateComponent } from './pages/create/create.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent, ViewComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HeaderComponent,
    HttpClientModule,
    FormsModule,
    TaskComponent,
    CreateComponent,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
