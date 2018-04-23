//@ sourceURL=PageFunction.js
var PageFunction = (function() {
	//获取计费重量
	function getBranchChargeWeight(){

	}
	// 结算重量*单件*件数=金额
	function calculateMoney() {
		var a = new Array();
		var branchKind = new Array();
		var branchGross = new Array();
		var branchPrice = new Array();
		var branchAmount = new Array();
		var branchCalculateWeight = [ 0, 0, 0 ];
		$("#cargoDataTable .branchVolume").each(function() {
			a.push(this.value);
		})
		$("#cargoDataTable .branchKind").each(function() {
			branchKind.push(this.value);
		})
		$("#cargoDataTable .branchGross").each(function() {
			branchGross.push(this.value);
		})
		$("#cargoDataTable .branchPrice").each(function() {
			branchPrice.push(this.value);
		})
		$("#cargoDataTable .branchAmount").each(function() {
			branchAmount.push(this.value);
		})
		// 根据体积计算计费重量 branchChargeWeight
		var branchChargeWeight = new Array();
		for (var i = 0; i < 3; i++) {
			if (a[i] == null || a[i] == "" || a[i] == undefined) {
				a[i] = 0;
			}
			if (branchKind[i] == null || branchKind[i] == ""
					|| branchKind[i] == undefined) {
				branchKind[i] = 0;
			}
			if (branchGross[i] == null || branchGross[i] == ""
					|| branchGross[i] == undefined) {
				branchGross[i] = 0;
			}
			if (branchPrice[i] == null || branchPrice[i] == ""
					|| branchPrice[i] == undefined) {
				branchPrice[i] = 0;
			}
			if (branchAmount[i] == null || branchAmount[i] == ""
					|| branchAmount[i] == undefined) {
				branchAmount[i] = 0;
			}
			branchChargeWeight.push((a[i] * 1000 / 6).toFixed(4));
			switch (branchKind[i]) {
			case "5/5":
				branchCalculateWeight[i] = (branchChargeWeight[i] - branchGross[i])
						* 0.5 + branchGross[i];
				break;
			case "4/6":
				branchCalculateWeight[i] = (branchChargeWeight[i] - branchGross[i])
						* 0.4+ branchGross[i];
				break;
			case "3/7":
				branchCalculateWeight[i] = (branchChargeWeight[i] - branchGross[i])
						* 0.3 + branchGross[i];
				break;
			case "2/8":
				branchCalculateWeight[i] = (branchChargeWeight[i] - branchGross[i])
						* 0.2 + branchGross[i];
				break;
			default:
				if(i == 0)
				 callAlert("请选择收款-分单别类！");
				else if(i == 1)
				 callAlert("请选择付款-主单别类！");
				else if(i == 2)
				 callAlert("请选择实际进仓别类！");
				break;
			}
			
		}
		// 展示分单数据
		$(".branchChargeWeight").val(branchChargeWeight[0]);
		$(".branchCalculateWeight").val(branchCalculateWeight[0]);
		$(".branchMoney").val(
				branchCalculateWeight[0] * branchPrice[0]
						* branchAmount[0]);
		// 展示主单数据
		$(".majorChargeWeight").val(branchChargeWeight[1]);
		$(".majorCalculateWeight").val(branchCalculateWeight[1]);
		$(".majorMoney").val(
				branchCalculateWeight[1] * branchPrice[1]
						* branchAmount[1]);
		// 展示实际进仓数据
		$(".warehouseChargeWeight").val(branchChargeWeight[2]);
		$(".warehouseCalculateWeight").val(branchCalculateWeight[2]);
		$(".warehouseMoney").val(
				branchCalculateWeight[2] * branchPrice[2]
						* branchAmount[2]);

	}
	//function cogradientData(){
		//获取到实际进仓的一行数据，鼠标离开输入框，将值复制给付款-主单输入框
//		$.each($("#cargoDataTable tbody tr:eq(2)").find("td"),function(i){
//			alert(i);
//		})
	//}
	
	return {
        getBranchChargeWeight:getBranchChargeWeight,			//获取计费重量的值
		calculateMoney : calculateMoney							//获取结算重量的值
	};
})();
$(function () {
	//体积修改
	$('.AIRexport div#goodsData form#cargoDataForm table#cargoDataTable').find('input.branchVolume').on('input',function () {
			//体积修改
            if(Number($(this).val())){
                var num=(($(this).val())*1000/6).toFixed(4);		//计费重量
                console.log(num);
                $(this).parent('td').next('td').find('input').val(num);
            }else{
                $(this).parent('td').next('td').find('input').val('');
            }
    });
	//毛重修改
	$('.AIRexport div#goodsData form#cargoDataForm table#cargoDataTable').find('input.branchGross').on('input',function () {
        //毛重修改
        if(Number($(this).val())){
            var num=Number($(this).parents('tr').find('td:nth-child(5)').find('input').val());		//计费重量

            var kind=$(this).parents('tr').find('select.branchKind').val();
            switch (kind){
                case '5/5':
                    kind=0.5;
                    break;
                case '4/6':
                    kind=0.4;
                    break;
                case '3/7':
                    kind=0.3;
                    break;
                case '2/8':
                    kind=0.2;
                    break;
                default:
                    kind=0;
            }
            console.log(kind);
            if(kind&&num){
                var calculateWeight=(num-$(this).val())*kind+Number($(this).val());
                $(this).parents('tr').find('td:nth-child(8)').find('input').val(calculateWeight);
            }else {
                $(this).parents('tr').find('td:nth-child(8)').find('input').val('');
            }

        }else{
            $(this).parent('td').next('td').find('input').val('');
        }
    })
	//修改了分泡比       同时修改结算重量
	$('.AIRexport div#goodsData form#cargoDataForm table#cargoDataTable').find('select.branchKind').on('change',function () {
		//别类修改
        var kind=$(this).val();
        switch (kind){
            case '5/5':
                kind=0.5;
                break;
            case '4/6':
                kind=0.4;
                break;
            case '3/7':
                kind=0.3;
                break;
            case '2/8':
                kind=0.2;
                break;
            default:
                kind=0;
        }
        if(kind){
			var gross=Number($(this).parents('tr').find('input.branchGross').val());  //毛重
			var chargeWeight=Number($(this).parents('tr').find('td:nth-child(5)').find('input').val());		//计费重量
			if(gross&&chargeWeight){
                var calculateWeight=(chargeWeight-gross)*kind+gross;
                $(this).parents('tr').find('td:nth-child(8)').find('input').val(calculateWeight);
			}else {
                $(this).parents('tr').find('td:nth-child(8)').find('input').val('');
			}

		}else{
            $(this).parents('tr').find('td:nth-child(8)').find('input').val('');
		}

    })
	//计费重量修改 同时修改结算重量
	$('.AIRexport div#goodsData form#cargoDataForm table#cargoDataTable tbody tr td:nth-child(5)').find('input').on('input',function () {
		var gross=Number($(this).parents('tr').find('input.branchGross').val());		//毛重
		var chargeWeight=Number($(this).parents('tr').find('td:nth-child(5) input').val());	//计费重量
		var kind=$(this).parents('tr').find('select.branchKind').val();		//别类
        switch (kind){
            case '5/5':
                kind=0.5;
                break;
            case '4/6':
                kind=0.4;
                break;
            case '3/7':
                kind=0.3;
                break;
            case '2/8':
                kind=0.2;
                break;
            default:
                kind=0;
        }
        if(kind&&gross&&chargeWeight){
            var calculateWeight=(chargeWeight-gross)*kind+gross;
            $(this).parents('tr').find('td:nth-child(8)').find('input').val(calculateWeight);
        }else{
            $(this).parents('tr').find('td:nth-child(8)').find('input').val('');
		}
    })
	//$('.AIRexport div#goodsData form#cargoDataForm table#cargoDataTable').find('input.branchGross,input.branchVolume,')
})