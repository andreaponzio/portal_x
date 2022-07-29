/**
 * Librerie
 */
import * as mongoDB from "mongodb";
import {Base} from "./Base";

/**
 * File dati
 */

/**
 * Permette d'inizializzare una base dati MongoDB da zero per la
 * gestione del Portale.
 */
export class Initialize {
   private base: Base;

   public async init():Promise<void> {
      await Base.connection();
   }
}
