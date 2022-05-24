import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FsService {
    async deleteOne(file: any){
        fs.rm(file.path, (err)=>{
            if(err) console.log(err);
        })
    }
}
