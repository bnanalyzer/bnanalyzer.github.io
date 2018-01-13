var priceapi = "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + "BTC" + "&tsyms=" + "USD,CAD";
var infoapi = "https://api.blocktrail.com/v1/btc/block/latest?api_key=fb1f9e84fc6aa688cfa8b45e22cc0b203e338ad8";
var uncapi = "https://blockchain.info/q/unconfirmedcount?cors=true"; 
var capapi = "https://blockchain.info/q/totalbc?cors=true";

function updateTicker() {
    var BTCCAD;
    $.ajax({
        async: false,
        type: "GET",
        url: priceapi,
        dataType: "json",
        success: function(res) {
            BTCCAD = res.BTC.CAD;
            $("#tickerUSD").text("BTC/USD: " + res.BTC.USD);
            $("#tickerCAD").text("BTC/CAD: " + res.BTC.CAD);
        }
    });
    
    $.ajax({
        async: false,
        type: "GET",
        url: capapi,
        dataType: "text",
        success: function(res) {
            $("#mktCapCAD").text("Market Capitalization: " + (res * 10e-9 * BTCCAD).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " CAD");
        }
    });
    
    $.ajax({
        async: false,
        type: "GET",
        url: infoapi,
        dataType: "json",
        success: function(res) {
            $("#bh").html(res.height);
            $("#lbt").html(res.block_time);
            $("#lbn").html(res.nonce);
            $("#lbd").html(res.difficulty);
            $("#pool").html(res.miningpool_name);
            $("#tm").html(res.transactions);
            $("#tv").html("$" + ((res.value) * 10e-9 * BTCCAD).toFixed(2));
            $("#avgval").html("$" + (((res.value) * 10e-9 * BTCCAD) / res.transactions).toFixed(2));
            $("#avgsize").html(Math.round(res.byte_size / res.transactions) + "B");
        }
    });
    $.ajax({
        async: false,
        type: "GET",
        url: uncapi,
        dataType: "text",
        success: function(res) {
            $("#unc").html(res);
        }
    });
}

$(document).ready(function() {
    $.when(updateTicker()).then(function() {
        $('.marquee').marquee({
            duration: 15000,
            delayBeforeStart: 0,
            direction: 'right',
            duplicated: true
        });
    });
    
    setInterval(updateTicker, 30000);
});
