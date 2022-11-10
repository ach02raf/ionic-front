import { Component, OnInit, ViewChild } from '@angular/core';
import { SwiperComponent } from 'swiper/angular';
import { SwiperOptions } from 'swiper';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from './modal/modal.component';
import { CodeModalComponent } from './code-modal/code-modal.component';
import { HttpClient } from '@angular/common/http';
const ip = '192.168.246.203';
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  // configuration des inputs du code
  configInput = {
    length: 4,
    placeholder: '#',
    allowNumbersOnly: true,
    inputStyles: {
      width: '50px',
      height: '50px',
    },
  };
  phone: string = '';
  isSubmitted = false;
  EnterNumber: FormGroup;
  NewPassword: FormGroup;
  errors = [
    { type: 'required', message: 'Champ Obligatoire !' },
    { type: 'pattern', message: 'Vérifier le format du champ' },
  ];
  //afficher la valeur des input du code dans le console
  //vérifier le code et aller à la page new password

  //config swiper
  config: SwiperOptions = {
    slidesPerView: 1, //par défaut 1
    pagination: false,
    enabled: true,
  };

  slideNext() {
    this.swiper.swiperRef.slideNext(100);
  }
  slidePrev() {
    this.swiper.swiperRef.slidePrev(100);
  }

  get errorControl() {
    return this.EnterNumber.controls;
  }
  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private modalCtrl: ModalController,
    private CodemodalCtrl: ModalController
  ) {}

  code: number;
  num: number;

  ngOnInit() {
    this.EnterNumber = this.formBuilder.group({
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^\\d{8}$'),
          Validators.maxLength(8),
        ],
      ],
    });
  }
  message = 'test';
  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      componentProps: {
        num: this.EnterNumber.value['phone'],
      },
    });
    modal.present();
  }

  async openCodeModal() {
    const modal = await this.CodemodalCtrl.create({
      component: CodeModalComponent,
      componentProps: {
        code: this.code,
        num: this.EnterNumber.value['phone'],
      },
    });
    modal.present();
  }

  sendSMS() {
    return this.http.get('http://' + ip + ':3001/verifications/sendsms', {
      headers: { phone: this.EnterNumber.value['phone'] },
    });
  }

  verifNum() {
    this.http
      .get('http://' + ip + ':3001/verifications/verificationphone', {
        headers: { phone: this.EnterNumber.value['phone'] },
      })
      .subscribe(
        (res) => {
          this.sendSMS().subscribe(
            async (res) => {
              this.code = await res['random'];
              this.openCodeModal();
              console.log('part1');
            },
            (err) => {
              console.log(err.error);
            }
          );
        },
        (err) => {
          console.log('part2');
          this.openModal();
          console.log(err.error.msg);
        }
      );

    // if (verif) {
    //   this.openCodeModal();
    //   console.log('part1');
    // } else {
    //   console.log('part2');
    //   this.openModal();
    // }
  }

  // goToLogin() {
  //   const navigationExtras: NavigationExtras = {
  //     state: {
  //       user: {
  //         id: 42,
  //         name: 'yos',
  //       },
  //     },
  //   };
  //   this.router.navigateByUrl('/login', navigationExtras);
  // }

  //on submit phone
  onSubmit() {
    this.isSubmitted = true;
    if (!this.EnterNumber.valid) {
      console.log('Please provide all the required values!');
      console.log(this.config);
      return false;
    } else {
      this.verifNum();
    }
  }
}
