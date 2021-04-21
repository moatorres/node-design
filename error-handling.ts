// from https://gist.github.com/pauloafpjunior

// Value object
class CityName {

    static readonly MIN_LEN_NAME: number = 3
    static readonly MAX_LEN_NAME: number = 100

    private constructor(private _name: string) { }

    // Factory method with validation rules
    static create(name: string): [CityName, Error] {
        if (name == null || name.trim().length < CityName.MIN_LEN_NAME || name.trim().length > CityName.MAX_LEN_NAME) {
            return [
                null,
                new InvalidNameError(name)
            ];
        }
        
        // No validation errors
        return [new CityName(name), null]
    }

    get name(): string { return this._name; }
}

// Validation error
class InvalidNameError extends Error {
    constructor(name: string) {
        super(`The name "${name}" is not valid!`)
    }
}

// Input
const text = prompt('Type the city name: ');

// How to use
const [city, error] = CityName.create(text);

if (error != null) {
    alert(`Error: ${error.message}`);
} else {
    alert(`Welcome to ${city.name}`)
}
