let g = 1, h = 2, v = 3, x = 4;
const c = h*((x*g) | (x*h) | (v*g) | (v*h))
const r = v - (x*c)

const check1 = (v * g)
const check2 = (r * g) + c * (x*g)

const check3 = (v * h)
const check4 = (r * h) + c * (x * h)
console.log(check1);
console.log(check2);
console.log(check3);
console.log(check4);


