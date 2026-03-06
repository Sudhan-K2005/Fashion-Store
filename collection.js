var sidenavbar = document.querySelector(".side-navbar")
function shownavbar() {
    sidenavbar.style.left = "0"
}
function closenavbar() {
    sidenavbar.style.left = "-60%"
}
var search = document.getElementById("search")
var productContainer = document.getElementById("products")
var productList = productContainer.querySelectorAll(".product-box")

search.addEventListener("keyup", function (event) {

    var enteredValue = event.target.value.toUpperCase()

    for (var count = 0; count < productList.length; count++) {

        var productName = productList[count].querySelector("p").textContent

        if (productName.toUpperCase().indexOf(enteredValue) < 0) {
            productList[count].style.display = "none"
        } else {
            productList[count].style.display = ""
        }
    }
})
