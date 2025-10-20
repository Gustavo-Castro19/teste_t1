
//JEST SAMPLE FUNCTION TEST

test('two plus two is four', () => {
  expect(2 + 2).toBe(4);
});


test('number variable not equals string', ()=>{
  expect(2 !=='2').toBeTruthy();
})

function double(num) {
  if(!isNaN(num)) return num*2;
  else{
    throw new Error('non number paramater can\'t be doubled'); 
  }
}

test('double function', ()=>{
expect(double(4)).toBe(8);
expect(() => double('a')).toThrow(Error);
});
// END 


