//@ sourceURL=rule_condition.js
var ruleConditionList = (function () {
    var GlobalcustomerId;
    var ruleConditionList_table;
    var viewRuleConditionList_table;
    var viewIndexSetList_table;
    var editIndexSetList_table;
    var loginCookie=JSON.parse($.cookie("loginingEmployee"));
    var loginName=loginCookie.user.username;
    var loginId=loginCookie.user.userDetailId;

    
    
    
    function InitEditIndexSetList(ruleConditionId) {
//      GlobalcustomerId = customerId;
    	editIndexSetList_table =  $("#editIndexSetList_tb").DataTable( {
//          fnDrawCallback: changePage, //重绘的回调函数，调用changePage方法用来初始化跳转到指定页面
          bProcessing: true,
          bServerSide: true,
//          aLengthMenu: [10, 20, 40, 60], // 动态指定分页后每页显示的记录数。
          searching: false,// 禁用搜索
//          lengthChange: true, // 是否启用改变每页显示多少条数据的控件
           info:false,
          bPaginate: true,
          deferRender: true,// 延迟渲染
//          stateSave: true,//开启状态记录，datatabls会记录当前在第几页，可显示的列等datables参数信息
//          iDisplayLength: 10, // 默认每页显示多少条记录
//          iDisplayStart: 0,
          ordering: false,// 全局禁用排序
          autoWidth: true,
           scrollX: true,
          serverSide: true,
          bPaginate:false,
//          scrollY:calcDataTableHeight(),
          colReorder: true,//列位置的拖动
          destroy:true, //Cannot reinitialise DataTable,解决重新加载表格内容问题
//          dom:'<"top">rt<"bottom"flip><"clear">',
          ajax : {
              "type" : "POST",
              "url" : getContextPath()+'accountRuleCondition/listIndexSetByKeys.do',
              "data": function(d){
              	var reData = {};
                  reData['ruleConditionId'] = ruleConditionId;
                  d.keys =  JSON.stringify(reData);
                 
            }
          },
          language: {
              "url": "js/Chinese.json"
          },
          columns: [{
                        "sClass": "text-center",
                        "data": "indexSetId",
                        "title":"<input type='checkbox' class='checkall' />",
                        "render": function (data, type, full, meta) {
                            return  '<input type="checkbox"  class="checkchild"  value="' + data + '" />';
                        },
                        "bSortable": false

                    },
                    {
                        "sClass": "text-center",
                        "data": null,
                        "title":"序号",
                        "render": function (data, type, full, meta) {
                            return  meta.row+1;
                        }
                    },      
            
              { title: "指标序号",data:"serialNumber" },
              { title: "指标区间",data:"section" },
              { title: "分数",data:"score" }
          ],
          columnDefs: [
              {
                  orderable: false,
                  targets: 0
              },
          ],
          select: {
              // blurable: true,
              style: 'multi',//选中多行
              selector: 'td:first-child'//选中效果仅对第一列有效
              // info: false
          }
      } );
  }
    
    
    function InitViewIndexSetList(ruleConditionId) {
//      GlobalcustomerId = customerId;
    	viewIndexSetList_table =  $("#viewIndexSetList_tb").DataTable( {
//          fnDrawCallback: changePage, //重绘的回调函数，调用changePage方法用来初始化跳转到指定页面
          bProcessing: true,
          bServerSide: true,
//          aLengthMenu: [10, 20, 40, 60], // 动态指定分页后每页显示的记录数。
          searching: false,// 禁用搜索
//          lengthChange: true, // 是否启用改变每页显示多少条数据的控件
           info:false,
          bPaginate: true,
          deferRender: true,// 延迟渲染
//          stateSave: true,//开启状态记录，datatabls会记录当前在第几页，可显示的列等datables参数信息
//          iDisplayLength: 10, // 默认每页显示多少条记录
//          iDisplayStart: 0,
          ordering: false,// 全局禁用排序
          autoWidth: true,
           scrollX: true,
          serverSide: true,
          bPaginate:false,
//          scrollY:calcDataTableHeight(),
          colReorder: true,//列位置的拖动
          destroy:true, //Cannot reinitialise DataTable,解决重新加载表格内容问题
//          dom:'<"top">rt<"bottom"flip><"clear">',
          ajax : {
              "type" : "POST",
              "url" : getContextPath()+'accountRuleCondition/listIndexSetByKeys.do',
              "data": function(d){
              	var reData = {};
                  reData['ruleConditionId'] = ruleConditionId;
                  d.keys =  JSON.stringify(reData);
                 
            }
          },
          language: {
              "url": "js/Chinese.json"
          },
          columns: [
            
              { title: "指标序号",data:"serialNumber" },
              { title: "指标区间",data:"section" },
              { title: "分数",data:"score" }
          ],
          columnDefs: [
              {
                  orderable: false,
                  targets: 0
              },
          ],
          select: {
              // blurable: true,
              style: 'multi',//选中多行
              selector: 'td:first-child'//选中效果仅对第一列有效
              // info: false
          }
      } );
  }
    
    function InitViewRuleConditionList(smartReleaseDocId) {
//        GlobalcustomerId = customerId;
    	viewRuleConditionList_table =  $("#viewRuleConditionList_tb").DataTable( {
//            fnDrawCallback: changePage, //重绘的回调函数，调用changePage方法用来初始化跳转到指定页面
            bProcessing: true,
            bServerSide: true,
//            aLengthMenu: [10, 20, 40, 60], // 动态指定分页后每页显示的记录数。
            searching: false,// 禁用搜索
//            lengthChange: true, // 是否启用改变每页显示多少条数据的控件
             info:false,
            bPaginate: true,
            deferRender: true,// 延迟渲染
//            stateSave: true,//开启状态记录，datatabls会记录当前在第几页，可显示的列等datables参数信息
//            iDisplayLength: 10, // 默认每页显示多少条记录
//            iDisplayStart: 0,
            ordering: false,// 全局禁用排序
            autoWidth: true,
             scrollX: true,
            serverSide: true,
            bPaginate:false,
//            scrollY:calcDataTableHeight(),
            colReorder: true,//列位置的拖动
            destroy:true, //Cannot reinitialise DataTable,解决重新加载表格内容问题
//            dom:'<"top">rt<"bottom"flip><"clear">',
            ajax : {
                "type" : "POST",
                "url" : getContextPath()+'accountRuleCondition/listByKeys.do',
                "data": function(d){
                	var reData = {};
                    reData['smartReleaseDocId'] = smartReleaseDocId;
                    d.keys =  JSON.stringify(reData);
                   
              }
            },
            language: {
                "url": "js/Chinese.json"
            },
            columns: [
              
                { title: "因子",data:"factor" },
                { title: "因子名称",data:"factorName" },
                { title: "权重",data:"weight" },
                { title: "详情",
                    "render": function (data, type, full, meta) {
                        return '<a onclick="AccountSmartReleaseDoc.showIndexSetDetail('+full["ruleConditionId"] +')">详情</a>';
                        }
                }
            ],
            columnDefs: [
                {
                    orderable: false,
                    targets: 0
                },
            ],
            select: {
                // blurable: true,
                style: 'multi',//选中多行
                selector: 'td:first-child'//选中效果仅对第一列有效
                // info: false
            }
        } );
    }
    
    
    
    function InitRuleConditionList(smartReleaseDocId) {

        ruleConditionList_table =  $("#ruleConditionList_tb").DataTable( {
//            fnDrawCallback: changePage, //重绘的回调函数，调用changePage方法用来初始化跳转到指定页面
            bProcessing: true,
            bServerSide: true,
//            aLengthMenu: [10, 20, 40, 60], // 动态指定分页后每页显示的记录数。
            searching: false,// 禁用搜索
//            lengthChange: true, // 是否启用改变每页显示多少条数据的控件
             info:false,
            bPaginate: true,
            deferRender: true,// 延迟渲染
//            stateSave: true,//开启状态记录，datatabls会记录当前在第几页，可显示的列等datables参数信息
//            iDisplayLength: 10, // 默认每页显示多少条记录
//            iDisplayStart: 0,
            ordering: false,// 全局禁用排序
            autoWidth: true,
             scrollX: true,
            serverSide: true,
            bPaginate:false,
//            scrollY:calcDataTableHeight(),
            colReorder: true,//列位置的拖动
            destroy:true, //Cannot reinitialise DataTable,解决重新加载表格内容问题
//            dom:'<"top">rt<"bottom"flip><"clear">',
            ajax : {
                "type" : "POST",
                "url" : getContextPath()+'accountRuleCondition/listByKeys.do',
                "data": function(d){
                    var reData = {};// $('#ruleConditionForm').serializeObject();
//                    reData['customerId'] = GlobalcustomerId;
                    // reData['operatorLeader'] = '';
                    reData['smartReleaseDocId'] = smartReleaseDocId;
                    d.keys =  JSON.stringify(reData);
                    console.log(d.keys =  JSON.stringify(reData));
                    // console.log(JSON.stringify(reData));
              },
                // "dataSrc": function ( data ) {
                //     //读取select2的内容进行相应的初始化
                //     for(var i=0;i<data.aaData.length;i++){
                //         if(data.aaData[i].customerId!=GlobalcustomerId||(data.aaData[i].operatorLeader!='')){   //筛选出customerId的那些联系人
                //             data.aaData.splice(i,1);
                //             i--;
                //         }
                //     }
                //     return data.aaData;
                // }
            },
            language: {
                "url": "js/Chinese.json"
            },
            columns: [
                {
                    "sClass": "text-center",
                    "data": "ruleConditionId",
                    "title":"<input type='checkbox' class='checkall' />",
                    "render": function (data, type, full, meta) {
                        return  '<input type="checkbox"  class="checkchild"  value="' + data + '" />';
                    },
                    "bSortable": false

                },
                {
                    "sClass": "text-center",
                    "data": null,
                    "title":"序号",
                    "render": function (data, type, full, meta) {
                        return  meta.row+1;
                    }
                },
                { title: "因子",data:"factor" },
                { title: "因子名称",data:"factorName" },
                { title: "权重",data:"weight" },
                { title: "详情",
                    "render": function (data, type, full, meta) {
//                        return '<a onclick="AccountSmartReleaseDoc.showIndexSetDetail(1)">详情</a>';
                    	return '<a onclick="AccountSmartReleaseDoc.showEditIndexSetDetail('+full.ruleConditionId+')">详情</a>';
                    	
                    }
                }
            ],
            columnDefs: [
                {
                    orderable: false,
                    targets: 0
                },

            ],
            select: {
                // blurable: true,
                style: 'multi',//选中多行
                selector: 'td:first-child'//选中效果仅对第一列有效
                // info: false
            }
        } );
    }

    var editor; // use a global for the submit and return data rendering in the examples
    editor = new $.fn.dataTable.Editor({
        ajax:{
            url:getContextPath() + 'accountRuleCondition/update.do',
            data:function (data) {
                //对返回给后台的数据进行格式化
                var reData = data.data;  //??
                for(var key in reData){
                    reData = reData[key];
                }
                reData.saveType = "update";
                reData.customerId = GlobalcustomerId;
                // reData.customerEmployeeId = GlobalcustomerId;
                reData = changeDatetoDatetime(reData);
                return reData;
            },
            success:function () {
                //修改成功后reload表格
                ruleConditionList_table.ajax.reload();
            }
        },
        table: "#ruleConditionList_tb",
        idSrc:  'ruleConditionId',//作为每一行的标示
        // data: function ( d ) {
        //     //对返回后台的数据进行重构
        // },
        formOptions: {
            inline: {
                submitOnBlur: true
            }
        },
        fields: [   //传给后台的数据
            {
//                      label: "ruleConditionId:",
             	name: "ruleConditionId"

            },
            {
//                label: "ruleConditionId:",
                name: "factor"

            },
            {
//                label: "factorName:",
                name: "factorName"
                // type: 'select'
            }, {
//                label: "weight:",
                name: "weight"
                // type: 'select'
            }
        ]
    });

    // 对于非第一列数据进行行内编辑
    $('#ruleConditionList_tb').on('dblclick', 'tbody td:not(:nth-child(-n+2))', function (e) {
        editor.inline(this);
    });

// 操作人/负责人切换
//$('#ruleConditionSelect').on('change', function(){
//    var selectOpt = $(this).val();
//    //初始化显示所有列
//    for (var i=0;i<11;i++){
//        ruleConditionList_table.column(i ).visible( true);
//    }
//
//    if (selectOpt =="操作人"){
//        ruleConditionList_table.column( 2 ).visible( false);
//        ruleConditionList_table.columns.adjust().draw( false );
//
//    }
//    else{
//        ruleConditionList_table.column( 3 ).visible( false);
//        ruleConditionList_table.column( 9 ).visible( false);
//
//        ruleConditionList_table.columns.adjust().draw( false );
//    }
//});

    // select/not select all
    $('body').on('click', '#ruleConditionList .checkall', function () {
        var check = $(this).prop("checked");
        $("#ruleConditionList_tb .checkchild").prop("checked", check);
        //通过调用datatables的select事件来触发选中
        $("#ruleConditionList_tb tbody tr").each(function () {
            if ( ruleConditionList_table.row( this, { selected: true } ).any() ) {
                ruleConditionList_table.row( this ).deselect();
            }
            else {
                ruleConditionList_table.row( this ).select();
            }
        });

    });
    //监听分页事件,去除复选
    $('#ruleConditionList_tb').on( 'page.dt', function () {

        $(".checkall").prop("checked",false);

    } );

    $('#ruleConditionList_tb').on( 'length.dt ', function () {

        $(".checkall").prop("checked",false);

    } );

    // 选中行
    $('body').on('click', '#ruleConditionList_tb tbody tr td:first-child', function () {
        // $(".selected").not(this).removeClass("selected");
        $(this).toggleClass("selected");
        var check = $(this).hasClass("selected");
        $(this).children("input[class=checkchild]").prop("checked", check);//把查找到checkbox并且勾选
        // console.log(table.rows('.selected').data().length);
    });

    // function addRuleConditionList() {
    //
    // 	if($("#addRowId").length>0){
    //
    // 		alert("请先保存！");
    // 		return;
    // 	}
    //
    //     // 插入行字段
    //     var rowObj;
    //
    //    rowObj = {
    //             // 'null':'input',
    // 		   'factor':'input',
    //             'factorName':'input',
    //             'weight':'input'
    //    };
    //    AddRowInline('ruleConditionList_tb','addRowId',rowObj,true);
    // }
    
    //datatables 表内添加行
    function addIndexSetList() {
    	
    	if($("#addRowId").length>0){ 
    		
    		alert("请先保存！");
    		return;
    	}

        // 插入行字段
        var rowObj;

       rowObj = {
                // 'null':'input',
    		   'serialNumber':'input',
                'section':'input',
                'score':'input'
       };
       AddRowInline('editIndexSetList_tb','addRowId',rowObj,true);
    }
    
    function submitIndexSetList(){

        var data =  getRowData('addRowId');
        console.log(data);
        
        //获的ruleConditionId
        data.ruleConditionId = $("#editIndexSetModal input[name='ruleConditionId']").val();

        $.ajax({
            url: getContextPath() + 'accountRuleCondition/insertIndexSet.do',
            data: data,
            dataType: 'json',
            beforeSend: function () {
                showMask();//显示遮罩层
            },
            success: function (rsp) {
                hideMask();

                if (rsp.code == 0) {
                    callSuccess(rsp.message);
                    
                    editIndexSetList_table.ajax.reload();
                    
                } else
                    callAlert(rsp.message)


            },
            error: function () {
                hideMask();
                callAlert("新增失败！")
            }
        });

        editIndexSetList_table.ajax.reload();
    	
    }
    
    // delete item
    function deleteIndexSetList() {
        var ids = [];
        var info;
        var selectedRowData = editIndexSetList_table.rows('.selected').data();
        if (selectedRowData.length < 1) {
            info = "请选择需要删除的数据！";
            callAlert(info);
            return;
        }
        info = "确定要删除" + selectedRowData.length + "条数据吗?";
        callAlertModal(info,'editIndexSetList_confirmDelete');
    }
    
    //确定删除按钮
    $('#alertModal').on('click','.editIndexSetList_confirmDelete',function () {
        var ids = [];
        var selectedRowData = editIndexSetList_table.rows('.selected').data();
        $.each(selectedRowData, function () {
            ids.push(this.indexSetId);
        });

        $.ajax({
            url: getContextPath() + 'accountRuleCondition/deleteIndexSet.do',
            data: {
            	indexSetIds: ids.join(',')
            },
            dataType: 'json',
            beforeSend: function () {
                showMask();//显示遮罩层
            },
            success: function (rsp) {
                hideMask();//隐藏遮罩层
                if (rsp.code == 0)
                    callSuccess(rsp.message);
                
                editIndexSetList_table.ajax.reload();
            },
            error: function () {
                hideMask();//隐藏遮罩层
                callAlert("删除失败！")
            }
        });

    });


    // 提交保存
    function submitRuleConditionList() {
        var data =  getRowData('addRowId');
        console.log(data);
        data.customerId = GlobalcustomerId;  //向后台传入customerId
        data.salesmanId = loginId;  //向后台传入salesmanId  标记是那个业务员

        $.ajax({
            url: getContextPath() + '/saleCustomerEmployee/insert.do',
            data: data,
            dataType: 'json',
            beforeSend: function () {
                showMask();//显示遮罩层
            },
            success: function (rsp) {
                hideMask();

                if (rsp.code == 0) {
                    callSuccess(rsp.message);
                    ruleConditionList_table.ajax.reload();
                    customer.Init();
                    // customer_table.ajax.reload();//????
                } else
                    callAlert(rsp.message)


            },
            error: function () {
                hideMask();
                callAlert("新增失败！")
            }
        });

        ruleConditionList_table.ajax.reload();
        // 实现摁钮的互斥
        // $("button.addRuleConditionMan").removeAttr('disabled');
        // $("button.submitRuleConditionMan").attr("disabled","true");
    }

    // // delete item
    // function deleteRuleConditionList() {
    //     var ids = [];
    //     var info;
    //     var selectedRowData = ruleConditionList_table.rows('.selected').data();
    //     if (selectedRowData.length < 1) {
    //         info = "请选择需要删除的数据！";
    //         callAlert(info);
    //         return;
    //     }
    //     info = "确定要删除" + selectedRowData.length + "条数据吗?";
    //     callAlertModal(info,'ruleConditionList_confirmDelete');
    // }

    //确定删除按钮
    $('#alertModal').on('click','.ruleConditionList_confirmDelete',function () {
        var ids = [];
        var selectedRowData = ruleConditionList_table.rows('.selected').data();
        $.each(selectedRowData, function () {
            ids.push(this.ruleConditionId);
        });

        $.ajax({
            url: getContextPath() + 'accountRuleCondition/delete.do',
            data: {
            	ruleConditionIds: ids.join(',')
            },
            dataType: 'json',
            beforeSend: function () {
                showMask();//显示遮罩层
            },
            success: function (rsp) {
                hideMask();//隐藏遮罩层
                if (rsp.code == 0)
                    callSuccess(rsp.message);
                
                ruleConditionList_table.ajax.reload();
            },
            error: function () {
                hideMask();//隐藏遮罩层
                callAlert("删除失败！")
            }
        });

    });

    return{
        InitRuleConditionList:InitRuleConditionList,
        // joinPublicPool:joinPublicPool,
        submitRuleConditionList:submitRuleConditionList,
        InitViewRuleConditionList:InitViewRuleConditionList,
        InitViewIndexSetList:InitViewIndexSetList,
        InitEditIndexSetList:InitEditIndexSetList,
        addIndexSetList:addIndexSetList,
        submitIndexSetList:submitIndexSetList,
        deleteIndexSetList:deleteIndexSetList

    }

})();