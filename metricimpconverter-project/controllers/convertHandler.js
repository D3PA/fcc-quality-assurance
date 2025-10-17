function ConvertHandler() {
  const validUnits = ['gal','l','lbs','kg','mi','km'];
  
  this.getNum = function(input) {
    let result;
    let regex = /^[\d\.\/]+/; // grabs the number - fraction part
    let numStr = input.match(regex) ? input.match(regex)[0] : '';
    
    if(!numStr) return 1; // default
    
    if(numStr.split('/').length > 2) return 'invalid number'; // double fraction
    
    try {
      if(numStr.includes('/')) {
        let [numerator, denominator] = numStr.split('/');
        result = parseFloat(numerator) / parseFloat(denominator);
      } else {
        result = parseFloat(numStr);
      }
      if(isNaN(result)) return 'invalid number';
    } catch(e) {
      return 'invalid number';
    }
    
    return result;
  };
  
  this.getUnit = function(input) {
    let unit = input.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if(unit === 'l') unit = 'L'; 
    return validUnits.includes(unit.toLowerCase()) || unit === 'L' ? unit : 'invalid unit';
  };
  
  this.getReturnUnit = function(initUnit) {
    const map = { gal: 'L', L: 'gal', lbs: 'kg', kg: 'lbs', mi: 'km', km: 'mi' };
    return map[initUnit];
  };

  this.spellOutUnit = function(unit) {
    const map = { gal: 'gallons', L: 'liters', lbs: 'pounds', kg: 'kilograms', mi: 'miles', km: 'kilometers' };
    return map[unit];
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    
    let result;
    switch(initUnit) {
      case 'gal': result = initNum * galToL; break;
      case 'L':   result = initNum / galToL; break;
      case 'lbs': result = initNum * lbsToKg; break;
      case 'kg':  result = initNum / lbsToKg; break;
      case 'mi':  result = initNum * miToKm; break;
      case 'km':  result = initNum / miToKm; break;
    }
    return parseFloat(result.toFixed(5));
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    const initUnitFull = this.spellOutUnit(initUnit);
    const returnUnitFull = this.spellOutUnit(returnUnit);
    return `${initNum} ${initUnitFull} converts to ${returnNum} ${returnUnitFull}`;
  };
}

module.exports = ConvertHandler;