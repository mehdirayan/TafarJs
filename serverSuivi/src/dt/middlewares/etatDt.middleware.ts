import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CreateDtDto } from '../dto/dt.dto';
import { eEtat, eTest } from '../interfaces/type';

@Injectable()
export class EtatDtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let dt:CreateDtDto = req.body
    
    //--------------- si non commencé operation>0  ----------> en cours /
    if (dt.état==eEtat.nonCommence && dt.opérations.length>0){
      req.body.état=eEtat.enCours
      req.body.test=eTest.pasFini
    }

    //--------------- si en cours operation =0  ----------> non comencé /

    if((dt.état==eEtat.enCours || dt.état==eEtat.achevée) && dt.opérations.length==0){
      req.body.état=eEtat.nonCommence
      req.body.test=eTest.pasFini
    }

    if(dt.état==eEtat.achevée && dt.test==eTest.pasFini){
      throw  new BadRequestException("Il faut indiquer le résultat du test")
    }

    next();
  }
}
