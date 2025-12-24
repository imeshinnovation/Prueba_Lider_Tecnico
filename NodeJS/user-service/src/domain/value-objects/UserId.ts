// src/domain/value-objects/UserId.ts
export class UserId {
    constructor(private readonly _value: string) {
        if (!_value) throw new Error('El UserId no puede estar vacio');
        if (!/^[0-9a-fA-F]{24}$/.test(_value)) throw new Error('El formato del UserId no es valido');
    }

    get value(): string {
        return this._value;
    }

    equals(other: UserId): boolean {
        return this._value === other.value;
    }
}