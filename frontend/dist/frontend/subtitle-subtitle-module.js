(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["subtitle-subtitle-module"],{

/***/ "2Xbf":
/*!************************************************!*\
  !*** ./src/app/subtitle/subtitle.component.ts ***!
  \************************************************/
/*! exports provided: SubtitleComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SubtitleComponent", function() { return SubtitleComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/button */ "bTqV");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "3Pt+");



const layouts = ['left', 'right', 'both'];
class SubtitleComponent {
    constructor(cd) {
        this.cd = cd;
        this.inputArea = '';
        this.outputArea = '';
        this.layout = 'both';
        this.subtitleLocalStorageKey = 'subtitleLocalStorageKey';
        const input = localStorage.getItem(this.subtitleLocalStorageKey);
        if (input) {
            this.inputArea = input;
            this.outputArea = this.formatSubtitle(input);
            this.cd.markForCheck();
        }
    }
    ngOnInit() { }
    generateSubtitle() {
        const input = this.inputArea;
        localStorage.setItem(this.subtitleLocalStorageKey, input);
        const output = this.formatSubtitle(input);
        this.outputArea = output;
        this.cd.markForCheck();
    }
    applyLayout(type) {
        if (layouts.includes(type)) {
            this.layout = type;
            this.cd.markForCheck();
        }
    }
    formatSubtitle(input) {
        input = input.replace(/[\(|（].*[\)|）]/g, '');
        input = input.replace(/\n{3,}/g, '\n\n');
        input = input.replace(/、/g, '、\n');
        input = input.replace(/。/g, '。\n');
        const border = '-'.repeat(20);
        input = input.replace(/\n(\d+_\d+)\n/g, (match, p) => `\n${border}${p}${border}\n`);
        input = input.replace(/\n(\d+)\n/g, (match, p) => `\n${border}${p}${border}\n`);
        return input;
    }
}
SubtitleComponent.ɵfac = function SubtitleComponent_Factory(t) { return new (t || SubtitleComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"])); };
SubtitleComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: SubtitleComponent, selectors: [["app-subtitle"]], decls: 19, vars: 13, consts: [[1, "subtitle_Wrapper"], ["mat-stroked-button", "", "color", "primary", "type", "button", 1, "subtitle_MainButton", 3, "click"], [1, "subtitle_Layout_Buttons"], ["mat-stroked-button", "", "color", "primary", 3, "disabled", "click"], [1, "subtitle_Inner"], [1, "subtitle_Labels"], [1, "subtitle_TextAreas"], ["placeholder", "paste subtitle here", 1, "subtitle_TextArea", "left", 3, "ngModel", "ngModelChange"], [1, "subtitle_TextArea", "right", 3, "ngModel", "ngModelChange"]], template: function SubtitleComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "button", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SubtitleComponent_Template_button_click_1_listener() { return ctx.generateSubtitle(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, " generate subtitle ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SubtitleComponent_Template_button_click_4_listener() { return ctx.applyLayout("left"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, " input ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SubtitleComponent_Template_button_click_6_listener() { return ctx.applyLayout("right"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, " output ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SubtitleComponent_Template_button_click_8_listener() { return ctx.applyLayout("both"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, " both ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "input");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "output");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "textarea", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function SubtitleComponent_Template_textarea_ngModelChange_17_listener($event) { return ctx.inputArea = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "textarea", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function SubtitleComponent_Template_textarea_ngModelChange_18_listener($event) { return ctx.outputArea = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.layout === "left");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.layout === "right");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.layout === "both");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("hide", ctx.layout === "right");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("hide", ctx.layout === "left");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("hide", ctx.layout === "right");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.inputArea);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("hide", ctx.layout === "left");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.outputArea);
    } }, directives: [_angular_material_button__WEBPACK_IMPORTED_MODULE_1__["MatButton"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgModel"]], styles: ["html[_ngcontent-%COMP%], body[_ngcontent-%COMP%] {\n  height: 100%;\n}\nbody[_ngcontent-%COMP%] {\n  margin: 0;\n  font-family: Roboto, \"Helvetica Neue\", sans-serif;\n}\n.subtitle_Wrapper[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 1080px;\n  margin: 0 auto;\n  padding: 0 30px;\n  width: 100%;\n  max-width: none;\n}\n.subtitle_Wrapper[_ngcontent-%COMP%]   .subtitle_MainButton[_ngcontent-%COMP%] {\n  margin: 20px;\n  height: 50px;\n  width: 500px;\n}\n.subtitle_Wrapper[_ngcontent-%COMP%]   .subtitle_Layout_Buttons[_ngcontent-%COMP%] {\n  margin: 20px;\n}\n.subtitle_Wrapper[_ngcontent-%COMP%]   .subtitle_Layout_Buttons[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  width: 300px;\n  height: 50px;\n}\n.subtitle_Wrapper[_ngcontent-%COMP%]   .subtitle_Inner[_ngcontent-%COMP%]   .subtitle_Labels[_ngcontent-%COMP%] {\n  display: flex;\n  width: 100%;\n}\n.subtitle_Wrapper[_ngcontent-%COMP%]   .subtitle_Inner[_ngcontent-%COMP%]   .subtitle_Labels[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  flex-grow: 1;\n  font-size: 30px;\n  margin: 10px 30px;\n}\n.subtitle_Wrapper[_ngcontent-%COMP%]   .subtitle_Inner[_ngcontent-%COMP%]   .subtitle_TextAreas[_ngcontent-%COMP%] {\n  display: flex;\n  width: 100%;\n}\n.subtitle_Wrapper[_ngcontent-%COMP%]   .subtitle_Inner[_ngcontent-%COMP%]   .subtitle_TextAreas[_ngcontent-%COMP%]   .subtitle_TextArea[_ngcontent-%COMP%] {\n  height: 1000px;\n  margin: 0 20px;\n  flex-grow: 1;\n}\n.hide[_ngcontent-%COMP%] {\n  display: none;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3N0eWxlcy5zY3NzIiwiLi4vLi4vLi4vc3VidGl0bGUuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEVBQUE7QUFFQTs7RUFFRSxZQUFBO0FDQUY7QURFQTtFQUNFLFNBQUE7RUFDQSxpREFBQTtBQ0NGO0FBUkE7RURXRSxXQUFBO0VBQ0EsaUJBQUE7RUFDQSxjQUFBO0VBQ0EsZUFBQTtFQ1pBLFdBQUE7RUFDQSxlQUFBO0FBY0Y7QUFaRTtFQUNFLFlBQUE7RUFDQSxZQUFBO0VBQ0EsWUFBQTtBQWNKO0FBWkU7RUFDRSxZQUFBO0FBY0o7QUFiSTtFQUNFLFlBQUE7RUFDQSxZQUFBO0FBZU47QUFWSTtFQUNFLGFBQUE7RUFDQSxXQUFBO0FBWU47QUFWTTtFQUNFLFlBQUE7RUFDQSxlQUFBO0VBQ0EsaUJBQUE7QUFZUjtBQVRJO0VBQ0UsYUFBQTtFQUNBLFdBQUE7QUFXTjtBQVRNO0VBQ0UsY0FBQTtFQUNBLGNBQUE7RUFDQSxZQUFBO0FBV1I7QUFMQTtFQUNFLGFBQUE7QUFRRiIsImZpbGUiOiJzdWJ0aXRsZS5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIFlvdSBjYW4gYWRkIGdsb2JhbCBzdHlsZXMgdG8gdGhpcyBmaWxlLCBhbmQgYWxzbyBpbXBvcnQgb3RoZXIgc3R5bGUgZmlsZXMgKi9cblxuaHRtbCxcbmJvZHkge1xuICBoZWlnaHQ6IDEwMCU7XG59XG5ib2R5IHtcbiAgbWFyZ2luOiAwO1xuICBmb250LWZhbWlseTogUm9ib3RvLCAnSGVsdmV0aWNhIE5ldWUnLCBzYW5zLXNlcmlmO1xufVxuXG5AbWl4aW4gd3JhcHBlciB7XG4gIHdpZHRoOiAxMDAlO1xuICBtYXgtd2lkdGg6IDEwODBweDtcbiAgbWFyZ2luOiAwIGF1dG87XG4gIHBhZGRpbmc6IDAgMzBweDtcbn1cbiIsIkBpbXBvcnQgJy4uLy4uL3N0eWxlcy5zY3NzJztcbi5zdWJ0aXRsZV9XcmFwcGVyIHtcbiAgQGluY2x1ZGUgd3JhcHBlcjtcbiAgd2lkdGg6IDEwMCU7XG4gIG1heC13aWR0aDogbm9uZTtcblxuICAuc3VidGl0bGVfTWFpbkJ1dHRvbiB7XG4gICAgbWFyZ2luOiAyMHB4O1xuICAgIGhlaWdodDogNTBweDtcbiAgICB3aWR0aDogNTAwcHg7XG4gIH1cbiAgLnN1YnRpdGxlX0xheW91dF9CdXR0b25zIHtcbiAgICBtYXJnaW46IDIwcHg7XG4gICAgYnV0dG9uIHtcbiAgICAgIHdpZHRoOiAzMDBweDtcbiAgICAgIGhlaWdodDogNTBweDtcbiAgICB9XG4gIH1cblxuICAuc3VidGl0bGVfSW5uZXIge1xuICAgIC5zdWJ0aXRsZV9MYWJlbHMge1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIHdpZHRoOiAxMDAlO1xuXG4gICAgICBsYWJlbCB7XG4gICAgICAgIGZsZXgtZ3JvdzogMTtcbiAgICAgICAgZm9udC1zaXplOiAzMHB4O1xuICAgICAgICBtYXJnaW46IDEwcHggMzBweDtcbiAgICAgIH1cbiAgICB9XG4gICAgLnN1YnRpdGxlX1RleHRBcmVhcyB7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgd2lkdGg6IDEwMCU7XG5cbiAgICAgIC5zdWJ0aXRsZV9UZXh0QXJlYSB7XG4gICAgICAgIGhlaWdodDogMTAwMHB4O1xuICAgICAgICBtYXJnaW46IDAgMjBweDtcbiAgICAgICAgZmxleC1ncm93OiAxO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4uaGlkZSB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG4iXX0= */"], changeDetection: 0 });


/***/ }),

/***/ "Q3Ke":
/*!*****************************************************!*\
  !*** ./src/app/subtitle/subtitle-routing.module.ts ***!
  \*****************************************************/
/*! exports provided: SubtitleRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SubtitleRoutingModule", function() { return SubtitleRoutingModule; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _subtitle_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./subtitle.component */ "2Xbf");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");




const routes = [{ path: '', component: _subtitle_component__WEBPACK_IMPORTED_MODULE_1__["SubtitleComponent"] }];
class SubtitleRoutingModule {
}
SubtitleRoutingModule.ɵfac = function SubtitleRoutingModule_Factory(t) { return new (t || SubtitleRoutingModule)(); };
SubtitleRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({ type: SubtitleRoutingModule });
SubtitleRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({ imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](SubtitleRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] }); })();


/***/ }),

/***/ "Yq2R":
/*!*********************************************!*\
  !*** ./src/app/subtitle/subtitle.module.ts ***!
  \*********************************************/
/*! exports provided: SubtitleModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SubtitleModule", function() { return SubtitleModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/button */ "bTqV");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shared/shared.module */ "PCNd");
/* harmony import */ var _subtitle_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./subtitle-routing.module */ "Q3Ke");
/* harmony import */ var _subtitle_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./subtitle.component */ "2Xbf");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ "fXoL");







class SubtitleModule {
}
SubtitleModule.ɵfac = function SubtitleModule_Factory(t) { return new (t || SubtitleModule)(); };
SubtitleModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineNgModule"]({ type: SubtitleModule });
SubtitleModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjector"]({ imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"],
            _shared_shared_module__WEBPACK_IMPORTED_MODULE_3__["SharedModule"],
            _subtitle_routing_module__WEBPACK_IMPORTED_MODULE_4__["SubtitleRoutingModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormsModule"],
            _angular_material_button__WEBPACK_IMPORTED_MODULE_2__["MatButtonModule"],
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsetNgModuleScope"](SubtitleModule, { declarations: [_subtitle_component__WEBPACK_IMPORTED_MODULE_5__["SubtitleComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"],
        _shared_shared_module__WEBPACK_IMPORTED_MODULE_3__["SharedModule"],
        _subtitle_routing_module__WEBPACK_IMPORTED_MODULE_4__["SubtitleRoutingModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormsModule"],
        _angular_material_button__WEBPACK_IMPORTED_MODULE_2__["MatButtonModule"]] }); })();


/***/ })

}]);
//# sourceMappingURL=subtitle-subtitle-module.js.map