function decode(bits) {
    // Calculate Z vector
    var numDataBits = bits.length - Math.ceil(Math.log2(bits.length + 1));
    var zVector = [];

    for (var i = 0; i < Math.ceil(Math.log2(bits.length + 1)); i++) {
        var position = Math.pow(2, i) - 1;
        zVector.push(parity(calculateZ(position, bits, numDataBits)));
    }

    console.log("Z vector: " + zVector.join(","));

    var errorPosition = zVector.reduce((acc, cur, index) => acc + cur * Math.pow(2, index));
    var errorDetected = errorPosition !== 0;

    if (errorDetected) {
        bits[errorPosition - 1] = parity(bits[errorPosition - 1] + 1);
    }

    return { errorCorrected: errorDetected, errorPosition: errorPosition - 1, bits: bits };
}

function calculateZ(position, bits, numDataBits) {
    var z = 0;
    for (var i = position; i < bits.length; i++) {
        if (((i + 1) & (position + 1)) !== 0) { // Check if the bit should be included in the parity calculation
            z ^= parseInt(bits[i]); // XOR operation to calculate parity
        }
    }
    return z;
}

function parity(number) {
    return number % 2;
}

exports.decode = decode;
