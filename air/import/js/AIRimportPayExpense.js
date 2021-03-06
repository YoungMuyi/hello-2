//@ sourceURL=AIRimportPayExpense.js
var AIRimportPayExpense=(function(){
	var businessTable='air_bill_import';
    var businessData='';   //请求数据时需要的参数
	function initPayFee(id, htmlName, businessTable) {
        // 基础数据
        // 往来单位  应付
        
        //请求业务数据 businessData
        $.ajax({
            type: 'post',
            async:false,
            url: getContextPath() + 'accountExpense/getBusinessByIdAndTable.do',
            data: {"businessId": id, "businessTable": businessTable},
            success: function (data) {
                businessData = JSON.parse(data);
                console.log(businessData);
                AIRimportPayExpense.askData(id);
            }
        })
    }
	//页面加载
	function askData(id){
		
        $('.AIRimport div#imairExportPayable thead input[name="all"]').prop('checked',false);
        $('.AIRimport div#imexpReceivable thead input[name="all"]').prop('checked',false);
		//请求费用数据 應付費用
        $.ajax({
            type:'post',
            url: getContextPath() + 'accountExpense/listPayExpenseByIdAndType.do',
            //      contentType: "application/json;charset=UTF-8",
            data:{"businessId":id,"businessTable":businessTable},
            //async:false,
            success:function(data){
                data = JSON.parse(data);
                $(".AIRimport div#imairExportPayable tbody").empty();
                console.log(data.length);
                for(var i=0;i<data.length;i++){
                    var strTR=  '<tr  exchange_operate  class="active oldData" expenseBusinessId='+data[i]['expenseBusinessId']+'> '+
                        '<td><input type="checkbox"></td>'+
                        '<td>'+(i+1)+'</td>'+
                        '<td class="selOp" style="position: relative;">'+
                        '<select name="expenseNameSel" class="FeiYongDaiMa select2 select2-hidden-accessible form-control"tabindex="-1" aria-hidden="true" style="width: 160px;position: absolute;">'+
                        '</select>'+
                        '<input type="text" name="expenseCode" class="form-control" style="float: left;" value='+data[i]['expenseCode']+'>' +
                        '</td>'+
                        '<td>'+
                        '<input type="text" class="form-control" readonly="readonly" name="expenseName" value='+data[i]['expenseName']+'>'+
                        '</td>'+
                        '<td>'+
                        /*'<select name="customerCode" class="select2 select2-hidden-accessible form-control" tabindex="-1" aria-hidden="true" style="width: 120px;"></select>'+*/
                      /*  '<input type="text" name="cutomerCode" style="display: none;">'+
                        '<input type="text" name="customerName" style="display:none;" value='+data[i]['customerName']+'>'+*/
                        '<input type="text" name="customerCode" style="display: none;" value='+data[i]['customerCode']+'>'+
                        '<input type="text" name="customerName" class="form-control"  data-toggle="modal" data-target="#AIRIntercourseUnitModal" value='+data[i]['customerName']+'>'+
                        '</td>'+
                        '<td>'+
                        '<select name="currencyExpense" class="optionCurrency select2 select2-hidden-accessible form-control"tabindex="-1" aria-hidden="true" style="width:70px;">'+
                        '</select>'+
                        '</td>'+
                        '<td>'+
                        '<input name="amount"  class="form-control" value='+data[i]['amount']+'>'+
                        '</td>'+
                        '<td>'+
                        '<input name="unitPrice" class="form-control" value='+data[i]['unitPrice']+'>'+
                        '</td>'+
                        '<td>'+
                        '<select name="unit" class="form-control select2 select2-hidden-accessible" style="width:60px;">'+
                            '<option value="/BL">/BL</option>'+
                            '<option value="/单">/单</option>'+
                        '</select>'+
                        '</td>'+
                        '<td>'+
                           '<input name="amountExpense" class="form-control" value='+data[i]['amountExpense']+'>'+
                        '</td>'+
                        '<td>'+
                        '<select name="pC" class="form-control select2 select2-hidden-accessible" style="width: 60px;">'+
                            '<option value="PP">PP</option>'+
                            '<option value="C">C</option>'+
                        '</select>'+
                        '</td>'+
                        '<td style="text-align: center;"><input type="checkbox" name="payBill"></td>'+
                        '<td>'+
                             '<input name="salesmanName" class="form-control" value='+data[i]['accountBusinessTotal']['salesmanName']+'>'+
                        '</td>'+
                        '<td>'+
                              '<input name="statustwo" class="form-control" readonly="readonly" value='+data[i]['statustwo']+'>'+
                        '</td>'+
                        '<td>'+
                                 '<input name="statusone" class="form-control" readonly="readonly" value='+data[i]['statusone']+'>'+
                        '</td>'+
                        '<td>'+
                                 '<input name="confirmStatus" class="form-control" readonly="readonly" value='+data[i]['confirmStatus']+'>'+
                        '</td>'+
                        '<td>'+
                                '<input name="reconcileConfirmStatus" class="form-control" readonly="readonly" value='+data[i]['reconcileConfirmStatus']+'>'+
                        '</td>'+
                        '<td>'+
                              '<input name="remark" class="form-control" value='+data[i]['remark']+'>'+
                        '</td>'+
                        '</tr>';
                    var currencyExpense=data[i]['currencyExpense'];
                    var expenseNameSel=data[i]['expenseName'];
                    var unit=data[i]['unit'];
                    var pC=data[i]['pC'];


                    $(".AIRimport div#imairExportPayable tbody").append(strTR);

                    console.log(data[i]['payBill']);
                    if(data[i]['payBill']==1){
                        $(".AIRimport div#imairExportPayable tbody").find('tr:last input[name="payBill"]').prop('checked',true);
                    }

                    $(".AIRimport div#imairExportPayable tbody").find('tr:last .FeiYongDaiMa').select2({
                        data: AIRimport.FeiYongDaiMa,
                        placeholder:''
                      });/*.val(data[i]['expenseNameSel']).trigger("change");*/
                    console.log(data[i]['expenseName']);
                    $(".AIRimport div#imairExportPayable tbody").find('tr:last .optionCurrency').select2({
                        data:AIRimport.optionCurrency,
                        placeholder:''
                    }).val(data[i]['currencyExpense']).trigger('change');
                    console.log(data[i]['currencyExpense']);
                    $(".AIRimport div#imairExportPayable tbody").find('tr:last select[name="customerCode"]').select2({
                        data:AIRimport.customerNameSel,
                        placeholder:''
                    }).val(data[i]['customerCode']).trigger('change');
              //      console.log(data[i]['customerNameSel']);
                   $(".AIRimport div#imairExportPayable tbody").find('tr:last .select2').select2();
                   $(".AIRimport div#imairExportPayable tbody").find('tr:last select[name="unit"]').select2().val(data[i]['unit']).trigger('change');
                   $(".AIRimport div#imairExportPayable tbody").find('tr:last select[name="pC"]').select2().val(data[i]['pC']).trigger('change');
                    //console.log(currencyExpense+'*************************'+expenseNameSel);
                    $(".AIRimport div#imairExportPayable tbody").find('tr:last').find('select[name="currencyExpense"]').val(currencyExpense).trigger('change');
                    $(".AIRimport div#imairExportPayable tbody").find('tr:last').find('select[name="expenseNameSel"]').val(expenseNameSel).trigger('change');
                    $(".AIRimport div#imairExportPayable tbody").find('tr:last').find('select[name="unit"]').val(unit);
                    $(".AIRimport div#imairExportPayable tbody").find('tr:last').find('select[name="pC"]').val(pC);
                }
          //      FCLpayExpense.domBind();
                $('.AIRimport div.ZLmain>ul.nav-tabs>li.imcost').attr('changed',false);
            }
        })
        //请求应收费用数据
        $.ajax({
            type:'post',
            url: getContextPath() + 'accountExpense/listReceivableExpenseByIdAndType.do',
            //      contentType: "application/json;charset=UTF-8",
            data:{"businessId":id,"businessTable":AIRimportPayExpense.businessTable},
            success:function(data){
                data = JSON.parse(data);
                $(".AIRimport div#imexpReceivable tbody").empty();
                for(var i=0;i<data.length;i++){
                    var strTR=  '<tr  exchange_operate  class="active oldData" expenseId='+data[i]['expenseId']+'> '+
                        '<td><input type="checkbox"></td>'+
                        '<td>' + (i + 1) + '</td>' +
                        '<td class="selOp" style="position: relative;">' +
                        '<select name="expenseNameSel" class="FeiYongDaiMa select2 select2-hidden-accessible form-control" tabindex="-1" aria-hidden="true" style="width:100px;position:absolute;">' +
                        '</select>'+
                        '<input type="text" class="form-control" name="expenseCode" style="float:left;" value='+data[i]['expenseCode']+'>' +
                        '</td>'+
                        '<td>' +
                            '<input type="text" class="form-control" readonly="readonly" name="expenseName" value='+data[i]['expenseName']+' >'+
                      /*  '<select name="expenseName" class="form-control FeiYongDaiMa select2 select2-hidden-accessible"tabindex="-1" aria-hidden="true" style="width: 150px;">'+
                        '</select>'+*/
                        '</td>' +
                        '<td>' +
                          /*  '<input name="customerCode" style="display: none;">'+
                            '<input name="customerName" class="form-control" readonly="readonly" value='+data[i]['customerName']+'>'+*/
                        /*'<select name="customerCode" class="select2 select2-hidden-accessible form-control" tabindex="-1" aria-hidden="true" style="width:120px;"></select>'+*/
                        /*'<input type="text" class="form-control" style="display:none;" name="customerCode" value='+data[i]['customerCode']+'>'+
                        '<input type="text" class="form-control" name="customerName" value='+data[i]['customerName']+'>'+*/
                        	'<input type="text" class="form-control" style="display:none;" name="customerCode" value='+data[i]['customerCode']+'>'+
                        	'<input type="text" class="form-control" name="customerName" data-toggle="modal" data-target="#AIRReceivableUnitModal"  value='+data[i]['customerName']+'>'+
                        '</td>' +
                        '<td>' +
                        '<select name="currencyExpense" class="form-control optionCurrency select2 select2-hidden-accessible"tabindex="-1" aria-hidden="true" style="width:70px;">'+
                        '</select>'+
                        /*'<select name="currencyExpense">'+
                         FCLpayExpense.optionCurrency+
                         '</select>'+*/
                        '</td>' +
                        '<td>' +
                        '<input name="amount" class="form-control" value='+data[i]['amount']+'>'+
                        '</td>' +
                        '<td>' +
                        '<input name="unitPrice" class="form-control" value='+data[i]['unitPrice']+'>'+
                        '</td>' +
                        '<td>' +
                        '<select name="unit" class="form-control select2 select2-hidden-accessible" tabindex="-1" aria-hidden="true" style="width:60px;height:30px; ">' +
                        '<option value="BL">/BL</option>' +
                        '<option value="/单">/单</option>' +
                        '</select>' +
                        '</td>' +
                        '<td>' +
                        '<input class="form-control" name="amountExpense" value='+data[i]['amountExpense']+'>'+
                        '</td>' +
                        '<td>' +
                        '<select class="form-control select2 select2-hidden-accessible" name="PC" tabindex="-1" aria-hidden="true" style="width:60px;height: 30px;">' +
                        '<option value="PP">PP</option>' +
                        '<option value="C">C</option>' +
                     /*   '<option>…</option>' +*/
                        '</select >' +
                        '</td>' +
                        '<td>' +
                        '<input class="form-control" readonly="readonly" name="contact" value='+data[i]['accountBusinessTotal']['contact']+'>' +
                        '</td>' +
                        '<td>' +
                        '<input class="form-control" readonly="readonly" name="creatorName" value='+data[i]['baseModel']['creatorName']+'>' +
                        '</td>' +
                        '<td>' +
                        '<input class="form-control" readonly="readonly" name="amendTime" value='+data[i]['amendTime']+'>' +
                        '</td>' +
                        '<td>' +
                        '<input class="form-control" readonly="readonly" name="billingApplyNumber" value='+data[i]['accountReceivableInvoice']['billingApplyNumber']+'>'+
                        '</td>' +
                        '<td>' +
                        '<select class="form-control select2 select2-hidden-accessible" name="billingApplyStatus" tabindex="-1" style="width:60px;height:30px;" aria-hidden="true">' +
                        '<option value="未开">未开</option>' +
                        '<option value="已开">已开</option>' +
                        '<option value="作废">作废</option>' +
                        '<option value="审核">审核</option>' +
                        '</select>' +
                        '</td>' +
                        '<td>' +
                        '<input class="form-control" readonly="readonly" name="contractNumber" value='+data[i]['contractNumber']+'>' +
                        '</td>' +
                        '<td>' +
                        '<input class="form-control" readonly="readonly" name="statusone" value='+data[i]['statusone']+'>' +
                        '</td>' +
                        '</tr>';
                    var currencyExpense=data[i]['currencyExpense'];
                    var expenseNameSel=data[i]['expenseName'];
                    $(".AIRimport div#imexpReceivable tbody").append(strTR);
                    $(".AIRimport div#imexpReceivable tbody").find('tr:last .FeiYongDaiMa').select2({
                        data: AIRimport.FeiYongDaiMa,
                        placeholder:''
                    }).val(data[i]['expenseName']).trigger('change');
                    $(".AIRimport div#imexpReceivable tbody").find('tr:last .optionCurrency').select2({
                        data:AIRimport.optionCurrency,
                        placeholder:''
                    }).val(data[i]['currencyExpense']).trigger('change');
                 // 已变为input  应收费用 往来单位为不可编辑的input
                    /*$(".AIRimport div#imexpReceivable tbody").find('tr:last select[name="customerCode"]').select2({
                        data:AIRexport.CorrespondentUnit,
                        placeholder:''
                    }).val(data[i]['customerCode']).trigger('change');*/
                    $(".AIRimport div#imexpReceivable tbody").find('tr:last .select2').select2();
                    $(".AIRimport div#imexpReceivable tbody").find('tr:last').find('select[name="currencyExpense"]').val(currencyExpense).trigger('change');
                    $(".AIRimport div#imexpReceivable tbody").find('tr:last').find('select[name="expenseNameSel"]').val(expenseNameSel).trigger('change');
                    $('.AIRimport div.ZLmain>ul.nav-tabs>li.imcost').attr('changed',false);
                }
                //FCLpayExpense.domBind();
                AIRimportPayExpense.totalExpense($(".AIRimport div#imairExportPayable tbody").find('tr:last .optionCurrency').eq(0));
                AIRimportPayExpense.totalExpense($(".AIRimport div#imexpReceivable tbody").find('tr:last .optionCurrency').eq(0));

                $('.AIRimport div.ZLmain>ul.nav-tabs>li.imcost').attr('changed',false);
                //让页面只读
           //     $(".FCLexport div#imexpReceivable tbody ").find('input,select').attr('disabled',true);
            }
        })

	}
	//保存
	function saveData(){
		
	    var payData=[];
	    //新增数据
        $.each($(".AIRimport div#imairExportPayable tbody").find('tr.newData'),function (i,tr) {
            console.log($(this));
            var obj={'exchange_operate':'insert','businessTotalId':businessData['businessTotalId']};
            console.log($(this).find('select[name="customerCode"]').next().find('span.select2-selection__rendered').text()+'******************8888888');
            obj['cutomerName']=$(this).find('select[name="customerCode"]').next().find('span.select2-selection__rendered').text();
            $.each($(this).find('select,input'),function (j,input) {
               if($(this).attr('type')=='checkbox'){
                    if($(this).attr('name')==undefined){

                    }else if($(this).get(0).checked){
                        obj[$(this).attr('name')]=1;
                    }else {
                        obj[$(this).attr('name')]=0;
                    }
               }else{
                   obj[$(this).attr('name')]=$(this).val();
               }
            });
            console.log(obj);
            payData.push(obj);
        })
        console.log(payData);
        //删除的数据
        $.each($(".AIRimport div#imairExportPayable tbody").find('tr.delData'),function (i,tr) {
            console.log($(this));
            var obj={'exchange_operate':'delete','businessTotalId':businessData['businessTotalId'],'expenseBusinessId':$(this).attr('expenseBusinessId')};
            payData.push(obj);
        })
        console.log(payData);
        //修改的数据 oldData
        $.each($('.AIRimport div#imairExportPayable tbody').find('tr.oldData'),function (i,tr) {
            console.log(this);
            var obj={'expenseBusinessId':$(this).attr('expenseBusinessId')}
            console.log($(this).find('select[name="customerCode"]').next().find('span.select2-selection__rendered').text()+'******************8888888');
            obj['cutomerName']=$(this).find('select[name="customerCode"]').next().find('span.select2-selection__rendered').text();
            $.each($(this).find('select,input'),function (j,input) {
                if($(this).attr('type')=='checkbox'){
                    if($(this).attr('name')==undefined){

                    }else if($(this).get(0).checked){
                        obj[$(this).attr('name')]=1;
                    }else {
                        obj[$(this).attr('name')]=0;
                    }
                }else{
                    obj[$(this).attr('name')]=$(this).val();
                }
            });
            payData.push(obj);
        })
        console.log(payData);
        $('.AIRimport div#imairExportPayable thead input[name="all"]').prop('checked',false);
        $.ajax({
            type: 'post',
            url: getContextPath() + '/accountExpense/savePayExpense.do',
            contentType: "application/json;charset=UTF-8",
            async: false,
            data: JSON.stringify(payData),
            success: function (data) {
                console.log(JSON.parse(data)['message']);
                data = JSON.parse(data);
                if(data['code']==0){
                    //应付保存成功后   进而保存应收
                    (function () {
                        var receiveData=[];
                        //新增数据
                        $.each($(".AIRimport div#imexpReceivable tbody").find('tr.newData'),function (i,tr) {
                            console.log($(this));
                            var obj={'exchange_operate':'insert','businessTotalId':businessData['businessTotalId']};
                     /*       obj['cutomerName']=$(this).find('select[name="customerCode"]').next().find('sapn.select2-selection__rendered').text();*/
                            $.each($(this).find('select,input'),function (j,input) {
                                if($(this).attr('type')=='checkbox'){
                                    if($(this).attr('name')==undefined){

                                    }else if($(this).get(0).checked){
                                        obj[$(this).attr('name')]=1;
                                    }else {
                                        obj[$(this).attr('name')]=0;
                                    }
                                }else{
                                    obj[$(this).attr('name')]=$(this).val();
                                }
                            });
                            console.log(obj);
                            receiveData.push(obj);
                        })
                        console.log(receiveData);
                        //删除的数据
                        $.each($(".AIRimport div#imexpReceivable tbody").find('tr.delData'),function (i,tr) {
                            console.log($(this));
                            var obj={'exchange_operate':'delete','businessTotalId':businessData['businessTotalId'],'expenseId':$(this).attr('expenseId')};
                            receiveData.push(obj);
                        })
                        console.log(payData);
                        //修改的数据 oldData
                        $.each($('.AIRimport div#imexpReceivable tbody').find('tr.oldData'),function (i,tr) {
                            console.log(this);
                            var obj={'expenseId':$(this).attr('expenseId')}
                            console.log($(this).find('select[name="customerCode"]').next().find('span.select2-selection__rendered').text()+'666666666666666666666666666666666')
                         /*   obj['cutomerName']=$(this).find('select[name="customerCode"]').next().find('span.select2-selection__rendered').text();*/
                            $.each($(this).find('select,input'),function (j,input) {
                                if($(this).attr('type')=='checkbox'){
                                    if($(this).attr('name')==undefined){

                                    }else if($(this).get(0).checked){
                                        obj[$(this).attr('name')]=1;
                                    }else {
                                        obj[$(this).attr('name')]=0;
                                    }
                                }else{
                                    obj[$(this).attr('name')]=$(this).val();
                                }
                            });
                            receiveData.push(obj);
                        })
                        console.log(receiveData);
                        $.ajax({
                            type: 'post',
                            url: getContextPath() + '/accountExpense/saveReceivableExpense.do',
                            contentType: "application/json;charset=UTF-8",
                            async: false,
                            data: JSON.stringify(receiveData),
                            success: function (data) {
                                data = JSON.parse(data);
                                callAlert(data['message']);
                                $('.AIRimport div.ZLmain>ul.nav-tabs>li.imcost').attr('changed',false);
                                if( $('.AIRimport div.ZLmain>ul.nav-tabs>li.cost').hasClass('active')){
                                    AIRimport.AIRimportDetail($('.AIRimport ul.Big li.active').attr('billid'),5);
                                }else{

                                }
                            }
                        })
                    })()
                }
         //       callAlert(data['message']);

            }
        })
	}
	//新增功能
    function addData(d){
    	if($(d).parents('div#imairExportPayable').length==1){
    		var tr='<tr exchange_operate="insert" class="active newData">'+
                '<td><input type="checkbox"></td>'+
                '<td></td>'+
                '<td class="selOp" style="position: relative;">' +
                    '<select name="expenseNameSel" class="FeiYongDaiMa select2 select2-hidden-accessible form-control" tabindex="-1" aria-hidden="true" style="width: 160px;position: absolute;"></select>'+
                    '<input type="text" name="expenseCode" style="float: left;" value="" class="form-control"></td>'+
                '<td>'+
                    '<input type="text" class="form-control" readonly="readonly" name="expenseName" value="">'+
              /*  '<select name="expenseName" class="FeiYongDaiMa select2 select2-hidden-accessible form-control"tabindex="-1" aria-hidden="true" style="width: 150px;">'+
                '</select>'+*/
                '</td>'+
                '<td>'+
                /*'<select name="customerCode" class="select2 select2-hidden-accessible form-control" tabindex="-1" aria-hidden="true" style="width: 120px;"></select>'+*/
             /*   '<input type="text" name="customerName" style="display: none;" class="form-control" value="">'+
                '<input type="text" name="customerCode" style="display: none;">'+*/
                	'<input type="text" name="customerName"  class="form-control" data-toggle="modal" data-target="#AIRIntercourseUnitModal">'+
                	'<input type="text" name="customerCode" style="display: none;">'+
                '</td>'+
                '<td>'+
                '<select name="currencyExpense" class="optionCurrency select2 select2-hidden-accessible form-control"tabindex="-1" aria-hidden="true" style="width:70px;">'+
                '</select>'+
                '</td>'+
                '<td>'+
                '<input name="amount" class="form-control" value="">'+
                '</td>'+
                '<td>'+
                '<input name="unitPrice" class="form-control" value="">'+
                '</td>'+
                '<td>'+
                '<select name="unit" class="form-control select2" style="width:60px;height: 30px;">'+
                    '<option value="/BL">/BL</option>'+
                    '<option value="/单">/单</option>'+
                '</select>'+
                '</td>'+
                '<td>'+
                '<input name="amountExpense" class="form-control" value="">'+
                '</td>'+
                '<td>'+
                    '<select name="pC" class="form-control select2 select2-hidden-accessible" style="width: 60px;">'+
                    '<option value="PP">PP</option>'+
                    '<option value="C">C</option>'+
                    '</select>'+
                '</td>'+
                '<td class="text-center">' +
                    '<input type="checkbox" name="payBill">'+
                '</td>'+
                '<td>'+
                '<input name="salesmanName" value="" class="form-control" readonly="readonly">'+
                '</td>'+
                '<td>'+
                '<input name="statustwo" class="form-control" readonly="readonly" value='+"未确认"+'>'+
                '</td>'+
                '<td>'+
                '<input name="statusone" class="form-control" readonly="readonly" value='+"未确认"+'>'+
                '</td>'+
                '<td>'+
                '<input name="confirmStatus" class="form-control" readonly="readonly" value='+"未确认"+'>'+
                '</td>'+
                '<td>'+
                '<input name="reconcileConfirmStatus" class="form-control" readonly="readonly" value='+"未确认"+'>'+
                '</td>'+
                '<td>'+
                '<input name="remark" class="form-control" value="">'+
                '</td>'+
                '</tr>';
        $('.AIRimport div#imairExportPayable table.table tbody').find('tr').css('background','transparent').removeClass('sel');
        $('.AIRimport div#imairExportPayable table.table tbody').append(tr);
        //$('.AIRimport div#imairExportPayable table.table tbody tr:last').css('background','lightblue').addClass('sel');
        
        //初始化下拉框
        $(".AIRimport div#imairExportPayable tbody").find('tr:last .FeiYongDaiMa').select2({
                data: AIRimport.FeiYongDaiMa,
                placeholder:''
            });
        $(".AIRimport div#imairExportPayable tbody").find('tr:last .optionCurrency').select2({
                data:AIRimport.optionCurrency,
                placeholder:''
        }).val('RMB').trigger('change');
        $(".AIRimport div#imairExportPayable tbody").find('tr:last select[name="customerCode"]').select2({
                data:AIRimport.customerNameSel,
                placeholder:''
        }).val(businessData['customerCode']+'|'+businessData['contactCompany']).trigger('change');
        $(".AIRimport div#imairExportPayable tbody").find('tr:last .select2').select2();
        var salesmanName=businessData['salesmanName'];
        $(".AIRimport div#imairExportPayable tbody").find("tr:last input[name='salesmanName']").val(salesmanName);
        //排序
        AIRimportPayExpense.reorderByCon('imairExportPayable');
    	}else{
    		var tr= '<tr  exchange_operate="insert"  class="active newData"> '+
                    '<td><input type="checkbox"></td>'+
                    '<td></td>' +
                    '<td class="selOp" style="position: relative;">' +
                         '<select name="expenseNameSel" class="FeiYongDaiMa select2 select2-hidden-accessible form-control" tabindex="-1" aria-hidden="true" style="width: 160px;position: absolute;"></select>'+
                        '<input type="text" class="form-control" style="float: left;" name="expenseCode" value="">' +
                     '</td>'+
                    '<td>' +
                         '<input type="text" class="form-control" readonly="readonly" name="expenseName" value="">'+
                        /*'<select name="expenseName" class="form-control FeiYongDaiMa select2 select2-hidden-accessible" tabindex="-1" aria-hidden="true" style="width: 150px;">'+
                        '</select>'+*/
                    '</td>' +
                    '<td>' +
                    /*    '<input type="text" name="customerCode" style="display:none;" value='+businessData['customerCode']+' >'+
                        '<input type="text" name="customerName" readonly="readonly" class="form-control" value='+businessData['contactCompany']+'>'+*/
                        /*'<select name="customerCode" class="select2 select2-hidden-accessible form-control" tabindex="-1" aria-hidden="true" style="width:120px;"></select>'+*/
                         /*'<input type="text" class="form-control" name="customerName" value='+businessData['contactCompany']+'>'+
                         '<input type="text" class="form-control" name="customerCode" style="display: none;" value='+businessData['customerCode']+'>'+*/
                    	 '<input type="text" class="form-control" name="customerName" data-toggle="modal" data-target="#AIRReceivableUnitModal"  value='+businessData['contactCompany']+'>'+
                         '<input type="text" class="form-control" name="customerCode" style="display: none;" value='+businessData['customerCode']+'>'+
                    '</td>' +
                    '<td>' +
                        '<select name="currencyExpense" class="form-control optionCurrency select2 select2-hidden-accessible"tabindex="-1" aria-hidden="true" style="width:70px;">'+
                        '</select>'+
                    '</td>' +
                    '<td>' +
                         '<input name="amount" class="form-control" value="">'+
                    '</td>' +
                    '<td>' +
                           '<input name="unitPrice" class="form-control" value="">'+
                    '</td>' +
                    '<td>' +
                        '<select name="unit" class="form-control select2 select2-hidden-accessible" tabindex="-1" aria-hidden="true" style="width:60px;height: 30px;">' +
                        '<option value="BL">/BL</option>' +
                        '<option value="/单">/单</option>' +
                        '</select>' +
                    '</td>' +
                    '<td>' +
                          '<input class="form-control" name="amountExpense" value="">'+
                    '</td>' +
                    '<td>' +
                            '<select class="form-control  select2 select2-hidden-accessible" aria-hidden="true" style="width:60px;height: 30px;" name="PC">' +
                            '<option value=""></option>'+
                            '<option value="PP">PP</option>' +
                            '<option value="C">C</option>' +
                            /*'<option>…</option>' +*/
                            '</select >' +
                    '</td>' +
                    '<td>' +
                            '<input class="form-control" name="contact" readonly="readonly" value='+businessData['contact']+'>' +
                    '</td>' +
                    '<td>' +
                            '<input class="form-control" name="creatorName" readonly="readonly" value='+JSON.parse($.cookie()['loginingEmployee'])['user']['username']+'>' +
                    '</td>' +
                    '<td>' +
                            '<input class="form-control" readonly="readonly" name="amendTime" value='+((new Date).toLocaleDateString()).replace(/\//g,'\-')+'>' +
                    '</td>' +
                    '<td>' +
                            '<input class="form-control" readonly="readonly" name="billingApplyNumber" value="">'+
                    '</td>' +
                    '<td>' +
                            '<select class="form-control select2 select2-hidden-accessible" aria-hidden="true" style="width:60px;height:30px;" name="billingApplyStatus">' +
                            '<option value="未开">未开</option>' +
                            '<option value="已开">已开</option>' +
                            '<option value="作废">作废</option>' +
                            '<option value="审核">审核</option>' +
                            '</select>' +
                    '</td>' +
                    '<td>' +
                           '<input class="form-control" readonyl="readonly" name="contractNumber" value="">' +
                    '</td>' +
                    '<td>' +
                            '<input class="form-control" readonly="readonly" name="statusone" value="">' +
                    '</td>' +
                    '</tr>';
            //alert(businessData['contactCompany']);
            $('.AIRimport div#imexpReceivable table tbody').find('tr').css('background','transparent').removeClass('sel');
            //  $(tr).css('background','lightblue').addClass('sel');
            $('.AIRimport div#imexpReceivable table tbody').append(tr);
            //$('.AIRimport div#imexpReceivable table tbody tr:last').css('background','lightblue').addClass('sel');
            //给select2赋值
            $('.AIRimport div#imexpReceivable tbody').find('tr:last .FeiYongDaiMa').select2({
                data:AIRimport.FeiYongDaiMa,
                placeholder:''
            });
            $('.AIRimport div#imexpReceivable tbody ').find('tr:last .optionCurrency').select2({
                data:AIRimport.optionCurrency,
                placeholder:''
            }).val('RMB').trigger('change');
            /*$('.AIRexport div#imexpReceivable tbody').find('tr:last select[name="customerCode"]').select2({
                data:AIRexport.CorrespondentUnit,
                placeholder:''
            });*/
            $('.AIRimport div#imexpReceivable tbody').find('tr:last .select2').select2();

            AIRimportPayExpense.reorderByCon('imexpReceivable');
    	}
    	
    }
    //删除功能
    function delData(d){
    	if($(d).parents('div#imairExportPayable').length==1){
            //删除 应付费用数据
            var trArr=$('.AIRimport div#imairExportPayable table tbody tr').find('td:eq(0)').find('input:checked'); //选中的数据
            $.each(trArr,function (i,input) {
                var trNow=$(this).parents('tr');
                if(trNow.attr('exchange_operate')=='insert'){
                    trNow.remove();
                }else if(trNow.attr('exchange_operate')=='delete'){
                    //这里有全选 功能 已经删除（隐藏）的数据还有可能被选中
                }else{
                    trNow.attr('exchange_operate','delete').css('display','none').removeClass('active').removeClass('oldData').addClass('delData');
                }
            })
            AIRimportPayExpense.reorderByCon('imairExportPayable');
        }else{
        	//删除 应收费用数据
            var trArr=$('.AIRimport div#imexpReceivable table tbody tr').find('td:eq(0)').find('input:checked'); //选中的数据
            $.each(trArr,function (i,input) {
                var trNow=$(this).parents('tr');
                if(trNow.attr('exchange_operate')=='insert'){
                    trNow.remove();
                }else if(trNow.attr('exchange_operate')=='delete'){
                    //这里有全选 功能 已经删除（隐藏）的数据还有可能被选中
                }else{
                    trNow.attr('exchange_operate','delete').css('display','none').removeClass('active').removeClass('oldData').addClass('delData');
                }
            })
            AIRimportPayExpense.reorderByCon('imexpReceivable');
        }
    }
    function reorderByCon(d) {
        var ConArr = $('.AIRimport div#'+d+'  table tbody tr.active');
        for (var i = 0; i < ConArr.length; i++) {
            $(ConArr[i]).find('td:eq(1)').text(i + 1);
        }
    }
    function checkAll(d){
        if(d.checked){
            $(d).parents('table').find('tbody tr.active').find('td:eq(0) input').prop('checked',true);
        }else{
            $(d).parents('table').find('tbody tr.active').find('td:eq(0) input').prop('checked',false);
        }
    }
    //费用合计
    function totalExpense(d) {
        console.log(d);
        var USD=0;
        var RMB=0;
        $.each($(d).parents('table').find('tbody tr.active'),function (i,tr) {
            console.log($(this).find('select[name="currencyExpense"]').val());
            var num=Number($(this).find('input[name="amountExpense"]').val());
            if($(this).find('select[name="currencyExpense"]').val()=='USD'){
                USD=USD+(num?num:0);
            }else if($(this).find('select[name="currencyExpense"]').val()=='RMB'){
                RMB=RMB+(num?num:0);
            }
        });
        console.log(USD+'****'+RMB);
        //修改USD合计和RMB合计的值
        if($(d).parents('div#imairExportPayable').length==1){
            $('.AIRimport #imcost div#imairExportPayable div.text-right input[name="USDTotal"]').val(USD);
            //$('.AIRexport #financeTC input#USDfinancePay').val(USD);
            $('.AIRimport #imcost div#imairExportPayable div.text-right input[name="RMBTotal"]').val(RMB);
        }else{
            $('.AIRimport #imcost div#imexpReceivable div.text-right input[name="USDTotal"]').val(USD);
            $('.AIRimport #imcost div#imexpReceivable div.text-right input[name="RMBTotal"]').val(RMB);
        }
    }
    //选中变蓝  应付费用和应收费用
    /*$('.AIRimport div#imcost div#imairExportPayable table tbody,.AIRimport div#imexpReceivable table tbody').on('click', 'tr td', function () {
        $(this).parents('table').find('tr').css('background', 'transparent').removeClass('sel');
        //    $('.FCLexport div#imcost div#expPayable  table tbody').find('tr').css('background', 'transparent').removeClass('sel');
        $(this).parents('tr').css('background', 'lightblue').addClass('sel');
    });*/
    //点击下拉框选项给输入框赋值
    $('.AIRimport div#imcost div#imairExportPayable table tbody,.AIRimport div#imcost div#imexpReceivable table tbody').on('change',' tr td select[name="expenseNameSel"]',function () {
       //     alert('已改变改变');
            console.log($(this).val());
            if($(this).val()){
                console.log($(this).val().split(' | '));
                var strArr=$(this).val().split(' | ');
                $(this).parent('td').find('input[name="expenseCode"]').val(strArr[0]);
                $(this).parent('td').next('td').find('input').val(strArr[1]);
            }
        });
    //取消全选
    $('.AIRimport div#imcost div#imairExportPayable table tbody,.AIRimport div#imcost div#imexpReceivable table tbody').on('click','tr td input',function () {
            if($(this).attr('name')==undefined){
                console.log($(this).prop('checked'));
                $(this).parents('table').find('thead tr td input[name="all"]').prop('checked',false);
            }else{

            }
        });
    //根据单价和数量设置金额的值
    $('.AIRimport div#imairExportPayable table tbody,.AIRimport div#imexpReceivable table tbody').on('input','input[name="amount"],input[name="unitPrice"]',function () {
       //     alert('哼');
            console.log(Number($(this).parents('tr').find('input[name="amount"]').val()));
            console.log(Number($(this).parents('tr').find('input[name="unitPrice"]').val()));
            var amountNum=Number($(this).parents('tr').find('input[name="amount"]').val());
            var unitPriceNum=Number($(this).parents('tr').find('input[name="unitPrice"]').val());
            if(amountNum*unitPriceNum){
                $(this).parents('tr').find('input[name="amountExpense"]').val(amountNum*unitPriceNum).trigger('input').prop('readonly',true);
            }else{
                if(amountNum||unitPriceNum){
                    $(this).parents('tr').find('input[name="amountExpense"]').val('').prop('readonly',true);
                }else{
                    $(this).parents('tr').find('input[name="amountExpense"]').val('').prop('readonly',false);
                }

            }
        });
    //修改金额时 修改对应的合计内容
        $('.AIRimport div#imairExportPayable table tbody,.AIRimport div#imexpReceivable table tbody').on('input','input[name="amountExpense"]',function () {
            //判断修改的是USD和RMB
            AIRimportPayExpense.totalExpense(this);
        });
        //修改货币类型时 修改对应的合计内容
        $('.AIRimport div#imairExportPayable table tbody,.AIRimport div#imexpReceivable table tbody').on('change','select[name="currencyExpense"]',function () {
            //修改对应的合计
            AIRimportPayExpense.totalExpense(this);
        });
        //确认提交
    /*function confirmationSubmission() {
        var payData=[];
        //新增数据
        $.each($(".AIRimport div#imairExportPayable tbody").find('tr.newData'),function (i,tr) {
            console.log($(this));
            var obj={'exchange_operate':'insert','businessTotalId':businessData['businessTotalId']};
            console.log($(this).find('select[name="customerCode"]').next().find('span.select2-selection__rendered').text()+'******************8888888');
            obj['cutomerName']=$(this).find('select[name="customerCode"]').next().find('span.select2-selection__rendered').text();
            $.each($(this).find('select,input'),function (j,input) {
                if($(this).attr('type')=='checkbox'){
                    if($(this).attr('name')==undefined){

                    }else if($(this).get(0).checked){
                        obj[$(this).attr('name')]=1;
                    }else {
                        obj[$(this).attr('name')]=0;
                    }
                }else{
                    obj[$(this).attr('name')]=$(this).val();
                }
            });
            console.log(obj);
            payData.push(obj);
        })
        console.log(payData);
        //删除的数据
        $.each($(".AIRimport div#imairExportPayable tbody").find('tr.delData'),function (i,tr) {
            console.log($(this));
            var obj={'exchange_operate':'delete','businessTotalId':businessData['businessTotalId'],'expenseBusinessId':$(this).attr('expenseBusinessId')};
            payData.push(obj);
        })
        console.log(payData);
        //修改的数据 oldData
        $.each($('.AIRimport div#imairExportPayable tbody').find('tr.oldData'),function (i,tr) {
            console.log(this);
            var obj={'expenseBusinessId':$(this).attr('expenseBusinessId')}
            console.log($(this).find('select[name="customerCode"]').next().find('span.select2-selection__rendered').text()+'******************8888888');
            obj['cutomerName']=$(this).find('select[name="customerCode"]').next().find('span.select2-selection__rendered').text();
            $.each($(this).find('select,input'),function (j,input) {
                if($(this).attr('type')=='checkbox'){
                    if($(this).attr('name')==undefined){

                    }else if($(this).get(0).checked){
                        obj[$(this).attr('name')]=1;
                    }else {
                        obj[$(this).attr('name')]=0;
                    }
                }else{
                    obj[$(this).attr('name')]=$(this).val();
                }
            });
            payData.push(obj);
        })
        console.log(payData);
        var workFlow={};
        workFlow['salesmanId']=businessData['salesmanId'];
        //workFlow['procInstId']=$('.AIRexport ul.Big li.active').attr('procinstid');
        workFlow['billId']=$('.AIRimport ul.Big li.active').attr('billId');
        $.ajax({
            url:getShipContextPath()+'shippingWorkFlow/submitFeeAudit.do',
            type:'post',
           // contentType: "application/json;charset=UTF-8",
            data:{'expense':JSON.stringify(payData),'wf':JSON.stringify(workFlow),'expenseType':1,'businessTotalId':JSON.stringify(businessData['businessTotalId'])},
            success:function (data) {
             //   console.log(data);
                data=JSON.parse(data);
                alert('提交成功');
                //callAlert(data['message']);
            }
        })
    }*/
   //提交
   function confirmationSubmission() {
        if($('.AIRimport div.ZLmain>ul.nav-tabs>li.imcost').attr('changed')=='true'){
            var con=confirm('是否保存页面的修改');
            if(con){
                AIRimportPayExpense.saveData();
            }else{
                var payData=[];
                //确认提交数据
                $.each($('.AIRimport div#imairExportPayable tbody tr').find('td:eq(0)').find('input:checked'),function (i,td) {
                    console.log(this);
                    console.log($(this).parents('tr'));
                    var $tr=$(this).parents('tr');
                    var obj={'expenseBusinessId':$tr.attr('expenseBusinessId')}
                    console.log($tr.find('select[name="customerCode"]').next().find('span.select2-selection__rendered').text()+'******************8888888');
                    $.each($tr.find('select,input'),function (j,input) {
                        if($(this).attr('type')=='checkbox'){
                            if($(this).attr('name')==undefined){

                            }else if($(this).get(0).checked){
                                obj[$(this).attr('name')]=1;
                            }else {
                                obj[$(this).attr('name')]=0;
                            }
                        }else{
                            obj[$(this).attr('name')]=$(this).val();
                        }
                    });
                    payData.push(obj);
                })
                console.log(payData);
                var workFlow={};
                workFlow['salesmanId']=businessData['salesmanId'];
                //workFlow['procInstId']=$('.AIRexport ul.Big li.active').attr('procinstid');
                workFlow['billId']=$('.AIRimport ul.Big li.active').attr('billId');
                $.ajax({
                    url:getShipContextPath()+'shippingWorkFlow/submitFeeAudit.do',
                    type:'post',
                    data:{'expense':JSON.stringify(payData),'wf':JSON.stringify(workFlow),'expenseType':1,'businessTotalId':JSON.stringify(businessData['businessTotalId'])},
                    success:function (data) {
                        //   console.log(data);
                        data=JSON.parse(data);
                        callAlert(data['message']);
                        AIRimport.AIRimportDetail($(AIRimport.ULname+' li.active').attr('billid'),5);
                    }
                })
            }
        }else{
            var payData=[];
            //确认提交数据
            $.each($('.AIRimport div#imairExportPayable tbody tr').find('td:eq(0)').find('input:checked'),function (i,td) {
                console.log(this);
                console.log($(this).parents('tr'));
                var $tr=$(this).parents('tr');
                var obj={'expenseBusinessId':$tr.attr('expenseBusinessId')}
                console.log($tr.find('select[name="customerCode"]').next().find('span.select2-selection__rendered').text()+'******************8888888');
                $.each($tr.find('select,input'),function (j,input) {
                    if($(this).attr('type')=='checkbox'){
                        if($(this).attr('name')==undefined){

                        }else if($(this).get(0).checked){
                            obj[$(this).attr('name')]=1;
                        }else {
                            obj[$(this).attr('name')]=0;
                        }
                    }else{
                        obj[$(this).attr('name')]=$(this).val();
                    }
                });
                payData.push(obj);
            })
            console.log(payData);
            var workFlow={};
            workFlow['salesmanId']=businessData['salesmanId'];
            //workFlow['procInstId']=$('.FCLexport ul.Big li.active').attr('procinstid');
            workFlow['billId']=$('.AIRimport ul.Big li.active').attr('billId');
            $.ajax({
                url:getShipContextPath()+'shippingWorkFlow/submitFeeAudit.do',
                type:'post',
                data:{'expense':JSON.stringify(payData),'wf':JSON.stringify(workFlow),'expenseType':1,'businessTotalId':JSON.stringify(businessData['businessTotalId'])},
                success:function (data) {
                    //   console.log(data);
                    data=JSON.parse(data);
                    callAlert(data['message']);
                    AIRimport.AIRimportDetail($(AIRimport.ULname+' li.active').attr('billid'),5);
                }
            })
        }

    }
    //应付模态框赋值
    $('.AIRimport div#AIRIntercourseUnitModal').on('click','div.box-body table#IntercourseUnitTable tbody tr td',function(){
            $(this).parents('tbody').find('tr').removeClass('selNow');
            $(this).parents('tr').addClass('selNow');
        });
        $('.AIRimport div#AIRIntercourseUnitModal').on('dblclick','div.box-body table#IntercourseUnitTable tbody tr.selNow',function () {
            var IntercourseUnitData=AIRimport.AIRIntercourUnit_table.rows('.selNow').data()[0];
            var trSel=$('.AIRimport div.imcost div#imairExportPayable table').find('tbody tr.sel');
            console.log(trSel);
            trSel.find('td input[name="customerName"]').val(IntercourseUnitData['customerNameCn']);
            trSel.find('td input[name="customerCode"]').val(IntercourseUnitData['customerCode']);
            $('.AIRimport div#AIRIntercourseUnitModal').modal('hide');
        })
        //应收模态框
        $('.AIRimport div#AIRReceivableUnitModal').on('click','div.box-body table#ReceivableUnitTable tbody tr td',function () {
            $(this).parents('tbody').find('tr').removeClass('selNow');
            $(this).parents('tr').addClass('selNow');
        });
        $('.AIRimport div#AIRReceivableUnitModal').on('dblclick','div.box-body table#ReceivableUnitTable tbody tr.selNow',function () {
            var ReceivableUnitData=AIRimport.AIRReceivableUnit_table.rows('.selNow').data()[0];
            var trSel=$('.AIRimport div.imcost div#imexpReceivable table').find('tbody tr.sel');
            trSel.find('td input[name="customerName"]').val(ReceivableUnitData['customerNameCn']);
            trSel.find('td input[name="customerCode"]').val(ReceivableUnitData['customerCode']);
            console.log(ReceivableUnitData['customerNameCn']);
            $('.AIRimport div#AIRReceivableUnitModal').modal('hide');
        });
    //点击表格 选中该行 添加sel类
        $('.AIRimport div#imcost table').on('click','tbody tr td',function () {
            $(this).parents('tbody').find('tr').removeClass('sel');
            $(this).parents('tr').addClass('sel');
        });
    //监听内容页面是否修改
        $('.AIRimport div#imcost').on('change','section input,section textarea,section select',function () {
     //       alert('&&&')
            if($(this).attr('name')=='all'){
                //全选按钮    操作不算修改页面内容
            }else{
                if($(this).attr('name')){
                    $('.AIRimport div.ZLmain>ul.nav-tabs>li.imcost').attr('changed',true);
                }else{

                }
            }
        })
    return{
    	addData:addData,
    	reorderByCon:reorderByCon,
    	initPayFee:initPayFee,
    	delData:delData,
    	checkAll:checkAll,
    	totalExpense:totalExpense,
    	saveData:saveData,
    	askData:askData,
    	confirmationSubmission:confirmationSubmission
    }
})();
$(function () {
    $('.AIRimport div#AIRIntercourseUnitModal button.search_reset').on('click',function () {
        $('.AIRimport div#AIRIntercourseUnitModal form#IntercourseUnitForm')[0].reset();
        AIRimport.AIRIntercourUnit_table.ajax.reload();
    })
})
