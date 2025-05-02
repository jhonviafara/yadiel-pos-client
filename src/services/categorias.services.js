import { get } from "./utils.services"

export async function getCategorias () {
try {
    const ruta = "/planilla-categorias"
    const res = await  get(ruta)
    return res
} catch (error) {
    throw new Error(error);
}
}