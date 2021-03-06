var resource = "/basic/nerveTypeInfo";
$(function () {
    DataTable.init({
        url: resource, //ajax请求url
        tableName: "data-table", //数据表table id
        paramsFormName: "search-form", //查询参数form id
        modal: "modals", //模态框div
        columns: [ //列对应的字段数组，注意顺序
            {
                data:'nerveTypeName'
            },
            {
                data: "gmtCreate",
                replaceFn: 'setDateFormat'
            },
        ],
        options: [ //操作区域(id)
            {
                title: "修改名称",
                icon: "fa fa-edit",
                option: "modal-edit",
                edit: true,
                //editMain: true,
                url: resource,
            },
            {
                icon: "fa fa-remove",
                name: "删除",
                del: resource,
                msg: "确定要删除该神经类型吗？"
            },
        ],
        handles: {
            insert: [{
                url: resource,
                modalId: "modal-add"
            }, ],
        },
    });

    
});


function setDateFormat(date) {
    var oNewD = new Date(parseInt(date));
    var years = parseInt(oNewD.getFullYear());
    var month = parseInt(oNewD.getMonth()) + 1;
    month = month > 10 ? month : '0' + month;
    var dates = parseInt(oNewD.getDate());
    dates = dates > 10 ? dates : '0' + dates;
    return years + '-' + month + '-' + dates;
}




function loadRoleById(obj) {

}