"use strict";

yOSON.AppCore.addModule("modal", function (Sb) {

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
		parent: ".modal-overlay",
		wrap: ".modal-wrap",
		content: ".modal-content",
		btnClose: ".modalClose",
		modalLoading: ".modal-loading",
		tplWrap: "<div class='modal-overlay'><div class='modalClose'>X Cerrar</div><div class='modal-wrap'> <div class='modal-content'></div><span class='modalClose'></span></div></div>",
		tplLoading: "<div class='modal-loading'><img src='../../neoauto3/public/static/neoauto3/img/plugins/fancybox/fancybox_loading@2x.gif'></div>",
		settings: {
			cssWrap: {
				padding: "20px"
			},
			cssContent: {},
			onResize: true
		}
	};

	asyncatchDom = function asyncatchDom() {

		dom.parent = $(st.parent);
		dom.wrap = $(st.wrap, st.parent);
		dom.btnClose = $(st.btnClose, dom.parent);
		dom.content = $(st.content, dom.parent);
	};

	asynSuscribeEvents = function asynSuscribeEvents() {

		dom.btnClose.on("click", events.close);
		dom.parent.on("click", events.close);
	};

	events = {
		openModal: function openModal(e) {
			fn.openNew();
		},
		close: function close(e) {

			if (e.target == this) {
				fn.close(st.settings.afterClose);
			}
		}
	};

	fn = {
		openNew: function openNew() {
			var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			st.settings = $.extend({}, defaults.settings, opts);

			new Image().src = "http://www.construyehogar.com/wp-content/uploads/2015/06/Dise%C3%B1o-de-casa-moderna-de-dos-plantas.jpg";
			new Image().src = "http://1.bp.blogspot.com/-9O6l6K9RfKs/VbHLGfeuglI/AAAAAAAABKE/RYyY-1EOlMI/s640/FACHADAS%2BDE%2BCASAS%2BDE%2BCAMPO%2B3.jpg";

			var view = new Image();

			console.log("valor : ", view.complete);
		},
		open: function open() {
			var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


			st.settings = $.extend({}, defaults.settings, opts);
			fn.showLoading();
			fn._loadModal();

			if (st.settings.beforeShow && typeof st.settings.beforeShow === "function") {
				fn._beforeShow();
			} else {
				fn._addHtmlModal();
			}
		},
		_addHtmlModal: function _addHtmlModal() {

			dom.content.append(st.settings.html);

			fn._setCss();

			if (st.settings.afterShow && typeof st.settings.afterShow === "function") {
				fn._afterShow();
			}
			fn._onResize();
		},
		_beforeShow: function _beforeShow() {

			st.settings.beforeShow(st.tplWrap);
			setTimeout(fn._addHtmlModal(), 1000);
		},
		_afterShow: function _afterShow() {

			setTimeout(st.settings.afterShow(), 1);
		},
		_loadModal: function _loadModal() {

			$("body").append(st.tplWrap);
			asyncatchDom();
			asynSuscribeEvents();
		},
		_setCss: function _setCss() {

			if (st.settings.locked) {

				$("body").addClass("locked");
				$("html").addClass("locked-html");
			}
			dom.wrap.css({

				left: ($(window).width() - dom.wrap.outerWidth()) / 2,
				top: ($(window).height() - dom.wrap.outerHeight()) / 2
			});

			dom.wrap.addClass("active");
			fn.hideLoading();

			//	dom.parent.css(st.settings.css || {})
		},
		_onResize: function _onResize() {

			$(window).resize(function () {
				dom.wrap.css({
					left: ($(window).width() - dom.wrap.outerWidth()) / 2,
					top: ($(window).height() - dom.wrap.outerHeight()) / 2
				});
			});
			setTimeout(function () {
				$(window).trigger("resize");
			}, 2);
		},
		updateSize: function updateSize() {

			fn._onResize();
		},
		close: function close(callback) {

			dom.parent.remove();
			//dom.overlay.remove();

			$("body").removeClass("locked");
			$("html").removeClass("locked-html");

			if (callback && $.type(callback) === "function") {
				setTimeout(callback, 1);
			}
		},
		showLoading: function showLoading() {
			$(st.tplLoading).appendTo("body");
		},
		hideLoading: function hideLoading() {
			$(st.modalLoading).remove();
		}
	};

	initialize = function initialize(oP) {

		st = $.extend({}, defaults, oP);
		Sb.events(["modal:open"], fn.open, undefined);
		Sb.events(["modal:updateSize"], fn.updateSize, undefined);
		Sb.events(["modal:showLoading"], fn.showLoading, undefined);
		Sb.events(["modal:hideLoading"], fn.hideLoading, undefined);
	};

	return {
		init: initialize
	};
});