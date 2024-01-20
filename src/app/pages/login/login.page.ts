import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/auth-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, AfterViewInit {
  @ViewChild('passwordInput', { static: false }) passwordInput: IonInput;

  ionicForm: FormGroup;
  showPassword = false;

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthServiceService,
    private router: Router,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(''),
          // Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
        ],
      ],
      rememberCredentials: [false],
    });

    // Recuperar credenciales almacenadas al iniciar la página
    const savedEmail = localStorage.getItem('savedEmail');

    if (savedEmail) {
      this.ionicForm.patchValue({
        email: savedEmail,
        rememberCredentials: true,
      });
    }
  }

  ngAfterViewInit() {
    // Asegurarse de que el elemento IonInput esté disponible antes de cambiar su tipo
    this.togglePasswordVisibility();
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    if (this.ionicForm.valid) {
      const email = this.ionicForm.value.email;
      const password = this.ionicForm.value.password;

      if (this.ionicForm.value.rememberCredentials) {
        // Guardar credenciales si se selecciona la opción
        localStorage.setItem('savedEmail', email);
        localStorage.setItem('savedPassword', password);
      } else {
        // Eliminar credenciales almacenadas si no se selecciona la opción
        localStorage.removeItem('savedEmail');
        localStorage.removeItem('savedPassword');
      }

      const user = await this.authService.loginUser(email, password).catch((err) => {
        this.presentToast(err);
        console.log(err);
        loading.dismiss();
      });

      if (user) {
        loading.dismiss();
        this.router.navigate(['/home']);
      }
    } else {
      console.log('Please provide all the required values!');
    }
  }

  get errorControl() {
    return this.ionicForm.controls;
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
