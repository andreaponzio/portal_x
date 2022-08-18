/**
 *  Permette di gestire il passaggio allo step successivo oppure tornare allo
 *  step precedente..
 */
function process(value) {
   switch(value) {
      case "-":
         document.querySelector("#_command").value = "back";
         break;

      case "+":
         document.querySelector("#_command").value = "next";
         break;

      case "$":
         document.querySelector("#_command").value = "reset";
         break;

      case "!":
         document.querySelector("#_command").value = "suspend";
         break;
   }
   document.querySelector("#submit").submit();
}