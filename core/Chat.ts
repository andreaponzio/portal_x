/**
 * Librerie
 */
import {ObjectId} from "mongodb";
import {Base} from "./Base";

/**
 * Classe di gestione delle chat tra utenti.
 */
export class Chat extends Base {

   /**
    * Getter
    */
   get owner(): ObjectId {
      return this._document["owner"];
   };
   get title(): string {
      return this._document["title"];
   };

   /**
    * Setter
    * @param value
    */
   set owner(value: ObjectId) {
      this._document["owner"] = value;
   };
   set title(value: string) {
      this._document["title"] = value;
   };

   /**
    * Costruttore della classe.
    */
   constructor() {
      super();
      this._collection = this.getCollection("chat");
   };

   /**
    * Effettua controllo proprietà obbligatorie.
    */
   public check(): void {
      super.check();
      if(this.title.length === 0 || this.owner === undefined)
         throw new Error("mandatory fields missing");
   };

   /**
    * Inizializza il documento per una nuova chat.
    */
   public new(): void {
      super.new("chat");
      this._document["created_at"] = new Date();
   };

   /**
    * Aggiunge un utente come partecipante alla chat. Ogni utente può partecipare
    * solo una volta alla stessa chat. Se la collezione dei partecipanti non esiste, lo crea.
    * @param id
    */
   public addUser(id: ObjectId): void {
      if(this._document["users"] === undefined)
         this._document["users"] = [];

      if(this._document["users"].findIndex(d => d.equals(id)) === -1)
         this._document["users"].push(id);
   };

   /**
    * Permette di eliminare un partecipante dalla chat. Se la collezione dei partecipanti
    * risulta vuota al termine, la elimina.
    * @param id
    */
   public delUser(id: ObjectId): void {
      let index: number = -1;

      index = this._document["users"].findIndex(d => d.equals(id));
      if(index !== -1)
         this._document["users"].splice(index, 1);
   };

   /**
    * Inserisce il messaggio dell'utente specificato all'interno della chat. Se la collezione
    * di messaggi non esiste,la crea. Utenti non ammessi alla chat genereranno un'eccezione.
    * @param id
    * @param message
    * @return message id
    */
   public send(id: ObjectId, message: string): ObjectId {
      let _id: ObjectId;

      if(this._document["users"].findIndex(d => d.equals(id)) === -1)
         throw new Error("user not allowed");

      if(message.length === 0)
         throw new Error("mandatory fields missing");

      if(this._document["messages"] === undefined)
         this._document["messages"] = [];
      _id = new ObjectId();
      this._document["messages"].push({
         "id": _id,
         "sender": id,
         "message": message,
         "moderate": false,
         "created_at": new Date()
      });

      return _id;
   };

   /**
    * Permette di moderare o cancellare un messaggio dalla chat. Sia in caso di moderazione sia
    * in caso di cancellazione, non sarà più possibile recuperare il contenuto precedente.
    * @param id
    * @param moderating
    */
   public recall(id: ObjectId, moderating: boolean = true): void {
      let index: number = -1;

      index = this._document["messages"].findIndex(d => d.id.equals(id));
      switch(moderating) {
         case false:
            this._document["messages"].splice(index, 1);
            break;

         default:
            this._document["messages"][index]["message"] = "< messaggio moderato dall'amministratore >";
            this._document["messages"][index]["moderate"] = true;
      }
   };
}