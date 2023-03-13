let g = 1, h = 2, v = 3, x = 0xffffff;
const hash = "e427373461b8607920e89c9e74f1aadef2231a70a389eb6e29e68fcca71ad4ca"
const smallerParts = hash.match(/.{1,6}/g).map(e => Number("0x" +e)); 

const check = function(hashCheck) {
    x = hashCheck;
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
}

smallerParts.forEach(hashPart => check(hashPart))





