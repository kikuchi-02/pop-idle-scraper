(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{ScRi:function(t,n,e){"use strict";e.r(n),e.d(n,"MemberModule",function(){return T});var c=e("ofXK"),o=e("PCNd"),a=e("tyNb"),i=e("XNiG"),r=e("1G5W"),b=e("fXoL"),l=e("cp0P"),s=e("LRne"),d=e("lJxs"),p=e("JIr8"),g=e("tk/3");let h=(()=>{class t{constructor(t){this.http=t}getLinks(t){const n=t.map(t=>`kind[]=${t}`).join("&");return this.http.get(`api/v1/member-links?${n}`)}getMemberTable(t){const n=t.map(t=>`kind[]=${t}`).join("&");return Object(l.a)([this.getLinks(t),this.http.get(`api/v1/member-table?${n}`)]).pipe(Object(d.a)(([t,n])=>{const e=t.reduce((t,n)=>(t[n.kind]=n.value.reduce((t,n)=>(t[n.name]=n.links,t),{}),t),{});return n.map(t=>{const n=e[t.kind];return t.tables=t.value.map(t=>this.parseTable(t,n)),t})}),Object(p.a)(t=>(console.error(t),Object(s.a)(void 0))))}parseTable(t,n){const e=t.map(t=>Object.keys(t));let o,a=0;for(const c of e)c.length>a&&(o=c,a=c.length);return o=o.filter(t=>!["\u5099\u8003","\u3088\u307f"].includes(t)),t=t.map(t=>(o=o.map(e=>{try{const n=new Date(t[e]);n instanceof Date&&(t[e]=Object(c.t)(n,"y/M/d","en-US"))}catch(o){}return"\u51fa\u8eab\u5730"===e&&/^\d{1,2}.+$/.test(t[e])&&(t[e]=t[e].replace(/^\d{1,2}(.+)$/,(t,n)=>n)),"link"===e&&(t[e]=(n[t["\u540d\u524d"]]||[]).map(t=>({host:new URL(t).host,link:t}))),e}),t)),{columns:o,rows:t}}}return t.\u0275fac=function(n){return new(n||t)(b.Wb(g.b))},t.\u0275prov=b.Ib({token:t,factory:t.\u0275fac,providedIn:"root"}),t})();var u=e("uJfP");function k(t,n){1&t&&b.Ob(0)}function f(t,n){if(1&t&&(b.Qb(0),b.xc(1,k,1,0,"ng-container",6),b.Pb()),2&t){const t=n.$implicit;b.dc(2);const e=b.oc(9);b.Bb(1),b.jc("ngTemplateOutlet",e)("ngTemplateOutletContext",t)}}function m(t,n){if(1&t&&(b.Qb(0),b.Sb(1,"h2"),b.zc(2,"\u4e43\u6728\u574246"),b.Rb(),b.xc(3,f,2,2,"ng-container",5),b.Pb()),2&t){const t=b.dc();b.Bb(3),b.jc("ngForOf",t.nogizakaTables)}}function O(t,n){1&t&&b.Ob(0)}function x(t,n){if(1&t&&(b.Qb(0),b.xc(1,O,1,0,"ng-container",6),b.Pb()),2&t){const t=n.$implicit;b.dc(2);const e=b.oc(9);b.Bb(1),b.jc("ngTemplateOutlet",e)("ngTemplateOutletContext",t)}}function w(t,n){if(1&t&&(b.Qb(0),b.Sb(1,"h2"),b.zc(2,"\u6afb\u574246"),b.Rb(),b.xc(3,x,2,2,"ng-container",5),b.Pb()),2&t){const t=b.dc();b.Bb(3),b.jc("ngForOf",t.sakurazakaTables)}}function y(t,n){1&t&&b.Ob(0)}function C(t,n){if(1&t&&(b.Qb(0),b.xc(1,y,1,0,"ng-container",6),b.Pb()),2&t){const t=n.$implicit;b.dc(2);const e=b.oc(9);b.Bb(1),b.jc("ngTemplateOutlet",e)("ngTemplateOutletContext",t)}}function v(t,n){if(1&t&&(b.Qb(0),b.Sb(1,"h2"),b.zc(2,"\u65e5\u5411\u574246"),b.Rb(),b.xc(3,C,2,2,"ng-container",5),b.Pb()),2&t){const t=b.dc();b.Bb(3),b.jc("ngForOf",t.hinatazakaTables)}}function P(t,n){if(1&t&&(b.Sb(0,"th"),b.zc(1),b.Rb()),2&t){const t=n.$implicit,e=n.index,c=b.dc().columns,o=b.dc();b.uc("width",o.setWidth(e,c.length)),b.Bb(1),b.Bc(" ",t," ")}}function _(t,n){if(1&t&&(b.Sb(0,"a",12),b.zc(1),b.Rb()),2&t){const t=n.$implicit;b.jc("href",t.link,b.sc),b.Bb(1),b.Ac(t.host)}}function M(t,n){if(1&t&&(b.Qb(0),b.xc(1,_,2,2,"a",11),b.Pb()),2&t){const t=b.dc().$implicit,n=b.dc().$implicit;b.Bb(1),b.jc("ngForOf",n[t])}}function S(t,n){if(1&t&&(b.Qb(0),b.zc(1),b.Pb()),2&t){const t=b.dc().$implicit,n=b.dc().$implicit;b.Bb(1),b.Bc(" ",n[t]," ")}}function z(t,n){if(1&t&&(b.Sb(0,"td"),b.Qb(1,8),b.xc(2,M,2,1,"ng-container",9),b.xc(3,S,2,1,"ng-container",10),b.Pb(),b.Rb()),2&t){const t=n.$implicit,e=n.index,c=b.dc(2).columns,o=b.dc();b.uc("width",o.setWidth(e,c.length)),b.Bb(1),b.jc("ngSwitch",t),b.Bb(1),b.jc("ngSwitchCase","link")}}function j(t,n){if(1&t&&(b.Sb(0,"tr"),b.xc(1,z,4,4,"td",7),b.Rb()),2&t){const t=b.dc().columns;b.Bb(1),b.jc("ngForOf",t)}}function B(t,n){if(1&t&&(b.Sb(0,"table"),b.Sb(1,"thead"),b.Sb(2,"tr"),b.xc(3,P,2,3,"th",7),b.Rb(),b.Rb(),b.Sb(4,"tbody"),b.xc(5,j,2,1,"tr",5),b.Rb(),b.Rb()),2&t){const t=n.rows,e=n.columns;b.Bb(3),b.jc("ngForOf",e),b.Bb(2),b.jc("ngForOf",t)}}const $=[{path:"",component:(()=>{class t{constructor(t,n){this.memberService=t,this.cd=n,this.idleSwitchState={nogizakaCheck:!0,sakurazakaCheck:!0,hinatazakaCheck:!0},this.unsubscriber$=new i.a,this.memberService.getMemberTable(["nogizaka","sakurazaka","hinatazaka"]).pipe(Object(r.a)(this.unsubscriber$)).subscribe(t=>{t.forEach(t=>{switch(t.kind){case"nogizaka":this.nogizakaTables=t.tables;break;case"sakurazaka":this.sakurazakaTables=t.tables;break;case"hinatazaka":this.hinatazakaTables=t.tables}}),this.cd.markForCheck()})}ngOnInit(){}ngOnDestroy(){this.unsubscriber$.next()}setWidth(t,n){return t===n-1?`calc(100% - ${120*n-1}px)`:"120px"}}return t.\u0275fac=function(n){return new(n||t)(b.Mb(h),b.Mb(b.h))},t.\u0275cmp=b.Gb({type:t,selectors:[["app-member"]],decls:10,vars:4,consts:[[1,"member_Wrapper"],[3,"value"],[1,"table-section"],[4,"ngIf"],["tableTemplate",""],[4,"ngFor","ngForOf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"width",4,"ngFor","ngForOf"],[3,"ngSwitch"],[4,"ngSwitchCase"],[4,"ngSwitchDefault"],["class","table-column__link-anchor","target","_blank",3,"href",4,"ngFor","ngForOf"],["target","_blank",1,"table-column__link-anchor",3,"href"]],template:function(t,n){1&t&&(b.Sb(0,"div",0),b.Nb(1,"app-idle-switcher",1),b.Sb(2,"section",2),b.xc(3,m,4,1,"ng-container",3),b.Rb(),b.Sb(4,"section",2),b.xc(5,w,4,1,"ng-container",3),b.Rb(),b.Sb(6,"section",2),b.xc(7,v,4,1,"ng-container",3),b.Rb(),b.Rb(),b.xc(8,B,6,2,"ng-template",null,4,b.yc)),2&t&&(b.Bb(1),b.jc("value",n.idleSwitchState),b.Bb(2),b.jc("ngIf",n.idleSwitchState.nogizakaCheck),b.Bb(2),b.jc("ngIf",n.idleSwitchState.sakurazakaCheck),b.Bb(2),b.jc("ngIf",n.idleSwitchState.hinatazakaCheck))},directives:[u.a,c.l,c.k,c.p,c.m,c.n,c.o],styles:[".cdk-global-overlay-wrapper[_ngcontent-%COMP%], .cdk-overlay-container[_ngcontent-%COMP%]{pointer-events:none;top:0;left:0;height:100%;width:100%}.cdk-overlay-container[_ngcontent-%COMP%]{position:fixed;z-index:1000}.cdk-overlay-container[_ngcontent-%COMP%]:empty{display:none}.cdk-global-overlay-wrapper[_ngcontent-%COMP%], .cdk-overlay-pane[_ngcontent-%COMP%]{display:flex;position:absolute;z-index:1000}.cdk-overlay-pane[_ngcontent-%COMP%]{pointer-events:auto;box-sizing:border-box;max-width:100%;max-height:100%}.cdk-overlay-backdrop[_ngcontent-%COMP%]{position:absolute;top:0;bottom:0;left:0;right:0;z-index:1000;pointer-events:auto;-webkit-tap-highlight-color:transparent;transition:opacity .4s cubic-bezier(.25,.8,.25,1);opacity:0}.cdk-overlay-backdrop.cdk-overlay-backdrop-showing[_ngcontent-%COMP%]{opacity:1}.cdk-high-contrast-active[_ngcontent-%COMP%]   .cdk-overlay-backdrop.cdk-overlay-backdrop-showing[_ngcontent-%COMP%]{opacity:.6}.cdk-overlay-dark-backdrop[_ngcontent-%COMP%]{background:rgba(0,0,0,.32)}.cdk-overlay-transparent-backdrop[_ngcontent-%COMP%], .cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing[_ngcontent-%COMP%]{opacity:0}.cdk-overlay-connected-position-bounding-box[_ngcontent-%COMP%]{position:absolute;z-index:1000;display:flex;flex-direction:column;min-width:1px;min-height:1px}.cdk-global-scrollblock[_ngcontent-%COMP%]{position:fixed;width:100%;overflow-y:scroll}body[_ngcontent-%COMP%], html[_ngcontent-%COMP%]{height:100%}body[_ngcontent-%COMP%]{margin:0;font-family:Roboto,Helvetica Neue,sans-serif}body.dark-theme[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#fff}body.dark-theme[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{color:#607d8b}.member_Wrapper[_ngcontent-%COMP%]{width:100%;max-width:1080px;margin:0 auto;padding:0 30px}.table-section[_ngcontent-%COMP%]     table{width:100%;border-collapse:collapse;border-spacing:0;margin-bottom:30px}.table-section[_ngcontent-%COMP%]     table td, .table-section[_ngcontent-%COMP%]     table th{padding:10px 0;text-align:center;border:1px solid #000;width:120px}.table-section[_ngcontent-%COMP%]     table .table-column__link-anchor{display:block}"],changeDetection:0}),t})()}];let R=(()=>{class t{}return t.\u0275fac=function(n){return new(n||t)},t.\u0275mod=b.Kb({type:t}),t.\u0275inj=b.Jb({imports:[[a.d.forChild($)],a.d]}),t})(),T=(()=>{class t{}return t.\u0275fac=function(n){return new(n||t)},t.\u0275mod=b.Kb({type:t}),t.\u0275inj=b.Jb({imports:[[c.c,o.a,R]]}),t})()}}]);