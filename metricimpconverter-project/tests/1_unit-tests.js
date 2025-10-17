const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function() {

  test('Should correctly read a whole number input', function() {
    assert.equal(convertHandler.getNum('5kg'), 5);
  });

  test('Should correctly read a decimal number input', function() {
    assert.equal(convertHandler.getNum('5.4kg'), 5.4);
  });

  test('Should correctly read a fractional input', function() {
    assert.equal(convertHandler.getNum('1/2kg'), 0.5);
  });

  test('Should correctly read a fractional input with a decimal', function() {
    assert.equal(convertHandler.getNum('5.4/2kg'), 2.7);
  });

  test('Should correctly return an error on a double-fraction', function() {
    assert.equal(convertHandler.getNum('3/2/3kg'), 'invalid number');
  });

  test('Should correctly default to a numerical input of 1 when no number is provided', function() {
    assert.equal(convertHandler.getNum('kg'), 1);
  });

  test('Should correctly read each valid input unit', function() {
    const input = ['gal', 'L', 'mi', 'km', 'lbs', 'kg'];
    input.forEach((u) => {
      assert.equal(convertHandler.getUnit('3' + u), u);
    });
  });

  test('Should correctly return an error for an invalid input unit', function() {
    assert.equal(convertHandler.getUnit('32g'), 'invalid unit');
  });

  test('Should return the correct return unit for each valid input unit', function() {
    const input = ['gal', 'L', 'mi', 'km', 'lbs', 'kg'];
    const output = ['L', 'gal', 'km', 'mi', 'kg', 'lbs'];
    input.forEach((u, i) => {
      assert.equal(convertHandler.getReturnUnit(u), output[i]);
    });
  });

  test('Should correctly return the spelled out string unit for each valid input unit', function() {
    const input = ['gal', 'L', 'mi', 'km', 'lbs', 'kg'];
    const output = ['gallons', 'liters', 'miles', 'kilometers', 'pounds', 'kilograms'];
    input.forEach((u, i) => {
      assert.equal(convertHandler.spellOutUnit(u), output[i]);
    });
  });

  test('Should correctly convert gal to L', function() {
    assert.approximately(convertHandler.convert(1, 'gal'), 3.78541, 0.00001);
  });

  test('Should correctly convert L to gal', function() {
    assert.approximately(convertHandler.convert(1, 'L'), 0.26417, 0.00001);
  });

  test('Should correctly convert mi to km', function() {
    assert.approximately(convertHandler.convert(1, 'mi'), 1.60934, 0.00001);
  });

  test('Should correctly convert km to mi', function() {
    assert.approximately(convertHandler.convert(1, 'km'), 0.62137, 0.00001);
  });

  test('Should correctly convert lbs to kg', function() {
    assert.approximately(convertHandler.convert(1, 'lbs'), 0.453592, 0.00001);
  });

  test('Should correctly convert kg to lbs', function() {
    assert.approximately(convertHandler.convert(1, 'kg'), 2.20462, 0.00001);
  });
});
