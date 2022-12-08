import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from '../apiservice.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  constructor(private api: ApiserviceService,private router:Router) { }
  readUser: any;
  validate = true;
  messageVisible = false;

  ngOnInit(): void {
    this.api.getAllUser().subscribe((res) => {
      this.readUser = res.data;
      // console.log("email", this.readUser[0].email)
      if(window.localStorage.getItem('email') === "piyush.patel@rws.com"){
        this.validate = true;
        this.messageVisible = false
      }
      else{
        this.messageVisible = true
        this.validate = false;
      }
    })
  }

  navigateToSignup(){
    this.router.navigateByUrl('/signup');
  }
  logout() {
    this.router.navigateByUrl('');
  }

  deleteUser(id:any){
    console.log(id,"-: Selected id")
    this.api.deleteData(id).subscribe((res)=>{
      console.log(res,"Deleted")
      window.location.reload();
    })
  }

  

  
}
