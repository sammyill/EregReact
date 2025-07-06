const baseurl="http://127.0.0.1:3000";
/*
EXAMPLE OF USE 
fetchHelper("POST",`/login`,"",{
        email: email,
        password:password
        });
in this case the method is POST
API url is /login
the token is null because we don't need a toke(we could have just use _)
the last field is the jsonbody 
*/

export async function fetchHelper(method,apiurl,token,userrequest){
    let fetchurl=`${baseurl}${apiurl}`
    let fetchoption;
    if (method==="POST"||method==="PATCH") fetchoption={
        headers: {
            'Authorization':`Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        method: method,
        body: JSON.stringify(userrequest)
        };
    if(method==="GET"|| method==="DELETE")  fetchoption={
        headers: {
            'Authorization':`Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        method: method
        };
    try{
        const rawResponse=await fetch(fetchurl,fetchoption);
        const content = await rawResponse.json();
        return content
    }catch(err){
        return {error:true}
    }   
}

//FULLNAME HELPER
export function fullName(firstname,lastname){
    let first=firstname.trim().toLowerCase();
    let last=lastname.trim().toLowerCase();
    return `${first[0].toUpperCase()}${first.slice(1)} ${last[0].toUpperCase()}${last.slice(1)}`
}

//TO UCT DATE CONVERTER
export function dateToUTC(date){
    console.log("well,i'm not needed it seems,better someone remove me in the relase version")

}

export function formatTimeFromDate(dateString) {
  const date = new Date(dateString);

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}

export function isFutureDate(dateString) {
  const inputDate = new Date(dateString);
  const now = new Date();

  return inputDate > now;
}

export function formatFullDateTime(dateString) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}