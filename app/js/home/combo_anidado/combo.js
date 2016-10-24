"use strict";

yOSON.AppCore.addModule("combo_anidado", function (Sb) {
	var st = {},
	    dom = {},
	    events = void 0,
	    fn = void 0,
	    catchDom = void 0,
	    asyncatchDom = void 0,
	    afterCatchDom = void 0,
	    suscribeEvents = void 0,
	    asynSuscribeEvents = void 0,
	    initialize = void 0;

	st = {

		linkModal: ".link_modal a",
		parentModal: "#modal",
		tplListSlc: "#tplListSlc",
		tplShowList: "#tplShowList",
		slcDpto: "select[name='dpto']",
		slcProv: "select[name='prov']",
		slcDist: "select[name='dist']",
		btnAdd: ".btn_add",
		btnUpdate: ".btn_update",
		btnRemove: ".btn_remove",
		btnEdit: ".btn_edit",
		urlDepart: "http://www.json-generator.com/api/json/get/bYmFFsHmDC?indent=2",
		urlprov: "http://www.json-generator.com/api/json/get/cpXdelSNki?indent=2",
		urlDist: "http://www.json-generator.com/api/json/get/cjWbLDrQXS?indent=2",
		arrayList: [],
		html: "",
		idArray: null,
		data: {
			dpto: {},
			prov: {},
			dist: {}
		}

	};

	catchDom = function catchDom() {

		dom.linkModal = $(st.linkModal);
		dom.idTpl = dom.linkModal.attr("data-link-modal");
	};

	asyncatchDom = function asyncatchDom() {

		dom.parentModal = $(st.parentModal);
		dom.slcDpto = $(st.slcDpto, st.parentModal);
		dom.slcProv = $(st.slcProv, st.parentModal);
		dom.slcDist = $(st.slcDist, st.parentModal);
		dom.btnAdd = $(st.btnAdd, st.parentModal);
		dom.btnRemove = $(st.btnRemove, st.parentModal);
		dom.btnEdit = $(st.btnEdit, st.parentModal);
		dom.btnUpdate = $(st.btnUpdate, st.parentModal);
	};

	afterCatchDom = function afterCatchDom() {

		_.templateSettings = {
			evaluate: /\{\{([\s\S]+?)\}\}/g,
			interpolate: /\{\{=([\s\S]+?)\}\}/g
		};
	};

	suscribeEvents = function suscribeEvents() {
		dom.linkModal.on("click", events.openModal);
	};

	asynSuscribeEvents = function asynSuscribeEvents() {

		dom.slcDpto.on("change", events.findProvincia);
		dom.slcProv.on("change", events.findDistrito);
		dom.btnAdd.on("click", events.addList);
		dom.btnUpdate.on("click", events.updateList);
		dom.parentModal.on("click", st.btnRemove, events.removeList);
		dom.parentModal.on("click", st.btnEdit, events.editList);
	};

	events = {
		openModal: function openModal(e) {
			e.preventDefault();
			fn.renderModal();
		},
		findProvincia: function findProvincia() {

			var ajax = [{
				slc: dom.slcProv,
				id: st.data.prov.id,
				parent: dom.slcDpto,
				url: st.urlprov
			}];

			fn.ajax(ajax);
			fn.cleanSlcDist();
		},
		findDistrito: function findDistrito() {

			var ajaxDist = [{
				slc: dom.slcDist,
				id: st.data.dist.id,
				parent: dom.slcProv,
				url: st.urlDist
			}];

			fn.ajax(ajaxDist);
		},
		removeList: function removeList(e) {

			var id = $(e.target).siblings("div").attr("data-id");
			st.arrayList.splice(id, 1);

			$(e.target).parent().slideUp("slow", function () {

				if (!st.arrayList.length) {
					$(".content_list").slideUp();
				} else {
					fn.showList();
				}
			});

			$("ul li").removeClass("active");
			st.idArray = null;
			fn.changeAdd();
		},
		addList: function addList() {

			var data = fn.captureData();
			st.arrayList.push(data);
			fn.showList();
		},
		editList: function editList(e) {

			st.idArray = $(e.target).parent().children("div").attr("data-id");
			st.data = st.arrayList[st.idArray];
			$("ul li").removeClass("active");
			$(e.target).parent().addClass("active");
			fn.editData();
		},
		updateList: function updateList() {

			st.arrayList[st.idArray] = fn.captureData();
			dom.btnAdd.show();
			dom.btnUpdate.hide();
			fn.showList();
		}
	};

	fn = {
		renderModal: function renderModal() {

			fn.template($(dom.idTpl).html(), { data: {} }, function (html) {
				st.html += html;
				fn.LoadDataList();
			});
		},
		LoadDataList: function LoadDataList() {
			fn.template($(st.tplShowList).html(), { data: st.arrayList }, function (html) {

				st.html += html;
				fn.showModal(st.html);
				st.html = "";
			});
		},
		showModal: function showModal(html) {

			var opts = {

				html: html,
				locked: true,
				afterShow: fn.AfterModal,
				beforeShow: fn.before,
				afterClose: fn.cleanData,
				onResize: true

			};

			Sb.trigger('modal:open', opts);
		},
		AfterModal: function AfterModal() {

			asyncatchDom();
			var ajax = [{
				slc: dom.slcDpto,
				id: st.data.dpto.id,
				parent: false,
				url: st.urlDepart
			}];

			fn.ajax(ajax);
			asynSuscribeEvents();
		},
		ajax: function ajax(opts) {

			var dataSlc = opts[0];
			$.ajax({
				url: dataSlc.url,
				beforeSend: function beforeSend() {
					Sb.trigger('modal:showModal');
				},
				dataType: "json",
				success: function success(data) {

					opts.splice(0, 1);
					var valor = data;
					if (dataSlc.parent) {

						var option = dataSlc.parent.val();
						valor = valor[option];
					}

					fn.template($(st.tplListSlc).html(), { data: valor, id: dataSlc.id }, function (html) {

						$(dataSlc.slc).html(html);
						if (typeof dataSlc.callback === "function") {
							dataSlc.callback(opts);
						}
					});
				}
			});
		},
		template: function template(tpl, data, fn) {

			var html = _.template(tpl, data);
			if (fn != undefined) {
				fn(html);
			}
		},
		showList: function showList() {

			$(".content_list ").remove();
			fn.template($(st.tplShowList).html(), { data: st.arrayList }, function (html) {
				dom.parentModal.append(html);
				Sb.trigger('modal:onResize');
			});
		},
		captureData: function captureData() {

			var myObject = {};
			$("select option:selected").each(function (index) {
				myObject[$(this).parent().attr("name")] = {
					id: $(this).val(),
					name: $(this).text()
				};
			});
			return myObject;
		},
		cleanData: function cleanData() {

			st.idArray = null;
			st.data = {
				dpto: {
					id: null,
					name: null
				},
				prov: {
					id: null,
					name: null
				},
				dist: {
					id: null,
					name: null
				}
			};
		},
		cleanSlcDist: function cleanSlcDist() {
			dom.slcDist.children("option").remove();
			dom.slcDist.append("<option selected disabled>Selecciona</option>");
		},
		changeUpdate: function changeUpdate() {

			dom.btnAdd.hide();
			dom.btnUpdate.show();
			$(".btn_loading").hide();
		},
		changeAdd: function changeAdd() {

			dom.btnAdd.show();
			$(".btn_loading").hide();
			dom.btnUpdate.hide();
		},
		changeLoading: function changeLoading() {

			dom.btnAdd.hide();
			dom.btnUpdate.hide();
			$(".btn_loading").show();
		},
		editData: function editData() {

			fn.changeLoading();
			var data = [{
				slc: dom.slcDpto,
				id: st.data.dpto.id,
				parent: false,
				name: "depart",
				url: st.urlDepart,
				callback: fn.ajax

			}, {
				slc: dom.slcProv,
				id: st.data.prov.id,
				parent: dom.slcDpto,
				name: "prov",
				url: st.urlprov,
				callback: fn.ajax

			}, {
				slc: dom.slcDist,
				id: st.data.dist.id,
				parent: dom.slcProv,
				name: "dist",
				url: st.urlDist,
				callback: fn.changeUpdate
			}];

			fn.ajax(data);
		}
	};

	initialize = function initialize() {

		catchDom();
		afterCatchDom();
		suscribeEvents();
	};

	return {
		init: initialize
	};
});

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
		parent: ".modal-wrap",
		content: ".modal-content",
		overlay: ".modal-overlay",
		btnClose: ".close",
		modalLoading: ".modal-loading",
		tplWrap: "<div class='modal-overlay'></div><div class='modal-wrap'> <div class='modal-content'></div><span class='close'></span></div>",
		tplLoading: "<div class='modal-loading'><img src='../img/loading.gif'></div>",
		settings: {}

	};

	asyncatchDom = function asyncatchDom() {

		dom.btnClose = $(st.btnClose);
		dom.content = $(st.content);
		dom.parent = $(st.parent);
		dom.overlay = $(st.overlay);
		dom.modalLoading = $(st.modalLoading);
	};

	asynSuscribeEvents = function asynSuscribeEvents() {
		dom.btnClose.on("click", events.close);
		dom.overlay.on("click", events.close);
	};

	events = {
		openModal: function openModal(e) {
			fn.open(opts);
		},
		close: function close() {
			fn.close(st.settings.afterClose);
		}
	};

	fn = {
		open: function open() {
			var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


			st.settings = opts;
			fn.beforeShow();
			fn.showModal();
			dom.content.append(st.settings.html);
			fn.afterShow();
			fn.modalCss();
			st.settings.onResize ? fn.onResize() : '';
		},
		beforeShow: function beforeShow() {

			$.type(st.settings.beforeShow) === "function" ? st.settings.beforeShow() : '';
		},
		afterShow: function afterShow() {

			$.type(st.settings.afterShow) === "function" ? setTimeout(st.settings.afterShow(), 1) : '';
		},
		showModal: function showModal() {

			$(st.tplWrap).appendTo("body");
			asyncatchDom();
			asynSuscribeEvents();
		},
		modalCss: function modalCss() {

			dom.parent.css({
				position: 'fixed',
				left: ($(window).width() - dom.parent.outerWidth()) / 2,
				top: ($(window).height() - dom.parent.outerHeight()) / 2
			});
			st.settings.locked == true ? $("body").addClass("locked") : '';
		},
		close: function close(callback) {

			dom.parent.remove();
			dom.overlay.remove();
			$("body").removeClass("locked");
			$.type(callback) === "function" ? setTimeout(callback, 1) : '';
		},
		onResize: function onResize() {

			$(window).resize(function () {
				dom.parent.css({
					position: 'fixed',
					left: ($(window).width() - dom.parent.outerWidth()) / 2,
					top: ($(window).height() - dom.parent.outerHeight()) / 2
				});
			});
			$(window).trigger("resize");
		},
		showLoading: function showLoading() {
			$(st.tplLoading).appendTo("body");
		},
		hideLoading: function hideLoading() {
			$(".modal-loading").remove();
		}
	};

	initialize = function initialize(oP) {

		st = $.extend({}, defaults, oP);
		Sb.events(["modal:open"], fn.open, undefined);
		Sb.events(["modal:onResize"], fn.onResize, undefined);
		Sb.events(["modal:showLoading"], fn.showLoading, undefined);
		Sb.events(["modal:hideLoading"], fn.hideLoading, undefined);
	};
	return {
		init: initialize
	};
});