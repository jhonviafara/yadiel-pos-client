import { useEffect, useState } from 'react';
import Logo from "../assets/logo_pdv.png";
import Header from '../components/Header';
import { getFixture } from '../services/fixture.services';

function FixturePages() {
    const [Fixture, setFixture] = useState([]);

    async function obtenerFixture() {
        const res = await getFixture();
        console.log(res);
        setFixture(res);
    }

    useEffect(() => {
        obtenerFixture();
    }, []);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Jugando':
                return { bgColor: 'bg-green-100', textColor: 'text-green-600' };
            case 'Lesionado':
                return { bgColor: 'bg-red-100', textColor: 'text-red-600' };
            case 'No juega':
                return { bgColor: 'bg-gray-100', textColor: 'text-gray-600' };
            default:
                return { bgColor: 'bg-white', textColor: 'text-black' };
        }
    };

    return (
        <div>
            <Header />
            <div className="bg-green-700 min-h-screen flex flex-col items-center">
                <img src={Logo} alt="Logo" className="w-32 my-2 drop-shadow-lg" />

                <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-4xl">
                    <h2 className="text-center text-xl font-semibold py-3 text-gray-700">
                        Fixture
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 text-left text-sm">
                            <thead>
                                <tr className="bg-gray-300 text-gray-700">
                                    <th className="py-2 px-3 border-b font-semibold">Rival</th>
                                    <th className="py-2 px-3 border-b font-semibold">Categoría</th>
                                    <th className="py-2 px-3 border-b font-semibold">Fecha</th>
                                    <th className="py-2 px-3 border-b font-semibold">Resultado</th>
                                    <th className="py-2 px-3 border-b font-semibold">Localidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Fixture.length < 0 ? Fixture.map((fixture) => {
                                    const { bgColor } = getStatusStyles(fixture.estado);
                                    return (
                                        <tr key={fixture.id} className={`hover:bg-gray-100 ${bgColor}`}>
                                            <td className="py-2 px-3 border-b text-gray-800">{fixture.rival}</td>
                                            <td className="py-2 px-3 border-b text-gray-800">{fixture.categoria}</td>
                                            <td className="py-2 px-3 border-b text-gray-800">{fixture.fecha}</td>
                                            <td className="py-2 px-3 border-b text-gray-800">{fixture.resultado}</td>
                                            <td className="py-2 px-3 border-b text-gray-800">{fixture.localidad}</td>
                                            <td className={`py-2 px-3 border-b flex items-center`}>
                                            </td>
                                        </tr>
                                    );
                                }) : <tr>
                                    <td colSpan="5" className="py-4 px-6 text-center text-gray-500">No hay fechas para mostrar</td>
                                </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FixturePages;
