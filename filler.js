const bigInt = require('big-integer')
const carSizes = {
    1: 67,
    2: 103,
    3: 103,
    4: 103,
    5: 67,
}

function randn_bm() { //normal distribution
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
    return num;
}

function fillCar(car, shift=0){
    let carSize = carSizes[car]
    let zeroes = new Array(carSize).fill(0);
    let numOfTakenSeats = Math.min(Math.floor(randn_bm()*carSize + shift), carSize)
    let takenSeats = []
    while (takenSeats.length < numOfTakenSeats){
        let index = Math.floor(Math.random()*carSize)
        if(takenSeats.indexOf(index) === -1) {
            takenSeats.push(index);
        }
    }
    
    let carArray = zeroes.map((item, index) => {
        if (takenSeats.indexOf(index) !== -1){
            return 1
        } else return 0
    })

    let layout = encodeCarLayout(carArray)
    
    let sum = 0
    carArray.forEach(s => {sum += s})
    return {car_num: car, free_seats: carSize-sum, layout: layout}
}
    

function encodeCarLayout(carArray){ //encode
    return BigInt('0b'+carArray.join('')).toString()
}


function fillTrain(trainID, shifts=new Array(carSizes.length).fill(0)){    
    let train = {
        "id": trainID,
        "cars": []
    }
    let carNums = Object.keys(carSizes)
    let totalFreeSeats = 0
    carNums.forEach((car, i) => {
        let res = fillCar(car, shifts[i])
        totalFreeSeats += res['free_seats']
        train.cars.push(res)
    })
    train['free_seats'] = totalFreeSeats

    return train
}

function randomizing(i){
    let rare = Math.random().toString().split('.')[1].startsWith(i.toString()[0]) ? -2 : 1
    let every13th = (i % 13 === 0) ? 40 : 1
    let initialCoefs = [5, 0, 0, 0, 5]
    let coefs = initialCoefs.map(coef => {
        return coef + rare*Math.floor(Math.random()*50) + every13th
    })
    return coefs
}

function decodeCarLayout (decimal, totalSeats) { 
    let bin = bigInt(decimal).toString(2)
    while (bin.length < totalSeats){
        bin = '0' + bin    
    }
    let binArray = Array.from(bin)
    return binArray
  }


exports.fillTrain = fillTrain
exports.randomizing = randomizing
exports.encodeCarLayout = encodeCarLayout
exports.decodeCarLayout = decodeCarLayout
exports.carSizes = carSizes