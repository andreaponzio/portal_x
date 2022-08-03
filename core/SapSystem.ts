/**
 * Librerie
 */
import * as mongoDB from "mongodb";
import {Base} from "./Base";

/**
 * Classe di gestione dei sistemi SAP presenti nel Portale.
 */
export class SapSystem extends Base {

   /**
    * Getter
    */
   get internal_id(): string {
      return this._document["internal_id"];
   };
   get description(): string {
      return this._document["description"];
   };
   get application_server(): string {
      return this._document["application_server"];
   };
   get port(): number {
      return this._document["port"];
   };
   get client(): number {
      return this._document["client"];
   };
   get service(): string {
      return this._document["service"];
   };
   get token(): boolean {
      return this._document["token"];
   };

   /**
    * Setter
    * @param value
    */
   set internal_id(value: string) {
      this._document["internal_id"] = value;
   };
   set description(value: string) {
      this._document["description"] = value;
   };
   set application_server(value: string) {
      this._document["application_server"] = value;
   };
   set port(value: number) {
      this._document["port"] = value;
   };
   set client(value: number) {
      this._document["client"] = value;
   };
   set service(value: string) {
      this._document["service"] = value;
   };
   set token(value: boolean) {
      this._document["token"] = value;
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
      super.new("sapsys");
   };

   /**
    * Effettua controllo proprietà obbligatorie.
    */
   public check(): void {
      super.check();
      if(this.internal_id === undefined || this.description === undefined ||
         this.application_server === undefined || this.port === undefined ||
         this.client === undefined || this.service === undefined)
         throw new Error("mandatory fields missing");
   };
}