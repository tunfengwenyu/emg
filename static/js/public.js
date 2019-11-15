function wangEditorForPublic(editor) {
    // 自定义菜单配置
    editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'quote',  // 引用
        // 'image',  // 插入图片
        'table',  // 表格
        // 'code',  // 插入代码
        'undo',  // 撤销
        'redo'  // 重复
    ]
    // 下面两个配置，使用其中一个即可显示“上传图片”的tab。但是两者不要同时使用！！！
    //     editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
    editor.customConfig.uploadImgServer = '/admin/uploadImg'  // 上传图片到服务器
    // 隐藏“网络图片”tab
    editor.customConfig.showLinkImg = false;
    // 将图片大小限制为 3M
    editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
    // 限制一次最多上传 5 张图片
    editor.customConfig.uploadImgMaxLength = 5;
    editor.customConfig.uploadFileName = 'myFileName';
    editor.create();
}
//格式化时间
function formatTimeFtt(val) {
    if (val != null) {
        var date = new Date(val);
        var month=date.getMonth()<9?"0"+(date.getMonth()+ 1):date.getMonth()+ 1;
        var day=date.getDate()<10?"0"+date.getDate():date.getDate();
        var hours=date.getHours()<10?"0"+date.getHours():date.getHours();
        var minutes=date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();
        var seconds=date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds();
        return date.getFullYear() + '-' + (month ) + '-' + day
            +" "+hours+":"+ minutes
            + ":"+seconds;
    }
}
//生成随机字符串
function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}