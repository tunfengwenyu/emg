/**
 * ShowPage 1.9.0
 * Created by ShiNez on 2016/11/21.
 * Updated at 2017/04/08
 * 仅支持：pagehelper 请自行添加依赖
 */

var DataTable = function () {
    var url;
    var page;
    var params;
    var table;
    var modal;
    var multiple;
    var columNum;
    var columns;
    var options;
    var handles;
    var endFn;
    var end;
    var endFnOnce;
    var endFnOnceFlag = true;
    var tableMethod;
    var checkedIds = [];
    var authValid = false;
    var dbArray = [];
    var subline;


    var convertDataValue = function (convertRole, fieldValue) {
        //     fieldValue=fieldValue+"";
        //     if(!isNaN(fieldValue)){
        //         fieldValue=parseInt(fieldValue);
        //     }
        if (fieldValue == "true") fieldValue = 1;
        if (fieldValue == "false") fieldValue = 0;
        var roleArray = convertRole.split("|");
        var currentRoleArray;
        var showValue;
        $.each(roleArray, function (k, v) {
            currentRoleArray = v.split("=>");
            if (fieldValue == currentRoleArray[0]) {
                showValue = currentRoleArray[1];
                return false;
            }
        });
        return showValue;
    };

    var flush = function () {
        $(".search").trigger("click");
    }
    //构建行
    var buildRow = function (dataIndex, dataId, getFieldValue, dataObject) {
        var tr = $("<tr data-id='" + dataId + "' ></tr>");
        $(table).find("tbody").append(tr);
        if (multiple === true) {
            $(tr).append("<td><label class='mt-checkbox'><input class='no-init' type='checkbox'  onclick='DataTable.checkParent(event)'  value='" + dataId + "'><span><span></span></span></label></td>");
        }
        $.each(columns, function (k, v) {
                var td = $("<td style='vertical-align: middle' data-name='" + v.data + "'></td>");
                var fieldValue = getFieldValue(v);
                //fieldValue 为数据库中真实存在的值
                fieldValue = fieldValue == null ? "" : fieldValue;
                $(td).attr("data-value", fieldValue);
                var showValue = fieldValue;
                if (showValue.length == 0) {
                    showValue = showValue == "" ? "-" : showValue;
                }

                if (v.replaceFn != null && v.replaceFn !== "") {
                    v.replace = v.replaceFn;

                }
                if (v.replace != null && v.replace !== "") {
                    if (typeof(v.replace) === "function") {
                        showValue = v.replace(fieldValue, dataObject)
                    } else {
                        $(td).attr("data-fn", v.replace);
                        showValue = convertVal(v.replace, fieldValue, dataObject);
                    }
                }

                if (v.convert != null && v.convert != "") {
                    $(td).attr("data-convert", v.convert);
                    showValue = convertDataValue(v.convert, fieldValue);

                }

                $(td).attr("data-type", v.type == null ? 'text' : v.type);
                if (v.type == "img" && v.visible != false) {
                    if (showValue == "-") showValue = "";
                    $(td).html("").append("<img style='width:50px;height:50px;' src='" + showValue + "' alt=''>");
                    if (v.view != null && v.view != "") {
                        $(td).attr("title", "点击可预览").unbind("click").on("click", function () {
                            $("#" + v.view).modal("show").css("z-index", 99999).find("img").attr("src", fieldValue);
                        });
                    }
                } else if (v.type == "date") {
                    var timestamp = showValue;
                    var dateStr = "";
                    if (timestamp != null && timestamp != "" && timestamp != "-") {
                        var d = new Date(timestamp);    //根据时间戳生成的时间对象
                        dateStr = (d.getFullYear()) + "-" +
                            (d.getMonth() < 9 ? "0" + (parseInt(d.getMonth() + 1)) : (parseInt(d.getMonth() + 1))) + "-" +
                            (d.getDate() < 10 ? "0" + d.getDate() : d.getDate())
                    }
                    $(td).html(dateStr);
                    $(td).attr("data-value", dateStr);
                } else if (v.type == "datetime") {
                    var timestamp = showValue;
                    var dateStr = "";
                    if (timestamp != null && timestamp != "" && timestamp != "-") {
                        var d = new Date(timestamp);    //根据时间戳生成的时间对象
                        dateStr = (d.getFullYear()) + "-" +
                            (d.getMonth() < 9 ? "0" + (parseInt(d.getMonth() + 1)) : (parseInt(d.getMonth() + 1))) + "-" +
                            (d.getDate() < 10 ? "0" + d.getDate() : d.getDate()) + " " +
                            (d.getHours() < 10 ? "0" + d.getHours() : d.getHours()) + ":" +
                            (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes());
                    }
                    $(td).html(dateStr);
                    $(td).attr("data-value", dateStr);

                } else if (v.type == "rowNum") {
                    if (dataIndex != null) {
                        var idx = parseInt(dataIndex);
                        $(td).html(idx + 1);
                        $(td).attr("data-value", idx + 1);
                    } else {
                        $(td).html("[new]");
                        $(td).attr("-1");
                    }
                }else if(v.type=='number'){
                    var iNum=$(td).attr('data-value');
                    var sStatus=''
                    switch(iNum){
                        case '0':
                            sStatus='未分析';
                            break;
                        case '1':
                            sStatus= '未审核';
                            break;
                        case '2':
                            sStatus= '已审核';
                            break;
                        case '3':
                            sStatus= '已退回';
                            break;
                        case '4':
                            sStatus= '未提交';
                            break;
                    }
                    $(td).html("").append('<span class="status" data-status="'+iNum+'">'+sStatus+'</span>');
                }
                else {
                    if (v.collect) {
                        td.append("<span class='td-content'></span>")
                        td.find("span")
                            .css("word-break", " break-all")
                            .css("display", "-webkit-box")
                            .css("-webkit-line-clamp", "" + (v.collect.line || 3))
                            .css("-webkit-box-orient", "vertical")
                            .css("overflow", "hidden")
                            .css("height", (v.collect.line || 3) * 20 + "px")
                            .attr("title", "" + showValue);
                        $(td).find("span").html("" + showValue);
                    } else {
                        $(td).html("" + showValue);
                    }
                }

                if (v.visible === false) {
                    $(td).addClass("display-none");
                }

                $(tr).append(td);
                if (v.onclick != null && v.onclick !== "") {
                    if (typeof(v.onclick) === "function") {
                        $(td).on("click", function () {
                            v.onclick(fieldValue, dataObject)
                        });
                    } else {
                        $(td).on("click", function () {
                            doFnWithDataId(v.onclick, td);
                        });
                    }
                }
            }
        );
        //添加退回报告的颜色
        $(table).find('tbody tr td span[data-status=3]').parents('tr').attr('class','danger');
        //操作区td
        if (options != null) {
            var optTd = $("<td style='vertical-align: middle'></td>")
            $.each(options, function (i, opt) {
                var color = opt.color == null ? " " : opt.color ;
                var flag = opt.flag == null ? " " : opt.flag + " ";
                var title = opt.title || opt.name || "";
                var a_tag;
                var icon = opt.icon;
                var btnName = opt.name;
                var fontSize = "";
                var visibleResult = true;
                if (opt.visible) {
                    if (typeof(opt.visible) === "function") {
                        visibleResult = opt.visible(dataObject);
                    } else {
                        visibleResult = eval(opt.visible + "(dataObject)");
                    }
                    if (!visibleResult) {
                        return true;
                    }
                }

                if (icon != null) {
                    btnName = "";
                    color = "";
                    fontSize = "font-size:18px;";
                }

                a_tag = $("<a class='btn " + color + flag + "' title='" + title + "' href='javascript:void(0);' style='color: #333;" + fontSize + "'><i class='" + icon + "'></i>" + btnName + "</a>");
                if (opt.option != null) {
                    $(a_tag).attr("href", "#" + opt.option).attr("data-toggle", "modal");
                    if (opt.edit) {//如果设置了编辑，将启用行转model功能
                        $(a_tag).on("click", function () {
                            rowToModal(dataId, opt.option, dataObject);
                        });

                        if (opt.editMain) {
                            $(tr).on("dblclick", function () {
                                $(a_tag).trigger("click");
                            })
                        }
                        if (opt.visible == false) {
                            $(a_tag).css("display", "none");
                        }
                    }
                }
                if (opt.pre != null && opt.pre != "") {
                    $(a_tag).on("click", function () {
                        if (typeof(opt.pre) === "function") {
                            opt.pre(dataObject);
                        } else {
                            doFnWithDataId(opt.pre, this);
                        }
                    });
                }

                if (opt.props != null && opt.props.length > 0) {
                    for (var i = 0; i < opt.props.length; ++i) {
                        var clsArr = opt.props[i].split("=");
                        $(a_tag).attr(clsArr[0], clsArr[1]);
                    }
                }

                if (opt.del != null && opt.del != "") {//如果是删除功能
                    $(a_tag).on("click", function () {
                        bootbox.setLocale("zh_CN");
                        var tipMsg = opt.msg;
                        if (tipMsg == null) {
                            tipMsg = "确定要删除该条记录吗？";
                        }
                        bootbox.confirm(tipMsg, function (result) {
                            if (result) {
                                Shinez.del(opt.del + "/" + dataId, function (ret) {
                                    if (ret.code == 0) {
                                        Shinez.tip("success", "删除成功");
                                        delRow(dataId);
                                    } else {
                                        Shinez.tip("error", ret.msg);
                                    }
                                });
                            }
                        });
                    });
                }

                $(modal).find("#" + opt.option).find(".btn-save").off("click").on("click", function () {
                    if (opt.url != null && opt.url != "") {
                        var validresult;
                        if (opt.before == null || opt.before == "") {
                            validresult = true
                        } else {
                            validresult = doFn(opt.before);
                        }
                        var flag = true;

                        if (validresult && flag) {
                            var items=getJSONObj($(modal).find("#" +opt.option),$(modal).find("#" + opt.option).find("form").serializeArray())
                            if($(modal).find("#" + opt.option).find("input[type=checkbox]").val()!=''){
                                var open=$(modal).find("#" + opt.option).find("input[type=checkbox]").not(".no-init").bootstrapSwitch('state')
                                if(open==true){
                                    items['isCurrent']=1
                                }else{
                                    items['isCurrent']=0
                                }
                            }
                            Shinez.put(opt.url,items, function (ret) {
                                if (ret.code == 0) {
                                    flag = false;
                                    $(".modal").modal('hide');
                                    Shinez.tip("success", (opt.success == null || opt.success == "") ? "操作成功" : opt.success);
                                    setTimeout(function () {
                                        $(params).find(".search").trigger("click")
                                    }, 300);
                                } else {
                                    Shinez.tip("error", ret.msg+'===');
                                }
                            });
                        }

                    }
                    if (opt.submit != null && opt.submit != "") {
                        doFn(opt.submit);
                    }
                });

                $(optTd).append(a_tag);
            });
            $(tr).append(optTd);
        }
         $(table).find("tbody").append(tr);

        if (subline != undefined) {
            if (typeof(subline.init) === "function") {
                subline.init(tr, dataObject);
            } else {
                execute(subline.init, tr, dataObject)
            }
        }
    };


    //数据请求ajax
    var turnPage = function (obj) {
        if (multiple === true) {
            $(table).find("thead tr").find("th:first input").prop("checked", false);
            checkedIds = [];
        }

        var $this = $(obj);
        var input;
        if (obj != null) {
            input = document.createElement('input');
            input.type = 'hidden';
            input.name = "pageIndex";
            input.value = $.trim($this.attr("data-index"));
            $(params).append(input);
        }
        var param=getJSONObj($(obj),$(params).serializeArray())
        Shinez.get(url, /*$(params).serialize()*/ param,
            function (ret) {
                if (ret.code) {
                    Shinez.tip("error", "数据加载失败：" + ret.msg);
                    $(".loading-tip").html("数据加载失败：" + ret.msg).css("color", "red");
                    return;
                }

                if (ret.data) {
                    page = ret.data.page;
                } else {
                    page = ret.page || ret;
                }

                $(table).find("tbody").html("");
                buildPageNums();
                dbArray = [];
                if (page.total === 0 || page.length === 0) {
                    noDataFlag();
                }

                $.each(page.list || page, function (key, value) {
                    dbArray.push(value)
                    buildRow(key, value["id"], function (v) {

                        return value[v.data];
                    }, value);
                });

                if($(table).parent().attr('class').indexOf('table-checklist')!=-1){
                    $(table).parent().height(function(){
                        var iHeight=$(table).find('tbody tr').height();
                        var iLine=$(table).find('tr').length;
                        return iLine*iHeight
                    });
                    $(table).parent().find('.scroll-left-bar').height(function(){
                        return parseInt($(table).parent().height())*0.3
                    });
                    $(table).parent().next('.curr-text').height(function(){
                        return $(table).parent().height();
                    });
                    $(table).parent().next('.curr-text').find('.check-wrap').height(function(){
                        return parseInt(parseInt($(table).parent().height())/2)
                    })

                }

                var $tr=$(table).find('tbody tr')
                $tr.sort(function(a,b){
                    var sort1=$(a).find('td:eq(1)').attr('data-value');
                    var sort2=$(b).find('td:eq(1)').attr('data-value');
                    //var sort2=$(b).attr('data-id')
                    if(sort1>sort2){
                        return -1
                    }
                });
                $tr.detach().appendTo($(table).find('tbody'));

                if (endFn !== undefined) {
                    end = endFn;
                }
                if (end !== undefined) {
                    if (typeof (end) === "function") {
                        end(ret.data || ret);
                    } else {
                        doFnWithData(end, ret.data || ret);
                    }
                }
                if (endFnOnceFlag && endFnOnce != null && endFnOnce != '') {
                    doFnWithData(endFnOnce, ret.data || ret);
                    endFnOnceFlag = false;
                }
                registerPageComponent();
                /* var aInputCheckbox=$("#modal-add").find("input[type=checkbox]");
                for(var i=0;i<aInputCheckbox.length;i++){
                    $(aInputCheckbox[i]).bootstrapSwitch('state',true);
                } */
                $("#modal-add").find("input[type=checkbox]").not(".no-init").bootstrapSwitch('state',true);
                $("#modal-edit").find("input[type=checkbox]").not(".no-init").bootstrapSwitch();
                table.find("td").find("input[type=checkbox]").not(".no-init").bootstrapSwitch();

                //$(params).find(".search").attr("data-index", page.pageNum || 1).attr("last-page", page.lastPage || 1);
                $(params).find(".search").attr("data-index", page.pageNum ).attr("last-page", page.lastPage);

                if (authValid === true) {
                    clearAuth(ret.data || ret)
                }
                //$("input[name=pageIndex]").remove();
                $(params).find("input[name=pageIndex]").remove();
            }
            , function (ret) {
                Shinez.tip("error", "数据加载失败：" + ret.msg);
                $(".loading-tip").html("数据加载失败：" + ret.msg).css("color", "red");
            }
        );



    };

    var clearAuth = function (data) {
        var rolesArr = data.roles;
        if (rolesArr === undefined || rolesArr.length === 0) {
            var authorities = JSON.parse(localStorage.authorities);
            rolesArr = [];
            for (var i = 0; i < authorities.length; ++i) {
                rolesArr.push(authorities[i].roleCode);
            }
        }

        $("*[data-roles]").each(function (k , v) {
            var val = $(v).attr("data-roles");
            var valArr = val.split(",")
            var hasRole = false;
            for (var i = 0; i < rolesArr.length; ++i) {
                for (var j = 0; j < valArr.length; ++j) {
                    if (rolesArr[i] === valArr[j]) {

                        hasRole = true;
                        break;
                    }
                }
                if (hasRole === true) {
                    break;
                }
            }
            if (hasRole === false) {
                $(v).css("display", "none").remove()
            } else {
                $(v).css("display", "")
            }
        });
    }

    //构建翻页插件
    var buildPageNums = function () {
        //$(table).find("tfoot tr[class=page-nums]").remove();
        $('.pages-number').empty();
        if (page.total === 0 || page.length === 0) return;
        var ul;
        var footLi;

        if (page.pages === 1 || page.length) {
            ul = $("<ul class='pagination pull-left'></ul>");
            footLi = $("<li><span> 共<span id='data-total'>" + (page.total || page.length) + "</span>条记录</span></li>");
            $(ul).append(footLi);

            $('.pages-number').append(ul);
            return;
        }

        var homeLi;
        var preLi;
        var currentLi;
        var nextLi;
        var lastLi;

        ul = $("<ul class='pagination pull-right'></ul>");
        var ulLeft = $("<ul class='pagination pull-left'></ul>");
        $(ulLeft).append("<li><a style='padding: 3px;margin-right:10px;border: none'>Page <input id='pagenum-input'  min='1' max='" + page.pages + "' type='number' value='" + page.pageNum + "' style='width: 50px;text-align: center'> </a><a class='btn btn-sm blue' data-index='' href='javascript:;'>GO</a></li>");
        $(ulLeft).find("#pagenum-input").on("change", function () {
            if ($(this).val() < 1) {
                $(this).val(1);
            } else if ($(this).val() > page.pages) {
                $(this).val(page.pages);
            }
        });
        $(ulLeft).find(".btn").on("click", function () {
            $(this).attr("data-index", $(ulLeft).find("#pagenum-input").val());
            turnPage(this);
        });
        $('.pages-number').append(ulLeft);

        //构建页码
        if (page.pageNum == 1) {
            homeLi = $("<li><a href='javascript:;'>首页</a></li>");
            preLi = $("<li><a href='javascript:;'>上一页</a></li>");
        } else {
            homeLi = $("<li><a data-index='1' href='javascript:;'>首页</a></li>");
            preLi = $("<li><a data-index='" + (parseInt(page.pageNum) - 1) + "' href='javascript:;'>上一页</a></li>");
            $(homeLi.find("a")).on("click", function () {
                turnPage(this);
            });
            $(preLi.find("a")).on("click", function () {
                turnPage(this);
            });
        }

        $(ul).append(homeLi).append(preLi);
        for (var i = page.firstPage; i <= page.lastPage; ++i) {
            if (page.pageNum == i) {
                currentLi = $("<li class='active'><a href='javaScript:;'>" + i + "<span class='sr-only'>(current)</span></a></li>");
            } else {
                currentLi = $("<li><a data-index='" + i + "' href='javascript:;'>" + i + "</a></li>");
                $(currentLi.find("a")).on("click", function () {
                    turnPage(this);
                });
            }
            $(ul).append(currentLi);
        }

        if (page.pageNum == page.lastPage) {
            nextLi = $("<li><a href='javascript:;'>下一页</a></li>");
        } else {
            nextLi = $("<li><a data-index='" + (parseInt(page.pageNum) + 1) + "' href='javascript:;' >下一页</a></li>");
            $(nextLi.find("a")).on("click", function () {
                turnPage(this);
            });
        }

        if (page.pageNum == page.pages) {
            lastLi = $("<li><a href='javascript:;'>尾页</a></li>");
        } else {
            lastLi = $("<li><a data-index='" + page.pages + "' href='javascript:;'>尾页</a></li>");
            $(lastLi.find("a")).on("click", function () {
                turnPage(this);
            });
        }
        footLi = $("<li><span> 共<span id='data-total'>" + page.total + "</span>条记录,共" + page.pages + "页</span></li>");
        $(ul).append(nextLi).append(lastLi).append(footLi);
        //var td = $("<td style='border-left:none;' colspan='" + (parseInt(columNum) - 2) + "'></td>");
        $('.pages-number').append(ul)
    };

    var registerPageComponent = function () {
        var $dataRef = $("*[data-ref]");
        $.each($dataRef, function (i, j) {
            if ($(j).attr("data-ref").indexOf("::") == -1) {
                $(j).parents("td").find("*[name=" + $(j).attr("data-ref") + "]").on("change", function () {
                    if ($(this).is("select")) {
                        if ($(this).val() != null && $(this).val() != "") {
                            $(j).val($(this).find("option[value=" + $(this).val() + "]").html());
                        }
                    } else {
                        $(j).blur();
                        $(j).focus();
                        $(j).val($(this).val());
                    }
                });
            } else {
                var names = $(j).attr("data-ref").split("::");
                var dataMethod = $(j).attr("data-method");
                if (dataMethod.indexOf("concat") != -1) {
                    var sp = dataMethod.substring(7, dataMethod.lastIndexOf(")"));
                    var newVal = "";
                    $.each(names, function (k, v) {
                        $(j).parents("td").find("*[name=" + v + "]").on("change", function () {
                            newVal = "";
                            $.each(names, function (y, z) {
                                newVal += $(j).parents("td").find("*[name=" + z + "]").val();
                                newVal += sp;
                            });
                            newVal = newVal.substring(0, newVal.lastIndexOf(sp));
                            $(j).val(newVal);
                        });
                    });
                }
            }
        });

        $(".modal").find("select").change();
        $(".modal").find("input[type=radio]").change();
        $(".modal").find("input[type=checkbox]").change();

    };
    //执行函数
    var doFnWithDataId = function (fnName, obj) {
        if (obj != null) {
            var data_id;
            if (obj instanceof Object)
                data_id = $(obj).parents("tr").attr("data-id");
            else
                data_id = obj;
            fnName = fnName + "(" + data_id + ")";
        } else {
            fnName = fnName + "()";
        }
        eval(fnName);
    };

    var doFnWithData = function (fnName, data) {
        var excuteStr = fnName + "(data)";
        eval(excuteStr);
    };


    //执行函数
    var doFn = function (fnName) {
        fnName = fnName + "()";
        return eval(fnName);
    };


    //列字段转换
    var convertVal = function (fnName, val, dataObj) {
        //调用的函数名，val医院机构名，dataObj

        if (isNaN("'" + val + "'") && val != true && val != false && val != "true" && val != "false") {
            val = "'" + val + "'";
        }
        if(val=="" || val==undefined || val==null){
            fnName = fnName + "('" + val + "'," + "(dataObj)" + ")";
        }else {
            fnName = fnName + "(" + val + "," + "(dataObj)" + ")";
        }
        return eval(fnName);
    };
    var execute = function (fnName, param1, param2) {
        fnName = fnName + "((param1),(param2))";
        return eval(fnName);
    }

    var rowToModal = function (dataId, modalId, data) {
        var objs=$('#'+modalId).find('*[name]');
            $.each(objs,function(k,v){
                if($(v).attr('type')!='checkbox'){
                    $(v).val('')
                }
                
            })
        $.each(data, function (k, v) {
            var $currentElement = $("#" + modalId).find("*[name=" + k + "]");
            if ($currentElement.is("img")) {
                $currentElement.prop("src", v).val(v);
            }
            if ($currentElement.parent("div").hasClass("form_datetime")) {
                $currentElement.val($("tr[data-id=" + dataId + "]").find("td[data-name=" + k + "]").attr("data-value"))
                return true;
            }
            if ($currentElement.is("[type=checkbox]")) {
                if ($currentElement.val() == "true") {
                    $currentElement.val(1);
                }
                if ($currentElement.val() == "false") {
                    $currentElement.val(0);
                }
                var open = ((v === true || v === 1) && $currentElement.val() == 1)
                    || ((v === false || v === 0) && $currentElement.val() == 0);
                if ($currentElement.hasClass("no-init")) {
                    $currentElement.prop("checked", open).change();
                    return true;
                }
                $currentElement.bootstrapSwitch('state', open);
                return true;
            }
            
            $("#" + modalId).find("*[name=" + k + "]").val(v).change();
            
            if ($currentElement.attr("data-ref") != null) {
                if ($currentElement.val() == "true") {
                    $currentElement.val(1);
                }
                if ($currentElement.val() == "false") {
                    $currentElement.val(0);
                }
                if ($currentElement.val() && $currentElement.val() != "") {
                    $currentElement.parents("td").find("*[name=" + $currentElement.attr("data-ref") + "][value='" + $currentElement.val() + "']").prop("checked", true).change();
                }
                $currentElement.change();
            }
        })

    };

    var noDataFlag = function () {
        var tr = $(table).find("tr[class=no-data]");
        if ($(table).find("tbody tr").length == 0) {
            columNum = $(table).find("thead").find("th").length;
            tr = $("<tr class='no-data'></tr>");
            var td = $("<td class='text-center' colspan='" + columNum + "'>没有符合条件的记录</td>");
            $(tr).append(td);
            $(table).find("tbody").append(tr);
        } else {
            $(tr).remove();
        }
    }


    var delRow = function (id) {
        $(table).find("tr[data-id=" + id + "]").fadeOut(1000);
        $(table).find("#data-total").html(parseInt($(table).find("#data-total").html()) - 1);
        noDataFlag();
    };

    var checkChildren = function (event) {
        var eState = $(event.target).prop("checked");
        var tr = $(table).find("tbody tr");

        checkedIds = [];
        tr.each(function (k, v) {
            $(v).find("td:first input").prop("checked", eState);
            if (eState === true) {
                checkedIds.push($(v).find("td:first input").val())
            }
        });
    };

    var checkParent = function (event) {
        var eState = $(event.target).prop("checked");
        var id = $(event.target).val();
        if (eState === false) {
            $(table).find("thead tr").find("th:first input").prop("checked", false)
            checkedIds.forEach(function (v, k) {
                if (v == id) {
                    checkedIds.splice(k, 1);
                }
            })
        } else {
            checkedIds.push(id)
            var tdCheck = $(table).find("tbody tr input[class=no-init]");
            var checkAll = true;
            tdCheck.each(function (k, v) {
                if ($(v).prop("checked") === false) {
                    checkAll = false;
                    return false;
                }
            });
            $(table).find("thead tr").find("th:first input").prop("checked", checkAll)
        }

    }

    //转换json数据
    var getJSONObj=function(obj,args){
        var oParams={}
        $.each(args,function(k,v){

            if(v.value!='' || null){
                oParams[v.name]=v.value
            }

            if(v.name=="normalRangeUpper"){
                oParams[v.name]=parseFloat(v.value)/100
            }
            if(v.name=="normalRangeLower"){
                oParams[v.name]=parseFloat(v.value)/100
            }
            if(oParams.upperLimit==''){
                oParams.upperLimit=obj.find('input[name=upperLimit]').attr('placeholder')
            }
            if(oParams.lowerLimit==''){
                oParams.lowerLimit=obj.find('input[name=lowerLimit]').attr('placeholder')
            }
            if(v.name=="rangeType"){
                var sUpper = obj.find('.checkbox-choose-upper').attr('data-value');
                var sLower = obj.find('.checkbox-choose-lower').attr('data-value');
                if (sUpper == 1 && sLower == 1) {
                    oParams[v.name]='0'
                } else if (sUpper == 0 && sLower == 1) {
                    oParams[v.name] ='2'
                } else if (sUpper == 1 && sLower == 0) {
                    oParams[v.name] ='1'
                }
            }
            
        });
        /* if(oParams['institutionNo']==''){
            oParams['institutionNo']=sessionStorage.getItem('institutionNo')
        } */

        return oParams
    }

    return {
        init: function (data) {
            $.each($("*[name]"), function (k, v) {
                $(v).attr("title", $(v).attr("placeholder"))
            });
            url = data.url;
            multiple = data.multiple;
            tableMethod = data.tableMethod == null ? "GET" : data.tableMethod;
            table = $("#" + data.tableName);
            columNum = $(table).find("thead").find("th").length;
            //获取thead中的th
            if(data.options!=null){
                columNum=columNum+1
            }
            columns = data.columns;

            modal = $("#" + data.modal);

            params = $("#" + data.paramsFormName);

            $("#" + data.paramsFormName).on("change", function () {
                $(".search").trigger("click");
            })
            authValid = data.authValid;
            subline = data.subline;
            //搜索后跳转的页面
            params.find(".search").on("click", function () {
                turnPage(this);
            });
            //编辑、删除操作
            options = data.options;
            if (options != null) {
                $(table).find("thead tr").find("th[name=opt-th]").remove();
                $(table).find("thead tr").append("<th name='opt-th'>操作</th>");
            }

            handles = data.handles;
            endFnOnceFlag = true;
            endFn = data.endFn;
            end = data.end;
            endFnOnce = data.endFnOnce;
            if (handles != null) {
                $.each(handles.insert, function (k, v) {
                    $(modal).find("#" + v.modalId).on('show.bs.modal', function (e) {
                        $(modal).find("#" + v.modalId).find('.refer-calc-result-upper').text('');
                        $(modal).find("#" + v.modalId).find('.refer-calc-result-lower').text('');
                        $(e.relatedTarget).on("click", function () {
                            $(modal).find("#" + v.modalId).find("input[type=text]").not(".inputtime").val("");

                        })
                    });
                    $(modal).find("#" + v.modalId).find(".btn-save").off('click').on("click", function () {

                        //添加
                        var validresult;
                        if (v.fn == null || v.fn == "") {
                            validresult = true;
                        } else {
                            validresult = doFn(v.fn);
                        }
                        var flag = true;
                        if (validresult && flag) {
                            flag = false;
                            var newTds = $(modal).find("#" + v.modalId).find("td");
                            var dataRef = "";
                            $.each(newTds, function (k, v) {
                                dataRef = $(v).find("*[data-ref]").attr("data-ref");
                                if (dataRef != null) {
                                    if (dataRef.indexOf("::") == -1) {
                                        if ($(v).find("*[name=" + dataRef + "]").is("select")) {
                                            var v = $(v).find("*[name=" + dataRef + "]").val();
                                            if (v != "" && v != null) {
                                                $(v).find("*[data-ref]").val($(v).find("*[name=" + dataRef + "]").find("option[value=" + v + "]").html());
                                            }
                                        } else {
                                            $(v).find("*[data-ref]").val($(v).find("*[name=" + dataRef + "]:checked").val());
                                        }
                                    } else {
                                        var names = $(v).find("*[data-ref]").attr("data-ref").split("::");
                                        var dataMethod = $(v).find("*[data-ref]").attr("data-method");
                                        if (dataMethod.indexOf("concat") != -1) {
                                            var sp = dataMethod.substring(7, dataMethod.lastIndexOf(")"));
                                            var newVal = "";
                                            $.each(names, function (k1, v1) {
                                                newVal = "";
                                                $.each(names, function (y, z) {
                                                    newVal += $(v).find("*[name=" + z + "]").val();
                                                    newVal += sp;
                                                });
                                                newVal = newVal.substring(0, newVal.lastIndexOf(sp));
                                                $(v).find("*[data-ref]").val(newVal);
                                            });
                                        }
                                    }

                                }
                            });
                            var items=getJSONObj($(modal).find("#" +v.modalId),$(modal).find("#" +v.modalId).find("form").serializeArray());
                            Shinez.post(v.url,items , function (ret) {
                                
                                if (ret.code == 0) {
                                    flag = true;
                                    // addRow(ret.data.obj, v.modalId);
                                    $(".modal").modal('hide');
                                    Shinez.tip("success", "添加成功");

                                    setTimeout(function () {
                                        $(".search").trigger("click");
                                    }, 300);
                                } else {
                                    Shinez.tip("error", ret.msg);
                                }
                            });
                        }
                    });
                });

            }

            $(table).find("tbody").html("").append("<tr><td colspan='" + columNum + "' class='text-center loading-tip'>请稍后，数据加载中...</td></tr>");
            turnPage();

        },
        rowToModal: function (dataId, modalId) {
            rowToModal(dataId, modalId);
        },
        convert: function (role, value) {
            return convertDataValue(role, value);
        },
        checkChildren: function (event) {
            return checkChildren(event)
        },

        checkParent: function (event) {
            return checkParent(event)
        },
        getCheckedId: function () {
            return checkedIds;
        },
        getData: function () {
            return dbArray;
        },
        flush: function () {
            return flush();
        }
    }
}
();
