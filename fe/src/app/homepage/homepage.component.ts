import { splitNsName } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from '../apiservice.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  userinfo: any;
  name: any;
  email: any;
  imgUrl: any;

  constructor(private api: ApiserviceService, private router: Router) {
    this.userinfo = window.localStorage.getItem('email');
    this.email = this.userinfo;
    // this.name2 = this.email.split("@");
    // this.name = this.name2[0]
  }
  readUser: any
  ngOnInit(): void {
    this.api.getNameByEmail(this.email).subscribe((res) => {
      this.name = res.data;
      this.imgUrl = res.body;

    })
  }

  openDelete() {
    this.router.navigateByUrl('/delete');
  }
  logout() {
    this.router.navigateByUrl('');
  }

}
