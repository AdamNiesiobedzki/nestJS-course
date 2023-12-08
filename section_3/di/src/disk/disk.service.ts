import { Injectable } from '@nestjs/common';
import { PowerService } from 'src/power/power.service';

@Injectable()
export class DiskService {

    constructor(private powerService: PowerService){}

    getData(){
        console.log("Drawing 20 watts of power from Power Service");
        this.powerService.suplyPower(20);
        return "data";
    }
}
