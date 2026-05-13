import { IsEmail, IsString, MinLength, MaxLength, IsEnum, IsOptional } from 'class-validator';

export enum State {
  LAGOS = 'Lagos',
  ABUJA = 'Abuja',
  KANO = 'Kano',
  KADUNA = 'Kaduna',
  ENUGU = 'Enugu',
  PORT_HARCOURT = 'Port Harcourt',
  IBADAN = 'Ibadan',
  BENIN_CITY = 'Benin City',
  JOS = 'Jos',
  KATSINA = 'Katsina',
  OWERRI = 'Owerri',
  ABEOKUTA = 'Abeokuta',
  OSOGBO = 'Osogbo',
  ILORIN = 'Ilorin',
  LOKOJA = 'Lokoja',
  AKURE = 'Akure',
  CALABAR = 'Calabar',
  UMUAHIA = 'Umuahia',
  YENAGOA = 'Yenagoa',
  ASABA = 'Asaba',
  MAIDUGURI = 'Maiduguri',
  GUSAU = 'Gusau',
  BIRNIN_KEBBI = 'Birnin Kebbi',
  GOMBE = 'Gombe',
  DAMATURU = 'Damaturu',
  MAKURDI = 'Makurdi',
  LAFIA = 'Lafia',
  BAUCHI = 'Bauchi',
  DUTSE = 'Dutse',
  FEDERAL_CAPITAL_TERRITORY = 'Federal Capital Territory',
}

export class SignUpDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password!: string;

  @IsEnum(State)
  state!: State;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class AuthResponseDto {
  id!: number;
  name!: string;
  email!: string;
  state!: string;
  role!: string;
  accessToken!: string;
  expiresIn!: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken!: string;
}