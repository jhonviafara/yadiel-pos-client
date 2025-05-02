import { get } from "./utils.services"

export async function getFixture () {
try {
    const ruta = "/fixture"
    const res = await  get(ruta)
    console.log(res);
    
    return res
} catch (error) {
    throw new Error(error);
}
}