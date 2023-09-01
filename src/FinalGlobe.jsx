import React from 'react';

import { RadioBrowserApi, StationSearchType } from 'radio-browser-api';
import { useState, useEffect, useRef } from 'react';

import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import Globe from 'react-globe.gl';

import filters from "./assets/filters";
import defaultImage from "./assets/radio.jpg";

const FinalGlobe = () => {
    // Radio Browser API

    const globeEl = useRef();

    const [stations, setStations] = useState([]);
    const [stationFilter, setStationFilter] = useState("all");
    const [points, setPoints] = useState();
    const [selectedStation, setSelectedStation] = useState({
        urlResolved: "https://stream.0nlineradio.com/christmas?ref=radiobrowser"
    });
    const [stationSelected, setStationSeleted] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [search, setSearch] = useState(false);
    const [resetApi, setResetApi] = useState(0);
    const [apiLimit, setApiLimit] = useState(20);

    useEffect(() => {
        setupApi(stationFilter).then((data) => {
            // console.log(data);
            setStations(data);
        });
    }, [stationFilter, resetApi, apiLimit]);

    useEffect(() => {
        setPoints(stations.map(item => {
            return {
                lat: item.geoLat,
                lng: item.geoLong,
                size: 5,
                color: "red",
                currentStation: item
            }
        }))
    }, [stations]);

    useEffect(() => {
        // Auto-rotate
        globeEl.current.controls().autoRotate = true;
        globeEl.current.controls().autoRotateSpeed = 0.5;
        globeEl.current.controls().enableZoom = false;

        // globeEl.current.camera().position.x = 500;
    }, []);

    const setupApi = async (stationFilter) => {
        const api = new RadioBrowserApi(fetch.bind(window), "My Radio App");

        const stations = await api
            .searchStations({
                // countryCode: 'IN ',
                language: (search ? searchText : "english"),
                tag: stationFilter,
                limit: apiLimit,
            })
            .then((data) => {
                return data;
            });

        return stations;
    };

    const handlePointClick = (e) => {
        setStationSeleted(false);
        setSelectedStation(e.currentStation);
        setStationSeleted(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        setSearch(true);
        setResetApi(1 - resetApi);
    }

    const handleChange = (e) => {
        setSearchText(e.target.value);
    }

    const setDefaultSrc = (event) => {
        event.target.src = defaultImage;
    };

    return (
        <div>
            <div className='relative overflow-hidden'>

                <div className='absolute bg-white z-10 w-80 h-80 -m-40 -rotate-45'></div>

                <div className='absolute text-5xl px-5 py-2 z-10 bg-black text-transparent bg-clip-text rounded-lg bg-gradient-to-r from-black via-violet-300 to-violet-600'>
                    <h1 className='font-bold'>Choose Amongst these amazing filters</h1>
                </div>

                <div className='absolute z-10 mt-20 bg-black text-transparent bg-clip-text rounded-lg bg-gradient-to-r from-black via-violet-300 to-violet-600'>
                    <h1 className='font-bold'></h1>

                    <div className='p-5'>
                        <div className="grid grid-cols-2 gap-4 text-3xl font-bold text-transparent bg-clip-text 
                            bg-gradient-to-br from-black via-rose-600 to-violet-600"
                        >
                            {filters.map((filter) => (
                                <span
                                    className={"flex cursor-pointer z-11 m-2 p-1" + (stationFilter === filter ? "text-yellow-400" : "")}
                                    onClick={() => setStationFilter(filter)}
                                >
                                    {filter}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>


                <div className='z-10 absolute w-1/4 mx-auto mt-10 mr-10 right-0'>
                    <form onSubmit={handleSubmit}>
                        {/* <label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label> */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input
                                onChange={handleChange}
                                type="search"
                                id="default-search"

                                className="block w-full p-4 pl-10 appearance-none bg-transparent  text-sm text-gray-900 bg-opacity-0 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-opacity-0 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Search with the language you love"
                                required
                            ></input>
                            <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-yellow-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-900 dark:hover:bg-yellow-500 dark:focus:ring-blue-800">Search</button>
                        </div>
                    </form>
                </div>



                <div className='flex justify-center z-5'>
                    <Globe
                        id="myGlobe"

                        ref={globeEl}

                        globeImageUrl="globe.jpg"
                        backgroundImageUrl="globe-night.jpg"

                        pointsData={points}

                        onPointClick={handlePointClick}

                        labelLat={d => d.properties.latitude}
                        labelLng={d => d.properties.longitude}
                        labelText={d => d.properties.name}
                        labelSize={d => Math.sqrt(d.properties.pop_max) * 4e-4}
                        labelDotRadius={d => Math.sqrt(d.properties.pop_max) * 4e-4}
                        labelColor={() => 'rgba(255, 165, 0, 0.75)'}
                        labelResolution={2}
                    />
                </div>
                {
                    stationSelected &&
                    <div className='z-10 absolute w-1/2 rounded-lg mx-auto left-0 right-0 -mt-20'>

                        <div className='w-full'>
                            <div className='absolute mx-40 my-4 font-bold text-center text-black text-xl'>
                                {selectedStation.name}
                            </div>

                            <AudioPlayer
                                className="rounded-xl"
                                src={selectedStation.urlResolved}
                                showJumpControls={false}
                                layout="stacked"
                                customProgressBarSection={[]}
                                customControlsSection={["MAIN_CONTROLS", "VOLUME_CONTROLS"]}
                                autoPlayAfterSrcChange={false}
                            />
                        </div>

                    </div>
                }




            </div>

            {/* // All Stations Part */}

            <div className='bg-gradient-to-b from-black via-teal-600 to-black'>
                <h1 className='flex justify-center pt-10 pb-8 text-5xl font-bold'>Available Stations</h1>

                <div className="grid grid-cols-4">
                    {stations &&
                        stations.map((station, index) => {
                            return (
                                <div className="flex flex-col m-4 
                                        relative
                                        rounded-b-xl
                                        shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]"
                                    key={index}>

                                    <div className="flex pt-5 pb-20">
                                        <img
                                            className="flex p-2 left-0 mr-auto rounded-full"
                                            src={station.favicon}
                                            alt="station logo"
                                            width="100px"
                                            onError={setDefaultSrc}
                                        />
                                        <div className="flex w-full p-4 font-bold justify-center items-center">{station.name}</div>
                                    </div>

                                    <div className='absolute inset-x-0 bottom-0'>
                                        <AudioPlayer
                                            className='rounded-b-xl'
                                            src={station.urlResolved}
                                            showJumpControls={false}
                                            layout="stacked"
                                            customProgressBarSection={[]}
                                            customControlsSection={["MAIN_CONTROLS", "VOLUME_CONTROLS"]}
                                            autoPlayAfterSrcChange={false}
                                        />
                                    </div>

                                </div>
                            );
                        })}
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a class="hover:underline">RadioEarth</a>. All Rights Reserved.</span>
            </div>

        </div>
    )
}

export default FinalGlobe