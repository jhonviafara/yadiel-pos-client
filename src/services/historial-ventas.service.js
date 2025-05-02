import { get } from "./utils.services"

export async function getHistorialVentas () {
try {
    const ruta = "/historial-ventas"
    const res = await  get(ruta)
    return res
} catch (error) {
    throw new Error(error);
}

}