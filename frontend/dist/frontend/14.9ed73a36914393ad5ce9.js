(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{X3zk:function(t,e,n){"use strict";n.r(e),n.d(e,"LoginModule",function(){return h});var r=n("ofXK"),o=n("3Pt+"),i=n("bTqV"),a=n("kmnG"),s=n("qFsG"),c=n("tyNb"),b=n("XNiG"),u=n("1G5W"),m=n("fXoL"),d=n("ej43");function l(t,e){1&t&&(m.Sb(0,"mat-error"),m.zc(1," The email and password were not recognized "),m.Rb())}const p=[{path:"",component:(()=>{class t{constructor(t,e,n,r){this.fb=t,this.cd=e,this.router=n,this.authenticationService=r,this.loginInvalid=!1,this.unsubscriber$=new b.b,this.form=this.fb.group({email:["",o.u.email],password:["",o.u.required]})}ngOnInit(){}ngOnDestroy(){this.unsubscriber$.next()}onSubmit(){const t=this.form.get("email").value,e=this.form.get("password").value;this.authenticationService.login(t,e).pipe(Object(u.a)(this.unsubscriber$)).subscribe({next:()=>{},error:t=>{this.loginInvalid=!0,this.cd.markForCheck()}})}}return t.\u0275fac=function(e){return new(e||t)(m.Mb(o.d),m.Mb(m.h),m.Mb(c.b),m.Mb(d.a))},t.\u0275cmp=m.Gb({type:t,selectors:[["app-login"]],decls:15,vars:2,consts:[[1,"wrapper"],[3,"formGroup","ngSubmit"],[4,"ngIf"],["matInput","","placeholder","Email","formControlName","email","required",""],["matInput","","type","password","placeholder","Password","formControlName","password","required",""],["mat-raised-button","","color","primary"]],template:function(t,e){1&t&&(m.Sb(0,"div",0),m.Sb(1,"form",1),m.Zb("ngSubmit",function(){return e.onSubmit()}),m.Sb(2,"h2"),m.zc(3,"Log In"),m.Rb(),m.xc(4,l,2,0,"mat-error",2),m.Sb(5,"mat-form-field"),m.Nb(6,"input",3),m.Sb(7,"mat-error"),m.zc(8," Please provide a valid email address "),m.Rb(),m.Rb(),m.Sb(9,"mat-form-field"),m.Nb(10,"input",4),m.Sb(11,"mat-error"),m.zc(12," Please provide a valid password "),m.Rb(),m.Rb(),m.Sb(13,"button",5),m.zc(14,"Login"),m.Rb(),m.Rb(),m.Rb()),2&t&&(m.Bb(1),m.jc("formGroup",e.form),m.Bb(3),m.jc("ngIf",e.loginInvalid))},directives:[o.v,o.o,o.i,r.l,a.c,s.b,o.c,o.n,o.g,o.t,a.b,i.b],styles:["body[_ngcontent-%COMP%], html[_ngcontent-%COMP%]{height:100%}body[_ngcontent-%COMP%]{margin:0;font-family:Roboto,Helvetica Neue,sans-serif}.wrapper[_ngcontent-%COMP%]{width:100%;max-width:1080px;margin:0 auto;padding:0 30px}mat-form-field[_ngcontent-%COMP%]{display:block}"],changeDetection:0}),t})()}];let f=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=m.Kb({type:t}),t.\u0275inj=m.Jb({imports:[[c.d.forChild(p)],c.d]}),t})(),h=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=m.Kb({type:t}),t.\u0275inj=m.Jb({imports:[[r.c,f,o.j,o.s,s.c,a.e,i.c]]}),t})()}}]);