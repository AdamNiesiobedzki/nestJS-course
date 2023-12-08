import { Injectable } from '@nestjs/common';

@Injectable()
export class PowerService {

    suplyPower(watts: number){
        console.log('Supplying ' + watts + ' worth of power.');
    }
}
