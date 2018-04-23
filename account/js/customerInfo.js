//@ sourceURL=customerInfo.js
// $('#lxy_basicdata_tb').DataTable().empty();
//标题行
var customerInfo = (function(){

    var customerInfo_tb;

    Init_customerInfo_table();

    function Init_customerInfo_table() {
        customerInfo_tb =  $("#customerInfo_table").DataTable( {
            // fnRowCallback: rightClick,//利用行回调函数，来实现右键事件
            fnDrawCallback:changePage,//重绘的回调函数，调用changePage方法用来初始化跳转到指定页面
            bProcessing : true,
            bServerSide : true,
            aLengthMenu : [ 50,100, 300, 500, 1000, 3000, 5000 ], // 动态指定分页后每页显示的记录数。
            searching : false,// 禁用搜索
            lengthChange : true, // 是否启用改变每页显示多少条数据的控件
            deferRender : true,// 延迟渲染
            bStateSave : false, // 在第三页刷新页面，会自动到第一页
            iDisplayLength :50, // 默认每页显示多少条记录
            iDisplayStart : 0,
            ordering : false,// 全局禁用排序
            // "order": [],
            serverSide: true,
            autoWidth: true,
            paging:true,  //配合scroller
            scrollX: true,
            colReorder: true,//列位置的拖动
            scrollY: calcDataTableHeight(),
            // scroller: {
            //     rowHeight: 26
            // },
            destroy:true, //Cannot reinitialise DataTable,解决重新加载表格内容问题
            dom:'<"top">rt<"bottom"flip><"clear">',
            ajax : {
                "type" : "POST",
                "url" : getContextPath()+'saleCustomerEmployee/listForFreightAccount.do',
                "data": function(d){
                    d.keys = JSON.stringify($('#searchCustomerInfoForm').serializeObject());
                    // reData['salesmanId'] = loginId;
                    // // console.log(loginId);
                    // reData['operatorLeader'] = '';
                    // d.keys =  JSON.stringify(reData);

                }
                // "dataSrc": function ( data ) {
                //     for(var i=0;i<data.aaData.length;i++){
                //         if(data.aaData[i].operatorLeader!=""){   //筛掉操作人的记录,
                //             data.aaData.splice(i,1);
                //             i--;
                //         }
                //     }
                //     return data.aaData;
                // }
            },
            language: {
                "url": "js/Chinese.json",
                select: {
                    rows: ""
                },
                buttons: {
                    copyTitle: '复制到剪切板',
                    copySuccess: {
                        _: '将%d 行复制到剪切板',
                        1: '将1行复制到剪切板'
                    }
                }
            },
            columns: [
                // {
                //     "sClass": "text-center",
                //     "data": "customerId",
                //     "title":"<input type='checkbox' class='checkall' />",
                //     "render": function (data, type, full, meta) {
                //         return  '<input type="checkbox"  class="checkchild"  value="' + data + '" />';
                //     },
                //     "bSortable": false
                //
                // },
                {
                    "sClass": "text-center",
                    "data": "customerId",
                    "title":"序号",
                    "render": function (data, type, full, meta) {
                        return  meta.row+1;
                    }
                },
                { title: "客户代码",data:"saleCustomer.customerCode" },
                { title: "客户名称",data:"customerNameForShow" },
//                { title: "往来单位(EN)",data:"saleCustomer.customerName" },
                { title: "单位税号",data:"saleCustomer.unitTaxNumber"},
                { title: "联系人",data:"manInCharge" },
                // { title: "客户状态",data:"saleCustomer.customerDefinition" },
                { title: "联系电话",data:"officeTel" },
                { title: "地址",data:"saleCustomer.address" },
                { title: "开票抬头（CN）",data:"saleCustomer.invoiceTitle" },
                { title: "开户行（人民币）",data:"saleCustomer.rmbBank"},
                { title: "人民币账号",data:"saleCustomer.rmbBankAccount"},
                { title: "开票抬头（EN）",data:"saleCustomer.invoiceTitleEn"},
                { title: "开户行（外汇）",data:"saleCustomer.foreignBank"},
                { title: "外汇账号",data:"saleCustomer.foreignBankAccount"}
                // {
                //     title: "最后修改人",
                //     "data": "baseModel",
                //
                //     "render": function (data, type, full, meta) {
                //         return (data == null || data == undefined ) ? '': data.creatorName;
                //     }
                // },
                //
                // { title: "最后修改时间",data:"amendTime"}

            ],
            columnDefs: [
                {
                    "orderable": false,
                    targets: [0]
                },
                //
                // {
                //     // "searchable": false,
                //     "orderable": true,
                //      targets: [2,3,4]
                // },
                {
                    "render": function ( data, type, full, meta ) {
                        if($.string.isNullOrEmpty(data))
                            return "";
                        else if(type === 'display')
                            return type === 'display' && data.length > 10 ?
                                '<span title="'+data+'">'+data+'</span>' : data;
                        else if  (type === 'copy') {
                            var api = new $.fn.dataTable.Api(meta.settings);
                            data = $(api.column(meta.col).header()).text() + ": " + data+"  ";
                        }
                        return data;
                    },
                    targets: [1,2,3,4,5,6,7,8,9,10,11,12]
                }
            ],
            // "order": [[ 1, 'asc' ]],

            select: {
                style: 'multi',   //选中多行
                selector: 'td:first-child'//选中效果仅对第一列有效
            }

        } );

    }

    // select/not select all
    $('body').on('click', '.customerInfoMainTable .checkall', function () {
        var check = $(this).prop("checked");
        $("#customerInfo_table .checkchild").prop("checked", check);
        // 通过调用datatables的select事件来触发选中
        $("#customerInfo_table tbody tr").each(function () {
            if (check){
                customerInfo_tb.row( this ).select();
                $( this ).find('td:first-child').addClass('selected');
            }
            else{
                customerInfo_tb.row( this ).deselect();
                $( this ).find('td:first-child').removeClass('selected');
            }
        });
    });

//监听分页事件,去除复选
    $('#customerInfo_table').on( 'page.dt', function () {

        $(".checkall").prop("checked",false);

    } );

    $('#customerInfo_table').on( 'length.dt ', function () {

        $(".checkall").prop("checked",false);

    } );

    $('#customerInfo_table tbody').on('click', 'tr td:first-child', function () {
        $(this).toggleClass("selected");
        var check = $(this).hasClass("selected");
        $(this).children("input[class=checkchild]").prop("checked", check);//把查找到checkbox并且勾选
    });



    //重置查询条件
    $("#resetCustomerInfoForm").click( function() {
        $("#searchCustomerInfoForm")[0].reset();
        customerInfo_tb.ajax.reload();
        //设置国家和航线默认值为空
    });

    //查询按钮search button
    function doSearch(){
        customerInfo_tb.ajax.reload();
    }

    return {
        // 将供页面该方法调用
        doSearch:doSearch,
        Init_customerInfo_table:Init_customerInfo_table

    };
})();
