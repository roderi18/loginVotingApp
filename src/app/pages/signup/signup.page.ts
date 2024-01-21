import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/auth-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { IonInput } from '@ionic/angular';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit, AfterViewInit {
  @ViewChild('passwordInput', { static: false }) passwordInput: IonInput;
  ionicForm: FormGroup;
  showPassword = false;

  constructor(private toastController: ToastController, private loadingController: LoadingController, private authService: AuthServiceService, private router: Router, public formBuilder: FormBuilder) {

  }

  ngOnInit() {
    // this.signUP()
    this.ionicForm = this.formBuilder.group({
      fullname: ['',
        [Validators.required]
      ],
      contact: ['',
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(10),
          // Validators.min(10)
        ]
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      password: ['', [
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}'),
        Validators.required,
      ],
      ],
    });
  }
  ngAfterViewInit() {
    // Asegurarse de que el elemento IonInput esté disponible antes de cambiar su tipo
    this.togglePasswordVisibility();
  }

  get errorControl() {
    // console.log(this.ionicForm.controls)
    return this.ionicForm.controls;
  }
  async signUpWithGoogle() {
    const user = await this.authService.GoogleAuth().then(() => {
      this.router.navigate(['/home'])
    })
  }

  async signUP() {
    console.log({ ionicForm: this.ionicForm })
    const loading = await this.loadingController.create();
    await loading.present();
    if (this.ionicForm.value) {
      const user = await this.authService.registerUser(this.ionicForm.value.email, this.ionicForm.value.password, this.ionicForm.value.fullname).catch((err) => {
        this.presentToast(err)
        console.log(err);
        loading.dismiss();
      })

      if (user) {
        loading.dismiss();
        this.router.navigate(['/home'])
      }
    } else {
      return console.log('Please provide all the required values!');
    }
  }
  signUpUsingPhonenumber(contact: string) {

    this.authService.signInWithPhoneNumber(contact)
  }
  async presentToast(message: undefined) {
    console.log(message);

    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
    });

    await toast.present();
  }

  togglePasswordVisibility() {
    // Cambiar el tipo de entrada solo si el elemento IonInput está disponible
    if (this.passwordInput) {
      const inputType = this.showPassword ? 'text' : 'password';
      this.passwordInput.type = inputType;
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    this.togglePasswordVisibility();
  }
}
