"""
All Sovereign World Nations & Capital Metros Dataset
Covers all 193 UN member states, Vatican City, Palestine, and sovereign jurisdictions.
"""

from typing import List, Dict, Any

ALL_SOVEREIGN_WORLD_CITIES: List[Dict[str, Any]] = [
    {
        "city_name": "Tirana",
        "country": "Albania",
        "country_code": "AL",
        "flag": "🇦🇱",
        "region": "Europe",
        "population_millions": 0.55,
        "lat": 41.3275,
        "lng": 19.8187,
        "crime_index": 39.5,
        "safety_index": 60.5,
        "crime_rate_per_100k": 2100,
        "violent_crime_rate_per_100k": 320,
        "risk_tier": "Moderate",
        "emergency_number": "112",
        "police_agency": "Albanian State Police",
        "is_live_db": False,
        "districts": [
                {
                        "id": "AL-01",
                        "name": "Blloku"
                },
                {
                        "id": "AL-02",
                        "name": "Kombinat"
                },
                {
                        "id": "AL-03",
                        "name": "Laprake"
                },
                {
                        "id": "AL-04",
                        "name": "Kinostudio"
                }
        ]
},
    {
        "city_name": "Andorra la Vella",
        "country": "Andorra",
        "country_code": "AD",
        "flag": "🇦🇩",
        "region": "Europe",
        "population_millions": 0.02,
        "lat": 42.5063,
        "lng": 1.5218,
        "crime_index": 11.2,
        "safety_index": 88.8,
        "crime_rate_per_100k": 650,
        "violent_crime_rate_per_100k": 40,
        "risk_tier": "Low Risk",
        "emergency_number": "112",
        "police_agency": "Police Corps of Andorra",
        "is_live_db": False,
        "districts": [
                {
                        "id": "AD-01",
                        "name": "Barri Antic"
                },
                {
                        "id": "AD-02",
                        "name": "Santa Coloma"
                },
                {
                        "id": "AD-03",
                        "name": "Centre"
                }
        ]
},
    {
        "city_name": "Minsk",
        "country": "Belarus",
        "country_code": "BY",
        "flag": "🇧🇾",
        "region": "Europe",
        "population_millions": 2.03,
        "lat": 53.9006,
        "lng": 27.559,
        "crime_index": 36.1,
        "safety_index": 63.9,
        "crime_rate_per_100k": 1950,
        "violent_crime_rate_per_100k": 280,
        "risk_tier": "Moderate",
        "emergency_number": "102",
        "police_agency": "Militia of Belarus",
        "is_live_db": False,
        "districts": [
                {
                        "id": "BY-01",
                        "name": "Tsentralny"
                },
                {
                        "id": "BY-02",
                        "name": "Sovetsky"
                },
                {
                        "id": "BY-03",
                        "name": "Pervomaysky"
                },
                {
                        "id": "BY-04",
                        "name": "Moskovsky"
                }
        ]
},
    {
        "city_name": "Sarajevo",
        "country": "Bosnia and Herzegovina",
        "country_code": "BA",
        "flag": "🇧🇦",
        "region": "Europe",
        "population_millions": 0.28,
        "lat": 43.8563,
        "lng": 18.4131,
        "crime_index": 44.2,
        "safety_index": 55.8,
        "crime_rate_per_100k": 2350,
        "violent_crime_rate_per_100k": 390,
        "risk_tier": "Moderate",
        "emergency_number": "122",
        "police_agency": "Federal Police Administration (FUP)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "BA-01",
                        "name": "Stari Grad"
                },
                {
                        "id": "BA-02",
                        "name": "Centar"
                },
                {
                        "id": "BA-03",
                        "name": "Novo Sarajevo"
                },
                {
                        "id": "BA-04",
                        "name": "Novi Grad"
                }
        ]
},
    {
        "city_name": "Sofia",
        "country": "Bulgaria",
        "country_code": "BG",
        "flag": "🇧🇬",
        "region": "Europe",
        "population_millions": 1.28,
        "lat": 42.6977,
        "lng": 23.3219,
        "crime_index": 38.4,
        "safety_index": 61.6,
        "crime_rate_per_100k": 2050,
        "violent_crime_rate_per_100k": 310,
        "risk_tier": "Moderate",
        "emergency_number": "112",
        "police_agency": "National Police Service",
        "is_live_db": False,
        "districts": [
                {
                        "id": "BG-01",
                        "name": "Sredets"
                },
                {
                        "id": "BG-02",
                        "name": "Vitosha"
                },
                {
                        "id": "BG-03",
                        "name": "Mladost"
                },
                {
                        "id": "BG-04",
                        "name": "Lyulin"
                }
        ]
},
    {
        "city_name": "Zagreb",
        "country": "Croatia",
        "country_code": "HR",
        "flag": "🇭🇷",
        "region": "Europe",
        "population_millions": 0.77,
        "lat": 45.815,
        "lng": 15.9819,
        "crime_index": 22.4,
        "safety_index": 77.6,
        "crime_rate_per_100k": 1280,
        "violent_crime_rate_per_100k": 110,
        "risk_tier": "Low Risk",
        "emergency_number": "112",
        "police_agency": "Police of the Republic of Croatia (Policija)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "HR-01",
                        "name": "Donji Grad"
                },
                {
                        "id": "HR-02",
                        "name": "Gornji Grad"
                },
                {
                        "id": "HR-03",
                        "name": "Maksimir"
                },
                {
                        "id": "HR-04",
                        "name": "Novi Zagreb"
                }
        ]
},
    {
        "city_name": "Nicosia",
        "country": "Cyprus",
        "country_code": "CY",
        "flag": "🇨🇾",
        "region": "Europe",
        "population_millions": 0.28,
        "lat": 35.1856,
        "lng": 33.3823,
        "crime_index": 31.8,
        "safety_index": 68.2,
        "crime_rate_per_100k": 1650,
        "violent_crime_rate_per_100k": 190,
        "risk_tier": "Low Risk",
        "emergency_number": "112",
        "police_agency": "Cyprus Police (Astynomia Kyprou)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "CY-01",
                        "name": "Old Town"
                },
                {
                        "id": "CY-02",
                        "name": "Strovolos"
                },
                {
                        "id": "CY-03",
                        "name": "Aglandjia"
                },
                {
                        "id": "CY-04",
                        "name": "Engomi"
                }
        ]
},
    {
        "city_name": "Tallinn",
        "country": "Estonia",
        "country_code": "EE",
        "flag": "🇪🇪",
        "region": "Europe",
        "population_millions": 0.44,
        "lat": 59.437,
        "lng": 24.7536,
        "crime_index": 24.1,
        "safety_index": 75.9,
        "crime_rate_per_100k": 1350,
        "violent_crime_rate_per_100k": 125,
        "risk_tier": "Low Risk",
        "emergency_number": "112",
        "police_agency": "Police and Border Guard Board",
        "is_live_db": False,
        "districts": [
                {
                        "id": "EE-01",
                        "name": "Kesklinn (City Centre)"
                },
                {
                        "id": "EE-02",
                        "name": "Pohja-Tallinn"
                },
                {
                        "id": "EE-03",
                        "name": "Lasnamae"
                },
                {
                        "id": "EE-04",
                        "name": "Nomme"
                }
        ]
},
    {
        "city_name": "Tbilisi",
        "country": "Georgia",
        "country_code": "GE",
        "flag": "🇬🇪",
        "region": "Europe",
        "population_millions": 1.15,
        "lat": 41.7151,
        "lng": 44.8271,
        "crime_index": 23.9,
        "safety_index": 76.1,
        "crime_rate_per_100k": 1320,
        "violent_crime_rate_per_100k": 115,
        "risk_tier": "Low Risk",
        "emergency_number": "112",
        "police_agency": "Patrol Police Department of Georgia",
        "is_live_db": False,
        "districts": [
                {
                        "id": "GE-01",
                        "name": "Old Tbilisi"
                },
                {
                        "id": "GE-02",
                        "name": "Vake"
                },
                {
                        "id": "GE-03",
                        "name": "Saburtalo"
                },
                {
                        "id": "GE-04",
                        "name": "Didube"
                }
        ]
},
    {
        "city_name": "Reykjavik",
        "country": "Iceland",
        "country_code": "IS",
        "flag": "🇮🇸",
        "region": "Europe",
        "population_millions": 0.14,
        "lat": 64.1466,
        "lng": -21.9426,
        "crime_index": 22.7,
        "safety_index": 77.3,
        "crime_rate_per_100k": 1290,
        "violent_crime_rate_per_100k": 95,
        "risk_tier": "Low Risk",
        "emergency_number": "112",
        "police_agency": "The Police of Iceland (Logreglan)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "IS-01",
                        "name": "Midborg (Downtown)"
                },
                {
                        "id": "IS-02",
                        "name": "Vesturbaer"
                },
                {
                        "id": "IS-03",
                        "name": "Hlidar"
                },
                {
                        "id": "IS-04",
                        "name": "Laugardalur"
                }
        ]
},
    {
        "city_name": "Pristina",
        "country": "Kosovo",
        "country_code": "XK",
        "flag": "🇽🇰",
        "region": "Europe",
        "population_millions": 0.21,
        "lat": 42.6629,
        "lng": 21.1655,
        "crime_index": 41.2,
        "safety_index": 58.8,
        "crime_rate_per_100k": 2200,
        "violent_crime_rate_per_100k": 350,
        "risk_tier": "Moderate",
        "emergency_number": "112",
        "police_agency": "Kosovo Police (Policia e Kosoves)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "XK-01",
                        "name": "Qendra"
                },
                {
                        "id": "XK-02",
                        "name": "Dardania"
                },
                {
                        "id": "XK-03",
                        "name": "Ulpiana"
                },
                {
                        "id": "XK-04",
                        "name": "Bregu i Diellit"
                }
        ]
},
    {
        "city_name": "Riga",
        "country": "Latvia",
        "country_code": "LV",
        "flag": "🇱🇻",
        "region": "Europe",
        "population_millions": 0.61,
        "lat": 56.9496,
        "lng": 24.1052,
        "crime_index": 37.6,
        "safety_index": 62.4,
        "crime_rate_per_100k": 2010,
        "violent_crime_rate_per_100k": 290,
        "risk_tier": "Moderate",
        "emergency_number": "112",
        "police_agency": "State Police of Latvia (Valsts Policija)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "LV-01",
                        "name": "Centrs"
                },
                {
                        "id": "LV-02",
                        "name": "Old Riga"
                },
                {
                        "id": "LV-03",
                        "name": "Agenskalns"
                },
                {
                        "id": "LV-04",
                        "name": "Teika"
                }
        ]
},
    {
        "city_name": "Vaduz",
        "country": "Liechtenstein",
        "country_code": "LI",
        "flag": "🇱🇮",
        "region": "Europe",
        "population_millions": 0.01,
        "lat": 47.141,
        "lng": 9.5209,
        "crime_index": 12.5,
        "safety_index": 87.5,
        "crime_rate_per_100k": 690,
        "violent_crime_rate_per_100k": 35,
        "risk_tier": "Low Risk",
        "emergency_number": "112",
        "police_agency": "National Police of Liechtenstein (Landespolizei)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "LI-01",
                        "name": "Vaduz Castle Sector"
                },
                {
                        "id": "LI-02",
                        "name": "Stadtzentrum"
                },
                {
                        "id": "LI-03",
                        "name": "Muehleholz"
                }
        ]
},
    {
        "city_name": "Vilnius",
        "country": "Lithuania",
        "country_code": "LT",
        "flag": "🇱🇹",
        "region": "Europe",
        "population_millions": 0.59,
        "lat": 54.6872,
        "lng": 25.2797,
        "crime_index": 32.7,
        "safety_index": 67.3,
        "crime_rate_per_100k": 1720,
        "violent_crime_rate_per_100k": 210,
        "risk_tier": "Low Risk",
        "emergency_number": "112",
        "police_agency": "Lithuanian Police (Lietuvos policija)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "LT-01",
                        "name": "Senamiestis"
                },
                {
                        "id": "LT-02",
                        "name": "Naujamiestis"
                },
                {
                        "id": "LT-03",
                        "name": "Antakalnis"
                },
                {
                        "id": "LT-04",
                        "name": "Zverynas"
                }
        ]
},
    {
        "city_name": "Luxembourg City",
        "country": "Luxembourg",
        "country_code": "LU",
        "flag": "🇱🇺",
        "region": "Europe",
        "population_millions": 0.13,
        "lat": 49.6116,
        "lng": 6.1319,
        "crime_index": 33.2,
        "safety_index": 66.8,
        "crime_rate_per_100k": 1750,
        "violent_crime_rate_per_100k": 220,
        "risk_tier": "Low Risk",
        "emergency_number": "113",
        "police_agency": "Grand Ducal Police (Police Grand-Ducale)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "LU-01",
                        "name": "Ville Haute"
                },
                {
                        "id": "LU-02",
                        "name": "Gare"
                },
                {
                        "id": "LU-03",
                        "name": "Kirchberg"
                },
                {
                        "id": "LU-04",
                        "name": "Clausen"
                }
        ]
},
    {
        "city_name": "Valletta",
        "country": "Malta",
        "country_code": "MT",
        "flag": "🇲🇹",
        "region": "Europe",
        "population_millions": 0.01,
        "lat": 35.8997,
        "lng": 14.5148,
        "crime_index": 38.9,
        "safety_index": 61.1,
        "crime_rate_per_100k": 2080,
        "violent_crime_rate_per_100k": 280,
        "risk_tier": "Moderate",
        "emergency_number": "112",
        "police_agency": "The Malta Police Force",
        "is_live_db": False,
        "districts": [
                {
                        "id": "MT-01",
                        "name": "Republic Street"
                },
                {
                        "id": "MT-02",
                        "name": "Floriana"
                },
                {
                        "id": "MT-03",
                        "name": "Sliema Precinct"
                },
                {
                        "id": "MT-04",
                        "name": "St. Julian's"
                }
        ]
},
    {
        "city_name": "Chisinau",
        "country": "Moldova",
        "country_code": "MD",
        "flag": "🇲🇩",
        "region": "Europe",
        "population_millions": 0.53,
        "lat": 47.0105,
        "lng": 28.8638,
        "crime_index": 46.5,
        "safety_index": 53.5,
        "crime_rate_per_100k": 2480,
        "violent_crime_rate_per_100k": 420,
        "risk_tier": "Moderate",
        "emergency_number": "112",
        "police_agency": "General Police Inspectorate (IGP Moldova)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "MD-01",
                        "name": "Centru"
                },
                {
                        "id": "MD-02",
                        "name": "Buiucani"
                },
                {
                        "id": "MD-03",
                        "name": "Botanica"
                },
                {
                        "id": "MD-04",
                        "name": "Riscani"
                }
        ]
},
    {
        "city_name": "Monaco",
        "country": "Monaco",
        "country_code": "MC",
        "flag": "🇲🇨",
        "region": "Europe",
        "population_millions": 0.04,
        "lat": 43.7384,
        "lng": 7.4246,
        "crime_index": 10.1,
        "safety_index": 89.9,
        "crime_rate_per_100k": 590,
        "violent_crime_rate_per_100k": 20,
        "risk_tier": "Low Risk",
        "emergency_number": "112",
        "police_agency": "Police Department of Monaco (Surete Publique)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "MC-01",
                        "name": "Monte Carlo"
                },
                {
                        "id": "MC-02",
                        "name": "La Condamine"
                },
                {
                        "id": "MC-03",
                        "name": "Monaco-Ville"
                },
                {
                        "id": "MC-04",
                        "name": "Fontvieille"
                }
        ]
},
    {
        "city_name": "Podgorica",
        "country": "Montenegro",
        "country_code": "ME",
        "flag": "🇲🇪",
        "region": "Europe",
        "population_millions": 0.19,
        "lat": 42.4304,
        "lng": 19.2594,
        "crime_index": 40.8,
        "safety_index": 59.2,
        "crime_rate_per_100k": 2180,
        "violent_crime_rate_per_100k": 340,
        "risk_tier": "Moderate",
        "emergency_number": "122",
        "police_agency": "Police Administration of Montenegro",
        "is_live_db": False,
        "districts": [
                {
                        "id": "ME-01",
                        "name": "Centar"
                },
                {
                        "id": "ME-02",
                        "name": "Preko Morace"
                },
                {
                        "id": "ME-03",
                        "name": "Stara Varos"
                },
                {
                        "id": "ME-04",
                        "name": "Blok 5"
                }
        ]
},
    {
        "city_name": "Skopje",
        "country": "North Macedonia",
        "country_code": "MK",
        "flag": "🇲🇰",
        "region": "Europe",
        "population_millions": 0.54,
        "lat": 41.9981,
        "lng": 21.4254,
        "crime_index": 42.3,
        "safety_index": 57.7,
        "crime_rate_per_100k": 2260,
        "violent_crime_rate_per_100k": 360,
        "risk_tier": "Moderate",
        "emergency_number": "112",
        "police_agency": "Police of North Macedonia (Politsija)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "MK-01",
                        "name": "Centar"
                },
                {
                        "id": "MK-02",
                        "name": "Karpos"
                },
                {
                        "id": "MK-03",
                        "name": "Kisela Voda"
                },
                {
                        "id": "MK-04",
                        "name": "Cair"
                }
        ]
},
    {
        "city_name": "Moscow",
        "country": "Russia",
        "country_code": "RU",
        "flag": "🇷🇺",
        "region": "Europe",
        "population_millions": 13.01,
        "lat": 55.7558,
        "lng": 37.6173,
        "crime_index": 42.1,
        "safety_index": 57.9,
        "crime_rate_per_100k": 2250,
        "violent_crime_rate_per_100k": 450,
        "risk_tier": "Moderate",
        "emergency_number": "112",
        "police_agency": "Main Directorate for Internal Affairs (Politsiya)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "RU-01",
                        "name": "Central Administrative Okrug"
                },
                {
                        "id": "RU-02",
                        "name": "Arbat"
                },
                {
                        "id": "RU-03",
                        "name": "Tverskoy"
                },
                {
                        "id": "RU-04",
                        "name": "Basmanny"
                }
        ]
},
    {
        "city_name": "San Marino",
        "country": "San Marino",
        "country_code": "SM",
        "flag": "🇸🇲",
        "region": "Europe",
        "population_millions": 0.01,
        "lat": 43.9424,
        "lng": 12.4578,
        "crime_index": 14.2,
        "safety_index": 85.8,
        "crime_rate_per_100k": 780,
        "violent_crime_rate_per_100k": 45,
        "risk_tier": "Low Risk",
        "emergency_number": "112",
        "police_agency": "Corps of Gendarmerie of San Marino",
        "is_live_db": False,
        "districts": [
                {
                        "id": "SM-01",
                        "name": "Citta"
                },
                {
                        "id": "SM-02",
                        "name": "Borgo Maggiore"
                },
                {
                        "id": "SM-03",
                        "name": "Serravalle"
                }
        ]
},
    {
        "city_name": "Belgrade",
        "country": "Serbia",
        "country_code": "RS",
        "flag": "🇷🇸",
        "region": "Europe",
        "population_millions": 1.4,
        "lat": 44.7866,
        "lng": 20.4489,
        "crime_index": 38.3,
        "safety_index": 61.7,
        "crime_rate_per_100k": 2040,
        "violent_crime_rate_per_100k": 310,
        "risk_tier": "Moderate",
        "emergency_number": "192",
        "police_agency": "Police of Serbia (Policija Srbije)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "RS-01",
                        "name": "Stari Grad"
                },
                {
                        "id": "RS-02",
                        "name": "Vracar"
                },
                {
                        "id": "RS-03",
                        "name": "Novi Beograd"
                },
                {
                        "id": "RS-04",
                        "name": "Zemun"
                }
        ]
},
    {
        "city_name": "Bratislava",
        "country": "Slovakia",
        "country_code": "SK",
        "flag": "🇸🇰",
        "region": "Europe",
        "population_millions": 0.47,
        "lat": 48.1486,
        "lng": 17.1077,
        "crime_index": 31.2,
        "safety_index": 68.8,
        "crime_rate_per_100k": 1640,
        "violent_crime_rate_per_100k": 185,
        "risk_tier": "Low Risk",
        "emergency_number": "112",
        "police_agency": "Police Corps of the Slovak Republic",
        "is_live_db": False,
        "districts": [
                {
                        "id": "SK-01",
                        "name": "Stare Mesto"
                },
                {
                        "id": "SK-02",
                        "name": "Ruzinov"
                },
                {
                        "id": "SK-03",
                        "name": "Petrzalka"
                },
                {
                        "id": "SK-04",
                        "name": "Nove Mesto"
                }
        ]
},
    {
        "city_name": "Ljubljana",
        "country": "Slovenia",
        "country_code": "SI",
        "flag": "🇸🇮",
        "region": "Europe",
        "population_millions": 0.29,
        "lat": 46.0569,
        "lng": 14.5058,
        "crime_index": 22.1,
        "safety_index": 77.9,
        "crime_rate_per_100k": 1250,
        "violent_crime_rate_per_100k": 90,
        "risk_tier": "Low Risk",
        "emergency_number": "113",
        "police_agency": "Slovenian National Police (Policija)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "SI-01",
                        "name": "Center"
                },
                {
                        "id": "SI-02",
                        "name": "Bezigrad"
                },
                {
                        "id": "SI-03",
                        "name": "Siska"
                },
                {
                        "id": "SI-04",
                        "name": "Vic"
                }
        ]
},
    {
        "city_name": "Kyiv",
        "country": "Ukraine",
        "country_code": "UA",
        "flag": "🇺🇦",
        "region": "Europe",
        "population_millions": 2.95,
        "lat": 50.4501,
        "lng": 30.5234,
        "crime_index": 47.2,
        "safety_index": 52.8,
        "crime_rate_per_100k": 2510,
        "violent_crime_rate_per_100k": 520,
        "risk_tier": "Moderate",
        "emergency_number": "102",
        "police_agency": "National Police of Ukraine (NPU)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "UA-01",
                        "name": "Shevchenkivskyi"
                },
                {
                        "id": "UA-02",
                        "name": "Pecherskyi"
                },
                {
                        "id": "UA-03",
                        "name": "Podilskyi"
                },
                {
                        "id": "UA-04",
                        "name": "Obolonskyi"
                }
        ]
},
    {
        "city_name": "Vatican City",
        "country": "Vatican City",
        "country_code": "VA",
        "flag": "🇻🇦",
        "region": "Europe",
        "population_millions": 0.001,
        "lat": 41.9029,
        "lng": 12.4534,
        "crime_index": 18.0,
        "safety_index": 82.0,
        "crime_rate_per_100k": 950,
        "violent_crime_rate_per_100k": 30,
        "risk_tier": "Low Risk",
        "emergency_number": "112",
        "police_agency": "Corps of Gendarmerie of Vatican City",
        "is_live_db": False,
        "districts": [
                {
                        "id": "VA-01",
                        "name": "St. Peter's Square"
                },
                {
                        "id": "VA-02",
                        "name": "Vatican Gardens"
                },
                {
                        "id": "VA-03",
                        "name": "Apostolic Palace"
                }
        ]
},
    {
        "city_name": "Kabul",
        "country": "Afghanistan",
        "country_code": "AF",
        "flag": "🇦🇫",
        "region": "Asia-Pacific",
        "population_millions": 4.4,
        "lat": 34.5553,
        "lng": 69.2075,
        "crime_index": 76.5,
        "safety_index": 23.5,
        "crime_rate_per_100k": 4100,
        "violent_crime_rate_per_100k": 1200,
        "risk_tier": "Critical",
        "emergency_number": "119",
        "police_agency": "Kabul City Police Command",
        "is_live_db": False,
        "districts": [
                {
                        "id": "AF-01",
                        "name": "District 1"
                },
                {
                        "id": "AF-02",
                        "name": "District 2 - Shahr-e Naw"
                },
                {
                        "id": "AF-03",
                        "name": "District 10 - Wazir Akbar Khan"
                },
                {
                        "id": "AF-04",
                        "name": "District 4"
                }
        ]
},
    {
        "city_name": "Yerevan",
        "country": "Armenia",
        "country_code": "AM",
        "flag": "🇦🇲",
        "region": "Asia-Pacific",
        "population_millions": 1.09,
        "lat": 40.1792,
        "lng": 44.4991,
        "crime_index": 21.8,
        "safety_index": 78.2,
        "crime_rate_per_100k": 1240,
        "violent_crime_rate_per_100k": 95,
        "risk_tier": "Low Risk",
        "emergency_number": "102",
        "police_agency": "Police of the Republic of Armenia",
        "is_live_db": False,
        "districts": [
                {
                        "id": "AM-01",
                        "name": "Kentron"
                },
                {
                        "id": "AM-02",
                        "name": "Arabkir"
                },
                {
                        "id": "AM-03",
                        "name": "Erebuni"
                },
                {
                        "id": "AM-04",
                        "name": "Ajapnyak"
                }
        ]
},
    {
        "city_name": "Baku",
        "country": "Azerbaijan",
        "country_code": "AZ",
        "flag": "🇦🇿",
        "region": "Asia-Pacific",
        "population_millions": 2.3,
        "lat": 40.4093,
        "lng": 49.8671,
        "crime_index": 31.4,
        "safety_index": 68.6,
        "crime_rate_per_100k": 1650,
        "violent_crime_rate_per_100k": 190,
        "risk_tier": "Low Risk",
        "emergency_number": "102",
        "police_agency": "Baku City Main Police Department",
        "is_live_db": False,
        "districts": [
                {
                        "id": "AZ-01",
                        "name": "Sabayil"
                },
                {
                        "id": "AZ-02",
                        "name": "Nasimi"
                },
                {
                        "id": "AZ-03",
                        "name": "Yasamal"
                },
                {
                        "id": "AZ-04",
                        "name": "Narimanov"
                }
        ]
},
    {
        "city_name": "Manama",
        "country": "Bahrain",
        "country_code": "BH",
        "flag": "🇧🇭",
        "region": "Middle East",
        "population_millions": 0.63,
        "lat": 26.2285,
        "lng": 50.586,
        "crime_index": 27.5,
        "safety_index": 72.5,
        "crime_rate_per_100k": 1490,
        "violent_crime_rate_per_100k": 140,
        "risk_tier": "Low Risk",
        "emergency_number": "999",
        "police_agency": "Ministry of Interior Public Security",
        "is_live_db": False,
        "districts": [
                {
                        "id": "BH-01",
                        "name": "Capital Sector"
                },
                {
                        "id": "BH-02",
                        "name": "Juffair"
                },
                {
                        "id": "BH-03",
                        "name": "Seef"
                },
                {
                        "id": "BH-04",
                        "name": "Diplomatic Area"
                }
        ]
},
    {
        "city_name": "Dhaka",
        "country": "Bangladesh",
        "country_code": "BD",
        "flag": "🇧🇩",
        "region": "Asia-Pacific",
        "population_millions": 10.2,
        "lat": 23.8103,
        "lng": 90.4125,
        "crime_index": 63.8,
        "safety_index": 36.2,
        "crime_rate_per_100k": 3520,
        "violent_crime_rate_per_100k": 780,
        "risk_tier": "Elevated",
        "emergency_number": "999",
        "police_agency": "Dhaka Metropolitan Police (DMP)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "BD-01",
                        "name": "Gulshan"
                },
                {
                        "id": "BD-02",
                        "name": "Dhanmondi"
                },
                {
                        "id": "BD-03",
                        "name": "Motijheel"
                },
                {
                        "id": "BD-04",
                        "name": "Mirpur"
                },
                {
                        "id": "BD-05",
                        "name": "Uttara"
                }
        ]
},
    {
        "city_name": "Thimphu",
        "country": "Bhutan",
        "country_code": "BT",
        "flag": "🇧🇹",
        "region": "Asia-Pacific",
        "population_millions": 0.11,
        "lat": 27.4728,
        "lng": 89.6393,
        "crime_index": 18.2,
        "safety_index": 81.8,
        "crime_rate_per_100k": 1050,
        "violent_crime_rate_per_100k": 60,
        "risk_tier": "Low Risk",
        "emergency_number": "113",
        "police_agency": "Royal Bhutan Police (RBP)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "BT-01",
                        "name": "Norzin Lam Sector"
                },
                {
                        "id": "BT-02",
                        "name": "Changzamtog"
                },
                {
                        "id": "BT-03",
                        "name": "Motithang"
                },
                {
                        "id": "BT-04",
                        "name": "Dechencholing"
                }
        ]
},
    {
        "city_name": "Bandar Seri Begawan",
        "country": "Brunei",
        "country_code": "BN",
        "flag": "🇧🇳",
        "region": "Asia-Pacific",
        "population_millions": 0.1,
        "lat": 4.9031,
        "lng": 114.9398,
        "crime_index": 22.3,
        "safety_index": 77.7,
        "crime_rate_per_100k": 1260,
        "violent_crime_rate_per_100k": 90,
        "risk_tier": "Low Risk",
        "emergency_number": "993",
        "police_agency": "Royal Brunei Police Force (RBPF)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "BN-01",
                        "name": "Kianggeh"
                },
                {
                        "id": "BN-02",
                        "name": "Gadong"
                },
                {
                        "id": "BN-03",
                        "name": "Berakas"
                },
                {
                        "id": "BN-04",
                        "name": "Kota Batu"
                }
        ]
},
    {
        "city_name": "Phnom Penh",
        "country": "Cambodia",
        "country_code": "KH",
        "flag": "🇰🇭",
        "region": "Asia-Pacific",
        "population_millions": 2.28,
        "lat": 11.5564,
        "lng": 104.9282,
        "crime_index": 51.4,
        "safety_index": 48.6,
        "crime_rate_per_100k": 2890,
        "violent_crime_rate_per_100k": 540,
        "risk_tier": "Moderate",
        "emergency_number": "117",
        "police_agency": "Phnom Penh Municipal Police",
        "is_live_db": False,
        "districts": [
                {
                        "id": "KH-01",
                        "name": "Daun Penh"
                },
                {
                        "id": "KH-02",
                        "name": "Chamkar Mon"
                },
                {
                        "id": "KH-03",
                        "name": "Toul Kork"
                },
                {
                        "id": "KH-04",
                        "name": "BKK1"
                }
        ]
},
    {
        "city_name": "Tehran",
        "country": "Iran",
        "country_code": "IR",
        "flag": "🇮🇷",
        "region": "Middle East",
        "population_millions": 9.3,
        "lat": 35.6892,
        "lng": 51.389,
        "crime_index": 53.2,
        "safety_index": 46.8,
        "crime_rate_per_100k": 2980,
        "violent_crime_rate_per_100k": 580,
        "risk_tier": "Moderate",
        "emergency_number": "110",
        "police_agency": "Law Enforcement Command of Iran (Faraja)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "IR-01",
                        "name": "District 1 - Tajrish"
                },
                {
                        "id": "IR-02",
                        "name": "District 3 - Jordan"
                },
                {
                        "id": "IR-03",
                        "name": "District 6 - Vali Asr"
                },
                {
                        "id": "IR-04",
                        "name": "District 12 - Grand Bazaar"
                }
        ]
},
    {
        "city_name": "Baghdad",
        "country": "Iraq",
        "country_code": "IQ",
        "flag": "🇮🇶",
        "region": "Middle East",
        "population_millions": 7.14,
        "lat": 33.3152,
        "lng": 44.3661,
        "crime_index": 56.7,
        "safety_index": 43.3,
        "crime_rate_per_100k": 3200,
        "violent_crime_rate_per_100k": 720,
        "risk_tier": "Elevated",
        "emergency_number": "104",
        "police_agency": "Baghdad Patrol Police Command",
        "is_live_db": False,
        "districts": [
                {
                        "id": "IQ-01",
                        "name": "Karkh"
                },
                {
                        "id": "IQ-02",
                        "name": "Rusafa"
                },
                {
                        "id": "IQ-03",
                        "name": "Mansour"
                },
                {
                        "id": "IQ-04",
                        "name": "Karrada"
                }
        ]
},
    {
        "city_name": "Amman",
        "country": "Jordan",
        "country_code": "JO",
        "flag": "🇯🇴",
        "region": "Middle East",
        "population_millions": 4.06,
        "lat": 31.9454,
        "lng": 35.9284,
        "crime_index": 41.5,
        "safety_index": 58.5,
        "crime_rate_per_100k": 2220,
        "violent_crime_rate_per_100k": 340,
        "risk_tier": "Moderate",
        "emergency_number": "911",
        "police_agency": "Public Security Directorate (PSD)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "JO-01",
                        "name": "Zahran"
                },
                {
                        "id": "JO-02",
                        "name": "Abdali"
                },
                {
                        "id": "JO-03",
                        "name": "Madina"
                },
                {
                        "id": "JO-04",
                        "name": "Jabal Amman"
                }
        ]
},
    {
        "city_name": "Almaty",
        "country": "Kazakhstan",
        "country_code": "KZ",
        "flag": "🇰🇿",
        "region": "Asia-Pacific",
        "population_millions": 2.15,
        "lat": 43.222,
        "lng": 76.8512,
        "crime_index": 53.6,
        "safety_index": 46.4,
        "crime_rate_per_100k": 3020,
        "violent_crime_rate_per_100k": 590,
        "risk_tier": "Moderate",
        "emergency_number": "102",
        "police_agency": "Almaty City Police Department",
        "is_live_db": False,
        "districts": [
                {
                        "id": "KZ-01",
                        "name": "Almaly"
                },
                {
                        "id": "KZ-02",
                        "name": "Medeu"
                },
                {
                        "id": "KZ-03",
                        "name": "Bostandyk"
                },
                {
                        "id": "KZ-04",
                        "name": "Auezov"
                }
        ]
},
    {
        "city_name": "Bishkek",
        "country": "Kyrgyzstan",
        "country_code": "KG",
        "flag": "🇰🇬",
        "region": "Asia-Pacific",
        "population_millions": 1.07,
        "lat": 42.8746,
        "lng": 74.5698,
        "crime_index": 52.1,
        "safety_index": 47.9,
        "crime_rate_per_100k": 2930,
        "violent_crime_rate_per_100k": 560,
        "risk_tier": "Moderate",
        "emergency_number": "102",
        "police_agency": "Bishkek City Police Department",
        "is_live_db": False,
        "districts": [
                {
                        "id": "KG-01",
                        "name": "Leninsky"
                },
                {
                        "id": "KG-02",
                        "name": "Oktyabrsky"
                },
                {
                        "id": "KG-03",
                        "name": "Pervomaysky"
                },
                {
                        "id": "KG-04",
                        "name": "Sverdlovsky"
                }
        ]
},
    {
        "city_name": "Vientiane",
        "country": "Laos",
        "country_code": "LA",
        "flag": "🇱🇦",
        "region": "Asia-Pacific",
        "population_millions": 0.95,
        "lat": 17.9757,
        "lng": 102.6331,
        "crime_index": 38.6,
        "safety_index": 61.4,
        "crime_rate_per_100k": 2060,
        "violent_crime_rate_per_100k": 310,
        "risk_tier": "Moderate",
        "emergency_number": "1191",
        "police_agency": "Lao Public Security Forces",
        "is_live_db": False,
        "districts": [
                {
                        "id": "LA-01",
                        "name": "Chanthabuly"
                },
                {
                        "id": "LA-02",
                        "name": "Sisattanak"
                },
                {
                        "id": "LA-03",
                        "name": "Saysettha"
                },
                {
                        "id": "LA-04",
                        "name": "Sikhottabong"
                }
        ]
},
    {
        "city_name": "Beirut",
        "country": "Lebanon",
        "country_code": "LB",
        "flag": "🇱🇧",
        "region": "Middle East",
        "population_millions": 2.42,
        "lat": 33.8938,
        "lng": 35.5018,
        "crime_index": 50.8,
        "safety_index": 49.2,
        "crime_rate_per_100k": 2860,
        "violent_crime_rate_per_100k": 530,
        "risk_tier": "Moderate",
        "emergency_number": "112",
        "police_agency": "Internal Security Forces (ISF)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "LB-01",
                        "name": "Achrafieh"
                },
                {
                        "id": "LB-02",
                        "name": "Hamra"
                },
                {
                        "id": "LB-03",
                        "name": "Downtown Beirut"
                },
                {
                        "id": "LB-04",
                        "name": "Ras Beirut"
                }
        ]
},
    {
        "city_name": "Male",
        "country": "Maldives",
        "country_code": "MV",
        "flag": "🇲🇻",
        "region": "Asia-Pacific",
        "population_millions": 0.25,
        "lat": 4.1755,
        "lng": 73.5093,
        "crime_index": 52.4,
        "safety_index": 47.6,
        "crime_rate_per_100k": 2950,
        "violent_crime_rate_per_100k": 510,
        "risk_tier": "Moderate",
        "emergency_number": "119",
        "police_agency": "Maldives Police Service (MPS)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "MV-01",
                        "name": "Henveiru"
                },
                {
                        "id": "MV-02",
                        "name": "Galolhu"
                },
                {
                        "id": "MV-03",
                        "name": "Machchangolhi"
                },
                {
                        "id": "MV-04",
                        "name": "Maafannu"
                }
        ]
},
    {
        "city_name": "Ulaanbaatar",
        "country": "Mongolia",
        "country_code": "MN",
        "flag": "🇲🇳",
        "region": "Asia-Pacific",
        "population_millions": 1.45,
        "lat": 47.8864,
        "lng": 106.9057,
        "crime_index": 54.8,
        "safety_index": 45.2,
        "crime_rate_per_100k": 3080,
        "violent_crime_rate_per_100k": 610,
        "risk_tier": "Moderate",
        "emergency_number": "102",
        "police_agency": "National Police Agency of Mongolia",
        "is_live_db": False,
        "districts": [
                {
                        "id": "MN-01",
                        "name": "Sukhbaatar"
                },
                {
                        "id": "MN-02",
                        "name": "Chingeltei"
                },
                {
                        "id": "MN-03",
                        "name": "Bayanzurkh"
                },
                {
                        "id": "MN-04",
                        "name": "Khan-Uul"
                }
        ]
},
    {
        "city_name": "Yangon",
        "country": "Myanmar",
        "country_code": "MM",
        "flag": "🇲🇲",
        "region": "Asia-Pacific",
        "population_millions": 5.43,
        "lat": 16.8661,
        "lng": 96.1951,
        "crime_index": 55.4,
        "safety_index": 44.6,
        "crime_rate_per_100k": 3120,
        "violent_crime_rate_per_100k": 640,
        "risk_tier": "Moderate",
        "emergency_number": "199",
        "police_agency": "Myanmar Police Force (MPF)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "MM-01",
                        "name": "Kyauktada"
                },
                {
                        "id": "MM-02",
                        "name": "Bahan"
                },
                {
                        "id": "MM-03",
                        "name": "Dagon"
                },
                {
                        "id": "MM-04",
                        "name": "Kamayut"
                }
        ]
},
    {
        "city_name": "Kathmandu",
        "country": "Nepal",
        "country_code": "NP",
        "flag": "🇳🇵",
        "region": "Asia-Pacific",
        "population_millions": 1.44,
        "lat": 27.7172,
        "lng": 85.324,
        "crime_index": 36.8,
        "safety_index": 63.2,
        "crime_rate_per_100k": 1960,
        "violent_crime_rate_per_100k": 270,
        "risk_tier": "Moderate",
        "emergency_number": "100",
        "police_agency": "Kathmandu Valley Police Office",
        "is_live_db": False,
        "districts": [
                {
                        "id": "NP-01",
                        "name": "Thamel"
                },
                {
                        "id": "NP-02",
                        "name": "Durbar Marg"
                },
                {
                        "id": "NP-03",
                        "name": "Baneshwor"
                },
                {
                        "id": "NP-04",
                        "name": "Lalitpur Sector"
                }
        ]
},
    {
        "city_name": "Pyongyang",
        "country": "North Korea",
        "country_code": "KP",
        "flag": "🇰🇵",
        "region": "Asia-Pacific",
        "population_millions": 3.08,
        "lat": 39.0392,
        "lng": 125.7625,
        "crime_index": 31.0,
        "safety_index": 69.0,
        "crime_rate_per_100k": 1620,
        "violent_crime_rate_per_100k": 180,
        "risk_tier": "Low Risk",
        "emergency_number": "119",
        "police_agency": "Ministry of Social Security",
        "is_live_db": False,
        "districts": [
                {
                        "id": "KP-01",
                        "name": "Chung-guyok"
                },
                {
                        "id": "KP-02",
                        "name": "Moranbong"
                },
                {
                        "id": "KP-03",
                        "name": "Taedonggang"
                },
                {
                        "id": "KP-04",
                        "name": "Potonggang"
                }
        ]
},
    {
        "city_name": "Islamabad",
        "country": "Pakistan",
        "country_code": "PK",
        "flag": "🇵🇰",
        "region": "Asia-Pacific",
        "population_millions": 1.2,
        "lat": 33.6844,
        "lng": 73.0479,
        "crime_index": 48.2,
        "safety_index": 51.8,
        "crime_rate_per_100k": 2680,
        "violent_crime_rate_per_100k": 480,
        "risk_tier": "Moderate",
        "emergency_number": "15",
        "police_agency": "Islamabad Capital Territory Police (ICTP)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "PK-01",
                        "name": "F-6 / F-7 Blue Area"
                },
                {
                        "id": "PK-02",
                        "name": "G-9 Markaz"
                },
                {
                        "id": "PK-03",
                        "name": "I-8 Sector"
                },
                {
                        "id": "PK-04",
                        "name": "Diplomatic Enclave"
                }
        ]
},
    {
        "city_name": "Ramallah",
        "country": "Palestine",
        "country_code": "PS",
        "flag": "🇵🇸",
        "region": "Middle East",
        "population_millions": 0.39,
        "lat": 31.9038,
        "lng": 35.2034,
        "crime_index": 45.1,
        "safety_index": 54.9,
        "crime_rate_per_100k": 2420,
        "violent_crime_rate_per_100k": 410,
        "risk_tier": "Moderate",
        "emergency_number": "100",
        "police_agency": "Palestinian Civil Police Force",
        "is_live_db": False,
        "districts": [
                {
                        "id": "PS-01",
                        "name": "Al-Manara"
                },
                {
                        "id": "PS-02",
                        "name": "Al-Masyoun"
                },
                {
                        "id": "PS-03",
                        "name": "Al-Bireh Sector"
                },
                {
                        "id": "PS-04",
                        "name": "Old City"
                }
        ]
},
    {
        "city_name": "Colombo",
        "country": "Sri Lanka",
        "country_code": "LK",
        "flag": "🇱🇰",
        "region": "Asia-Pacific",
        "population_millions": 0.75,
        "lat": 6.9271,
        "lng": 79.8612,
        "crime_index": 41.3,
        "safety_index": 58.7,
        "crime_rate_per_100k": 2210,
        "violent_crime_rate_per_100k": 330,
        "risk_tier": "Moderate",
        "emergency_number": "119",
        "police_agency": "Sri Lanka Police Service",
        "is_live_db": False,
        "districts": [
                {
                        "id": "LK-01",
                        "name": "Colombo Fort (01)"
                },
                {
                        "id": "LK-02",
                        "name": "Kollupitiya (03)"
                },
                {
                        "id": "LK-03",
                        "name": "Bambalapitiya (04)"
                },
                {
                        "id": "LK-04",
                        "name": "Cinnamon Gardens (07)"
                }
        ]
},
    {
        "city_name": "Damascus",
        "country": "Syria",
        "country_code": "SY",
        "flag": "🇸🇾",
        "region": "Middle East",
        "population_millions": 2.5,
        "lat": 33.5138,
        "lng": 36.2765,
        "crime_index": 68.4,
        "safety_index": 31.6,
        "crime_rate_per_100k": 3780,
        "violent_crime_rate_per_100k": 890,
        "risk_tier": "Critical",
        "emergency_number": "112",
        "police_agency": "Internal Security Directorate of Damascus",
        "is_live_db": False,
        "districts": [
                {
                        "id": "SY-01",
                        "name": "Old Damascus"
                },
                {
                        "id": "SY-02",
                        "name": "Al-Midan"
                },
                {
                        "id": "SY-03",
                        "name": "Al-Mezzeh"
                },
                {
                        "id": "SY-04",
                        "name": "Salhiyeh"
                }
        ]
},
    {
        "city_name": "Dushanbe",
        "country": "Tajikistan",
        "country_code": "TJ",
        "flag": "🇹🇯",
        "region": "Asia-Pacific",
        "population_millions": 0.86,
        "lat": 38.5598,
        "lng": 68.787,
        "crime_index": 39.7,
        "safety_index": 60.3,
        "crime_rate_per_100k": 2120,
        "violent_crime_rate_per_100k": 320,
        "risk_tier": "Moderate",
        "emergency_number": "102",
        "police_agency": "Dushanbe City Police Department",
        "is_live_db": False,
        "districts": [
                {
                        "id": "TJ-01",
                        "name": "Ismoili Somoni"
                },
                {
                        "id": "TJ-02",
                        "name": "Shohmansur"
                },
                {
                        "id": "TJ-03",
                        "name": "Sino"
                },
                {
                        "id": "TJ-04",
                        "name": "Firdavsi"
                }
        ]
},
    {
        "city_name": "Dili",
        "country": "Timor-Leste",
        "country_code": "TL",
        "flag": "🇹🇱",
        "region": "Asia-Pacific",
        "population_millions": 0.28,
        "lat": -8.5569,
        "lng": 125.5603,
        "crime_index": 42.1,
        "safety_index": 57.9,
        "crime_rate_per_100k": 2250,
        "violent_crime_rate_per_100k": 350,
        "risk_tier": "Moderate",
        "emergency_number": "112",
        "police_agency": "National Police of East Timor (PNTL)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "TL-01",
                        "name": "Nain Feto"
                },
                {
                        "id": "TL-02",
                        "name": "Vera Cruz"
                },
                {
                        "id": "TL-03",
                        "name": "Cristo Rei"
                },
                {
                        "id": "TL-04",
                        "name": "Dom Aleixo"
                }
        ]
},
    {
        "city_name": "Ashgabat",
        "country": "Turkmenistan",
        "country_code": "TM",
        "flag": "🇹🇲",
        "region": "Asia-Pacific",
        "population_millions": 1.03,
        "lat": 37.9601,
        "lng": 58.3261,
        "crime_index": 26.5,
        "safety_index": 73.5,
        "crime_rate_per_100k": 1450,
        "violent_crime_rate_per_100k": 130,
        "risk_tier": "Low Risk",
        "emergency_number": "102",
        "police_agency": "Ministry of Internal Affairs of Turkmenistan",
        "is_live_db": False,
        "districts": [
                {
                        "id": "TM-01",
                        "name": "Bagtyyarlyk"
                },
                {
                        "id": "TM-02",
                        "name": "Berkararlyk"
                },
                {
                        "id": "TM-03",
                        "name": "Buzmeyin"
                },
                {
                        "id": "TM-04",
                        "name": "Kopetdag"
                }
        ]
},
    {
        "city_name": "Tashkent",
        "country": "Uzbekistan",
        "country_code": "UZ",
        "flag": "🇺🇿",
        "region": "Asia-Pacific",
        "population_millions": 2.95,
        "lat": 41.2995,
        "lng": 69.2401,
        "crime_index": 27.9,
        "safety_index": 72.1,
        "crime_rate_per_100k": 1510,
        "violent_crime_rate_per_100k": 145,
        "risk_tier": "Low Risk",
        "emergency_number": "102",
        "police_agency": "Tashkent City Main Internal Affairs Directorate",
        "is_live_db": False,
        "districts": [
                {
                        "id": "UZ-01",
                        "name": "Mirzo Ulugbek"
                },
                {
                        "id": "UZ-02",
                        "name": "Yunusabad"
                },
                {
                        "id": "UZ-03",
                        "name": "Yakkasaray"
                },
                {
                        "id": "UZ-04",
                        "name": "Shaykhontokhur"
                }
        ]
},
    {
        "city_name": "Sanaa",
        "country": "Yemen",
        "country_code": "YE",
        "flag": "🇾🇪",
        "region": "Middle East",
        "population_millions": 3.29,
        "lat": 15.3694,
        "lng": 44.191,
        "crime_index": 68.9,
        "safety_index": 31.1,
        "crime_rate_per_100k": 3810,
        "violent_crime_rate_per_100k": 910,
        "risk_tier": "Critical",
        "emergency_number": "199",
        "police_agency": "Capital Security Directorate",
        "is_live_db": False,
        "districts": [
                {
                        "id": "YE-01",
                        "name": "Old City"
                },
                {
                        "id": "YE-02",
                        "name": "Al-Sabeen"
                },
                {
                        "id": "YE-03",
                        "name": "Al-Wahdah"
                },
                {
                        "id": "YE-04",
                        "name": "Shu'aub"
                }
        ]
},
    {
        "city_name": "St. John's",
        "country": "Antigua and Barbuda",
        "country_code": "AG",
        "flag": "🇦🇬",
        "region": "Latin America",
        "population_millions": 0.02,
        "lat": 17.1274,
        "lng": -61.8468,
        "crime_index": 41.5,
        "safety_index": 58.5,
        "crime_rate_per_100k": 2220,
        "violent_crime_rate_per_100k": 340,
        "risk_tier": "Moderate",
        "emergency_number": "911",
        "police_agency": "Royal Police Force of Antigua and Barbuda",
        "is_live_db": False,
        "districts": [
                {
                        "id": "AG-01",
                        "name": "City Centre"
                },
                {
                        "id": "AG-02",
                        "name": "Heritage Quay"
                },
                {
                        "id": "AG-03",
                        "name": "Dickenson Bay"
                },
                {
                        "id": "AG-04",
                        "name": "St. John Rural"
                }
        ]
},
    {
        "city_name": "Nassau",
        "country": "Bahamas",
        "country_code": "BS",
        "flag": "🇧🇸",
        "region": "Latin America",
        "population_millions": 0.27,
        "lat": 25.048,
        "lng": -77.3554,
        "crime_index": 63.2,
        "safety_index": 36.8,
        "crime_rate_per_100k": 3490,
        "violent_crime_rate_per_100k": 780,
        "risk_tier": "Elevated",
        "emergency_number": "911",
        "police_agency": "Royal Bahamas Police Force (RBPF)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "BS-01",
                        "name": "Downtown Nassau"
                },
                {
                        "id": "BS-02",
                        "name": "Paradise Island"
                },
                {
                        "id": "BS-03",
                        "name": "Cable Beach"
                },
                {
                        "id": "BS-04",
                        "name": "Over-the-Hill"
                }
        ]
},
    {
        "city_name": "Bridgetown",
        "country": "Barbados",
        "country_code": "BB",
        "flag": "🇧🇧",
        "region": "Latin America",
        "population_millions": 0.11,
        "lat": 13.106,
        "lng": -59.5432,
        "crime_index": 45.8,
        "safety_index": 54.2,
        "crime_rate_per_100k": 2450,
        "violent_crime_rate_per_100k": 410,
        "risk_tier": "Moderate",
        "emergency_number": "211",
        "police_agency": "The Barbados Police Service",
        "is_live_db": False,
        "districts": [
                {
                        "id": "BB-01",
                        "name": "Central Bridgetown"
                },
                {
                        "id": "BB-02",
                        "name": "St. Michael South"
                },
                {
                        "id": "BB-03",
                        "name": "Hastings Sector"
                },
                {
                        "id": "BB-04",
                        "name": "Spring Garden"
                }
        ]
},
    {
        "city_name": "Belize City",
        "country": "Belize",
        "country_code": "BZ",
        "flag": "🇧🇿",
        "region": "Latin America",
        "population_millions": 0.06,
        "lat": 17.5046,
        "lng": -88.1962,
        "crime_index": 58.4,
        "safety_index": 41.6,
        "crime_rate_per_100k": 3280,
        "violent_crime_rate_per_100k": 730,
        "risk_tier": "Elevated",
        "emergency_number": "911",
        "police_agency": "Belize Police Department",
        "is_live_db": False,
        "districts": [
                {
                        "id": "BZ-01",
                        "name": "Northside"
                },
                {
                        "id": "BZ-02",
                        "name": "Southside"
                },
                {
                        "id": "BZ-03",
                        "name": "Fort George"
                },
                {
                        "id": "BZ-04",
                        "name": "Albert Precinct"
                }
        ]
},
    {
        "city_name": "La Paz",
        "country": "Bolivia",
        "country_code": "BO",
        "flag": "🇧🇴",
        "region": "Latin America",
        "population_millions": 0.95,
        "lat": -16.5,
        "lng": -68.15,
        "crime_index": 55.6,
        "safety_index": 44.4,
        "crime_rate_per_100k": 3130,
        "violent_crime_rate_per_100k": 650,
        "risk_tier": "Moderate",
        "emergency_number": "110",
        "police_agency": "National Police of Bolivia (Policia Boliviana)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "BO-01",
                        "name": "Centro"
                },
                {
                        "id": "BO-02",
                        "name": "Zona Sur - Calacoto"
                },
                {
                        "id": "BO-03",
                        "name": "Sopocachi"
                },
                {
                        "id": "BO-04",
                        "name": "Miraflores"
                }
        ]
},
    {
        "city_name": "Havana",
        "country": "Cuba",
        "country_code": "CU",
        "flag": "🇨🇺",
        "region": "Latin America",
        "population_millions": 2.13,
        "lat": 23.1136,
        "lng": -82.3666,
        "crime_index": 34.5,
        "safety_index": 65.5,
        "crime_rate_per_100k": 1820,
        "violent_crime_rate_per_100k": 240,
        "risk_tier": "Low Risk",
        "emergency_number": "106",
        "police_agency": "National Revolutionary Police (PNR)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "CU-01",
                        "name": "Habana Vieja"
                },
                {
                        "id": "CU-02",
                        "name": "Vedado (Plaza)"
                },
                {
                        "id": "CU-03",
                        "name": "Miramar (Playa)"
                },
                {
                        "id": "CU-04",
                        "name": "Centro Habana"
                }
        ]
},
    {
        "city_name": "Roseau",
        "country": "Dominica",
        "country_code": "DM",
        "flag": "🇩🇲",
        "region": "Latin America",
        "population_millions": 0.01,
        "lat": 15.3092,
        "lng": -61.3794,
        "crime_index": 38.0,
        "safety_index": 62.0,
        "crime_rate_per_100k": 2020,
        "violent_crime_rate_per_100k": 290,
        "risk_tier": "Moderate",
        "emergency_number": "999",
        "police_agency": "Commonwealth of Dominica Police Force",
        "is_live_db": False,
        "districts": [
                {
                        "id": "DM-01",
                        "name": "Bayfront"
                },
                {
                        "id": "DM-02",
                        "name": "Pottersville"
                },
                {
                        "id": "DM-03",
                        "name": "Bath Estate"
                },
                {
                        "id": "DM-04",
                        "name": "Newtown"
                }
        ]
},
    {
        "city_name": "Santo Domingo",
        "country": "Dominican Republic",
        "country_code": "DO",
        "flag": "🇩🇴",
        "region": "Latin America",
        "population_millions": 3.1,
        "lat": 18.4861,
        "lng": -69.9312,
        "crime_index": 64.1,
        "safety_index": 35.9,
        "crime_rate_per_100k": 3540,
        "violent_crime_rate_per_100k": 810,
        "risk_tier": "Elevated",
        "emergency_number": "911",
        "police_agency": "National Police of the Dominican Republic",
        "is_live_db": False,
        "districts": [
                {
                        "id": "DO-01",
                        "name": "Zona Colonial"
                },
                {
                        "id": "DO-02",
                        "name": "Piantini"
                },
                {
                        "id": "DO-03",
                        "name": "Bella Vista"
                },
                {
                        "id": "DO-04",
                        "name": "Gazcue"
                },
                {
                        "id": "DO-05",
                        "name": "Santo Domingo Este"
                }
        ]
},
    {
        "city_name": "Quito",
        "country": "Ecuador",
        "country_code": "EC",
        "flag": "🇪🇨",
        "region": "Latin America",
        "population_millions": 2.01,
        "lat": -0.1807,
        "lng": -78.4678,
        "crime_index": 59.8,
        "safety_index": 40.2,
        "crime_rate_per_100k": 3340,
        "violent_crime_rate_per_100k": 740,
        "risk_tier": "Elevated",
        "emergency_number": "911",
        "police_agency": "National Police of Ecuador (Policia Nacional)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "EC-01",
                        "name": "Centro Historico"
                },
                {
                        "id": "EC-02",
                        "name": "La Mariscal"
                },
                {
                        "id": "EC-03",
                        "name": "Inaquito (Financial)"
                },
                {
                        "id": "EC-04",
                        "name": "Cumbaya"
                }
        ]
},
    {
        "city_name": "San Salvador",
        "country": "El Salvador",
        "country_code": "SV",
        "flag": "🇸🇻",
        "region": "Latin America",
        "population_millions": 0.57,
        "lat": 13.6929,
        "lng": -89.2182,
        "crime_index": 42.0,
        "safety_index": 58.0,
        "crime_rate_per_100k": 2250,
        "violent_crime_rate_per_100k": 370,
        "risk_tier": "Moderate",
        "emergency_number": "911",
        "police_agency": "National Civil Police (PNC El Salvador)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "SV-01",
                        "name": "San Benito"
                },
                {
                        "id": "SV-02",
                        "name": "Escalon"
                },
                {
                        "id": "SV-03",
                        "name": "Centro Historico"
                },
                {
                        "id": "SV-04",
                        "name": "Santa Tecla"
                }
        ]
},
    {
        "city_name": "St. George's",
        "country": "Grenada",
        "country_code": "GD",
        "flag": "🇬🇩",
        "region": "Latin America",
        "population_millions": 0.04,
        "lat": 12.0561,
        "lng": -61.7488,
        "crime_index": 32.5,
        "safety_index": 67.5,
        "crime_rate_per_100k": 1710,
        "violent_crime_rate_per_100k": 200,
        "risk_tier": "Low Risk",
        "emergency_number": "911",
        "police_agency": "Royal Grenada Police Force (RGPF)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "GD-01",
                        "name": "The Carenage"
                },
                {
                        "id": "GD-02",
                        "name": "Grand Anse"
                },
                {
                        "id": "GD-03",
                        "name": "Fort George Sector"
                },
                {
                        "id": "GD-04",
                        "name": "St. Paul's"
                }
        ]
},
    {
        "city_name": "Guatemala City",
        "country": "Guatemala",
        "country_code": "GT",
        "flag": "🇬🇹",
        "region": "Latin America",
        "population_millions": 1.21,
        "lat": 14.6349,
        "lng": -90.5069,
        "crime_index": 65.9,
        "safety_index": 34.1,
        "crime_rate_per_100k": 3640,
        "violent_crime_rate_per_100k": 860,
        "risk_tier": "Elevated",
        "emergency_number": "110",
        "police_agency": "National Civil Police (PNC Guatemala)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "GT-01",
                        "name": "Zona 1 - Centro"
                },
                {
                        "id": "GT-02",
                        "name": "Zona 10 - Zona Viva"
                },
                {
                        "id": "GT-03",
                        "name": "Zona 14 - La Canada"
                },
                {
                        "id": "GT-04",
                        "name": "Zona 4 - Cuatro Grados"
                }
        ]
},
    {
        "city_name": "Georgetown",
        "country": "Guyana",
        "country_code": "GY",
        "flag": "🇬🇾",
        "region": "Latin America",
        "population_millions": 0.2,
        "lat": 6.8013,
        "lng": -58.1551,
        "crime_index": 68.7,
        "safety_index": 31.3,
        "crime_rate_per_100k": 3800,
        "violent_crime_rate_per_100k": 910,
        "risk_tier": "Critical",
        "emergency_number": "911",
        "police_agency": "Guyana Police Force",
        "is_live_db": False,
        "districts": [
                {
                        "id": "GY-01",
                        "name": "Stabroek"
                },
                {
                        "id": "GY-02",
                        "name": "Bourda"
                },
                {
                        "id": "GY-03",
                        "name": "Kitty / Campbellville"
                },
                {
                        "id": "GY-04",
                        "name": "Prashad Nagar"
                }
        ]
},
    {
        "city_name": "Port-au-Prince",
        "country": "Haiti",
        "country_code": "HT",
        "flag": "🇭🇹",
        "region": "Latin America",
        "population_millions": 1.2,
        "lat": 18.5944,
        "lng": -72.3074,
        "crime_index": 81.2,
        "safety_index": 18.8,
        "crime_rate_per_100k": 4480,
        "violent_crime_rate_per_100k": 1390,
        "risk_tier": "Critical",
        "emergency_number": "114",
        "police_agency": "Haitian National Police (PNH)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "HT-01",
                        "name": "Delmas"
                },
                {
                        "id": "HT-02",
                        "name": "Petion-Ville"
                },
                {
                        "id": "HT-03",
                        "name": "Carrefour"
                },
                {
                        "id": "HT-04",
                        "name": "Centre-Ville"
                }
        ]
},
    {
        "city_name": "Tegucigalpa",
        "country": "Honduras",
        "country_code": "HN",
        "flag": "🇭🇳",
        "region": "Latin America",
        "population_millions": 1.15,
        "lat": 14.0723,
        "lng": -87.1921,
        "crime_index": 67.3,
        "safety_index": 32.7,
        "crime_rate_per_100k": 3720,
        "violent_crime_rate_per_100k": 890,
        "risk_tier": "Critical",
        "emergency_number": "911",
        "police_agency": "National Police of Honduras",
        "is_live_db": False,
        "districts": [
                {
                        "id": "HN-01",
                        "name": "Colonia Palmira"
                },
                {
                        "id": "HN-02",
                        "name": "Lomas del Guijarro"
                },
                {
                        "id": "HN-03",
                        "name": "Centro Historico"
                },
                {
                        "id": "HN-04",
                        "name": "Comayaguela"
                }
        ]
},
    {
        "city_name": "Kingston",
        "country": "Jamaica",
        "country_code": "JM",
        "flag": "🇯🇲",
        "region": "Latin America",
        "population_millions": 0.67,
        "lat": 17.9714,
        "lng": -76.7936,
        "crime_index": 70.8,
        "safety_index": 29.2,
        "crime_rate_per_100k": 3910,
        "violent_crime_rate_per_100k": 960,
        "risk_tier": "Critical",
        "emergency_number": "119",
        "police_agency": "Jamaica Constabulary Force (JCF)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "JM-01",
                        "name": "New Kingston"
                },
                {
                        "id": "JM-02",
                        "name": "Half Way Tree"
                },
                {
                        "id": "JM-03",
                        "name": "Downtown Kingston"
                },
                {
                        "id": "JM-04",
                        "name": "Liguanea"
                }
        ]
},
    {
        "city_name": "Managua",
        "country": "Nicaragua",
        "country_code": "NI",
        "flag": "🇳🇮",
        "region": "Latin America",
        "population_millions": 1.05,
        "lat": 12.115,
        "lng": -86.2362,
        "crime_index": 47.9,
        "safety_index": 52.1,
        "crime_rate_per_100k": 2550,
        "violent_crime_rate_per_100k": 440,
        "risk_tier": "Moderate",
        "emergency_number": "118",
        "police_agency": "National Police of Nicaragua",
        "is_live_db": False,
        "districts": [
                {
                        "id": "NI-01",
                        "name": "Distrito I - Bolonia"
                },
                {
                        "id": "NI-02",
                        "name": "Distrito V - Los Robles"
                },
                {
                        "id": "NI-03",
                        "name": "Distrito IV - Mercado"
                },
                {
                        "id": "NI-04",
                        "name": "Villa Fontana"
                }
        ]
},
    {
        "city_name": "Panama City",
        "country": "Panama",
        "country_code": "PA",
        "flag": "🇵🇦",
        "region": "Latin America",
        "population_millions": 0.88,
        "lat": 8.9824,
        "lng": -79.5199,
        "crime_index": 47.1,
        "safety_index": 52.9,
        "crime_rate_per_100k": 2510,
        "violent_crime_rate_per_100k": 430,
        "risk_tier": "Moderate",
        "emergency_number": "104",
        "police_agency": "National Police of Panama (Policia Nacional)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "PA-01",
                        "name": "Casco Viejo"
                },
                {
                        "id": "PA-02",
                        "name": "Bella Vista"
                },
                {
                        "id": "PA-03",
                        "name": "San Francisco"
                },
                {
                        "id": "PA-04",
                        "name": "Costa del Este"
                }
        ]
},
    {
        "city_name": "Asuncion",
        "country": "Paraguay",
        "country_code": "PY",
        "flag": "🇵🇾",
        "region": "Latin America",
        "population_millions": 0.52,
        "lat": -25.2637,
        "lng": -57.5759,
        "crime_index": 52.3,
        "safety_index": 47.7,
        "crime_rate_per_100k": 2940,
        "violent_crime_rate_per_100k": 550,
        "risk_tier": "Moderate",
        "emergency_number": "911",
        "police_agency": "National Police of Paraguay (Policia Nacional)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "PY-01",
                        "name": "Centro"
                },
                {
                        "id": "PY-02",
                        "name": "Villa Morra"
                },
                {
                        "id": "PY-03",
                        "name": "Las Carmelitas"
                },
                {
                        "id": "PY-04",
                        "name": "Manora"
                }
        ]
},
    {
        "city_name": "Basseterre",
        "country": "Saint Kitts and Nevis",
        "country_code": "KN",
        "flag": "🇰🇳",
        "region": "Latin America",
        "population_millions": 0.01,
        "lat": 17.3026,
        "lng": -62.7177,
        "crime_index": 39.0,
        "safety_index": 61.0,
        "crime_rate_per_100k": 2090,
        "violent_crime_rate_per_100k": 300,
        "risk_tier": "Moderate",
        "emergency_number": "911",
        "police_agency": "Royal St. Christopher and Nevis Police Force",
        "is_live_db": False,
        "districts": [
                {
                        "id": "KN-01",
                        "name": "The Circus"
                },
                {
                        "id": "KN-02",
                        "name": "Port Zante"
                },
                {
                        "id": "KN-03",
                        "name": "Frigate Bay"
                },
                {
                        "id": "KN-04",
                        "name": "Fortlands"
                }
        ]
},
    {
        "city_name": "Castries",
        "country": "Saint Lucia",
        "country_code": "LC",
        "flag": "🇱🇨",
        "region": "Latin America",
        "population_millions": 0.02,
        "lat": 14.0101,
        "lng": -60.9875,
        "crime_index": 46.5,
        "safety_index": 53.5,
        "crime_rate_per_100k": 2490,
        "violent_crime_rate_per_100k": 420,
        "risk_tier": "Moderate",
        "emergency_number": "911",
        "police_agency": "Royal Saint Lucia Police Force",
        "is_live_db": False,
        "districts": [
                {
                        "id": "LC-01",
                        "name": "Central Castries"
                },
                {
                        "id": "LC-02",
                        "name": "Pointe Seraphine"
                },
                {
                        "id": "LC-03",
                        "name": "Vigie"
                },
                {
                        "id": "LC-04",
                        "name": "Morne Fortune"
                }
        ]
},
    {
        "city_name": "Kingstown",
        "country": "Saint Vincent and the Grenadines",
        "country_code": "VC",
        "flag": "🇻🇨",
        "region": "Latin America",
        "population_millions": 0.02,
        "lat": 13.16,
        "lng": -61.2248,
        "crime_index": 48.2,
        "safety_index": 51.8,
        "crime_rate_per_100k": 2580,
        "violent_crime_rate_per_100k": 450,
        "risk_tier": "Moderate",
        "emergency_number": "911",
        "police_agency": "Royal Saint Vincent Police Force",
        "is_live_db": False,
        "districts": [
                {
                        "id": "VC-01",
                        "name": "Bay Street"
                },
                {
                        "id": "VC-02",
                        "name": "Middle Street"
                },
                {
                        "id": "VC-03",
                        "name": "Villa Sector"
                },
                {
                        "id": "VC-04",
                        "name": "Arnos Vale"
                }
        ]
},
    {
        "city_name": "Paramaribo",
        "country": "Suriname",
        "country_code": "SR",
        "flag": "🇸🇷",
        "region": "Latin America",
        "population_millions": 0.24,
        "lat": 5.852,
        "lng": -55.2038,
        "crime_index": 51.9,
        "safety_index": 48.1,
        "crime_rate_per_100k": 2910,
        "violent_crime_rate_per_100k": 530,
        "risk_tier": "Moderate",
        "emergency_number": "115",
        "police_agency": "Suriname Police Corps (KPS)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "SR-01",
                        "name": "Centrum"
                },
                {
                        "id": "SR-02",
                        "name": "Rainville"
                },
                {
                        "id": "SR-03",
                        "name": "Blauwgrond"
                },
                {
                        "id": "SR-04",
                        "name": "Beekhuizen"
                }
        ]
},
    {
        "city_name": "Port of Spain",
        "country": "Trinidad and Tobago",
        "country_code": "TT",
        "flag": "🇹🇹",
        "region": "Latin America",
        "population_millions": 0.04,
        "lat": 10.6549,
        "lng": -61.5019,
        "crime_index": 72.3,
        "safety_index": 27.7,
        "crime_rate_per_100k": 3990,
        "violent_crime_rate_per_100k": 1010,
        "risk_tier": "Critical",
        "emergency_number": "999",
        "police_agency": "Trinidad and Tobago Police Service (TTPS)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "TT-01",
                        "name": "Woodbrook"
                },
                {
                        "id": "TT-02",
                        "name": "St. Clair"
                },
                {
                        "id": "TT-03",
                        "name": "Downtown"
                },
                {
                        "id": "TT-04",
                        "name": "Belmont"
                }
        ]
},
    {
        "city_name": "Caracas",
        "country": "Venezuela",
        "country_code": "VE",
        "flag": "🇻🇪",
        "region": "Latin America",
        "population_millions": 2.95,
        "lat": 10.4806,
        "lng": -66.9036,
        "crime_index": 82.5,
        "safety_index": 17.5,
        "crime_rate_per_100k": 4560,
        "violent_crime_rate_per_100k": 1450,
        "risk_tier": "Critical",
        "emergency_number": "911",
        "police_agency": "Bolivarian National Police (PNB)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "VE-01",
                        "name": "Chacao"
                },
                {
                        "id": "VE-02",
                        "name": "Baruta"
                },
                {
                        "id": "VE-03",
                        "name": "El Hatillo"
                },
                {
                        "id": "VE-04",
                        "name": "Libertador"
                }
        ]
},
    {
        "city_name": "Algiers",
        "country": "Algeria",
        "country_code": "DZ",
        "flag": "🇩🇿",
        "region": "Africa",
        "population_millions": 2.85,
        "lat": 36.7538,
        "lng": 3.0588,
        "crime_index": 51.8,
        "safety_index": 48.2,
        "crime_rate_per_100k": 2910,
        "violent_crime_rate_per_100k": 520,
        "risk_tier": "Moderate",
        "emergency_number": "1548",
        "police_agency": "General Directorate of National Security (DGSN)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "DZ-01",
                        "name": "Sidi M'Hamed"
                },
                {
                        "id": "DZ-02",
                        "name": "Bab El Oued"
                },
                {
                        "id": "DZ-03",
                        "name": "El Biar"
                },
                {
                        "id": "DZ-04",
                        "name": "Hydra"
                }
        ]
},
    {
        "city_name": "Luanda",
        "country": "Angola",
        "country_code": "AO",
        "flag": "🇦🇴",
        "region": "Africa",
        "population_millions": 8.3,
        "lat": -8.839,
        "lng": 13.2894,
        "crime_index": 65.4,
        "safety_index": 34.6,
        "crime_rate_per_100k": 3610,
        "violent_crime_rate_per_100k": 840,
        "risk_tier": "Elevated",
        "emergency_number": "113",
        "police_agency": "National Police of Angola (PNA)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "AO-01",
                        "name": "Ingombota"
                },
                {
                        "id": "AO-02",
                        "name": "Maianga"
                },
                {
                        "id": "AO-03",
                        "name": "Talatona"
                },
                {
                        "id": "AO-04",
                        "name": "Kilamba Kiaxi"
                }
        ]
},
    {
        "city_name": "Cotonou",
        "country": "Benin",
        "country_code": "BJ",
        "flag": "🇧🇯",
        "region": "Africa",
        "population_millions": 1.2,
        "lat": 6.3703,
        "lng": 2.3912,
        "crime_index": 46.2,
        "safety_index": 53.8,
        "crime_rate_per_100k": 2480,
        "violent_crime_rate_per_100k": 420,
        "risk_tier": "Moderate",
        "emergency_number": "117",
        "police_agency": "Republican Police of Benin",
        "is_live_db": False,
        "districts": [
                {
                        "id": "BJ-01",
                        "name": "Haie Vive"
                },
                {
                        "id": "BJ-02",
                        "name": "Ganhi (Commercial)"
                },
                {
                        "id": "BJ-03",
                        "name": "Akpakpa"
                },
                {
                        "id": "BJ-04",
                        "name": "Cadjehoun"
                }
        ]
},
    {
        "city_name": "Gaborone",
        "country": "Botswana",
        "country_code": "BW",
        "flag": "🇧🇼",
        "region": "Africa",
        "population_millions": 0.28,
        "lat": -24.6282,
        "lng": 25.9231,
        "crime_index": 43.1,
        "safety_index": 56.9,
        "crime_rate_per_100k": 2310,
        "violent_crime_rate_per_100k": 370,
        "risk_tier": "Moderate",
        "emergency_number": "999",
        "police_agency": "Botswana Police Service (BPS)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "BW-01",
                        "name": "Main Mall / CBD"
                },
                {
                        "id": "BW-02",
                        "name": "Broadhurst"
                },
                {
                        "id": "BW-03",
                        "name": "Phakalane"
                },
                {
                        "id": "BW-04",
                        "name": "Village"
                }
        ]
},
    {
        "city_name": "Ouagadougou",
        "country": "Burkina Faso",
        "country_code": "BF",
        "flag": "🇧🇫",
        "region": "Africa",
        "population_millions": 2.45,
        "lat": 12.3714,
        "lng": -1.5197,
        "crime_index": 58.7,
        "safety_index": 41.3,
        "crime_rate_per_100k": 3290,
        "violent_crime_rate_per_100k": 740,
        "risk_tier": "Elevated",
        "emergency_number": "17",
        "police_agency": "National Police of Burkina Faso",
        "is_live_db": False,
        "districts": [
                {
                        "id": "BF-01",
                        "name": "Ouaga 2000"
                },
                {
                        "id": "BF-02",
                        "name": "Gounghin"
                },
                {
                        "id": "BF-03",
                        "name": "Koulouba"
                },
                {
                        "id": "BF-04",
                        "name": "Dassasgho"
                }
        ]
},
    {
        "city_name": "Bujumbura",
        "country": "Burundi",
        "country_code": "BI",
        "flag": "🇧🇮",
        "region": "Africa",
        "population_millions": 1.1,
        "lat": -3.3822,
        "lng": 29.3644,
        "crime_index": 56.8,
        "safety_index": 43.2,
        "crime_rate_per_100k": 3190,
        "violent_crime_rate_per_100k": 690,
        "risk_tier": "Elevated",
        "emergency_number": "117",
        "police_agency": "National Police of Burundi",
        "is_live_db": False,
        "districts": [
                {
                        "id": "BI-01",
                        "name": "Rohero"
                },
                {
                        "id": "BI-02",
                        "name": "Kiriri"
                },
                {
                        "id": "BI-03",
                        "name": "Bwiza"
                },
                {
                        "id": "BI-04",
                        "name": "Buyenzi"
                }
        ]
},
    {
        "city_name": "Praia",
        "country": "Cabo Verde",
        "country_code": "CV",
        "flag": "🇨🇻",
        "region": "Africa",
        "population_millions": 0.16,
        "lat": 14.933,
        "lng": -23.5133,
        "crime_index": 38.5,
        "safety_index": 61.5,
        "crime_rate_per_100k": 2060,
        "violent_crime_rate_per_100k": 290,
        "risk_tier": "Moderate",
        "emergency_number": "132",
        "police_agency": "National Police of Cabo Verde",
        "is_live_db": False,
        "districts": [
                {
                        "id": "CV-01",
                        "name": "Plato (Historic)"
                },
                {
                        "id": "CV-02",
                        "name": "Achada Santo Antonio"
                },
                {
                        "id": "CV-03",
                        "name": "Palmarejo"
                },
                {
                        "id": "CV-04",
                        "name": "Prainha"
                }
        ]
},
    {
        "city_name": "Douala",
        "country": "Cameroon",
        "country_code": "CM",
        "flag": "🇨🇲",
        "region": "Africa",
        "population_millions": 3.65,
        "lat": 4.0511,
        "lng": 9.7679,
        "crime_index": 62.4,
        "safety_index": 37.6,
        "crime_rate_per_100k": 3460,
        "violent_crime_rate_per_100k": 790,
        "risk_tier": "Elevated",
        "emergency_number": "117",
        "police_agency": "National Police of Cameroon (DGSN)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "CM-01",
                        "name": "Bonanjo"
                },
                {
                        "id": "CM-02",
                        "name": "Akwa"
                },
                {
                        "id": "CM-03",
                        "name": "Bonapriso"
                },
                {
                        "id": "CM-04",
                        "name": "Deido"
                }
        ]
},
    {
        "city_name": "Bangui",
        "country": "Central African Republic",
        "country_code": "CF",
        "flag": "🇨🇫",
        "region": "Africa",
        "population_millions": 0.89,
        "lat": 4.3947,
        "lng": 18.5582,
        "crime_index": 75.1,
        "safety_index": 24.9,
        "crime_rate_per_100k": 4050,
        "violent_crime_rate_per_100k": 1180,
        "risk_tier": "Critical",
        "emergency_number": "117",
        "police_agency": "Central African National Police",
        "is_live_db": False,
        "districts": [
                {
                        "id": "CF-01",
                        "name": "1er Arrondissement"
                },
                {
                        "id": "CF-02",
                        "name": "Lakouanga"
                },
                {
                        "id": "CF-03",
                        "name": "Combattant"
                },
                {
                        "id": "CF-04",
                        "name": "PK5 Sector"
                }
        ]
},
    {
        "city_name": "N'Djamena",
        "country": "Chad",
        "country_code": "TD",
        "flag": "🇹🇩",
        "region": "Africa",
        "population_millions": 1.5,
        "lat": 12.1348,
        "lng": 15.0557,
        "crime_index": 64.9,
        "safety_index": 35.1,
        "crime_rate_per_100k": 3580,
        "violent_crime_rate_per_100k": 830,
        "risk_tier": "Elevated",
        "emergency_number": "17",
        "police_agency": "National Police of Chad",
        "is_live_db": False,
        "districts": [
                {
                        "id": "TD-01",
                        "name": "Farcha"
                },
                {
                        "id": "TD-02",
                        "name": "Chagoua"
                },
                {
                        "id": "TD-03",
                        "name": "Moursal"
                },
                {
                        "id": "TD-04",
                        "name": "Paris-Congo"
                }
        ]
},
    {
        "city_name": "Moroni",
        "country": "Comoros",
        "country_code": "KM",
        "flag": "🇰🇲",
        "region": "Africa",
        "population_millions": 0.08,
        "lat": -11.7172,
        "lng": 43.2473,
        "crime_index": 35.0,
        "safety_index": 65.0,
        "crime_rate_per_100k": 1850,
        "violent_crime_rate_per_100k": 230,
        "risk_tier": "Low Risk",
        "emergency_number": "17",
        "police_agency": "National Police of Comoros",
        "is_live_db": False,
        "districts": [
                {
                        "id": "KM-01",
                        "name": "Badjanani"
                },
                {
                        "id": "KM-02",
                        "name": "Mtsangani"
                },
                {
                        "id": "KM-03",
                        "name": "Iraqi"
                },
                {
                        "id": "KM-04",
                        "name": "Coulisse"
                }
        ]
},
    {
        "city_name": "Brazzaville",
        "country": "Congo",
        "country_code": "CG",
        "flag": "🇨🇬",
        "region": "Africa",
        "population_millions": 1.95,
        "lat": -4.2634,
        "lng": 15.2429,
        "crime_index": 59.3,
        "safety_index": 40.7,
        "crime_rate_per_100k": 3320,
        "violent_crime_rate_per_100k": 730,
        "risk_tier": "Elevated",
        "emergency_number": "117",
        "police_agency": "National Police of the Republic of the Congo",
        "is_live_db": False,
        "districts": [
                {
                        "id": "CG-01",
                        "name": "Bacongo"
                },
                {
                        "id": "CG-02",
                        "name": "Poto-Poto"
                },
                {
                        "id": "CG-03",
                        "name": "Moungali"
                },
                {
                        "id": "CG-04",
                        "name": "Ouenze"
                }
        ]
},
    {
        "city_name": "Kinshasa",
        "country": "DR Congo",
        "country_code": "CD",
        "flag": "🇨🇩",
        "region": "Africa",
        "population_millions": 15.6,
        "lat": -4.4419,
        "lng": 15.2663,
        "crime_index": 72.8,
        "safety_index": 27.2,
        "crime_rate_per_100k": 4020,
        "violent_crime_rate_per_100k": 1080,
        "risk_tier": "Critical",
        "emergency_number": "112",
        "police_agency": "Congolese National Police (PNC)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "CD-01",
                        "name": "Gombe"
                },
                {
                        "id": "CD-02",
                        "name": "Kalamu"
                },
                {
                        "id": "CD-03",
                        "name": "Limete"
                },
                {
                        "id": "CD-04",
                        "name": "Lingwala"
                },
                {
                        "id": "CD-05",
                        "name": "Matete"
                }
        ]
},
    {
        "city_name": "Abidjan",
        "country": "Cote d'Ivoire",
        "country_code": "CI",
        "flag": "🇨🇮",
        "region": "Africa",
        "population_millions": 5.6,
        "lat": 5.36,
        "lng": -4.0083,
        "crime_index": 56.4,
        "safety_index": 43.6,
        "crime_rate_per_100k": 3180,
        "violent_crime_rate_per_100k": 690,
        "risk_tier": "Elevated",
        "emergency_number": "111",
        "police_agency": "National Police of Ivory Coast",
        "is_live_db": False,
        "districts": [
                {
                        "id": "CI-01",
                        "name": "Plateau"
                },
                {
                        "id": "CI-02",
                        "name": "Cocody"
                },
                {
                        "id": "CI-03",
                        "name": "Marcory - Zone 4"
                },
                {
                        "id": "CI-04",
                        "name": "Treichville"
                },
                {
                        "id": "CI-05",
                        "name": "Yopougon"
                }
        ]
},
    {
        "city_name": "Djibouti City",
        "country": "Djibouti",
        "country_code": "DJ",
        "flag": "🇩🇯",
        "region": "Africa",
        "population_millions": 0.6,
        "lat": 11.5721,
        "lng": 43.1456,
        "crime_index": 41.2,
        "safety_index": 58.8,
        "crime_rate_per_100k": 2210,
        "violent_crime_rate_per_100k": 330,
        "risk_tier": "Moderate",
        "emergency_number": "17",
        "police_agency": "Djiboutian National Police",
        "is_live_db": False,
        "districts": [
                {
                        "id": "DJ-01",
                        "name": "Heron"
                },
                {
                        "id": "DJ-02",
                        "name": "Ambouli"
                },
                {
                        "id": "DJ-03",
                        "name": "Balbala"
                },
                {
                        "id": "DJ-04",
                        "name": "Plateau du Serpent"
                }
        ]
},
    {
        "city_name": "Malabo",
        "country": "Equatorial Guinea",
        "country_code": "GQ",
        "flag": "🇬🇶",
        "region": "Africa",
        "population_millions": 0.3,
        "lat": 3.7504,
        "lng": 8.7371,
        "crime_index": 47.5,
        "safety_index": 52.5,
        "crime_rate_per_100k": 2530,
        "violent_crime_rate_per_100k": 430,
        "risk_tier": "Moderate",
        "emergency_number": "114",
        "police_agency": "National Police of Equatorial Guinea",
        "is_live_db": False,
        "districts": [
                {
                        "id": "GQ-01",
                        "name": "Caracolas"
                },
                {
                        "id": "GQ-02",
                        "name": "Ela Nguema"
                },
                {
                        "id": "GQ-03",
                        "name": "Malabo II"
                },
                {
                        "id": "GQ-04",
                        "name": "Campo Yaounde"
                }
        ]
},
    {
        "city_name": "Asmara",
        "country": "Eritrea",
        "country_code": "ER",
        "flag": "🇪🇷",
        "region": "Africa",
        "population_millions": 0.96,
        "lat": 15.3229,
        "lng": 38.9251,
        "crime_index": 29.8,
        "safety_index": 70.2,
        "crime_rate_per_100k": 1590,
        "violent_crime_rate_per_100k": 160,
        "risk_tier": "Low Risk",
        "emergency_number": "113",
        "police_agency": "Eritrean Police Force",
        "is_live_db": False,
        "districts": [
                {
                        "id": "ER-01",
                        "name": "Godaif"
                },
                {
                        "id": "ER-02",
                        "name": "Tiravolo"
                },
                {
                        "id": "ER-03",
                        "name": "Sembel"
                },
                {
                        "id": "ER-04",
                        "name": "Maekel"
                }
        ]
},
    {
        "city_name": "Mbabane",
        "country": "Eswatini",
        "country_code": "SZ",
        "flag": "🇸🇿",
        "region": "Africa",
        "population_millions": 0.1,
        "lat": -26.3054,
        "lng": 31.1367,
        "crime_index": 54.2,
        "safety_index": 45.8,
        "crime_rate_per_100k": 3050,
        "violent_crime_rate_per_100k": 600,
        "risk_tier": "Moderate",
        "emergency_number": "999",
        "police_agency": "Royal Eswatini Police Service",
        "is_live_db": False,
        "districts": [
                {
                        "id": "SZ-01",
                        "name": "Central Business District"
                },
                {
                        "id": "SZ-02",
                        "name": "Msunduza"
                },
                {
                        "id": "SZ-03",
                        "name": "Mbangweni"
                },
                {
                        "id": "SZ-04",
                        "name": "Eveni"
                }
        ]
},
    {
        "city_name": "Addis Ababa",
        "country": "Ethiopia",
        "country_code": "ET",
        "flag": "🇪🇹",
        "region": "Africa",
        "population_millions": 5.23,
        "lat": 9.032,
        "lng": 38.7469,
        "crime_index": 48.9,
        "safety_index": 51.1,
        "crime_rate_per_100k": 2720,
        "violent_crime_rate_per_100k": 490,
        "risk_tier": "Moderate",
        "emergency_number": "991",
        "police_agency": "Addis Ababa City Police Commission",
        "is_live_db": False,
        "districts": [
                {
                        "id": "ET-01",
                        "name": "Bole"
                },
                {
                        "id": "ET-02",
                        "name": "Kirkos"
                },
                {
                        "id": "ET-03",
                        "name": "Arada - Piazza"
                },
                {
                        "id": "ET-04",
                        "name": "Yeka"
                },
                {
                        "id": "ET-05",
                        "name": "Lideta"
                }
        ]
},
    {
        "city_name": "Libreville",
        "country": "Gabon",
        "country_code": "GA",
        "flag": "🇬🇦",
        "region": "Africa",
        "population_millions": 0.85,
        "lat": 0.4162,
        "lng": 9.4673,
        "crime_index": 52.8,
        "safety_index": 47.2,
        "crime_rate_per_100k": 2970,
        "violent_crime_rate_per_100k": 560,
        "risk_tier": "Moderate",
        "emergency_number": "177",
        "police_agency": "National Police Force of Gabon",
        "is_live_db": False,
        "districts": [
                {
                        "id": "GA-01",
                        "name": "Batterie IV"
                },
                {
                        "id": "GA-02",
                        "name": "Louis"
                },
                {
                        "id": "GA-03",
                        "name": "Mont-Bouet"
                },
                {
                        "id": "GA-04",
                        "name": "Glass"
                }
        ]
},
    {
        "city_name": "Banjul",
        "country": "Gambia",
        "country_code": "GM",
        "flag": "🇬🇲",
        "region": "Africa",
        "population_millions": 0.05,
        "lat": 13.4549,
        "lng": -16.579,
        "crime_index": 42.6,
        "safety_index": 57.4,
        "crime_rate_per_100k": 2280,
        "violent_crime_rate_per_100k": 360,
        "risk_tier": "Moderate",
        "emergency_number": "117",
        "police_agency": "The Gambia Police Force",
        "is_live_db": False,
        "districts": [
                {
                        "id": "GM-01",
                        "name": "Albert Market"
                },
                {
                        "id": "GM-02",
                        "name": "Half Die"
                },
                {
                        "id": "GM-03",
                        "name": "Soldier Town"
                },
                {
                        "id": "GM-04",
                        "name": "Serrekunda Precinct"
                }
        ]
},
    {
        "city_name": "Conakry",
        "country": "Guinea",
        "country_code": "GN",
        "flag": "🇬🇳",
        "region": "Africa",
        "population_millions": 1.95,
        "lat": 9.6412,
        "lng": -13.5784,
        "crime_index": 61.2,
        "safety_index": 38.8,
        "crime_rate_per_100k": 3410,
        "violent_crime_rate_per_100k": 780,
        "risk_tier": "Elevated",
        "emergency_number": "117",
        "police_agency": "National Police of Guinea",
        "is_live_db": False,
        "districts": [
                {
                        "id": "GN-01",
                        "name": "Kaloum"
                },
                {
                        "id": "GN-02",
                        "name": "Dixinn"
                },
                {
                        "id": "GN-03",
                        "name": "Ratoma"
                },
                {
                        "id": "GN-04",
                        "name": "Matam"
                }
        ]
},
    {
        "city_name": "Bissau",
        "country": "Guinea-Bissau",
        "country_code": "GW",
        "flag": "🇬🇼",
        "region": "Africa",
        "population_millions": 0.49,
        "lat": 11.8816,
        "lng": -15.6178,
        "crime_index": 53.0,
        "safety_index": 47.0,
        "crime_rate_per_100k": 2980,
        "violent_crime_rate_per_100k": 570,
        "risk_tier": "Moderate",
        "emergency_number": "117",
        "police_agency": "Public Order Police of Guinea-Bissau",
        "is_live_db": False,
        "districts": [
                {
                        "id": "GW-01",
                        "name": "Praca Bissau"
                },
                {
                        "id": "GW-02",
                        "name": "Bandim"
                },
                {
                        "id": "GW-03",
                        "name": "Santa Luzia"
                },
                {
                        "id": "GW-04",
                        "name": "Bissalanca"
                }
        ]
},
    {
        "city_name": "Maseru",
        "country": "Lesotho",
        "country_code": "LS",
        "flag": "🇱🇸",
        "region": "Africa",
        "population_millions": 0.34,
        "lat": -29.3151,
        "lng": 27.4869,
        "crime_index": 57.9,
        "safety_index": 42.1,
        "crime_rate_per_100k": 3250,
        "violent_crime_rate_per_100k": 720,
        "risk_tier": "Elevated",
        "emergency_number": "123",
        "police_agency": "Lesotho Mounted Police Service",
        "is_live_db": False,
        "districts": [
                {
                        "id": "LS-01",
                        "name": "Kingsway Central"
                },
                {
                        "id": "LS-02",
                        "name": "Cathedral Area"
                },
                {
                        "id": "LS-03",
                        "name": "Maseru West"
                },
                {
                        "id": "LS-04",
                        "name": "Hlotse Corridor"
                }
        ]
},
    {
        "city_name": "Monrovia",
        "country": "Liberia",
        "country_code": "LR",
        "flag": "🇱🇷",
        "region": "Africa",
        "population_millions": 1.02,
        "lat": 6.3005,
        "lng": -10.7969,
        "crime_index": 65.1,
        "safety_index": 34.9,
        "crime_rate_per_100k": 3620,
        "violent_crime_rate_per_100k": 860,
        "risk_tier": "Elevated",
        "emergency_number": "911",
        "police_agency": "Liberia National Police (LNP)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "LR-01",
                        "name": "Mamba Point"
                },
                {
                        "id": "LR-02",
                        "name": "Sinkor"
                },
                {
                        "id": "LR-03",
                        "name": "Bushrod Island"
                },
                {
                        "id": "LR-04",
                        "name": "Paynesville"
                }
        ]
},
    {
        "city_name": "Tripoli",
        "country": "Libya",
        "country_code": "LY",
        "flag": "🇱🇾",
        "region": "Africa",
        "population_millions": 1.18,
        "lat": 32.8872,
        "lng": 13.1913,
        "crime_index": 63.8,
        "safety_index": 36.2,
        "crime_rate_per_100k": 3520,
        "violent_crime_rate_per_100k": 810,
        "risk_tier": "Elevated",
        "emergency_number": "1515",
        "police_agency": "Tripoli Security Directorate",
        "is_live_db": False,
        "districts": [
                {
                        "id": "LY-01",
                        "name": "Martyrs' Square"
                },
                {
                        "id": "LY-02",
                        "name": "Dahra"
                },
                {
                        "id": "LY-03",
                        "name": "Gergarish"
                },
                {
                        "id": "LY-04",
                        "name": "Hay Al-Andalus"
                }
        ]
},
    {
        "city_name": "Antananarivo",
        "country": "Madagascar",
        "country_code": "MG",
        "flag": "🇲🇬",
        "region": "Africa",
        "population_millions": 1.4,
        "lat": -18.8792,
        "lng": 47.5079,
        "crime_index": 58.1,
        "safety_index": 41.9,
        "crime_rate_per_100k": 3260,
        "violent_crime_rate_per_100k": 730,
        "risk_tier": "Elevated",
        "emergency_number": "117",
        "police_agency": "National Police of Madagascar",
        "is_live_db": False,
        "districts": [
                {
                        "id": "MG-01",
                        "name": "Analakely"
                },
                {
                        "id": "MG-02",
                        "name": "Isoraka"
                },
                {
                        "id": "MG-03",
                        "name": "Ankorondrano"
                },
                {
                        "id": "MG-04",
                        "name": "Ambohimanarina"
                }
        ]
},
    {
        "city_name": "Lilongwe",
        "country": "Malawi",
        "country_code": "MW",
        "flag": "🇲🇼",
        "region": "Africa",
        "population_millions": 1.12,
        "lat": -13.9626,
        "lng": 33.7741,
        "crime_index": 49.3,
        "safety_index": 50.7,
        "crime_rate_per_100k": 2740,
        "violent_crime_rate_per_100k": 500,
        "risk_tier": "Moderate",
        "emergency_number": "997",
        "police_agency": "Malawi Police Service",
        "is_live_db": False,
        "districts": [
                {
                        "id": "MW-01",
                        "name": "City Centre - Area 13"
                },
                {
                        "id": "MW-02",
                        "name": "Old Town - Area 2"
                },
                {
                        "id": "MW-03",
                        "name": "Area 47"
                },
                {
                        "id": "MW-04",
                        "name": "Area 10"
                }
        ]
},
    {
        "city_name": "Bamako",
        "country": "Mali",
        "country_code": "ML",
        "flag": "🇲🇱",
        "region": "Africa",
        "population_millions": 2.75,
        "lat": 12.6392,
        "lng": -8.0029,
        "crime_index": 61.5,
        "safety_index": 38.5,
        "crime_rate_per_100k": 3420,
        "violent_crime_rate_per_100k": 780,
        "risk_tier": "Elevated",
        "emergency_number": "17",
        "police_agency": "National Police of Mali",
        "is_live_db": False,
        "districts": [
                {
                        "id": "ML-01",
                        "name": "Commune III - Downtown"
                },
                {
                        "id": "ML-02",
                        "name": "Badalabougou"
                },
                {
                        "id": "ML-03",
                        "name": "ACI 2000"
                },
                {
                        "id": "ML-04",
                        "name": "Hippodrome"
                }
        ]
},
    {
        "city_name": "Nouakchott",
        "country": "Mauritania",
        "country_code": "MR",
        "flag": "🇲🇷",
        "region": "Africa",
        "population_millions": 1.25,
        "lat": 18.0735,
        "lng": -15.9582,
        "crime_index": 54.6,
        "safety_index": 45.4,
        "crime_rate_per_100k": 3070,
        "violent_crime_rate_per_100k": 610,
        "risk_tier": "Moderate",
        "emergency_number": "117",
        "police_agency": "General Directorate of National Security",
        "is_live_db": False,
        "districts": [
                {
                        "id": "MR-01",
                        "name": "Tevragh-Zeina"
                },
                {
                        "id": "MR-02",
                        "name": "Ksar"
                },
                {
                        "id": "MR-03",
                        "name": "Sebkha"
                },
                {
                        "id": "MR-04",
                        "name": "Dar-Naim"
                }
        ]
},
    {
        "city_name": "Port Louis",
        "country": "Mauritius",
        "country_code": "MU",
        "flag": "🇲🇺",
        "region": "Africa",
        "population_millions": 0.15,
        "lat": -20.1609,
        "lng": 57.5012,
        "crime_index": 32.4,
        "safety_index": 67.6,
        "crime_rate_per_100k": 1710,
        "violent_crime_rate_per_100k": 210,
        "risk_tier": "Low Risk",
        "emergency_number": "999",
        "police_agency": "Mauritius Police Force (MPF)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "MU-01",
                        "name": "Caudan Waterfront"
                },
                {
                        "id": "MU-02",
                        "name": "Chinatown"
                },
                {
                        "id": "MU-03",
                        "name": "Plaine Verte"
                },
                {
                        "id": "MU-04",
                        "name": "Champ de Mars"
                }
        ]
},
    {
        "city_name": "Maputo",
        "country": "Mozambique",
        "country_code": "MZ",
        "flag": "🇲🇿",
        "region": "Africa",
        "population_millions": 1.1,
        "lat": -25.9692,
        "lng": 32.5732,
        "crime_index": 59.2,
        "safety_index": 40.8,
        "crime_rate_per_100k": 3310,
        "violent_crime_rate_per_100k": 730,
        "risk_tier": "Elevated",
        "emergency_number": "112",
        "police_agency": "Police of the Republic of Mozambique",
        "is_live_db": False,
        "districts": [
                {
                        "id": "MZ-01",
                        "name": "Polana Cimento"
                },
                {
                        "id": "MZ-02",
                        "name": "Central B"
                },
                {
                        "id": "MZ-03",
                        "name": "Sommerschield"
                },
                {
                        "id": "MZ-04",
                        "name": "Alto Mae"
                }
        ]
},
    {
        "city_name": "Windhoek",
        "country": "Namibia",
        "country_code": "NA",
        "flag": "🇳🇦",
        "region": "Africa",
        "population_millions": 0.43,
        "lat": -22.5609,
        "lng": 17.0658,
        "crime_index": 56.7,
        "safety_index": 43.3,
        "crime_rate_per_100k": 3190,
        "violent_crime_rate_per_100k": 680,
        "risk_tier": "Elevated",
        "emergency_number": "10111",
        "police_agency": "City of Windhoek Police Department",
        "is_live_db": False,
        "districts": [
                {
                        "id": "NA-01",
                        "name": "Central Business District"
                },
                {
                        "id": "NA-02",
                        "name": "Klein Windhoek"
                },
                {
                        "id": "NA-03",
                        "name": "Ludwigsdorf"
                },
                {
                        "id": "NA-04",
                        "name": "Katutura"
                }
        ]
},
    {
        "city_name": "Niamey",
        "country": "Niger",
        "country_code": "NE",
        "flag": "🇳🇪",
        "region": "Africa",
        "population_millions": 1.35,
        "lat": 13.5116,
        "lng": 2.1254,
        "crime_index": 55.3,
        "safety_index": 44.7,
        "crime_rate_per_100k": 3110,
        "violent_crime_rate_per_100k": 640,
        "risk_tier": "Moderate",
        "emergency_number": "17",
        "police_agency": "National Police of Niger",
        "is_live_db": False,
        "districts": [
                {
                        "id": "NE-01",
                        "name": "Plateau"
                },
                {
                        "id": "NE-02",
                        "name": "Grand Marche"
                },
                {
                        "id": "NE-03",
                        "name": "Terminus"
                },
                {
                        "id": "NE-04",
                        "name": "Yantala"
                }
        ]
},
    {
        "city_name": "Sao Tome",
        "country": "Sao Tome and Principe",
        "country_code": "ST",
        "flag": "🇸🇹",
        "region": "Africa",
        "population_millions": 0.08,
        "lat": 0.3365,
        "lng": 6.7273,
        "crime_index": 34.0,
        "safety_index": 66.0,
        "crime_rate_per_100k": 1810,
        "violent_crime_rate_per_100k": 220,
        "risk_tier": "Low Risk",
        "emergency_number": "113",
        "police_agency": "National Police of Sao Tome and Principe",
        "is_live_db": False,
        "districts": [
                {
                        "id": "ST-01",
                        "name": "Baia de Ana Chaves"
                },
                {
                        "id": "ST-02",
                        "name": "Madre de Deus"
                },
                {
                        "id": "ST-03",
                        "name": "Agostinho Neto"
                },
                {
                        "id": "ST-04",
                        "name": "Pantufo"
                }
        ]
},
    {
        "city_name": "Dakar",
        "country": "Senegal",
        "country_code": "SN",
        "flag": "🇸🇳",
        "region": "Africa",
        "population_millions": 1.45,
        "lat": 14.7167,
        "lng": -17.4677,
        "crime_index": 48.6,
        "safety_index": 51.4,
        "crime_rate_per_100k": 2710,
        "violent_crime_rate_per_100k": 480,
        "risk_tier": "Moderate",
        "emergency_number": "17",
        "police_agency": "Senegalese National Police",
        "is_live_db": False,
        "districts": [
                {
                        "id": "SN-01",
                        "name": "Plateau"
                },
                {
                        "id": "SN-02",
                        "name": "Almadies"
                },
                {
                        "id": "SN-03",
                        "name": "Fann - Point E"
                },
                {
                        "id": "SN-04",
                        "name": "Medina"
                }
        ]
},
    {
        "city_name": "Victoria",
        "country": "Seychelles",
        "country_code": "SC",
        "flag": "🇸🇨",
        "region": "Africa",
        "population_millions": 0.03,
        "lat": -4.6191,
        "lng": 55.4513,
        "crime_index": 31.8,
        "safety_index": 68.2,
        "crime_rate_per_100k": 1680,
        "violent_crime_rate_per_100k": 190,
        "risk_tier": "Low Risk",
        "emergency_number": "999",
        "police_agency": "Seychelles Police Force",
        "is_live_db": False,
        "districts": [
                {
                        "id": "SC-01",
                        "name": "Central Victoria"
                },
                {
                        "id": "SC-02",
                        "name": "Mont Fleuri"
                },
                {
                        "id": "SC-03",
                        "name": "Bel Air"
                },
                {
                        "id": "SC-04",
                        "name": "Saint Louis"
                }
        ]
},
    {
        "city_name": "Freetown",
        "country": "Sierra Leone",
        "country_code": "SL",
        "flag": "🇸🇱",
        "region": "Africa",
        "population_millions": 1.2,
        "lat": 8.484,
        "lng": -13.2299,
        "crime_index": 57.4,
        "safety_index": 42.6,
        "crime_rate_per_100k": 3220,
        "violent_crime_rate_per_100k": 710,
        "risk_tier": "Elevated",
        "emergency_number": "999",
        "police_agency": "Sierra Leone Police",
        "is_live_db": False,
        "districts": [
                {
                        "id": "SL-01",
                        "name": "Central Freetown"
                },
                {
                        "id": "SL-02",
                        "name": "Wilberforce"
                },
                {
                        "id": "SL-03",
                        "name": "Aberdeen"
                },
                {
                        "id": "SL-04",
                        "name": "Congo Town"
                }
        ]
},
    {
        "city_name": "Mogadishu",
        "country": "Somalia",
        "country_code": "SO",
        "flag": "🇸🇴",
        "region": "Africa",
        "population_millions": 2.5,
        "lat": 2.0469,
        "lng": 45.3182,
        "crime_index": 74.2,
        "safety_index": 25.8,
        "crime_rate_per_100k": 4010,
        "violent_crime_rate_per_100k": 1140,
        "risk_tier": "Critical",
        "emergency_number": "888",
        "police_agency": "Somali Police Force",
        "is_live_db": False,
        "districts": [
                {
                        "id": "SO-01",
                        "name": "Hamar Weyne"
                },
                {
                        "id": "SO-02",
                        "name": "Hodan"
                },
                {
                        "id": "SO-03",
                        "name": "Waberi"
                },
                {
                        "id": "SO-04",
                        "name": "Abdiaziz"
                }
        ]
},
    {
        "city_name": "Juba",
        "country": "South Sudan",
        "country_code": "SS",
        "flag": "🇸🇸",
        "region": "Africa",
        "population_millions": 0.52,
        "lat": 4.8594,
        "lng": 31.5713,
        "crime_index": 76.8,
        "safety_index": 23.2,
        "crime_rate_per_100k": 4120,
        "violent_crime_rate_per_100k": 1220,
        "risk_tier": "Critical",
        "emergency_number": "777",
        "police_agency": "South Sudan National Police Service",
        "is_live_db": False,
        "districts": [
                {
                        "id": "SS-01",
                        "name": "Juba Town"
                },
                {
                        "id": "SS-02",
                        "name": "Malakia"
                },
                {
                        "id": "SS-03",
                        "name": "Munuki"
                },
                {
                        "id": "SS-04",
                        "name": "Kator"
                }
        ]
},
    {
        "city_name": "Khartoum",
        "country": "Sudan",
        "country_code": "SD",
        "flag": "🇸🇩",
        "region": "Africa",
        "population_millions": 5.3,
        "lat": 15.5007,
        "lng": 32.5599,
        "crime_index": 71.4,
        "safety_index": 28.6,
        "crime_rate_per_100k": 3950,
        "violent_crime_rate_per_100k": 990,
        "risk_tier": "Critical",
        "emergency_number": "999",
        "police_agency": "Sudan Police Force",
        "is_live_db": False,
        "districts": [
                {
                        "id": "SD-01",
                        "name": "Khartoum Centre"
                },
                {
                        "id": "SD-02",
                        "name": "Al-Riyadh"
                },
                {
                        "id": "SD-03",
                        "name": "Al-Amarat"
                },
                {
                        "id": "SD-04",
                        "name": "Bahri Sector"
                }
        ]
},
    {
        "city_name": "Dar es Salaam",
        "country": "Tanzania",
        "country_code": "TZ",
        "flag": "🇹🇿",
        "region": "Africa",
        "population_millions": 6.4,
        "lat": -6.7924,
        "lng": 39.2083,
        "crime_index": 54.6,
        "safety_index": 45.4,
        "crime_rate_per_100k": 3070,
        "violent_crime_rate_per_100k": 610,
        "risk_tier": "Moderate",
        "emergency_number": "112",
        "police_agency": "Tanzania Police Force",
        "is_live_db": False,
        "districts": [
                {
                        "id": "TZ-01",
                        "name": "Kivukoni"
                },
                {
                        "id": "TZ-02",
                        "name": "Oysterbay"
                },
                {
                        "id": "TZ-03",
                        "name": "Masaki"
                },
                {
                        "id": "TZ-04",
                        "name": "Upanga"
                },
                {
                        "id": "TZ-05",
                        "name": "Kariakoo"
                }
        ]
},
    {
        "city_name": "Lome",
        "country": "Togo",
        "country_code": "TG",
        "flag": "🇹🇬",
        "region": "Africa",
        "population_millions": 1.85,
        "lat": 6.1375,
        "lng": 1.2123,
        "crime_index": 49.8,
        "safety_index": 50.2,
        "crime_rate_per_100k": 2770,
        "violent_crime_rate_per_100k": 510,
        "risk_tier": "Moderate",
        "emergency_number": "117",
        "police_agency": "National Police of Togo",
        "is_live_db": False,
        "districts": [
                {
                        "id": "TG-01",
                        "name": "Centre-Ville"
                },
                {
                        "id": "TG-02",
                        "name": "Tokoin"
                },
                {
                        "id": "TG-03",
                        "name": "Hedzranawoe"
                },
                {
                        "id": "TG-04",
                        "name": "Be"
                }
        ]
},
    {
        "city_name": "Tunis",
        "country": "Tunisia",
        "country_code": "TN",
        "flag": "🇹🇳",
        "region": "Africa",
        "population_millions": 1.07,
        "lat": 36.8065,
        "lng": 10.1815,
        "crime_index": 46.8,
        "safety_index": 53.2,
        "crime_rate_per_100k": 2510,
        "violent_crime_rate_per_100k": 440,
        "risk_tier": "Moderate",
        "emergency_number": "197",
        "police_agency": "General Directorate of National Security of Tunisia",
        "is_live_db": False,
        "districts": [
                {
                        "id": "TN-01",
                        "name": "Medina"
                },
                {
                        "id": "TN-02",
                        "name": "Bab Bhar"
                },
                {
                        "id": "TN-03",
                        "name": "Les Berges du Lac"
                },
                {
                        "id": "TN-04",
                        "name": "La Marsa"
                }
        ]
},
    {
        "city_name": "Kampala",
        "country": "Uganda",
        "country_code": "UG",
        "flag": "🇺🇬",
        "region": "Africa",
        "population_millions": 1.68,
        "lat": 0.3476,
        "lng": 32.5825,
        "crime_index": 58.3,
        "safety_index": 41.7,
        "crime_rate_per_100k": 3270,
        "violent_crime_rate_per_100k": 720,
        "risk_tier": "Elevated",
        "emergency_number": "999",
        "police_agency": "Uganda Police Force (UPF)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "UG-01",
                        "name": "Central Division"
                },
                {
                        "id": "UG-02",
                        "name": "Nakasero"
                },
                {
                        "id": "UG-03",
                        "name": "Kololo"
                },
                {
                        "id": "UG-04",
                        "name": "Kabuusu"
                }
        ]
},
    {
        "city_name": "Lusaka",
        "country": "Zambia",
        "country_code": "ZM",
        "flag": "🇿🇲",
        "region": "Africa",
        "population_millions": 2.7,
        "lat": -15.3875,
        "lng": 28.3228,
        "crime_index": 52.4,
        "safety_index": 47.6,
        "crime_rate_per_100k": 2960,
        "violent_crime_rate_per_100k": 550,
        "risk_tier": "Moderate",
        "emergency_number": "999",
        "police_agency": "Zambia Police Service",
        "is_live_db": False,
        "districts": [
                {
                        "id": "ZM-01",
                        "name": "Cairo Road / Central"
                },
                {
                        "id": "ZM-02",
                        "name": "Woodlands"
                },
                {
                        "id": "ZM-03",
                        "name": "Rhodes Park"
                },
                {
                        "id": "ZM-04",
                        "name": "Kabulonga"
                }
        ]
},
    {
        "city_name": "Harare",
        "country": "Zimbabwe",
        "country_code": "ZW",
        "flag": "🇿🇼",
        "region": "Africa",
        "population_millions": 1.55,
        "lat": -17.8252,
        "lng": 31.0335,
        "crime_index": 58.7,
        "safety_index": 41.3,
        "crime_rate_per_100k": 3290,
        "violent_crime_rate_per_100k": 740,
        "risk_tier": "Elevated",
        "emergency_number": "995",
        "police_agency": "Zimbabwe Republic Police (ZRP)",
        "is_live_db": False,
        "districts": [
                {
                        "id": "ZW-01",
                        "name": "Central Business District"
                },
                {
                        "id": "ZW-02",
                        "name": "Avondale"
                },
                {
                        "id": "ZW-03",
                        "name": "Borrowdale"
                },
                {
                        "id": "ZW-04",
                        "name": "Highfield"
                }
        ]
},
    {
        "city_name": "Suva",
        "country": "Fiji",
        "country_code": "FJ",
        "flag": "🇫🇯",
        "region": "Oceania",
        "population_millions": 0.09,
        "lat": -18.1416,
        "lng": 178.4419,
        "crime_index": 47.3,
        "safety_index": 52.7,
        "crime_rate_per_100k": 2520,
        "violent_crime_rate_per_100k": 430,
        "risk_tier": "Moderate",
        "emergency_number": "917",
        "police_agency": "Fiji Police Force",
        "is_live_db": False,
        "districts": [
                {
                        "id": "FJ-01",
                        "name": "Central Suva"
                },
                {
                        "id": "FJ-02",
                        "name": "Toorak"
                },
                {
                        "id": "FJ-03",
                        "name": "Samabula"
                },
                {
                        "id": "FJ-04",
                        "name": "Domain"
                }
        ]
},
    {
        "city_name": "Tarawa",
        "country": "Kiribati",
        "country_code": "KI",
        "flag": "🇰🇮",
        "region": "Oceania",
        "population_millions": 0.06,
        "lat": 1.3291,
        "lng": 172.9785,
        "crime_index": 31.0,
        "safety_index": 69.0,
        "crime_rate_per_100k": 1620,
        "violent_crime_rate_per_100k": 180,
        "risk_tier": "Low Risk",
        "emergency_number": "992",
        "police_agency": "Kiribati Police Service",
        "is_live_db": False,
        "districts": [
                {
                        "id": "KI-01",
                        "name": "Bairiki"
                },
                {
                        "id": "KI-02",
                        "name": "Betio"
                },
                {
                        "id": "KI-03",
                        "name": "Bikenibeu"
                },
                {
                        "id": "KI-04",
                        "name": "Bonriki"
                }
        ]
},
    {
        "city_name": "Majuro",
        "country": "Marshall Islands",
        "country_code": "MH",
        "flag": "🇲🇭",
        "region": "Oceania",
        "population_millions": 0.03,
        "lat": 7.1167,
        "lng": 171.3833,
        "crime_index": 28.5,
        "safety_index": 71.5,
        "crime_rate_per_100k": 1510,
        "violent_crime_rate_per_100k": 150,
        "risk_tier": "Low Risk",
        "emergency_number": "911",
        "police_agency": "Marshall Islands National Police",
        "is_live_db": False,
        "districts": [
                {
                        "id": "MH-01",
                        "name": "D-U-D Municipality"
                },
                {
                        "id": "MH-02",
                        "name": "Delap"
                },
                {
                        "id": "MH-03",
                        "name": "Uliga"
                },
                {
                        "id": "MH-04",
                        "name": "Darrit"
                }
        ]
},
    {
        "city_name": "Palikir",
        "country": "Micronesia",
        "country_code": "FM",
        "flag": "🇫🇲",
        "region": "Oceania",
        "population_millions": 0.01,
        "lat": 6.9172,
        "lng": 158.1588,
        "crime_index": 29.0,
        "safety_index": 71.0,
        "crime_rate_per_100k": 1550,
        "violent_crime_rate_per_100k": 160,
        "risk_tier": "Low Risk",
        "emergency_number": "911",
        "police_agency": "FSM National Police",
        "is_live_db": False,
        "districts": [
                {
                        "id": "FM-01",
                        "name": "Capitol Complex"
                },
                {
                        "id": "FM-02",
                        "name": "Kolonia Precinct"
                },
                {
                        "id": "FM-03",
                        "name": "Nett"
                },
                {
                        "id": "FM-04",
                        "name": "Sokehs"
                }
        ]
},
    {
        "city_name": "Yaren",
        "country": "Nauru",
        "country_code": "NR",
        "flag": "🇳🇷",
        "region": "Oceania",
        "population_millions": 0.01,
        "lat": -0.5477,
        "lng": 166.9209,
        "crime_index": 27.0,
        "safety_index": 73.0,
        "crime_rate_per_100k": 1470,
        "violent_crime_rate_per_100k": 140,
        "risk_tier": "Low Risk",
        "emergency_number": "110",
        "police_agency": "Nauru Police Force",
        "is_live_db": False,
        "districts": [
                {
                        "id": "NR-01",
                        "name": "Civic Centre"
                },
                {
                        "id": "NR-02",
                        "name": "Airport Sector"
                },
                {
                        "id": "NR-03",
                        "name": "Aiwo Precinct"
                },
                {
                        "id": "NR-04",
                        "name": "Boe"
                }
        ]
},
    {
        "city_name": "Ngerulmud",
        "country": "Palau",
        "country_code": "PW",
        "flag": "🇵🇼",
        "region": "Oceania",
        "population_millions": 0.001,
        "lat": 7.5004,
        "lng": 134.6242,
        "crime_index": 21.0,
        "safety_index": 79.0,
        "crime_rate_per_100k": 1210,
        "violent_crime_rate_per_100k": 85,
        "risk_tier": "Low Risk",
        "emergency_number": "911",
        "police_agency": "Bureau of Public Safety of Palau",
        "is_live_db": False,
        "districts": [
                {
                        "id": "PW-01",
                        "name": "Capitol Complex"
                },
                {
                        "id": "PW-02",
                        "name": "Koror Commercial"
                },
                {
                        "id": "PW-03",
                        "name": "Meyuns"
                },
                {
                        "id": "PW-04",
                        "name": "Malakal"
                }
        ]
},
    {
        "city_name": "Port Moresby",
        "country": "Papua New Guinea",
        "country_code": "PG",
        "flag": "🇵🇬",
        "region": "Oceania",
        "population_millions": 0.4,
        "lat": -9.4438,
        "lng": 147.1803,
        "crime_index": 79.5,
        "safety_index": 20.5,
        "crime_rate_per_100k": 4350,
        "violent_crime_rate_per_100k": 1320,
        "risk_tier": "Critical",
        "emergency_number": "112",
        "police_agency": "Royal Papua New Guinea Constabulary",
        "is_live_db": False,
        "districts": [
                {
                        "id": "PG-01",
                        "name": "Town / Downtown"
                },
                {
                        "id": "PG-02",
                        "name": "Boroko"
                },
                {
                        "id": "PG-03",
                        "name": "Waigani"
                },
                {
                        "id": "PG-04",
                        "name": "Gordons"
                }
        ]
},
    {
        "city_name": "Apia",
        "country": "Samoa",
        "country_code": "WS",
        "flag": "🇼🇸",
        "region": "Oceania",
        "population_millions": 0.04,
        "lat": -13.8333,
        "lng": -171.7667,
        "crime_index": 33.2,
        "safety_index": 66.8,
        "crime_rate_per_100k": 1750,
        "violent_crime_rate_per_100k": 220,
        "risk_tier": "Low Risk",
        "emergency_number": "995",
        "police_agency": "Samoa Police Service",
        "is_live_db": False,
        "districts": [
                {
                        "id": "WS-01",
                        "name": "Beach Road"
                },
                {
                        "id": "WS-02",
                        "name": "Mulinu'u"
                },
                {
                        "id": "WS-03",
                        "name": "Vaitele"
                },
                {
                        "id": "WS-04",
                        "name": "Moto'otua"
                }
        ]
},
    {
        "city_name": "Honiara",
        "country": "Solomon Islands",
        "country_code": "SB",
        "flag": "🇸🇧",
        "region": "Oceania",
        "population_millions": 0.08,
        "lat": -9.4456,
        "lng": 159.9729,
        "crime_index": 53.1,
        "safety_index": 46.9,
        "crime_rate_per_100k": 2980,
        "violent_crime_rate_per_100k": 560,
        "risk_tier": "Moderate",
        "emergency_number": "999",
        "police_agency": "Royal Solomon Islands Police Force",
        "is_live_db": False,
        "districts": [
                {
                        "id": "SB-01",
                        "name": "Point Cruz"
                },
                {
                        "id": "SB-02",
                        "name": "Kukum"
                },
                {
                        "id": "SB-03",
                        "name": "Rove"
                },
                {
                        "id": "SB-04",
                        "name": "White River"
                }
        ]
},
    {
        "city_name": "Nuku'alofa",
        "country": "Tonga",
        "country_code": "TO",
        "flag": "🇹🇴",
        "region": "Oceania",
        "population_millions": 0.02,
        "lat": -21.1393,
        "lng": -175.2018,
        "crime_index": 32.0,
        "safety_index": 68.0,
        "crime_rate_per_100k": 1690,
        "violent_crime_rate_per_100k": 200,
        "risk_tier": "Low Risk",
        "emergency_number": "922",
        "police_agency": "Tonga Police",
        "is_live_db": False,
        "districts": [
                {
                        "id": "TO-01",
                        "name": "Kolomotu'a"
                },
                {
                        "id": "TO-02",
                        "name": "Kolofo'ou"
                },
                {
                        "id": "TO-03",
                        "name": "Ma'ufanga"
                },
                {
                        "id": "TO-04",
                        "name": "Fasi"
                }
        ]
},
    {
        "city_name": "Funafuti",
        "country": "Tuvalu",
        "country_code": "TV",
        "flag": "🇹🇻",
        "region": "Oceania",
        "population_millions": 0.01,
        "lat": -8.5211,
        "lng": 179.1962,
        "crime_index": 18.0,
        "safety_index": 82.0,
        "crime_rate_per_100k": 1050,
        "violent_crime_rate_per_100k": 60,
        "risk_tier": "Low Risk",
        "emergency_number": "911",
        "police_agency": "Tuvalu Police Force",
        "is_live_db": False,
        "districts": [
                {
                        "id": "TV-01",
                        "name": "Vaiaku"
                },
                {
                        "id": "TV-02",
                        "name": "Fongafale"
                },
                {
                        "id": "TV-03",
                        "name": "Senala"
                },
                {
                        "id": "TV-04",
                        "name": "Alapi"
                }
        ]
},
    {
        "city_name": "Port Vila",
        "country": "Vanuatu",
        "country_code": "VU",
        "flag": "🇻🇺",
        "region": "Oceania",
        "population_millions": 0.05,
        "lat": -17.7333,
        "lng": 168.3273,
        "crime_index": 36.0,
        "safety_index": 64.0,
        "crime_rate_per_100k": 1920,
        "violent_crime_rate_per_100k": 260,
        "risk_tier": "Moderate",
        "emergency_number": "112",
        "police_agency": "Vanuatu Police Force",
        "is_live_db": False,
        "districts": [
                {
                        "id": "VU-01",
                        "name": "Downtown Port Vila"
                },
                {
                        "id": "VU-02",
                        "name": "Nambatu"
                },
                {
                        "id": "VU-03",
                        "name": "Anabrou"
                },
                {
                        "id": "VU-04",
                        "name": "Tassiriki"
                }
        ]
},
]
