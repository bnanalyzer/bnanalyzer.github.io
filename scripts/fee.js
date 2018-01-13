var fees = getFees();
setInterval(getFees, 30000);

function getFees() {
    var resp;
    var data = [] //minMinutes, maxMinutes, minFee, maxFee, memCount
    $.ajax({
        async: false,
        type: "GET",
        url: "https://bitcoinfees.earn.com/api/v1/fees/list",
        dataType: "json",
        success: function(res) {
            resp = res;
        }
    });
    for (var i = 0; i < resp.fees.length; i++) {
        var temp = [];
        temp.push(resp.fees[i].minMinutes);
        temp.push(resp.fees[i].maxMinutes);
        temp.push(resp.fees[i].minFee);
        temp.push(resp.fees[i].maxFee);
        temp.push(resp.fees[i].memCount);
        data.push(temp);
    }
    fees = data;
    console.log(fees)
    return data;
}

function popSlider() {
    $("#min").text(fees[0][2] + " sat/B");
    $("#max").text(fees[fees.length - 1][2] + " sat/B");
    $("#ex1").attr("data-slider-min", fees[0][2]);
    $("#ex1").attr("data-slider-max", fees[fees.length - 1][2]);
    var reasonableFee;
    var ctr = 0;
    while (fees[ctr][1] >= 1000) {
        ctr += 1;
    }
    reasonableFee = fees[ctr][2];
    $("#ex1").attr("data-slider-value", reasonableFee);
}

function calculate(ctr, size) {
    console.log(fees[ctr], size);
    var rate = [fees[ctr][2] * (10e-9), fees[ctr][3] * (10e-9)];
    $("#fee").text((rate[0] * size).toFixed(8) + "-" + (rate[1] * size).toFixed(8) + " BTC");
    $("#mins").text(fees[ctr][1]);

}

$(document).ready(function() {
    popSlider();
    var ctr = 0;
    var rate = $("#ex1").attr("data-slider-value");
    while (fees[ctr][2] < rate) {
        ctr += 1;
    }
    calculate(ctr, $("#size").val());
    $('#ex1').slider({
        formatter: function(value) {
            return 'Current fee: ' + value + ' sat/B';
        }
    });
    $("#size").on("keypress", function() {
        $(this).val($(this).val().replace(/\D/g, ''));
        var rate = $(".feeslider").val();
        var ctr = 0;
        while (fees[ctr][2] < rate) {
            ctr += 1;
        }
        calculate(ctr, $("#size").val());
    });

    $("#ex1").on("change", function(se) {
        var ctr = 0;
        while (fees[ctr][2] < $(this).val()) {
            ctr += 1
        }
        calculate(ctr, $("#size").val());
    });

    var timer;
    $(".in").on("change paste", function(e) {
        clearTimeout(timer);
        if ($(this).val()) {
            timer = setTimeout(done(e), 2500);
        }

        function done(el) {
            console.log($(el.target).val());
            if ($(el.target).val().length == 64) {
                var url = "https://blockchain.info/rawtx/" + $(el.target).val() + "?cors=true";
                var fee;
                var size;
                $.ajax({
                    async: false,
                    type: "GET",
                    url: url,
                    dataType: "json",
                    success: function(res) {
                        console.log(res);
                        if (typeof res.inputs["0"].prev_out == "undefined") {
                            $(".result").text("This is a coinbase transaction. Feeless!");
                        }
                        else {
                            if (typeof res.block_height == "undefined") {
                                var sumIn = 0;
                                var sumOut = 0;
                                for (var i = 0; i < res.inputs.length; i++) {
                                    sumIn += res.inputs[i].prev_out.value * 10e-9;
                                }
                                for (var i = 0; i < res.out.length; i++) {
                                    sumOut += res.out[i].value * 10e-9;
                                }
                                fee = (sumIn - sumOut).toFixed(8);
                                size = res.size;
                                var ctr = 0;
                                console.log((fee / size) * 10e7);
                                while (fees[ctr][2] < (fee / size) * 10e7) {
                                    ctr += 1;
                                }
                                $(".result").text("This transaction is " + size + " bytes large with a fee of " + fee + "BTC, or " + Math.floor((fee / size) * 10e7) + "sat/B. It should confirm within " + fees[ctr][1] + " minutes.");
                            }
                            else {
                                $(".result").text("This transaction is already confirmed.");
                            }
                        }
                    }
                });
            }
            else {
                $(".result").text("");
            }
        }
    });
});
