var resource = "/basic/nerve";
var AllNerveName = null;
var AllPartName = null;
var AllNames = null;
$(function () {
    //获取所有的部位
    getAllPartName(function (ret) {
        if (ret) {
            AllPartName = ret
        }
    });
    getAllNerveName(function (ret) {
        if (ret) {
            AllNerveName = ret
        }
    })
    
    DataTable.init({
        url: resource, //ajax请求url
        tableName: "data-table", //数据表table id
        paramsFormName: "search-form", //查询参数form id
        modal: "modals", //模态框div
        columns: [ //列对应的字段数组，注意顺序
            {
                data: "id",
                visible: false
            },
            {
                data: 'nerveNameZh',
            },
            {
                data: 'nerveNameEn',
                visible: false,
            },
            {
                data: 'partId',
                replaceFn: 'setPartName'
            },
            {
                data: 'nerveTypeId',
                replaceFn: 'setNerveTypeName'
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
                pre: 'checkDataRole'
            },
            {
                icon: "fa fa-remove",
                name: "删除",
                del: resource,
                msg: "确定要删除该神经信息吗？"
            },
        ],
        handles: {
            insert: [{
                url: resource,
                modalId: "modal-add"
            }, ],
        },
        endFnOnce: 'loadSelect',
        endFn:'getSelectNerve'
    });

    $('#modal-add input[name=nerveNameZh]').on('blur', function () {
        var sRet = $(this).val();
        if (sRet != '') {
            //检查是否已经存在当前的名字
            var bResult = checkStrExist(sRet.trim())
            if (bResult) {
                Shinez.tip('error', '该神经名称已经存在，请重新输入')
                $(this).val('')
            }
        } else {
            Shinez.tip('error', '不能为空，且不能重复相同的神经名称')
        }
    });



});

//检查是否存在相同的神经名
function checkStrExist(strs) {
    if (AllNames.includes(strs)) {
        return true
    } else {
        return false
    } 
}

//部位名称改变成中文
function setPartName(args) {
    var sName = ''
    JSON.parse(AllPartName).forEach(function (item, index) {
        if (args == item.id) {
            sName = item.partName;
        }
    })
    return sName || '-';
}

//神经类型转成中文
function setNerveTypeName(args) {
    var sName = '';
    JSON.parse(AllNerveName).forEach(function (item, index) {
        if (args == item.id) {
            sName = item.nerveTypeName;
        }
    })
    return sName || '-';
}

//日期格式转换
function setDateFormat(date) {
    var oNewD = new Date(parseInt(date));
    var years = parseInt(oNewD.getFullYear());
    var month = parseInt(oNewD.getMonth()) + 1;
    month = month > 10 ? month : '0' + month;
    var dates = parseInt(oNewD.getDate());
    dates = dates > 10 ? dates : '0' + dates;
    return years + '-' + month + '-' + dates;
}
//获取所有的部位
function getAllPartName(callback) {
    Shinez.get('/basic/allPartInfo', function (ret) {
        if (ret) {
            callback && callback(JSON.stringify(ret))
        }
    })
}

//获取所有的神经类型
function getAllNerveName(callback) {
    Shinez.get('/basic/allNerveTypeInfo', function (ret) {
        if (ret) {
            callback && callback(JSON.stringify(ret))
        }
    })
}
//获取所有的神经名称
function getNerveNames(callback) {
    Shinez.get('/basic/allNerve', function (ret) {
        if (ret) {
            callback && callback(JSON.stringify(ret))
        }
    })
}

//登录时的所有select的预选项
function loadSelect(obj) {
    //填补部位控件
    getAllPartName(function (args) {
        var oData = JSON.parse(args);
        $.each(oData, function (k, v) {
            $('select[name=partId]').append('<option value="' + v.id + '">' + v.partName + '</option>')
        })
    });
    //填补神经类型控件
    getAllNerveName(function (args) {
        var oData = JSON.parse(args);
        $.each(oData, function (k, v) {
            $('select[name=nerveTypeId]').append('<option value="' + v.id + '">' + v.nerveTypeName + '</option>')
        })
    })
}

function checkDataRole(sId) {
    var sNerveName = ''
    $('#data-table tbody tr').each(function (index, item) {
        if ($(item).attr('data-id') == sId) {
            sNerveName = $(item).find('td[data-name=nerveNameZh]').text()
        }
    });

    $('#modal-edit input[name=nerveNameZh]').on('blur', function () {
        var sRet = $(this).val()
        if (sRet != '') {
            if (sRet == sNerveName) {
                return
            } else {
                //检查是否已经存在当前的名字
                var bResult = checkStrExist(sRet.trim())
                if (bResult) {
                    Shinez.tip('error', '该神经名称已经存在，请重新输入')
                }
            }

        } else {
            Shinez.tip('error', '不能为空，且不能重复相同的神经名称')
        }

    })

}

function getSelectNerve(s){
    getNerveNames(function (ret) {
        if (ret) {
            AllNames = ret;
        }
    })
}