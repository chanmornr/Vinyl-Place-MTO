// Send JSON formatted string to cart
function addToCart() {
	var cart = localStorage.getItem("cart");
	var data = cart ? (cart + "," + "item") : "item";
	localStorage.setItem("cart", data);
	alert("Added item to cart.");
	updateCartNav();
}

function loadCartToMain() {
	document.getElementById("main-cart").innerHTML = "";
	var cart = localStorage.getItem("cart");
	document.getElementById("main-cart").innerHTML += cart;

	// do loop stuff to display cart
	// add quantity and remove buttons
	// add total at end
}

function updateCartNav() {
	if(localStorage.getItem("cart") == null) {
		document.getElementById("cart-display").innerHTML = "Cart (0)";
	} else {
		// match with } closing JSON bracket to get number of items
		var items = (localStorage.getItem("cart").match(/,/g)||[]).length;
		document.getElementById("cart-display").innerHTML = "Cart (" + items + ")";
	}
}

if(window.location.href.split("/").slice(-1) == "cart.html") {
	loadCartToMain();
}

window.onload = updateCartNav();