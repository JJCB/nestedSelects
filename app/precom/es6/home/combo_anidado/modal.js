"use strict";

yOSON.AppCore.addModule("modal", function(Sb){

	var st = {},
	    defaults = {},
	    dom = {},
	    events = void 0,
	    fn = void 0,
	    catchDom = void 0,
	    suscribeEvents = void 0,
	    asyncatchDom = void 0,
	    asynSuscribeEvents = void 0,
	    initialize = void 0;

	defaults = {
		linkModal: ".open_modal",
		parent: ".modal-fixed",
		content: ".modal-content",
		btnClose: ".close",
		tpl: " <div class='modal-fixed'><div class='modal-wrap'> <div class='modal-content'>asdasdasd</div><span class='close'></span></div></div>",

		afterShow: '',
		afterClose: ''

	};

	catchDom = function catchDom() {
		dom.linkModal = $(st.linkModal);
	};

	asyncatchDom = function asyncatchDom() {
		dom.parent = $(st.parent);
		dom.btnClose = $(st.btnClose, st.parent);
		dom.content = $(st.content, st.parent);
	};

	suscribeEvents = function suscribeEvents() {
		dom.linkModal.on("click", events.openModal);
	};

	asynSuscribeEvents = function asynSuscribeEvents() {

		dom.btnClose.on("click", events.close);
	};

	events = {

		openModal: function openModal(e) {

			$.type(st.afterShow) === "function" ? fn.open(st.afterShow) : fn.open();
		},

		close: function close() {
			$.type(st.afterClose) === "function" ? fn.close(st.afterClose) : fn.close();
		}

	};

	fn = {

		open: function open(callback) {

			var modal = $(st.tpl).appendTo("body");
			modal.css({
				"display": "flex",
				"justify-content": "center",
				"align-items": "center"
			});

			var html = $($(".link_modal a").attr("data-href"));

			asyncatchDom();
			dom.content.append(html);
			asynSuscribeEvents();

			callback != undefined ? fn.callback() : '';
		},

		close: function close(callback) {

			dom.parent.remove().hide();

			callback != undefined ? fn.callback() : '';
		}

	};

	initialize = function initialize(opts) {
		st = $.extend({}, defaults, opts);
		catchDom();
		suscribeEvents();
	};
	return {
		init: initialize
	};
},[]);