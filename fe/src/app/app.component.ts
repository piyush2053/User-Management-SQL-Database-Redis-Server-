import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fe';
  public isButtonVisible = true
  constructor(private router: Router) {
    if (1) {
      this.isButtonVisible = false;
    }else{
      this.isButtonVisible = true;
    }
  }
  logout() {
    this.router.navigateByUrl('');
  }
}
