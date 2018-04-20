var assert = require('assert');

var G25Mapping = require('./../code/data-map.js');

var memoryPrev = {
    'wheel': {
        'turn': 50,
        'shift_left' : 0,
        'shift_right': 0,
        'button_1': 0,
        'button_2': 0,
        'button_3': 0,
        'button_4': 0,
        'button_5': 0,
        'button_6': 0
    },
    'shifter': {
        'button_1': 0,
        'button_2': 0,
        'button_3': 0,
        'button_4': 0,
        'dpad': 0,
        'button_5': 0,
        'button_6': 0,
        'button_7': 0,
        'button_8': 0,
        'gear': 0
    },
    'pedals': {
        'gas'   : 0,
        'brake' : 0,
        'clutch': 0
    }
}

function bufferFromOctets(octetStr){
    // converts a buffer octet serialisation in the format <Buffer 08 00 00 72 93 ff ff 80 87 81 13 ff>
    // back to a buffer
    var octetArr = octetStr.slice(8,-1).split(" ");
    octetArr = octetArr.map(function(item){
        return parseInt('0x' + item);
    });
    return Buffer.from(octetArr);
}

function simulateWheelEvent (changedBufferPositions, sentBuffer){
    var memoryCopy = JSON.parse(JSON.stringify(memoryPrev));
    var wheelBuffer = bufferFromOctets(sentBuffer);
    return G25Mapping(changedBufferPositions,wheelBuffer,memoryCopy);
}

describe('The G25 Steering Wheel Library', function() {
  describe('detects direction changes initiated by the steering wheel', function (){
        var wheelPositions = [
            {name:"neutral", buffer: "<Buffer 08 80 00 b2 80 ff ff 80 82 17 1>", valueOk: (turn) => Math.round(turn) === 50 },
            {name:"left", buffer: "<Buffer 08 00 00 7e 56 ff ff 80 87 81 13 ff>", valueOk: (turn) => Math.round(turn) < 50},
            {name:"right", buffer: "<Buffer 08 00 00 2a a4 ff ff 80 88 80 13 ff>", valueOk: (turn) => Math.round(turn) > 50},
        ];

        wheelPositions.forEach(function(position){
            it(`detects when the wheel is turned in  ${position.name} direction`, function(){
                var currentWheelState = simulateWheelEvent([3,4], position.buffer);
                assert.ok(position.valueOk(currentWheelState.wheel.turn));
            });
        })

  });
  
  describe ('detects velocity changes triggered by the clutch, brake and gas pedal', function (){
        var pedals = [
            {name:"clutch", changedPositions: [11], pressedBuffer:"<Buffer 08 00 00 ba 80 ff ff 80 87 80 13 27>"},
            {name:"brake", changedPositions: [6], pressedBuffer:"<Buffer 08 00 00 ba 80 ff 00 80 86 80 13 ff>"},
            {name:"gas", changedPositions: [5], pressedBuffer:"<Buffer 08 00 00 ba 80 68 ff 80 87 80 13 ff>"},
        ];

        pedals.forEach(function(pedal){
            it(`detects when ${pedal.name} is pressed`, function(){
                var currentWheelState = simulateWheelEvent(pedal.changedPositions, pedal.pressedBuffer);
                assert.ok(currentWheelState.pedals[pedal.name] > 0);
            });

            it(`detects when ${pedal.name} is released`, function(){
                var noPedalsPressedBuffer = "<Buffer 08 00 02 b2 80 ff ff 80 b6 19 13 ff>";
                var currentWheelState = simulateWheelEvent(pedal.changedPositions, noPedalsPressedBuffer);
                assert.ok(currentWheelState.pedals[pedal.name] === 0);
            });
        });
        
  });  

  describe('detects gear changes via the H-type gear shifter', function() {
    var gears = [
        {name:"neutral", buffer: "<Buffer 08 00 00 fa 80 ff ff 80 8e 7d 13 ff>", parsedValue: 0},
        {name:"first", buffer: "<Buffer 08 10 00 b2 80 ff ff 80 48 ed 13 ff>", parsedValue: 1},
        {name:"second", buffer: "<Buffer 08 20 00 b2 80 ff ff 80 44 12 13 ff>", parsedValue: 2},
        {name:"third", buffer: "<Buffer 08 40 00 b2 80 ff ff 80 81 ef 13 ff>", parsedValue: 3},
        {name:"fourth", buffer: "<Buffer 08 80 00 b2 80 ff ff 80 82 17 13 ff>", parsedValue: 4},
        {name:"fifth", buffer: "<Buffer 08 00 01 b2 80 ff ff 80 b4 f1 13 ff>", parsedValue: 5},
        {name:"sixth", buffer: "<Buffer 08 00 02 b2 80 ff ff 80 b6 18 13 ff>", parsedValue: 6},
        {name:"reverse", buffer: "<Buffer 08 00 04 fa 80 ff ff 80 b5 18 1b ff>", parsedValue: -1},
    ];

    gears.forEach(function(gear){
        it(`should return ${gear.parsedValue} when ${gear.name} gear is set`, function(){
            var currentWheelState = simulateWheelEvent([2,3],gear.buffer);
            assert.equal(currentWheelState.shifter.gear, gear.parsedValue);
        })
    });
  });

});