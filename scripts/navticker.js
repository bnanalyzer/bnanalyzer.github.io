var apiurl = "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + "BTC" + "&tsyms=" + "USD,CAD";

function updateTicker() {
    $.ajax({
        type: "GET",
        url: apiurl,
        dataType: "json",
        success: function(res) {
            $("#tickerUSD").text("BTC/USD: " + res.BTC.USD);
            $("#tickerCAD").text("BTC/CAD: " + res.BTC.CAD);
        }
    });
}

$(document).ready(function() {
    updateTicker();
    setInterval(updateTicker, 30000);
});