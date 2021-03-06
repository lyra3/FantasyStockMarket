// Placeholder 'clicker' stuff -------------------------------------------------

var gold = 50;
function basicClick(n) {
    gold = gold + n;
    document.getElementById("gold").innerHTML = gold;
}

var adventurers = 0;

function hireAdventurer(n) {
    var adventurerCost = Math.floor(10 * Math.pow(1.25,adventurers))
    if (gold >= adventurerCost) {
        adventurers = adventurers + 1;
        gold = gold - adventurerCost;
        document.getElementById("gold").innerHTML = gold.toFixed(2);
        document.getElementById("adventurers").innerHTML = adventurers;
    }
    var nextCost = Math.floor(10 * Math.pow(1.25,adventurers));
    document.getElementById("adventurerCost").innerHTML = nextCost;
}

// Item handling ---------------------------------------------------------------

function Item(name, quantity, price, bias, vol) {
    this.name = name;
    this.quantity = quantity;
    this.price = price;
    this.bias = bias;           //Item will trend towards this price value
    this.vol = vol;             //The +/- value that represents max/min prices
    //volume?                   //     e.g., bias=50 vol=20, max/min = 70/30
}

var scrolls = new Item("scroll", 0, 10, 20, 10);
var swords = new Item("sword", 0, 80, 80, 20);
var allItems = [scrolls, swords];

//debug functions to control bias/volatility
for (item of allItems) {
    document.getElementById(item.name + "Bias").innerHTML = item.bias; //lol
    document.getElementById(item.name + "Vol").innerHTML = item.vol;
}

function b_up(item) {item.bias = item.bias + 1; document.getElementById(item.name + "Bias").innerHTML = item.bias;}
function b_down(item) {item.bias = item.bias - 1; document.getElementById(item.name + "Bias").innerHTML = item.bias;}
function v_up(item) {item.vol = item.vol + 1; document.getElementById(item.name + "Vol").innerHTML = item.vol;}
function v_down(item) {item.vol = item.vol - 1; document.getElementById(item.name + "Vol").innerHTML = item.vol;}


function buyItem(n, item) {
    if (gold >= item.price * n) {
        item.quantity = item.quantity + n;
        gold = Number((gold - item.price * n).toFixed(2));
        document.getElementById("gold").innerHTML = gold;
        document.getElementById(item.name + "Quantity").innerHTML = item.quantity;
    }
}

function sellItem(n, item) {
    if (item.quantity >= n) {
        item.quantity = item.quantity - n;
        gold = Number((gold + item.price * n).toFixed(2));
        document.getElementById("gold").innerHTML = gold;
        document.getElementById(item.name + "Quantity").innerHTML = item.quantity;
    }
}

// Game loop and price modulation-----------------------------------------------

function priceShift(bias, vol, price) {
    // Returns the value of daily movement. E.g. -$15 for the day
    // Bias is the 'target' price
    // Vol is the range of prices, stored as absolute value of offset from bias
    // The price can not move more than range/4 (vol/2) per day
    // if the price is within 1 maxMove of ceiling or floor, the price will
    //      either stay the same, or it will move opposite of ceil/floor

    var maxMove = Math.floor(vol /2); //dont move more than vol/2
    var move = Math.floor((Math.random() * maxMove + 1));

    if (price >= bias+vol) { //if price > ceiling, it must trend down
        return 0 - move;
    } else if (price <= bias-vol) { // if price < floor, it must trend up
        return move;
    } else { //otherwise just 50/50 up or down
        if (Math.floor(Math.random() * 2) == 0) {
            return move;
        } else {
            return 0 - move;
        }
    }
}

var time = 0;
var gamespeed = 500;

window.setInterval(function() {
    // This function will run every gamespeed ms. Generally updates the price of
    // items (as well as the player's money from 'clicker' stuff) and then
    // draws this to the screen.

    time = time + 1;
    basicClick(adventurers);

    //essentially, do a double price update at midnight
    if (time % 24 == 0) {
        for (item of allItems) {
            item.price = item.price + priceShift(item.bias, item.vol, item.price);
        }
    }
    if (time % 6 == 0) {
        for (item of allItems) {
            item.price = item.price + priceShift(item.bias, item.vol, item.price);
        }
    }

    for (item of allItems) {
        document.getElementById(item.name + "Price").innerHTML = item.price.toFixed(2);
    }

    document.getElementById("tradingDay").innerHTML = Math.floor(time/24) + 1;
    document.getElementById("tradingHour").innerHTML = Math.floor(time % 24);
    document.getElementById("hour").innerHTML = time;
}, gamespeed);
