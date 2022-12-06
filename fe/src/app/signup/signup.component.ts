import { identifierName } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { count } from 'rxjs';
import { ApiserviceService } from '../apiservice.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private api: ApiserviceService,private router:Router) { }
  readUser: any;
  errMsg: any;

  ngOnInit(): void {

  }
  userForm = new FormGroup({
    'name': new FormControl('', Validators.required),
    'email': new FormControl('', Validators.required),
    'password': new FormControl('', Validators.required),
    'netImg': new FormControl('', Validators.required)
  })

  userSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
      this.api.createData(this.userForm.value).subscribe((res) => {
        console.log(res);
        alert("Succesfully Registered !")
        this.userForm.reset();
        this.router.navigateByUrl('');
      })
    }
    else {
      this.errMsg = "All fields required."
    }

  }
}
