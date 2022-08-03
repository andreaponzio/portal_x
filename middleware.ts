/**
 * Librerie
 */
import * as express from "express";
import {ObjectId} from "mongodb";

/**
 * Verifica per ogni rotta su è presente un'autenticazione. Se nessun utente è
 * autenticato, riporta sulla pagina di login.
 * @param request
 * @param response
 * @param next
 * @constructor
 */
export function Authenticated(request: express.Request, response: express.Response, next: express.NextFunction) {
}