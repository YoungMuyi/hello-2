//@ sourceURL=AirImportSecondTrack.js
//二程跟踪
var AirImportSecondTrack = (function() {
	var data = {};
	data['airTrackSecondParamVos'] = [];
	// obtain data
	function askData(billId, businessType,html) {
		$.ajax({
					type : "post",
					url : "/SeawinWebappBase/airTrackSecondController/showSecondTrack.do",
					data : {
						"billid" : billId,
						"status" : businessType
					},
					success : function(data) {
						data = JSON.parse(data);
						AirImportSecondTrack.data['airTrackSecondParamVos'] = data['aaData'];
						$.each($('#tracing').find('input,select'), function(i,
								input) {
							$(this).val(data[$(this).attr('name')]);
						});
						var tr = '';
						$('.'+html+' div#tracing div div#exportSecondTrack form table tr:gt(0)')
								.empty();
						for (var i = 0; i < data['aaData'].length; i++) {
							var sysData = data['aaData'][i];
							tr += '<tr exchange_operate=" ">'
									+ '<td><input class="form-control" name="myId" value='
									+ sysData['myId']
									+ '></td>'
									+ '<td><input class="form-control" name="previousPerson" value='
									+ sysData['previousPerson']
									+ '></td>'
									+ '<td><input class="form-control" name="customesCompany" value='
									+ sysData['customesCompany']
									+ '></td>'
									+ '<td><input class="form-control" name="majorBillno" value='
									+ sysData['majorBillno']
									+ '></td>'
									+ '<td><input class="form-control" name="outTransportDate" value='
									+ sysData['outTransportDate']
									+ '></td>'
									+ '<td><input class="form-control" name="amount" value='
									+ sysData['amount']
									+ '></td>'
									+ '<td><input class="form-control" name="gross" value='
									+ sysData['gross']
									+ '></td>'
									+ '<td><input class="form-control" name="startPort" value='
									+ sysData['startPort']
									+ '></td>'
									+ '<td><input class="form-control" name="endPort" value='
									+ sysData['endPort']
									+ '></td>'
									+ '<td><input class="form-control" name="mediumPort" value='
									+ sysData['mediumPort']
									+ '></td>'
									+ '<td><input class="form-control" name="arrivePortTime" value='
									+ sysData['arrivePortTime']
									+ '></td>'
									+ '<td><input class="form-control" name="note" value='
									+ sysData['note']
									+ '></td>'
									+ '</tr>';
						}
						$('.'+html+' div#tracing div div#exportSecondTrack form table').append(tr);
					}
				})
	}
	function saveData(billId,businessType,html) {
		// 修改数据
		 $.each($('.'+html+' div#tracing div div#exportSecondTrack form table').find('tr[exchange_operate!="insert"]:gt(0)'),function(i,tr){
		 console.log(i);
		 console.log(tr);
		 console.log($(tr));
		 AirImportSecondTrack.data['airTrackSecondParamVos'][i]['exchange_operate']=$(tr).attr('exchange_operate');
		 $.each($(tr).find('input'),function(j,input){
		 console.log($(this).attr('name'));
		 var name=$(this).attr('name');
		 console.log(i);
		 console.log(AirImportSecondTrack.data['airTrackSecondParamVos'][i])
		 console.log(AirImportSecondTrack.data['airTrackSecondParamVos'][i][name]);
		 if(AirImportSecondTrack.data['airTrackSecondParamVos'][i][name]){
		 AirImportSecondTrack.data['airTrackSecondParamVos'][i][name]=$(this).val();
		 }
		 	})
		 })
		//新增的数据
			$.each($('.'+html+' div#tracing div div#exportSecondTrack form table').find('tr[exchange_operate="insert"]'),function(i,tr){
				var obj={'exchange_operate':'insert','businessType':businessType,'billId':billId};
				$.each($(tr).find('input'),function(j,input){
					obj[$(this).attr('name')]=$(this).val();
				})
				console.log("--------")
				console.log(AirImportSecondTrack.data);
				AirImportSecondTrack.data['airTrackSecondParamVos'].push(obj);
			});
		 	console.log("新增的数据");
			console.log(AirImportSecondTrack.data);
			//AirImportSecondTrack.data['billId']=billId;
			 $.ajax({
	             type:'post',
	             url:'/SeawinWebappBase/airTrackSecondController/updateById.do',  
	             contentType: "application/json;charset=UTF-8",
	             data:JSON.stringify(AirImportSecondTrack.data),
	             success:function(data){
	            	 console.log(data);
	            	 var res = JSON.parse(data);
	 				if(res.status == 1){
	 					callSuccess("保存成功！");
	 				}else if(res.status == 2){
	 					callAlert("保存失败！");
	 					
	 				}
	             }
			 });
	}
	// delete
	function delData(html) {
		var tr = $('.'+html+' div#tracing div div#exportSecondTrack form table').find('tr.sel');
		if (tr.length == 1) {
			if (tr.attr('exchange_operate') == 'insert') {
				tr.remove();
			} else {
				tr.attr('exchange_operate', 'delete').css('display', 'none');
			}
		} else {
			callAlert('请选择您要删除的数据');
		}
	}
	// 新增
	function addData(html) {
		var tr = '<tr exchange_operate="insert">'
				+ '<td><input class="form-control" name="myId" value=""></td>'
				+ '<td><input class="form-control" name="previousPerson" value=""></td>'
				+ '<td><input class="form-control" name="customesCompany" value=""></td>'
				+ '<td><input class="form-control" name="majorBillno" value=""></td>'
				+ '<td><input class="form-control" name="outTransportDate" value=""></td>'
				+ '<td><input class="form-control" name="amount" value=""></td>'
				+ '<td><input class="form-control" name="gross" value=""></td>'
				+ '<td><input class="form-control" name="startPort" value=""></td>'
				+ '<td><input class="form-control" name="endPort" value=""></td>'
				+ '<td><input class="form-control" name="mediumPort" value=""></td>'
				+ '<td><input class="form-control" name="arrivePortTime" value=""></td>'
				+ '<td><input class="form-control" name="note" value=""></td>' + '</tr>';
		$('.'+html+' div#tracing div div#exportSecondTrack form table')
				.find('tr:gt(0)').css('background', 'transparent').removeClass('sel');
		$(tr).css('background', 'lightblue').addClass('sel');
		$('.'+html+' div#tracing div div#exportSecondTrack form table').append(tr);
	}
	return {
		askData : askData,
		saveData: saveData,
		delData : delData,
		addData : addData,
		data : data
	}
})();
$(function() {
	$('.AIRimport div#tracing  div div#exportSecondTrack form table')
	.on('click','tr:gt(0) td',function() {
				$('.AIRimport div#tracing  div div#exportSecondTrack form table')
						.find('tr').css('background', 'transparent')
						.removeClass('sel');
				$(this).parents('tr').css('background', 'lightblue')
						.addClass('sel');
			});
})