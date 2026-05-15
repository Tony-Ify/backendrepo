import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator';

enum State {
  Lagos = 'Lagos',
  Abuja = 'Abuja',
  Kano = 'Kano',
  Kaduna = 'Kaduna',
  Enugu = 'Enugu',
  PortHarcourt = 'Port Harcourt',
  Ibadan = 'Ibadan',
  BeninCity = 'Benin City',
  Jos = 'Jos',
  Katsina = 'Katsina',
  Owerri = 'Owerri',
  Abeokuta = 'Abeokuta',
  Osogbo = 'Osogbo',
  Ilorin = 'Ilorin',
  Lokoja = 'Lokoja',
  Akure = 'Akure',
  Calabar = 'Calabar',
  Umuahia = 'Umuahia',
  Yenagoa = 'Yenagoa',
  Asaba = 'Asaba',
  Maiduguri = 'Maiduguri',
  Gusau = 'Gusau',
  BirnKebbi = 'Birnin Kebbi',
  Gombe = 'Gombe',
  Damaturu = 'Damaturu',
  Makurdi = 'Makurdi',
  Lafia = 'Lafia',
  Bauchi = 'Bauchi',
  Dutse = 'Dutse',
  FCT = 'Federal Capital Territory',
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
  @MaxLength(100)
  password!: string;

  @IsEnum(State)
  state!: string;
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