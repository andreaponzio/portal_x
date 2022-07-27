/**
 * Librerie
 */
import * as winston from "winston";

import {Base} from "./Base";

/**
 * Classe con metodi du utilità.
 */
export class Util extends Base {

   /**
    * Permette di creare una collazione.
    * @param logger
    * @param name
    */
   public static newCollection(logger: winston.Logger, name: string) {
      this.database.createCollection(name).catch(error => {
         logger.error(error.message);
         throw error;
      });
   }
}