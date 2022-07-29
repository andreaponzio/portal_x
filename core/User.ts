/**
 * Librerie
 */
import * as mongoDB from "mongodb";
import * as crypto from "bcrypt";
import {Base} from "./Base";

/**
 * File dati
 */
import {bcrypt} from "../public/config.json";

/**
 * Classe di gestione utenza registrate nel Portale.
 */
export class User extends Base {

   /**
    * Getter
    */
   get email(): string {
      return this._document["email"];
   };
   get name(): string {
      return this._document["name"];
   };
   get profile(): mongoDB.ObjectId {
      return this._document["profile"];
   };
   get password(): string {
      return this._document["password"];
   };
   get security(): string {
      return this._document["security"];
   };

   /**
    * Setter
    * @param value
    */
   set email(value: string) {
      this._document["email"] = value;
   };
   set name(value: string) {
      this._document["name"] = value;
   };
   set profile(value: mongoDB.ObjectId) {
      this._document["profile"] = value;
   };
   set password(value: string) {
      this._document["password"] = crypto.hashSync(value, bcrypt.salt);
   };
   set security(value: string) {
      this._document["security"] = crypto.hashSync(value, bcrypt.salt);
   };

   /**
    * Costruttore della classe.
    */
   constructor() {
      super();
      this._collection = this.getCollection("admin");
   };

   /**
    * Inizializza il documento per un nuovo utente.
    */
   public new(): void {
      super.new("user");
   };

   /**
    * Effettua controllo proprietà obbligatorie per l'oggetto utente.
    */
   public check(): void {
      super.check();
      if(this.email === undefined || this.name === undefined ||
         this.password === undefined || this.security === undefined)
         throw new Error("mandatory fields missing");
   };

   /**
    * Permette di accedere ad un utente tramite il suo indirizzo di posta usato in fase
    * di registrazione.
    * @param email
    */
   public async loadByEmail(email: string): Promise<void> {
      let result: object[] = await this._select(this._collection, {"email": email});
      this._document = result[0];
   };
}