import Head from "next/head";
import { useEffect, useState } from "react";
import { w3cwebsocket } from "websocket";
import BrandBox from "../components/BrandBox";
import CityBox from "../components/CityBox";
import CityModal from "../components/CityModal";
import { useCitySelector } from "../hooks";
import { updateCitiesArray } from "../utils";

const client = new w3cwebsocket("ws://city-ws.herokuapp.com");

export default function Home() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity, clearSelectedCity] = useCitySelector();

  useEffect(() => {
    client.onmessage = ({ data }) =>
      setCities(updateCitiesArray(cities, JSON.parse(data)));
  });

  return (
    <div>
      <Head>
        <title>Air Quality Monitor</title>
      </Head>

      <main className="rounded-md">
        <div className="md:flex relative pl-10">
          <BrandBox />

          <div className="bg-gray-200 flex-1 p-5 min-h-screen">
            <div className="lg:flex flex-wrap">
              {cities.map(({ city, aqi, date }, index) => (
                <CityBox
                  key={index}
                  title={city}
                  aqi={aqi}
                  date={date}
                  showModal={setSelectedCity}
                />
              ))}
            </div>
          </div>
        </div>

        {selectedCity && (
          <CityModal
            visible={true}
            hide={clearSelectedCity}
            city={selectedCity}
          />
        )}
      </main>
    </div>
  );
}
