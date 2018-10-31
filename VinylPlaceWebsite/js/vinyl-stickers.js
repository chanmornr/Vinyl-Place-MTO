var API ="https://mhq011eieb.execute-api.us-east-1.amazonaws.com/product";
var JSONObject ={
	"TableName": "Product",
	"Type" : "Full",
	"id" : "YEL477"

}

function setup(json){

	if(location.href.split("/").slice(-1) == "shop.html") {
		var product = '';
		console.log(product);
		for (var i = json.Items.length - 1; i >= 0; i--) {
			product = `
			<div class="box shop-item">
				<img class="shop-item-image" src="${json.Items[i].Image}">
				<h3 class="shop-item-name">${json.Items[i].Product_Name}</h3>
				<p class="shop-item-desc">${json.Items[i].Product_Description}</p>
				<input type="submit" class="shop-item-button" value="Add  to cart" onclick="addToCart();">
			</div>
			`;

			$('#container_items').append(product);
			console.log(product);
		}
	}
}

//get the payload
function grab() {
	try {
		$.getJSON(API,JSONObject)
		.done(function (json) {
			setup(json);
		});
	} catch(err){
		console.log(err);
	}
}

window.onload = grab();