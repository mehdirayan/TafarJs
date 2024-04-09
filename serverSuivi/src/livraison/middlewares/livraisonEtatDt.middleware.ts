import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { eEtat } from '../../dt/interfaces/type';
import { CreateLivraisonDto } from '../dto/livraison.dto';

@Injectable()
export class LivraisonEtatDtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let livraison: CreateLivraisonDto = req.body

    const result = livraison.dts.filter(ele => {
      return ele.état != eEtat.achevée
    })

    if (livraison.dts.length > 0) {
      if (result.length) throw new BadRequestException("Il ya des DT pas achevée")
    }
    next();
  }
}
