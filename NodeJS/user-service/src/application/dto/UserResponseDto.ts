// src/application/dto/UserResponseDto.ts
export interface UserResponseDto {
    id: string;
    name: string;
    email: string;
    age?: number;
    createdAt: Date;
}