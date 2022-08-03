/**
 * Librerie
 */
import * as mongoDB from "mongodb";
import {Base} from "./Base";
import {User} from "./User";

/**
 * Classe di gestione dei sistemi SAP associati a un utente.
 */
export class MySap extends Base {

   /**
    * Getter
    */
   get id(): mongoDB.ObjectId {
      return this._document["id"];
   };
   get system(): mongoDB.ObjectId {
      return this._document["system"];
   };
   get sapUserLogon(): string {
      return this._document["logon"]["user"];
   };
   get sapPasswordLogon(): string {
      return Base.decrypt(this._document["logon"]["password"]);
   };
   get monitor(): object[] {
      return this._document["monitor"];
   };

   /**
    * Setter
    * @param value
    */
   set id(value: mongoDB.ObjectId) {
      this._document["id"] = value;
   };
   set system(value: mongoDB.ObjectId) {
      this._document["system"] = value;
   };

   /**
    * Costruttore della classe.
    */
   constructor() {
      super();
      this._collection = this.getCollection("sap");
   };

   /**
    * Inizializza il documento per un nuovo sistema SAP.
    */
   public new(): void {
      super.new("mysap");
   };

   /**
    * Carica il documento dello specifico sistema SAP associato all'utente:
    * @param email
    * @param system
    */
   public async loadBySystem(email: string, system: mongoDB.ObjectId): Promise<void> {
      let result: object[] = await this._select(this._collection, {"email": email, "system": system});
      this._document = result[0];
   };

   /**
    * Effettua controllo proprietà obbligatorie.
    */
   public check(): void {
      super.check();
      if(this.id === undefined)
         throw new Error("mandatory fields missing");
   };

   /**
    * Permette d'impostare l'utenza e la password per la connessione
    * al sistema SAP. Se uno dei due elementi è vuoto, allora la proprietà
    * "logon" viene eliminata.
    * @param sapUser
    * @param sapPassword
    */
   public setSapLogon(sapUser: string = "", sapPassword: string = ""): void {
      if(this._document["logon"] === undefined)
         this._document["logon"] = {};
      if(sapUser.length !== 0 && sapPassword.length !== 0) {
         this._document["logon"]["user"] = sapUser;
         this._document["logon"]["password"] = Base.encrypt(sapPassword);
      } else
         delete this._document["logon"];
      ;
   }

   /**
    * Aggiunge un utente SAP da tenere sotto controllo per eventuali blocchi o
    * reset di password.
    * @param sapUser
    */
   public addUserToMonitor(sapUser: string): void {
      if(this._document["monitor"] === undefined)
         this._document["monitor"] = [];

      if(sapUser.length !== 0 && this._document["monitor"].findIndex(d => d.user == sapUser) === -1)
         this._document["monitor"].push({
            "user": sapUser
         });
   };

   /**
    * Rimuove un utente SAP dal monitor.
    * @param sapUser
    */
   public removeUserFromMonitor(sapUser: string): void {
      this._document["monitor"] = this._document["monitor"].filter(d => d.user != sapUser);
      if(this._document["monitor"].length === 0)
         delete this._document["monitor"];
   };
}