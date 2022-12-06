import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  constructor(private api: ApiserviceService) { }
  readUser: any;

  ngOnInit(): void {
    this.api.getAllUser().subscribe((res) => {
      this.readUser = res.data;
    })
  }

  deleteUser(id:any){
    console.log(id,"-: Selected id")
    this.api.deleteData(id).subscribe((res)=>{
      console.log(res,"Deleted")
      window.location.reload();
    })
  }


  
}
