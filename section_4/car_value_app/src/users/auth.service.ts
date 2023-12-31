import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { NotFoundError } from "rxjs";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService{

    constructor(private usersService: UsersService){}


    async signup(email: string, password: string){
        const users = await this.usersService.find(email);
        if (users.length){
            throw new BadRequestException('email already in use');
        }
        
        //hashing password
        //Generate salt
        const salt = randomBytes(8).toString('hex');

        //Hash password and salt, 32 is output length
        const hash = await scrypt(password, salt, 32) as Buffer;

        //Join hash result and salt together
        const result = salt + '.' + hash.toString('hex');

        //Create new user and save it
        const user = await this.usersService.create(email, result);

        return user;
    }

    async signin(email: string, password: string){
        const [user] = await this.usersService.find(email); 
        if(!user){
            throw new NotFoundException('User not found');
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = await scrypt(password, salt, 32) as Buffer;

        if (storedHash !== hash.toString('hex')){
            throw new BadRequestException('Bad password')
        }
        return user;
    }

}