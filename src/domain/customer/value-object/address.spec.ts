import Address from "./address";

describe('Address Class', () => {

    it('should create an address successfully when all fields are valid', () => {
        const address = new Address('Main St', 123, '12345', 'Metropolis');
        expect(address).toBeInstanceOf(Address);
    });

    it('should throw an error if street is empty', () => {
        expect(() => {
            const address = new Address('', 123, '12345', 'Metropolis');
        }).toThrow('Street is required');
    });

    it('should throw an error if number is zero', () => {
        expect(() => {
            const address = new Address('Main St', 0, '12345', 'Metropolis');
        }).toThrow('Number is required');
    });

    it('should throw an error if zip is empty', () => {
        expect(() => {
            const address = new Address('Main St', 123, '', 'Metropolis');
        }).toThrow('Zip is required');
    });

    it('should throw an error if city is empty', () => {
        expect(() => {
            const address = new Address('Main St', 123, '12345', '');
        }).toThrow('City is required');
    });
});
