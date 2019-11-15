var url = '/ruler/reference/';
//公共数据
var Hospital_Name = [];
var Position_Name = [];
var AllNerveName = [];
//end

var aColumn = [{
        data: "institutionNo",
        replaceFn: 'getInstitutionName'
    },
    {
        data: "gmtCreate",
        type: 'datetime',
        visible: false
    },
    {
        data: "programId",
        replaceFn: 'getProgram'
    },
    {
        data: "nerveName"
    },
    {
        data: "stimPointPositionId",
        replaceFn: 'getPointPosition'
    },
    {
        data: "collectPointPositionId",
        replaceFn: 'getPointPosition'
    },
    {
        data: "ageBegin"
    },
    {
        data: "ageEnd"
    },
    {
        data: "gender",
        replaceFn: 'getSex'
    },
    {
        data: "meanValue"
    },
    {
        data: "standardDeviation"
    },
    {
        data: "cases"
    },
    {
        data: "type",
        replaceFn: 'getTypes'
    },
    {
        data: "upperLimit"
    },
    {
        data: "lowerLimit"
    },
    {
        data: "times",visible:false,
    },
    {
        data: "normalRange",visible:false
    },
    {
        data: "isCurrent",
        convert: "1=> <span style='color:#fff;background-color:green;font-size:10px;padding:2px 4px;'>启用</span>" +
            "|0=><span style='color:#fff;background-color:red;padding:2px 4px;font-size:10px;'>关闭</span>"
    }
];

function init() {
    DataTable.init({
        url: url,
        tableName: 'data-table',
        paramsFormName: 'search-form',
        columns: aColumn,
        modal: "modals",
        options: [{
                icon: 'fa fa-edit',
                title: '编辑',
                color: 'green',
                edit: true,
                /*editMain:true,*/
                url: url,
                option: 'modal-edit',
                pre: 'checkDataRole'
            },
            {
                icon: 'fa fa-remove',
                title: '删除',
                color: 'red',
                del: url,
                msg: '确定需要删除该条参考值吗？'
            }
        ],
        handles: {
            insert: [{
                url: url,
                modalId: 'modal-add'
            }]
        },
        /*endFn: "registerSwitch",*/
        endFnOnce: 'loadSelect'

    });

}

$(function () {
    //公共变量Hospital_name
    getAllInstitution(function(ret){
        JSON.parse(ret).forEach(function(item,index){
            Hospital_Name.push({
                //'id': v.id,
                'institutionNo': item.institutionNo,
                'institutionName': item.institutionName
            })
        })
    })
    //公共变量position_name
    getAllPointPosition(function(ret){
        JSON.parse(ret).forEach(function(item,index){
            Position_Name.push({
                'id': item.id,
                'pointPosition': item.pointPosition
            })
        })
    })
    init();
    //normalRangeUpper input框中的默认值是否存在，存在则不用改变，不存在使用默认值
    if ($('.refer-calc-selfUpper').val() == '') {
        var iValue = $('.refer-calc-selfUpper').attr('placeholder');
        $('.refer-calc-selfUpper').val(iValue)
    }
    if ($('.refer-calc-selfLower').val() == '') {
        var iValue = $('.refer-calc-selfLower').attr('placeholder');
        $('.refer-calc-selfLower').val(iValue)
    }

    if($('input[name=ageBegin]').val()==''){
        $('input[name=ageBegin]').val(function(){
            return $('input[name=ageBegin]').attr('placeholder')
        })
    }
    if($('input[name=ageEnd]').val()==''){
        $('input[name=ageEnd]').val(function(){
            return $('input[name=ageEnd]').attr('placeholder')
        })
    }
    

    $('select[name=nerveId]').change(function () {
        var sVal = $(this).val()
        getAllNerve(function (args) {
            args.forEach(function (item, index) {
                if (sVal == item.nerveId) {
                    $('.nerverNames').val(item.nerveName)
                }
            })
        })
    });

    //年龄段的值变化
    /* $('#modal-add select[name=ageSection]').change(function(){
        var sVal=$(this).val()
        changeAgeSection('#modal-add',sVal)
        
    }) */

    //点击添加计算参考值
    $('#modal-add .calc-add-btn').on('click', function () {
        if ($(".calc-refer-add-result .calc-fail").show()) {
            $(".calc-refer-add-result .calc-fail").hide();
        }
        conditionCalc('#modal-add')

    });

    //参考值筛选条件重置
    $('#modal-add .calc-refer-reset').on('click', function () {
        resetClick('#modal-add')
        
        bClick = true;
    });


    //重新计算均数范围值和标准差范围值
    /*$('#modal-add').find('.restart-calc').on('click',function(){
        calcLimitNumber('#modal-add')
    })
    $('#modal-edit').find('.restart-calc').on('click',function(){
        calcLimitNumber('#modal-edit')
    })*/


    //上限下限的按钮按键取值
    $('.checkbox-choose').on('click', function () {
        var sClassName = $(this).find('i').attr('class')
        var iData;
        if (sClassName.includes('fa fa-check-square')) {
            sClassName = 'fa fa-square';
            iData = 0;
        } else {
            sClassName = 'fa fa-check-square';
            iData = 1;
        }
        $(this).attr('data-value', iData).find('i').attr('class', sClassName)

        var upperValue = $('.checkbox-choose-upper').attr('data-value');
        var lowerValue = $('.checkbox-choose-lower').attr('data-value');

        if (upperValue == 0 && lowerValue == 0) {
            $('.checkbox-choose-upper').attr('data-value', 1).find('i').attr('class', 'fa' +
                ' fa-check-square')
        }
    });


    /*//极值的取值
    $('.refer-calc-pick-upper').on('change',function(){
        $('input[name=timesUpper]').val($(this).val())
    });
    $('.refer-calc-pick-lower').on('change',function(){
        $('input[name=timesLower]').val($(this).val())
    });*/

    //点击重新计算
    $('#modal-add .calc-refer-restart').off('click').on('click', function () {
        doRestartCalc('#modal-add')
    });


    $('#modal-add .meanValue').bind('click keyup', function () {
        var sValue = $(this).val()
        if (sValue != '') {
            $('#modal-add .avge').text(sValue)
        }
        //设置双向的数据绑定
        setDataSync('#modal-add')
    })
    $('#modal-add .standardDeviation').bind('click keyup', function () {
        var sValue = $(this).val();
        if (sValue != '') {
            $('#modal-add .standard').text(sValue)
        }
        //设置双向的数据绑定
        setDataSync('#modal-add')
    });

    $('.calc-add').on('click',function(){
        resetClick('#modal-add')
    })


});
//双向的数据
function setDataSync(sClass){
    var sAvge = $(sClass).find('input[name=meanValue]').val()
    var sStandard = $(sClass).find('input[name=standardDeviation]').val();
    if (sAvge != '' && sStandard != '') {
        $(sClass).find('.calc-refer-restart').attr('class', 'label label-warning' +
            ' calc-refer-restart');
    }
}

//年龄的变化
function changeAgeSection(sClass,sVal){
    if(sVal!=''){
        switch (sVal) {
            case '0':
                $(sClass).find('input[name=ageBegin]').val(2)
                $(sClass).find('input[name=ageEnd]').val(14)
                break;
            case '1':
                $(sClass).find('input[name=ageBegin]').val(15)
                $(sClass).find('input[name=ageEnd]').val(24)
                break;
            case '2':
                $(sClass).find('input[name=ageBegin]').val(25)
                $(sClass).find('input[name=ageEnd]').val(34)
                break;
            case '3':
                $(sClass).find('input[name=ageBegin]').val(35)
                $(sClass).find('input[name=ageEnd]').val(44)
                break;
            case '4':
                $(sClass).find('input[name=ageBegin]').val(45)
                $(sClass).find('input[name=ageEnd]').val(54)
                break;
            case '5':
                $(sClass).find('input[name=ageBegin]').val(55)
                $(sClass).find('input[name=ageEnd]').val(64)
                break;
            case '6':
                $(sClass).find('input[name=ageBegin]').val(65)
                $(sClass).find('input[name=ageEnd]').val(74)
                break;
            case '7':
                $(sClass).find('input[name=ageBegin]').val(75)
                $(sClass).find('input[name=ageEnd]').val(84)
                break;
            case '8':
                $(sClass).find('input[name=ageBegin]').val(85)
                $(sClass).find('input[name=ageEnd]').val(94)
                break;
            }
    }else{
        $(sClass).find('input[name=ageBegin]').val(1)
        $(sClass).find('input[name=ageEnd]').val(99)
    }
}

//点击计算参考值时的参数条件
function conditionCalc(sClass) {
    var aSelected = []
    $(sClass).find('.must-fill-in').each(function (k, v) {
        aSelected.push($(v).val())
    });
    toastr.remove();
    if (aSelected.indexOf('') == -1) {
        
        /* var ageValue = $(sClass).find('select[name=ageSection]').val()
        switch (ageValue.toString()) {
            case '0':
                $(sClass + ' input[name=ageBegin]').val(2)
                $(sClass + ' input[name=ageEnd]').val(14)
                break;
            case '1':
                $(sClass + ' input[name=ageBegin]').val(15)
                $(sClass + ' input[name=ageEnd]').val(24)
                break;
            case '2':
                $(sClass + ' input[name=ageBegin]').val(25)
                $(sClass + ' input[name=ageEnd]').val(34)
                break;
            case '3':
                $(sClass + ' input[name=ageBegin]').val(35)
                $(sClass + ' input[name=ageEnd]').val(44)
                break;
            case '4':
                $(sClass + ' input[name=ageBegin]').val(45)
                $(sClass + ' input[name=ageEnd]').val(54)
                break;
            case '5':
                $(sClass + ' input[name=ageBegin]').val(55)
                $(sClass + ' input[name=ageEnd]').val(64)
                break;
            case '6':
                $(sClass + ' input[name=ageBegin]').val(65)
                $(sClass + ' input[name=ageEnd]').val(74)
            case '7':
                $(sClass + ' input[name=ageBegin]').val(75)
                $(sClass + ' input[name=ageEnd]').val(84)
                break;
            case '8':
                $(sClass + ' input[name=ageBegin]').val(85)
                $(sClass + ' input[name=ageEnd]').val(94)
            default:
                $(sClass + ' input[name=ageBegin]').val(1)
                $(sClass + ' input[name=ageEnd]').val(99)
        } */
        if ($(sClass + ' input[name=upperLimit]').val() == '') {
            $(sClass + ' input[name=upperLimit]').val(function () {
                return $(sClass + ' input[name=upperLimit]').attr('placeholder')
            })
        }
        if ($(sClass + ' input[name=lowerLimit]').val() == '') {
            $(sClass + ' input[name=lowerLimit]').val(function () {
                return $(sClass + ' input[name=lowerLimit]').attr('placeholder')
            })
        }
        if($(sClass).find('input[name=ageBegin]').val()==''){
            $(sClass).find('input[name=ageBegin]').val(function(){
                return $(sClass).find('input[name=ageBegin]').attr('placeholder')
            })
        }
        if($(sClass).find('input[name=ageEnd]').val()==''){
            $(sClass).find('input[name=ageEnd]').val(function(){
                return $(sClass).find('input[name=ageEnd]').attr('placeholder')
            })
        }
        $(sClass + ' input[name=institutionId]').val(function () {
            return $(sClass + ' select[name=institutionId]').val()
        });

        $(sClass + ' input[name=timesUpper]').val(function () {
            return $(sClass + ' .refer-calc-pick-upper').val();
        });
        $(sClass + ' input[name=timesLower]').val(function () {
            return $(sClass + ' .refer-calc-pick-lower').val()
        });


        $(sClass).find('input[name=normalRangeUpper]').val(function () {
            if ($(sClass).find('input[name=normalRangeUpper]').val() == '') {

                var iResult = $(sClass).find('.refer-calc-selfUpper').attr('placeholder')
                return iResult / 100
            } else {
                var iResult = $(sClass).find('.refer-calc-selfUpper').val()
                return iResult
            }
        });
        $(sClass).find('input[name=normalRangeLower]').val(function () {
            if ($(sClass).find('input[name=normalRangeLower]').val() == '') {
                var iResult = $(sClass).find('.refer-calc-selfLower').attr('placeholder')
                return iResult / 100;
            } else {
                var iResult = $(sClass).find('.refer-calc-selfLower').val()
                return iResult
            }
        });

        $(sClass).find('input[name=rangeType]').val(function () {
            var sUpper = $(sClass + ' .checkbox-choose-upper').attr('data-value');
            var sLower = $(sClass + ' .checkbox-choose-lower').attr('data-value');

            if (sUpper == 1 && sLower == 1) {
                return 0;
            } else if (sUpper == 0 && sLower == 1) {
                return 2
            } else if (sUpper == 1 && sLower == 0) {
                return 1
            }
        });
        var params = $(sClass).find('form').serializeArray();
        var param = getJsonObj(params);

        getAllNerve(function (args) {
            args.forEach(function (item, index) {
                if (item.nerveId == $(sClass + ' select[name=nerveId]').val()) {
                    param['nerveName'] = item.nerveNameZh
                    $(sClass).find('.nerverNames').val(item.nerveName)
                }
            })
        })
        getParams(sClass, param)
    } else {
        toastr.error('参数类型不能为null,请选择表单中的控件项', '错误提示');
        return;
    }
}

//点击重置按钮
function resetClick(sClass,sId) {
    //var sInstitutionNo = $(sClass).find('select[name=institutionNo]').val()
    //$(sClass).find('.standardDeviation-limit').text(0);
    //$(sClass).find('.meanValue-limit').text(0);
    $(sClass).find('form')[0].reset();
    $(sClass).find('.refer-calc-depend').text('0.00');
    $(sClass).find('.refer-calc-pick-upper').val(0);
    $(sClass).find('.refer-calc-pick-lower').val(0);
    $(sClass).find('.calc-refer-restart').attr('class', 'label label-default' +
        ' calc-refer-restart');
    $(sClass).find('.refer-calc-selfUpper').val('30')
    $(sClass).find('.refer-calc-selfLower').val('30')
    $(sClass).find('input[name=upperLimit]').val(100)
    $(sClass).find('input[name=lowerLimit]').val(0)
    $(sClass).find('input[name=ageBegin]').val(0)
    $(sClass).find('input[name=ageEnd]').val(99)
    $(sClass).find('.refer-calc-result-upper').text('');
    $(sClass).find('.refer-calc-result-lower').text('');
    $(sClass).find(".calc-refer-add-result .calc-fail").hide();
    $(sClass).find('select[name=institutionNo]').val(JSON.parse(sessionStorage.getItem('doctorInfo')).institutionNo);
    $(sClass).find('input[name=institutionNo]').val(JSON.parse(sessionStorage.getItem('doctorInfo')).institutionNo)
    $(sClass).find('input[name=id]').val(sId)
    $(sClass).find("input[type=checkbox]").not(".no-init").bootstrapSwitch('state', true);
    
}

//点击重新计算
function doRestartCalc(sClass) {
    var sRestartClassName = $(sClass).find('.calc-refer-restart').attr('class');
    if (sRestartClassName.includes('label-default')) {
        return;
    } else {
        /* if (sClass == '#modal-add') {
            $(sClass).find('.calc-add-btn').trigger('click')
        } else {
            $(sClass).find('.calc-edit-btn').trigger('click')
        } */

        calcLimitBorder(sClass)

    }
}

//计算参考值所需要的参数
function getParams(sClass, args) {
    toastr.remove()
    Shinez.post('/ruler/reference/compute', args, function (ret) {
        if (ret.code != 0) {
            if (ret.msg == '数据样本不足') {
                toastr.warning('计算参考值的参数范围太小,请放大参数范围', ret.msg)
            } else {
                toastr.error(ret.msg, '参考值计算错误提示')
            }
        } else {

            args['pageIndex'] = 1;
            args['pageSize'] = 1;
            Shinez.get('/ruler/reference/', args, function (ret) {
                if (ret.code == 0) {
                    if (ret.data.page.list.length == 0) {
                        $(sClass).find(".calc-fail").show();
                    } else {
                        $.each(ret.data.page.list, function (k, v) {
                            $(sClass).find('input[name=meanValue]').val(v.meanValue)
                            $(sClass).find('input[name=standardDeviation]').val(v.standardDeviation)
                            $(sClass).find('input[name=cases]').val(v.cases)
                            $(sClass).find('input[name=id]').val(v.id)
                        });

                        //calcLimitNumber(sClass)
                        //重新计算的按钮激活
                        $(sClass).find('.calc-refer-restart').attr('class', 'label label-warning' +
                            ' calc-refer-restart');

                        calcLimitBorder(sClass);
                    }
                } else {
                    toastr.error(ret.msg, '无法获得参考值的计算结果')
                }
            })
        }

    });

}
//将标单中的数据序列化后转成json
function getJsonObj(param) {
    var params = {}
    for (let iNum = 0; iNum < param.length; iNum++) {
        if (param[iNum].value !='') {
            params[param[iNum].name] = param[iNum].value
        } else if (param[iNum].name == "ageSection") {
            continue
        }else{
            params[param[iNum].name] = ''
        }
        
    }
    /* $.each(param,function(k,v){
        if(v.value=='' || null){
            params[v.name]=''
        }else if(v.name=="ageSection"){
            continue
        }
        params[v.name]=v.value
    }); */

    return params
}



function getInstitutionName(args) {
    var sName = JSON.stringify(Hospital_Name)
    if (sName.indexOf(args) != -1 && args.length > 2) {
        for (var i = 0; i < Hospital_Name.length; i++) {
            if (Hospital_Name[i].institutionNo == args) {
                return Hospital_Name[i].institutionName
            }
        }
    } else {
        return '-'
    }


}

function getProgram(args) {
    switch (parseInt(args)) {
        case 1:
            return "MCV";
        case 2:
            return "SSCT";
        case 3:
            return "SCV";
        case 5:
            return "SSR";
        default:
            return '-'
    }
}


function getPointPosition(args) {
    args = parseInt(args)
    var sPosition = JSON.stringify(Position_Name)
    if (sPosition.indexOf(args) != -1) {
        for (var i = 0; i < Position_Name.length; i++) {
            if (Position_Name[i].id == args) {
                return Position_Name[i].pointPosition
            }
        }
    } else {
        return '-'
    }

}
//转换性别
function getSex(args) {
    switch (parseInt(args)) {
        case 0:
            return '-'
        case 1:
            return '男'
        case 2:
            return '女'
        default:
            return '-'

    }
}

//参考值的类型转换
function getTypes(args) {
    switch (parseInt(args)) {
        case 0:
            return '潜伏期'
        case 1:
            return '波幅'
        case 2:
            return '速度'
        case 3:
            return '波宽'
        case 4:
            return '面积'
        case 5:
            return '距离'
        case 6:
            return '时间'
        case 7:
            return '潜伏期2'
        case 8:
            return '峰峰值'
        default:
            return '-'
    }
}


//获得当前的所在行的id
/*function getChoose(data){
    console.log('data',data)
}*/
//获取select中的数据信息
function loadSelect(args) {
    //获取神经类型
    getAllProgram(function(ret){
        JSON.parse(ret).forEach(function(item,index){
            $("select[name=programId]").append("<option value='" + item.id + "'>" + item.description + "</option>");
        })
    })
    //获取神经名称
    getAllNerve(function(ret){
        ret.forEach(function(item,index){
            $("select[name=nerveId]").append("<option value='" + item.nerveId + "'>" + item.nerveName + "</option>");
        })
    })
    //所有医疗机构
    getAllInstitution(function(ret){
        JSON.parse(ret).forEach(function(item,index){
            $("select[name=institutionNo]").append("<option value='" + item.institutionNo + "'>" + item.institutionName + "</option>");
            /* if ($('select[name=institutionNo]').val() == '') {
                if (item.institutionNo == sessionStorage.institutionNo) {
                    $('select[name=institutionNo]').val(item.institutionNo)
                    //$('input[name=institutionNo]').val(item.institutionNo)
                }
            } */
        })
    })
    //所有肢体部位
    getAllPartInfo(function(ret){
        JSON.parse(ret).forEach(function(item,index){
            $("select[name=partId]").append("<option value='" + item.id + "'>" + item.partName + "</option>");
        })
    });
    //获取所有记录点和刺激点
    getAllPointPosition(function(ret){
        JSON.parse(ret).forEach(function(item,index){
            $("select[name=stimPointPositionId]").append("<option value='" + item.id + "'>" + item.pointPosition + "</option>");
            $("select[name=collectPointPositionId]").append("<option value='" + item.id + "'>" + item.pointPosition + "</option>");
        })
    });
    

    
}
//获取神经类型
function getAllProgram(callback){
    Shinez.get('/basic/allProgram', function (ret) {
        if(ret){
            callback&&callback(JSON.stringify(ret))
        }
    });
}


//所有医疗机构
function getAllInstitution(callback){
    Shinez.get('/basic/allInstitution', function (ret) {
        if(ret){
            callback&&callback(JSON.stringify(ret))
        }
    
    });
}

//获取所有的nerve
function getAllNerve(callback) {
    Shinez.get('/basic/allNerve', function (ret) {

        $.each(ret, function (k, v) {
            AllNerveName.push({
                'nerveId': v.id,
                'nerveName': v.nerveNameZh
            })
        })
        callback && callback(AllNerveName)

    });
}
//所有肢体部位
function getAllPartInfo(callback){
    Shinez.get('/basic/allPartInfo', function (ret) {
        if(ret){
            callback&&callback(JSON.stringify(ret))
        }
    });
}
//获取所有记录点和刺激点
function getAllPointPosition(callback){
    Shinez.get('/basic/allPointPosition', function (ret) {
        if(ret){
            callback&&callback(JSON.stringify(ret))
        }
    });
}


//编辑当前项
function checkDataRole(obj) {
    var sNerveName = ''
    var sInstitutionNo = ''
    //读取神经名字改变控件的当前项
    $('#data-table tbody tr').each(function (index, item) {
        if ($(item).attr('data-id') == obj) {
            sNerveName = $(item).find('td[data-name=nerveName]').text()
            sInstitutionNo = $(item).find('td[data-name=institutionId]').text()
        }
    });
    $('#modal-edit select[name=nerveId] option').each(function (k, v) {

        if (sNerveName == $(v).text()) {
            $('#modal-edit').find('select[name=nerveId]').val($(v).attr('value'))
        }
    })
    /* $('#modal-edit select[name=ageSection]').on('change',function(){
        var sVal=$(this).val()
        changeAgeSection('#modal-edit',sVal)
    }) */
    //$('#modal-edit input[name=institutionNo]').val(sInstitutionNo);
    $('#modal-edit input[name=normalRangeUpper]').val(function () {
        var iValue = $(this).val()
        return parseFloat(iValue)*100
        /*if (parseFloat(iValue)<=1) {
            return parseFloat(iValue) * 100
        } else if (parseFloat(iValue) > 200) {
            return parseFloat(iValue) / 100
        } else {
            return iValue;
        }*/

    });
    var rangeResult=$('#modal-edit input[name=rangeType]').val();
    switch(rangeResult.toString()){
        case '0':
            $('#modal-edit').find('.checkbox-choose-upper').attr('data-value','1').find('i').attr('class','fa fa-check-square');
            $('#modal-edit').find('.checkbox-choose-lower').attr('data-value','1').find('i').attr('class','fa fa-check-square');
            break;
        case '1':
            $('#modal-edit').find('.checkbox-choose-upper').attr('data-value','1').find('i').attr('class','fa fa-check-square');
            $('#modal-edit').find('.checkbox-choose-lower').attr('data-value','0').find('i').attr('class','fa fa-square');
            break;
        case '2':
            $('#modal-edit').find('.checkbox-choose-upper').attr('data-value','0').find('i').attr('class','fa fa-square');
            $('#modal-edit').find('.checkbox-choose-lower').attr('data-value','1').find('i').attr('class','fa fa-check-square');
            break;
    }

    $('#modal-edit input[name=normalRangeLower]').val(function () {
        var iValue = $(this).val()
        return parseFloat(iValue)*100
        /*if (iValue.indexOf('.') == 1) {
            return parseFloat(iValue) * 100
        } else if (parseFloat(iValue) > 200) {
            return parseFloat(iValue) / 100
        } else {
            return iValue;
        }*/

    });
    $('#modal-edit').find('.calc-refer-restart').attr('class', 'label label-warning' +
        ' calc-refer-restart');
    $('#modal-edit .calc-refer-restart').off('click').on('click', function () {
        doRestartCalc('#modal-edit')
    })
    calcLimitBorder('#modal-edit');

    $('#modal-edit .calc-edit-btn').off('click').on('click', function () {
        $(".calc-refer-edit-result .calc-fail").hide();
        conditionCalc('#modal-edit')
    })
    $('#modal-edit .meanValue').bind('click keyup', function () {
        var sValue = $(this).val()
        if (sValue != '') {
            $('#modal-edit .avge').text(sValue)
        }
        //设置双向的数据绑定
        setDataSync('#modal-edit')
    })
    $('#modal-edit .standardDeviation').bind('click keyup', function () {
        var sValue = $(this).val();
        if (sValue != '') {
            $('#modal-edit .standard').text(sValue)
        }
        //设置双向的数据绑定
        setDataSync('#modal-edit')
    });

    //重置按钮
    var sId=$('#modal-edit').find('input[name=id]').val()
    $('#modal-edit .calc-refer-reset').on('click', function () {
        resetClick('#modal-edit',sId)
    });
}


//计算均数范围值和标准差的范围值
function calcLimitNumber(args) {
    var $obj = $(args)
    var iNormalRange = $obj.find('.normalRange').val()
    var iMeanValue = $obj.find('.meanValue').val()
    var iStandardDeviation = $obj.find('.standardDeviation').val()

    if (iNormalRange == '') {
        iNormalRange = $obj.find('.normalRange').attr('placeholder')
    }
    if (iMeanValue == '') {
        iMeanValue = $obj.find('.meanValue').attr('placeholder')
    }
    if (iStandardDeviation == '') {
        iStandardDeviation = $obj.find('.standardDeviation').attr('placeholder')
    }

    var mResult = parseFloat(iNormalRange) * parseFloat(iMeanValue)
    var mLimitDown = parseFloat(iMeanValue) - mResult
    var mLimitUp = parseFloat(iMeanValue) + mResult

    var sResult = parseFloat(iNormalRange) * parseFloat(iStandardDeviation)
    var sLimitDown = parseFloat(iStandardDeviation) - sResult
    var sLimitUp = parseFloat(iStandardDeviation) + sResult

    $obj.find('.meanValue-limit').html(mLimitDown.toFixed(2) + '~' + mLimitUp.toFixed(2));
    $obj.find('.standardDeviation-limit').html(sLimitDown.toFixed(2) + '~' + sLimitUp.toFixed(2))

}

//计算边界值
function calcLimitBorder(sClass) {
    var $obj = $(sClass)
    var iMeanValue = $obj.find('input[name=meanValue]').val()
    var iStandard = $obj.find('input[name=standardDeviation]').val()
    $obj.find('.avge').text(iMeanValue)
    $obj.find('.standard').text(iStandard)
    var iPickUpper = $obj.find('.refer-calc-pick-upper').val()
    var iPickLower = $obj.find('.refer-calc-pick-lower').val();
    var iNormalRangeUpper = $obj.find('.refer-calc-selfUpper').val();
    var iNormalRangeLower = $obj.find('.refer-calc-selfLower').val();


    var iUpper = (parseFloat(iMeanValue) + parseFloat(iPickUpper) * parseFloat(iStandard)) * parseFloat(iNormalRangeUpper / 100)
    var iLower = (parseFloat(iMeanValue) - parseFloat(iPickLower) * parseFloat(iStandard)) * parseFloat(iNormalRangeLower / 100)

    $('.refer-calc-result-upper').text(iUpper.toFixed(2));
    $('.refer-calc-result-lower').text(iLower.toFixed(2));

}