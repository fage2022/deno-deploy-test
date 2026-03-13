export default async function main() {
    

    const response = await fetch("https://google.com");
    console.log(response.status);  // e.g. 200
    console.log(response.statusText); // e.g. "OK"
    const txt = await response.text();
    console.log(txt);
    return txt;

}