var app = new Vue({
    el: '#hamming-encoder',
    data: {
        dataBits: [],
        status: '',
        numberOfDataBits: 4,
        parityBits: [],
        useParityBit: [],
    },
    created: function() {
        this.initDataBits();
    },
    methods: {
        initDataBits: function() {
            this.dataBits = [];
            var numBits = parseInt(this.numberOfDataBits);

            for (var i = 0; i < numBits; i++) {
                var bit = { data: null };
                this.dataBits.push(bit);
            }

            // Initialize parityBits array
            this.parityBits = [];
            for (var j = 0; j < Math.ceil(Math.log2(numBits + 1)); j++) {
                this.parityBits.push({ data: null });
            }
        },
        send: function() {
            if (this.validate(this.dataBits) === true) {
                var encodedMessage = this.encode(this.dataBits);
                // this.status = encodedMessage + ' encoded sent to server';

                return axios.put("http://localhost:3000/message", { bits: encodedMessage }).then(
                    response => (this.status = response.data)
                );
            } else {
                this.status = 'Input is not valid. Please use 0 or 1 as data bit values';
            }
        },
        encode: function(bits) {
            var numDataBits = bits.length;
            var numParityBits = this.parityBits.length;

            var encodedMessage = [];
            var parityPositions = [];

            // Calculate parity bits
            for (var i = 0; i < numParityBits; i++) {
                var position = Math.pow(2, i) - 1; // Calculate position of parity bit
                parityPositions.push(position);
                if (this.useParityBit[i]) {
                    var parity = this.calculateParity(position, bits);
                    encodedMessage[position] = parity;
                } else {
                    encodedMessage[position] = null; // Mark parity bit as not used
                }
            }

            // Fill in data bits and adjust parity bits accordingly
            var dataIndex = 0;
            for (var j = 0; j < numDataBits + numParityBits; j++) {
                if (!parityPositions.includes(j)) {
                    encodedMessage[j] = parseInt(bits[dataIndex].data);
                    dataIndex++;
                }
            }

            console.log("Control bits: " + parityPositions.join(","));
            return encodedMessage;
        },
        calculateParity: function(position, bits) {
            var parity = 0;
            for (var i = position; i < bits.length; i++) {
                if (((i + 1) & (position + 1)) !== 0) { // Check if the bit should be included in the parity calculation
                    parity ^= parseInt(bits[i].data); // XOR operation to calculate parity
                }
            }
            return parity;
        },
        validate: function(bits) {
            for (var i = 0; i < bits.length; i++) {
                if (this.validateBit(bits[i].data) === false)
                    return false;
            }
            return true;
        },
        validateBit: function(character) {
            if (character === null) return false;
            return (parseInt(character) === 0 ||
                parseInt(character) === 1);
        }
    }
});
