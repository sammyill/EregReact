
export const passwortInput={
        startingvalue:"your password", 
        label:"Password", 
        type:"password", 
        id:"password", 
        name:"password", 
        whatIsRight:"Min 10 char and  Max 20 char and contains at lease 1 uppercase,1 lovercase,1 number", 
        constrolExpression:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,20}$/
    }

export const emailInput={
        startingvalue:"your email", 
         label:"Email", 
         type:"text", 
         id:"email", 
         name:"email", 
         whatIsRight:"inserisci un' email nel formato mioindirizzo@mioprovider.dominio", 
         constrolExpression:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    }
    
export const firstName={
        startingvalue:"first name of user", 
         label:"First Name", 
         type:"text", 
         id:"firstName", 
         name:"firstName", 
         whatIsRight:"inserisci un nome valido,non mettere numeri", 
         constrolExpression:/^[A-Za-zÀ-ÖØ-öø-ÿ' -]{3,30}$/
    }

export const lastName = {
  startingvalue: "last name of user",
  label: "Last Name",
  type: "text",
  id: "lastName",
  name: "lastName",
  whatIsRight: "Insert a valid surname, no numbers or symbols",
  constrolExpression: /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{3,30}$/
};

export const phone = {
  startingvalue: "es. +393401234567",
  label: "Numero di telefono",
  type: "tel",
  id: "phone",
  name: "phone",
  whatIsRight: "Inserisci un numero italiano valido. Può iniziare con +39 o 0039, seguito da 9 o 10 cifre",
  constrolExpression: /^(?:(?:\+|00)39)?[ \t-]*(?:(0(?:[ \t-]*\d){5,10})|(3(?:[ \t-]*\d){9,10}))$/
};

export const moduleName = {
  startingvalue: "Insert the module name ",
  label: "Module Name",
  type: "text",
  id: "moduleName",
  name: "moduleName",
  whatIsRight: "The name need to be between 5 and 50 characters",
  constrolExpression: /^.{5,50}$/
};

export const moduleDescription = {
  startingvalue: "Insert a description of the module",
  label: "Module description",
  rows:5,
  id: "moduleDescription",
  name: "moduleDescription",
  whatIsRight: "The descrption need to be between  50 and 500 characters",
  constrolExpression: /^.{50,500}$/
};


export const moduleLenght = {
  startingvalue: "0",
  label: "Length",
  type: "number",
  id: "moduleLenght",
  name: "moduleLenght",
  whatIsRight: "Min. length 5 hours and Max length 200",
  constrolExpression: /^(?:[5-9]|[1-9][0-9]|1[0-9]{2}|200)$/
};

export const age = {
  startingvalue: "Inserisci la tua età",
  label: "Età",
  type: "number",
  id: "age",
  name: "age",
  whatIsRight: "L'età deve essere un numero compreso tra 18 e 65",
  constrolExpression: /^(1[89]|[2-5][0-9]|6[0-5])$/
};

export const note = {
  startingvalue: "Aggiungi una nota (facoltativo)",
  label: "Nota",
  type: "text",
  id: "note",
  name: "note",
  whatIsRight: "La nota deve contenere massimo 200 caratteri",
  constrolExpression: /^.{0,200}$/
};

export const beginDate = {
  startingvalue: "",
  label: "Data Inizio",
  type: "datetime-local",
  id: "beginDate",
  name: "beginDate",
  whatIsRight: "Seleziona una data valida nel formato AAAA-MM-GG",
  constrolExpression:/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/
};

export const endDate = {
  startingvalue: "",
  label: "Data Fine",
  type: "datetime-local",
  id: "endDate",
  name: "endDate",
  whatIsRight: "Seleziona una data valida nel formato AAAA-MM-GG, successiva o uguale alla data di inizio",
  constrolExpression:/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/
};
