import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { User } from '../models/User';
import { UserDatabaseService } from '../user-database.service';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {

  @ViewChild(MatSidenav)
  sidenav!:MatSidenav
  constructor(private observer: BreakpointObserver,private router:Router, private userDatabaseService:UserDatabaseService,
    private domSanitizer:DomSanitizer) { }

  ngOnInit(): void {
    this.userDatabaseService.getAllUsers().subscribe((user:User[])=>{
      this.users=user;
    })
    
  }
  firstname:string;
  lastname:string;
  address:string;
  username:string;
  phone_number:number;
  email:string;
  picture:string;
  type:string;
  bo:boolean;
  promena(use:User){
    this.bo=true;
    this.firstname=use.firstname;
    this.lastname=use.lastname;
    this.username=use.username;
    this.address=use.address;
    this.phone_number=use.phone_number;
    this.email=use.email;
    this.picture=use.picture;
    this.type=use.type;
    this.ngOnInit();
  }
  

  update(){
    if(this.bo!=true){
      alert("Niste izabrali korisnika");
      return;
    }
    if(this.slikaPromenjena!=true){
      this.slika=this.picture;
    }
    
    this.type=this.tip;
    this.userDatabaseService.updateProfile(this.firstname, this.lastname,this.username,this.address,this.phone_number,this.email,this.slika,this.type).subscribe(resp=>{
      if(resp['message']=='ok'){
        alert('User updated');
        this.slikaPromenjena=false;
        this.ngOnInit()
      }
      else{
        alert(resp['message']);
        this.ngOnInit()
        return;
      }
    })
  }

  tip:string;
  deleteUser(user:User){
    this.userDatabaseService.deleteUser(this.username).subscribe(resp=>{
      if(resp['message']=='ok'){
        alert('User deleted');
        this.ngOnInit()
      }
      else{
        alert(resp['message']);
        this.ngOnInit()
        return;
      }
    })

  }
  ngAfterViewInit(){
    this.observer.observe(['(max-width: 800px)']).subscribe((res)=>{
      if(res.matches){
        this.sidenav.mode='over';
        this.sidenav.close();
      }
      else{
        this.sidenav.mode='side';
        this.sidenav.open();
      }
    })
  }

  user:User;
  users:User[]=[];
  upd:boolean;

  saljiUpdate(){
    this.upd=true;
    localStorage.setItem('update', JSON.stringify(this.upd))
    this.router.navigate(['adminPage']);
  }
  saljiKuci(){
    this.upd=false;
    localStorage.setItem('update', JSON.stringify(this.upd))
    this.router.navigate(['adminPage']);

  }
  saljiAzuriraj(){
    this.router.navigate(['userUpdate']);
  }
  saljiRegister(){
    this.router.navigate(['register']);
  }
  saljiBrisi(){
    this.router.navigate(['user']);
  }
  odjava(){
    localStorage.removeItem('ulogovan')
    this.router.navigate(['home']);
  }


  slika: string
  slikaPoruka: string
  slikaSacuvana: boolean
  slikaPromenjena
  slikaDodata(fileInput: any) {
    this.slikaPoruka = null;
    this.slika = null
    this.slikaSacuvana = false
    if (fileInput.target.files && fileInput.target.files[0]) {


      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {


            const imgBase64Path = e.target.result;
            this.slika = imgBase64Path;
            this.slikaSacuvana = true;
            this.slikaPromenjena=true;
            return true
            // this.previewImagePath = imgBase64Path;
          
        };
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  putdoslike() {
    return this.domSanitizer.bypassSecurityTrustUrl(this.slika)
  }

}
