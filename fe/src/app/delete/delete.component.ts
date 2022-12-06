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

  ngOnInit(): void {
    this.api.getAllUser().subscribe((res) => {
      this.readUser = res.data;
      
    })
  }
  navigateToSignup(){
    this.router.navigateByUrl('/signup');
  }

  deleteUser(id:any){
    console.log(id,"-: Selected id")
    this.api.deleteData(id).subscribe((res)=>{
      console.log(res,"Deleted")
      window.location.reload();
    })
  }


  
}
