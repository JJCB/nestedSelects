"use strict";

var modal = function () {

	var st = {},
	    dom = {},
	    events = void 0,
	    fn = void 0,
	    findDatos = {},
	    catchDom = void 0,
	    asyncatchDom = void 0,
	    afterCatchDom = void 0,
	    suscribeEvents = void 0,
	    asynSuscribeEvents = void 0,
	    initialize = void 0;

	st = {
		linkModal: ".link_modal a",
		slcDepart: "select[name='depart']",
		slcProv: "select[name='prov']",
		slcDist: "select[name='dist']",
		btnAdd: ".btn_add",
		btnUpdate: ".btn_update",
		urlDepart: "http://www.json-generator.com/api/json/get/bYmFFsHmDC?indent=2",
		urlprov: "http://www.json-generator.com/api/json/get/cpXdelSNki?indent=2",
		urlDist: "http://www.json-generator.com/api/json/get/cjWbLDrQXS?indent=2",
		dataList: [],
		contentList: "#addDatos",
		btnRemove: "li .remove",
		btnEdit: "li .edit",
		html: "",
		id: null,
		data: {
			dpto: {},
			prov: {},
			dist: {}
		}

	};

	catchDom = function catchDom() {
		dom.linkModal = $(st.linkModal);
		dom.idTpl = dom.linkModal.data("link-modal");
	};

	asyncatchDom = function asyncatchDom() {
		dom.slcDepart = $(st.slcDepart, st.parentModal);
		dom.slcProv = $(st.slcProv, st.parentModal);
		dom.slcDist = $(st.slcDist, st.parentModal);
		dom.btnAdd = $(st.btnAdd, st.parentModal);
		dom.contentList = $(st.contentList);
		dom.btnRemove = $(st.btnRemove);
		dom.btnEdit = $(st.btnEdit);
		dom.btnUpdate = $(st.btnUpdate);
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
		dom.slcDepart.change(events.findprovincia);
		dom.slcProv.change(events.findDistrito);
		dom.btnAdd.on("click", events.addList);

		dom.btnRemove.on("click", events.removeList);
		dom.btnEdit.on("click", events.editList);
		dom.btnUpdate.on("click", events.updateList);
	};

	events = {

		openModal: function openModal(e) {
			e.preventDefault();
			fn.renderModal();
		},

		findprovincia: function findprovincia() {
			fn.ajaxProv();
		},

		findDistrito: function findDistrito() {
			fn.ajaxDist();
		},

		removeList: function removeList(e) {

			var $this = $(e.target);
			var $parent = $this.parent();
			var id = $parent.children("div").attr("data-id");
			st.dataList.splice(id, 1);

			$parent.slideUp("slow", function () {
				$(this).remove();
			});
		},
		addList: function addList() {

			var data = fn.captureData();
			st.dataList.push(data);
			fn.arrayList();
		},
		editList: function editList(e) {
			var $this = $(e.target);
			var $parent = $this.parent();
			var id = $parent.children("div").attr("data-id");

			st.data = st.dataList[id];
			st.id = id;
			fn.editData();
			dom.btnAdd.hide();
			dom.btnUpdate.show();
		},

		updateList: function updateList() {
			st.dataList[st.id] = fn.captureData();
			dom.btnAdd.show();
			dom.btnUpdate.hide();
			fn.arrayList();
		}
	};

	fn = {
		AfterModal: function AfterModal() {
			fn.ajaxDepart();
			asyncatchDom();
			asynSuscribeEvents();
		},

		ajaxDepart: function ajaxDepart() {
			$.ajax({
				url: st.urlDepart,
				dataType: "json",
				success: fn.successAjaxDepart
			});
		},
		ajaxProv: function ajaxProv() {
			$.ajax({
				url: st.urlprov,
				dataType: "json",
				success: fn.successAjaxProv
			});
		},
		ajaxDist: function ajaxDist() {
			$.ajax({
				url: st.urlDist,
				dataType: "json",
				success: fn.successAjaxDist
			});
		},

		renderModal: function renderModal() {

			fn.template($(dom.idTpl).html(), { data: {} }, function (html) {
				st.html += html;
				fn.list();
			});
		},

		list: function list() {

			fn.template($("#addDatos").html(), { data: st.dataList }, function (html) {
				st.html += html;
				fn.modal(st.html);
				st.html = "";
			});
		},

		modal: function modal(html) {

			$.fancybox.open(html, {
				afterShow: fn.AfterModal,
				afterClose: fn.cleanData
			});
		},

		successAjaxDepart: function successAjaxDepart(data) {
			console.log("editData", st.data.dpto.id);

			fn.template($("#listSlc").html(), { data: data, id: st.data.dpto.id }, function (html) {
				$(dom.slcDepart).append(html);
			});
		},
		successAjaxProv: function successAjaxProv(data) {

			var valorOption = dom.slcDepart.val();
			var content = data[valorOption];

			fn.template($("#listSlc").html(), { data: content, id: st.data.prov.id }, function (html) {
				dom.slcProv.html(html);
			});
		},

		successAjaxDist: function successAjaxDist(data) {

			var valorOption = dom.slcProv.val();
			var content = data[valorOption];
			fn.template($("#listSlc").html(), { data: content, id: st.data.dist.id }, function (html) {
				dom.slcDist.html(html);
			});
		},

		template: function template(tpl, data, fn) {

			var html = _.template(tpl, data);

			if (fn != undefined) {
				fn(html);
			}
		},

		arrayList: function arrayList() {

			dom.linkModal.addClass("active-list");
			$(".list_add ").remove();
			var li = _.template($("#addDatos").html(), { data: st.dataList });
			var $li = $(li);
			$li.on("click", ".remove", events.removeList);
			$li.on("click", ".edit", events.editList);
			$("#modal").append($li);
		},
		captureData: function captureData() {

			return {
				dpto: {
					id: dom.slcDepart.val(),
					name: $("select[name='depart'] option:selected").text()
				},
				prov: {
					id: dom.slcProv.val(),
					name: $("select[name='prov'] option:selected").text()
				},
				dist: {
					id: dom.slcDist.val(),
					name: $("select[name='dist'] option:selected").text()
				}
			};
		},
		cleanData: function cleanData() {
			st.id = null;
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
			console.log(st.data);
		},
		editData: function editData() {

			fn.ajaxDepart();
			fn.ajaxProv();
			fn.ajaxDist();
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
}();

modal.init();

// render:template (view)
// list(array)
// add({})
// delete(id)
// update(id,)


// json:bdd
// list(array)
// add({})
// delete(id)
// update(id, {})


/*data[key]
{
	pro: 4545,
	prov: 456456,
	dis: 454654
}*/