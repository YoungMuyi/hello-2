//@ sourceURL=AIRImport_print.js
var AIRimport_print = (function(){

    //单证打印select改变为上面的input框赋值
    $(".AIRimport #printSelect_1").on('change', function(){
        $(".AIRimport #print input[name='type']").val($(this).select2("data")[0].text);
        var data2 = $(this).select2("data")[0].id;
        $(".AIRimport #print input[name='printTemplates']").val("");
        //打印模板
        $.ajax({
            type:'post',
            url: getContextPath() + 'basedataPrintFormat/listByKeys.do',
            data:{'keys':'{printCode:"",type:"'+data2+'"}'},
            success:function(data){
                data=JSON.parse(data);
                $(".AIRimport #printSelect_2").empty();
                $(".AIRimport #printSelect_2").append("<option value=''></option>");
                for(var key=0,l=data.length;key<l;key++){
                        if(data[key]['name']){
                            $(".AIRimport #printSelect_2").append("<option value='"+ data[key]['saveName']  + "' printcode='"+data[key]['printCode']+"'>"+data[key]['name']+"</option>");
                        }
                        $(".AIRimport #print input[name = 'printFormatId']").val(data[key]['printFormatId']);
                }
                $(".AIRimport #print input[name='printTemplates']").val($(".AIRimport #printSelect_2").select2("data")[0].text);
            }
        });
    });


    //单证代码失去焦点时调用
    $(".AIRimport #print input[name = 'printCode']").focusout(function(){
        var data1 = $(".AIRimport #print").find("input[name = 'printCode']").val();
        $(".AIRimport #print input[name='printTemplates']").val("");
        $(".AIRimport #print input[name='type']").val("");
        if(data1 == ""){
            //如果为空值什么都不做
        } else {
            $.ajax({
                type:'post',
                url: getContextPath() + 'basedataPrintFormat/listByKeys.do',
                data:{'keys':'{printCode:"'+data1+'",type:""}'},
                success:function(data){
                    data=JSON.parse(data);
                    $(".AIRimport #printSelect_2").empty();
                    //$("#printSelect_2").append("<option value=''></option>");
                    for(var key=0,l=data.length;key<l;key++){
                            if(data[key]['name']){
                                $(".AIRimport #printSelect_2").append("<option value='"+ data[key]['saveName']  + "' printcode='"+data[key]['printCode']+"' >"+data[key]['name']+"</option>");
                            }
                            $(".AIRimport #print input[name = 'printFormatId']").val(data[key]['printFormatId']);
                            $(".AIRimport #print input[name = 'type']").val(data[key]['typeName']);
                    }
                    /*$(".AIRimport #print button[name='print']").attr("saveName", data[0]['saveName']);
                    $(".AIRimport #print input[name='printTemplates']").val($(".AIRimport #printSelect_2").select2("data")[0].text);*/
                   $(".AIRimport #print button[name='print']").attr("saveName", data[0]['saveName']);
                    $(".AIRimport #print button[name='showPrint']").attr("saveName", data[0]['saveName']);
                    $(".AIRimport #print button[name='previewButton']").attr("saveName", data[0]['saveName']);
                    $(".AIRimport #print input[name='printTemplates']").val($(".AIRimport #printSelect_2").select2("data")[0].text);
                }
            });
        }

    });

    //打印模板select改变为上面的input框赋值
    $(".AIRimport #printSelect_2").on('change', function(){
        $(".AIRimport #print input[name='printTemplates']").val($(this).select2("data")[0].text);
        $(".AIRimport #print input[name='printCode']").val($(this).find('option:selected').attr('printcode'));
        $(".AIRimport #print button[name='print']").attr("saveName", $(this).val()).attr("realName", $(this).select2("data")[0].text);
        $(".AIRimport #print button[name='showPrint']").attr("saveName", $(this).val()).attr("realName", $(this).select2("data")[0].text);
        $(".AIRimport #print button[name='previewButton']").attr("saveName", $(this).val()).attr("realName", $(this).select2("data")[0].text);
    });

    //打印
    /*function print(d){
        var billImportId=$(d).attr('billImportId');
        var saveName=$(d).attr('saveName');
        var employeeId=JSON.parse($.cookie('loginingEmployee'))['user']['userId'];
        window.open(getPrintContextPath()+"/stimulsoft_viewerfx?stimulsoft_report_key=seawin/"+saveName+"&billImportId="+billImportId);
    }*/
    //打印
    $(".AIRimport div#print button[name='print']").on('click', function(){
        var employeeId=JSON.parse($.cookie('loginingEmployee'))['user']['userId'];
        if($(this).attr('saveName')||$(this).attr('realName')){//判断是否将打印信息填写完整
        	$.ajax({
            type: 'post',
            url: '/seawin-stimulsoft-report/aiReport/print.do',
            data: {
                billId: $(this).attr('billImportId'),
                reportName: $(this).attr('saveName'),
                realName: $(this).attr('realName'),
                employeeId: employeeId
            },
            success: function(data) {
                $(".AIRimport div#print iframe#printIframe").attr('src', '' + data);
                setTimeout(function(){$("#printIframe")[0].contentWindow.print()}, 500);
            },
            error: function(){
                callAlert('error');
            }
        });
        }else{
        	callAlert('请将打印信息填写完整');
        }
        
    });
    //导出
    $(".AIRimport div#print div.btn-group li").on('click', function(){
        var data = $(this).find('span').text();
        var type;
        if(data == '导出为pdf') {
            type = 'Pdf';
        } else if(data == '导出为Excel') {
            type = 'Excel';
        } else {
            type = 'Word'
        }
        var button = $(".AIRimport div#print button[name='showPrint']");
        var employeeId=JSON.parse($.cookie('loginingEmployee'))['user']['userId'];
        if(button.attr('saveName')||button.attr('realName')){
        	$.ajax({
            type: 'post',
            url: '/seawin-stimulsoft-report/aiReport/export.do',
            data: {
                billId: button.attr('billImportId'),
                reportName: button.attr('saveName'),
                realName: button.attr('realName'),
                employeeId: employeeId,
                exportType: type
            },
            success: function(res) { 
            	//window.open(res);
                if(type == "Pdf") {
                    $(".AIRimport a#download").attr("href","" + res);
                    $(".AIRimport a#download")[0].click();
                } else {
                    window.location.href=res;
                }
                callAlert('success');
            },
            error: function(res){
                callAlert('error');
            }
        });
        }else{
        	callAlert('请将打印信息填写完整');
        }
        
    });
    //预览
    $(".AIRimport div#print button[name='previewButton']").on('click', function(){
        var billId=$(this).attr('billImportId');
        var saveName=$(this).attr('saveName');
        var employeeId=JSON.parse($.cookie('loginingEmployee'))['user']['userId'];
        if(saveName){
        	window.open(getPrintContextPath()+"/stimulsoft_viewerfx?stimulsoft_report_key=seawin/"+saveName+"&billImportId="+billId+"&employeeId="+employeeId);        	
        }else{
        	callAlert('请将打印信息填写完整');
        }

    });
    return{
        //print:print
    }

})();

