import { get } from "./utils.services"

export async function getEntrenadores () {
try {
    const ruta = "/planilla-entrenadores"
    const res = await  get(ruta)
    return res
} catch (error) {
    throw new Error(error);
}
}