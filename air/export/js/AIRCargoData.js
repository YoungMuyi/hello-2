//@ sourceURL=AIRCargoData.js
var AIRCargoData = (function() {
	// 根据id来请求货物数据信息
	function askData(id) {
		$.ajax({
			type : "GET",
			url : "/SeawinWebappBase/AirCargoDataController/select.do",
			data : {
				"id" : id
			},
			success : function(data) {
				var data = JSON.parse(data);
				$.each($('.AIRexport #goodsData table').find('input,select'), function(i, input) {
					if ($(this).attr("name")) {
						$(this).val(data[$(this).attr("name")]);
					} else {
						// 不需要替换
					}
				});
				$('#airCargoData input[name=businessCode]').val(data.businessCode)
				$('#inWarehouseIdForm input[name=inWarehouseId]').val(data.inWarehouseId)
				setFormSelect2Value("airCargoData", ["loadMean","inWarehouseMean"],[data["loadMean"],data["inWarehouseMean"]]);
                $('.AIRexport div.ZLmain>ul.nav-tabs>li.goodsData').attr('changed',false);
            }
		})
	}
	// 保存货物数据的信息
	function saveData(liId){
		$.ajax({
			type: "POST",
			async: false,
			url:"/SeawinWebappBase/AirCargoDataController/updateById.do",
			contentType: "application/json;charset=UTF-8",
			data:function(){
			  cargoDataReceive = $(".AIRexport #goodsData div form#cargoDataForm").serializeObject();
			  cargoDataHead = $("#airCargoData").serializeObject();
              cargoDataReceive['billExportId']=liId;
              for (var key in cargoDataHead) {
                  cargoDataReceive[key] = cargoDataHead[key];
              };
              return JSON.stringify(cargoDataReceive);
			}(),
			success:function(res){
				var res = JSON.parse(res);
				if(res.status == 1){
					//callSuccess("保存成功！");
					callAlert("保存成功！");
                    $('.AIRexport div.ZLmain>ul.nav-tabs>li.goodsData').attr('changed',false);
                    if($('.AIRexport div.ZLmain>ul>li.goodsData').hasClass('active')) {
                        AIRCargoData.askData(liId);
                    }
				}else if(res.status == 2){
					//callAlert("该订单未审核，不能修改！");
					callAlert("该订单未审核，不能修改！");
					
				}else{
					alert("保存失败！");
				}
			}
		})
	}
	return{
		askData:askData,
		saveData:saveData
	};
})();
$(function(){
	//监听内容页面是否修改
    $('.AIRexport div#goodsData').on('change','section input,section textarea,section select',function () {
        $('.AIRexport div.ZLmain>ul.nav-tabs>li.goodsData').attr('changed',true);
    })
});
