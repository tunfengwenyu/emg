var resource = "/terms";
var AllNerveName=null;
$(function () {
    //获取所有的部位
    getAllNerveName(function(args){
        AllNerveName=args
    });
    DataTable.init({
        url: resource, //ajax请求url
        tableName: "data-table", //数据表table id
        paramsFormName: "search-form", //查询参数form id
        modal: "modals", //模态框div
        columns: [ //列对应的字段数组，注意顺序
            {
                data: "nerveId",replaceFn:'showIndexNames'
            },
            {
                data:'normalLevel',replaceFn:'showDiffColor'
            },
            {
                data:'diagnosisTerm',
            },
            {
                data:'paramName',
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
                msg: "确定要删除该神经信息吗？"
            },
        ],
        handles: {
            insert: [{
                url: resource,
                modalId: "modal-add"
            }, ],
        },
        endFnOnce:'loadSelect'
    });

    /* $('select[name=normalLevel]').on('change',function(){
        var ret=$(this).val()
        console.log('sss',ret)
        if(ret!=null){
            switch(ret.toString()){
                case '0':
                    $('.status-level').css({display:'block'})
                    break;
                default:
                    $('.status-level').css({display:'none'})
                    return false;
                    break;
            }
        }else{
            $('.status-level').css({display:'block'})
        }
    }) */
    
});

//获取所有的神经名
function getAllNerveName(callback){
    Shinez.get('/basic/allNerve',function(ret){
        if(ret){
            callback&&callback(JSON.stringify(ret))
        }
    })
}

function showDiffColor(args){
    switch(args.toString()){
        case '0':
            return '<span class="show-color" style="background-color:#5BB85D;">正常</span>'
            break;
        case '1':
            return '<span class="show-color" style="background-color:#D9544F;">异常</span>'
            break;
        case '4':
            return '<span class="show-color" style="background-color:#999;">未统计</span>'
            break;
        case '5':
            return '<span class="show-color" style="background-color:##327d34;">正常(较另一侧上升)</span>'
            break;
        case '6':
            return '<span class="show-color" style="background-color:#16e01c;">正常(较另一侧下降)</span>'
            break;

    }

}

//显示nerveId和神经名称
function showIndexNames(args){
    var sName='';
    JSON.parse(AllNerveName).forEach(function(item,index){
        if(item.id==args){
            sName=args+':'+item.nerveNameZh
        }
    });

    return sName || '-'
}

//登录时的所有select的预选项
function loadSelect(obj){
    //填补部位控件
    getAllNerveName(function(args){
        var oData=JSON.parse(args);
        $.each(oData,function(k,v){
            $('select[name=nerveId]').append('<option value="'+v.id+'">'+v.nerveNameZh+'</option>')
        })
    });
    //填补神经类型控件
    /*getAllNerveName(function(args){
        var oData=JSON.parse(args);
        $.each(oData,function(k,v){
            $('select[name=nerveTypeId]').append('<option value="'+v.id+'">'+v.nerveTypeName+'</option>')
        })
    })*/
}

