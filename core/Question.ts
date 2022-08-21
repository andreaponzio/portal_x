/**
 * Librerie
 */
import {Base} from "./Base";

/**
 * Classe di gestione delle domande, suggerimenti dall'esterno.
 */
export class Question extends Base {

   /**
    * Getter
    */
   get email() {
      return this._document["email"] ;
   };
   get title() {
      return this._document["title"];
   };
   get message() {
      return this._document["message"];
   };

   /**
    * Setter
    * @param value
    */
   set email(value: string) {
      this._document["email"] = value;
   };
   set title(value: string) {
      this._document["title"] = value;
   };
   set message(value: string) {
      this._document["message"] = value;
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
   };

   /**
    * Inizializza il documento per una nuova domando e/o suggerimento.
    */
   public new(): void {
      super.new("question");
      this._document["created_at"] = new Date();
   };


}