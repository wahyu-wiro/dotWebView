$(document).ready(function () {
    var arrOrder = [];
    var txtQty = document.getElementById("txtQty");
    var btnQty =  document.getElementById("btnQty");
    var txtPrice = document.getElementById("txtPrice");
    var txtMerchantId = document.getElementById("txtMerchantId");
    var cardCheckout = document.getElementById("cardCheckout");
    var txtQtyCheckout = document.getElementById("txtQtyCheckout");
    var txtPriceCheckout = document.getElementById("txtPriceCheckout");        
    var txtMerchantIdCheckout = document.getElementById("txtMerchantIdCheckout");  
    var spanQtyCheckout = document.getElementById("spanQtyCheckout");
    var spanPriceCheckout = document.getElementById("spanPriceCheckout");
    var txtOrder = document.getElementById("txtOrder");

    //var mb = document.getElementById("modalBody").childNodes;
	var mb = document.getElementById("modalBody")
    $('.openBtn').on('click', function (e) {
        if(txtQty) { txtQty.value=1; }
        if(txtPrice) { txtPrice.value=0; }
        if(btnQty) { btnQty.innerHTML=1; }
        //console.log('openBtn ye =>', e.target.parentNode.id)
        var parentId = e.target.parentNode.id;
        var r = document.getElementById(parentId).innerHTML;
        document.getElementById("modalBody").innerHTML = r
        $('#myModal').modal({
            show: true
        });
    });
    $('#btnMin').on('click', function (e) {
        if(txtQty.value == 1) { return false;
        }else {
            var qtyNew = parseInt(txtQty.value)-1
            txtQty.value = qtyNew
            btnQty.innerHTML = qtyNew;

            //var priceNew =  parseInt(mb[5].value) * qtyNew;
			var priceNew =  parseInt(mb.querySelectorAll('.productPrice')[0].value) * qtyNew;
            txtPrice.value = priceNew
        }
    })
    $('#btnPlus').on('click', function (e) {
        var qtyNew = parseInt(txtQty.value)+1
        txtQty.value = qtyNew
        btnQty.innerHTML = qtyNew;
        
        //var priceNew =  parseInt(mb[5].value) * qtyNew;
		var priceNew =  parseInt(mb.querySelectorAll('.productPrice')[0].value) * qtyNew;
		console.log('priceNew =>',priceNew)
        txtPrice.value = priceNew
    })
    $('#btnAddToCart').on('click', function (e) {
        arrOrder.push({
            /*
			productId: mb[1].value,
            productName: mb[3].value,
            productPrice: mb[5].value,
            discountPrice: mb[9].value,
			*/
			productId: mb.querySelectorAll('.productId')[0].value,
            productName: mb.querySelectorAll('.productName')[0].value,
            productPrice: mb.querySelectorAll('.productPrice')[0].value,
            discountPrice: mb.querySelectorAll('.discountPrice')[0].value,
            qty: txtQty.value
        })
        txtOrder.value = JSON.stringify(arrOrder);
        console.log('order =>', JSON.stringify(arrOrder));

        if(!txtQtyCheckout.value) {txtQtyCheckout.value=0}
        var qc = parseInt(txtQtyCheckout.value) + parseInt(txtQty.value);            
        txtQtyCheckout.value = qc;
        spanQtyCheckout.innerHTML = qc + ' product(s)'
        //txtMerchantIdCheckout.value = mb[7].value;
		txtMerchantIdCheckout.value = mb.querySelectorAll('.merchantId')[0].value,
		console.log('txtPriceCheckout.value =>',txtPriceCheckout.value )
        if(!txtPriceCheckout.value) { txtPriceCheckout.value="0" }
        //var mb = document.getElementById('modalBody').childNodes;
        //txtPrice.value=mb[5].value;
        console.log('txtPrice.value =>',txtPrice.value)
        //if(txtPrice.value == "0") { txtPrice.value=mb[5].value }
		if(txtPrice.value == "0") { txtPrice.value=mb.querySelectorAll('.productPrice')[0].value }
        var pc = parseInt(txtPriceCheckout.value) + parseInt(txtPrice.value);
        txtPriceCheckout.value = pc;
        spanPriceCheckout.innerHTML = 'Rp'+new Intl.NumberFormat('ID').format(pc);
        console.log('txtPriceCheckout =>',pc)
        cardCheckout.classList.remove('d-none')
    })

})