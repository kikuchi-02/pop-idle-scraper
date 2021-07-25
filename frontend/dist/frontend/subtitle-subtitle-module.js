(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["subtitle-subtitle-module"],{

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