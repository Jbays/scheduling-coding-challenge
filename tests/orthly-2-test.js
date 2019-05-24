const expect = require('chai').expect;
const { mockSchedules, genTimeSlots } = require('../orthly-2');

describe('all functions to complete this coding assessment: \n',()=>{
  describe('genTimeSlots',()=>{
    let allPossibleTimeSlots = genTimeSlots(mockSchedules);

    it('should be a function',()=>{
      expect(genTimeSlots).to.be.a('function');
    });
    it('should generate timeSlots for every dentist in schedules',()=>{
      let allDentists = Object.keys(allPossibleTimeSlots);
      
      expect(allDentists[0]).to.equal('1');
      expect(allDentists[1]).to.equal('2');
      expect(allDentists.length).to.equal(2);
    });
    it('should generate correct amount of timeSlots (given dentist availability)',()=>{
      let dentistOnesTimeSlots = allPossibleTimeSlots[1];
      let dentistTwosTimeSlots = allPossibleTimeSlots[2];
      
      expect(dentistOnesTimeSlots.length).to.equal(8);
      expect(dentistTwosTimeSlots.length).to.equal(8);
    });
    describe('should output an object whose',()=>{
      it('outermost keys are provider numbers',()=>{
        let hasDentistOne = allPossibleTimeSlots.hasOwnProperty('1');
        let hasDentistTwo = allPossibleTimeSlots.hasOwnProperty('2');
  
        expect(hasDentistOne).to.equal(true);
        expect(hasDentistTwo).to.equal(true);
      });
      it('values are arrays',()=>{
        let hasDentistOne = Array.isArray(allPossibleTimeSlots['1']);
        let hasDentistTwo = Array.isArray(allPossibleTimeSlots['2']);
  
        expect(hasDentistOne).to.equal(true);
        expect(hasDentistTwo).to.equal(true);
      });
    })
  });
});