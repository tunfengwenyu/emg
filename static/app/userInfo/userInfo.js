/**
 * Created by Nation on 2019/6/3.
 */

var aColumn=[
    {data: "doctorName"},
    {data: "age",visible:false},
    {data: "phone"},
    {data: "institutionNo",replaceFn:'getInstitution'},
    {data: "doctorTypeId",visible:false},
    {data: "sysUserId",visible:false,replaceFn:'getUserRole'},
    {data: "pwd",visible:false},
    {data: "gmtCreate", type:'datetime'}
];

//ajax数据的获取地址
var url="/basic/doctor";
//初始化表格
function init(){
    DataTable.init({
        url:url,
        tableName:'data-table',
        paramsFormName:'search-form',
        columns:aColumn,
        modal:"modals",
        authValid: true,
        options:[
            {
                icon:'fa fa-edit',
                title:'编辑',
                color:'green',
                edit:true,
                /*editMain:true,*/
                url:url,
                option:'modal-edit',
            },
            {
                icon:'fa fa-remove',
                title:'删除',
                color:'red',
                del:url,
                msg:'确定需要删除该用户吗？'
            }
        ],
        handles:{
            insert:[
                {
                    url:url,
                    modalId:'modal-add'
                }
            ]
        }
        /*endFn: "registerSwitch",*/

    });

};


//加载页面后将医院的代号修改成汉字显示
var getInstitution=function(args){
    var newName=aHospitalName.find(function(value,index){
        if(value.institutionNo==args){
            return value
        }
    });
    if(newName){
        return newName.institutionName
    }else{
        return '-'
    }

};
//将用户角色转成中文字符
var getUserRole=function(args){
    var newItem=aRoleName.find(function(item,index){
        if(args==item.id){
            return item
        }
    });
    if(newItem){
        return newItem.roleName
    }else{
        return '-'
    }

}
//获取所有的医院名称
var getAllHospitalName=function(callback){
    var name=[]
    Shinez.get('/basic/allInstitution',function(ret){
        $.each(ret,function(k,v){
            $('select[name=institutionNo]').append('<option value="'+v.institutionNo+'">'+v.institutionName+'</option>')
            name.push({"institutionNo":v.institutionNo,"institutionName":v.institutionName})
        });

        callback(name)
    })
};
//定义一个空数组用来存储医院的名字
var aHospitalName=[];
getAllHospitalName(function(name){
    aHospitalName=name;
});

//获取用户的所有角色
function getAllUserRole(callback){
    var aUserInfo=[];
    Shinez.get('/main/sys-role',function(ret){
        //console.log(ret)
        if(ret.code==0){
            $.each(ret.data.page.list,function(k,v){
                aUserInfo.push({'id':v.id,'roleName':v.roleName})
            })
        }else{
            return
        }

        callback(aUserInfo)
    });


}
//获取所有的用户角色
var aRoleName=[]
getAllUserRole(function(args){
    aRoleName=args;
});

//点击编辑按钮获取当前的id号
/*checkDataRole=function(args){
    console.log('args',args)
}*/
$(function(){
    init();

});


