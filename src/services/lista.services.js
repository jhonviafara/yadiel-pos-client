import { get } from "./utils.services"

export async function getJugadores () {
try {
    const ruta = "/planilla-jugadores"
    const res = await  get(ruta)
    console.log(res);
    
    return res
} catch (error) {
    throw new Error(error);
}
}