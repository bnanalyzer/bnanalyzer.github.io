var url = "https://api.coinmarketcap.com/v1/ticker/?limit=20&convert=CAD";
var data = getData();
setInterval(getData, 15000);

function getData() {
    var temp = []; // [[ticker, [USD, CAD]], [ticker, [USD, CAD]], ...]
    $.ajax({
        async: false,
        type: "GET",
        url: url,
        dataType: "json",
        success: function(res) {
            for (var i = 0; i < 20; i++) {
                temp.push([res[i].symbol, [res[i].price_usd, res[i].price_cad]]);
            }
        }
    });
    data = temp;
    return temp;
}

function displayCoins() {
    $("#selectedCoin span").text(data[0][0]);
    for (var i = 0; i < data.length; i++) {
        $("#crypto").find(".currencies").append('<li class="currency" coin="' + data[i][0] + '">' + data[i][0] + '</li>');
    }
}

function calculate(toWhich) {
    var coin = $("#selectedCoin span").text();
    var fiat = $("#selectedFiat span").text();
    var where = 0;
    while (data[where][0] != coin)
        where++;
    var rate;
    if (fiat == "USD") 
        rate = data[where][1][0];
    else
        rate = data[where][1][1];
    if (toWhich == "fiat") {
        var coinAmt = $("#coinValue").val();
        var toAmt = parseFloat(Math.round(coinAmt * rate * 100) / 100).toFixed(2);
        $("#fiatValue").val(toAmt);
    }
    else {
        var fiatAmt = $("#fiatValue").val();
        var toAmt = fiatAmt / rate;
        $("#coinValue").val(toAmt);
    }
}
$(document).ready(function() {
    displayCoins();
    calculate("fiat");
    $("#coinValue").on("input propertychange", function(e) {
        e.stopPropagation();
        calculate("fiat");
    });
    
    $("#fiatValue").on("input propertychange", function(e) {
        e.stopPropagation();
        calculate("coin");
    });
    $(".button").on("click", function(e) {
        e.stopPropagation();
        $(this).find(".list").toggle();
    });
    
    $(document).on("click", function() {
       $(".list").hide(); 
    });
    
    $(".currencies").on("click", "li", function(e) {
        e.stopPropagation();
        var whichCoin = $(this).attr("coin");
        if (typeof whichCoin != typeof undefined && whichCoin !== false) {
            $("#selectedCoin span").text(whichCoin);
            calculate("fiat");
        }
        else {
            var whichFiat = $(this).attr("fiat");
            $("#selectedFiat span").text(whichFiat);
            calculate("coin");
        }
        $(this).parent().parent().hide();
    });
});