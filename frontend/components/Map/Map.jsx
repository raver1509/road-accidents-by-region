import React, { useEffect, useRef } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import mapdata from '../../utils/mapdata';
import { geoCentroid } from 'd3-geo';
import { gsap } from 'gsap';

const Map = ({ onProvinceClick }) => {
  const mapRef = useRef();

  useEffect(() => {
    if (mapRef.current) {
      let ctx = gsap.context(() => {
        gsap.from('.theState', {
          duration: 0.6,
          stagger: 0.3,
          ease: 'back',
          y: 96,
          opacity: 0,
        });
        gsap.from('.theMarkers', {
          duration: 0.6,
          stagger: 0.3,
          opacity: 0,
        });
        let tl = gsap.timeline();
        tl.to('.theCountry', {
          delay: 5.4,
          fill: '#FF331F',
          duration: 0.8,
        });
        tl.to('.theCountry', {
          fill: 'white',
        });
        tl.to('.theCountry', {
          delay: 0.4,
          fill: '#FF331F',
          duration: 0.8,
        });
        tl.to('.theCountry', {
          fill: 'white',
        });
      }, mapRef);

      return () => ctx.revert();
    }
  }, [mapRef]);

  return (
    <ComposableMap
      projection='geoMercator'
      projectionConfig={{
        scale: 3500,
        center: [19, 52],
      }}
      fill='white'
      stroke='black'
      strokeWidth={3}
      ref={mapRef}
    >
      <Geographies geography={mapdata.data}>
        {({ geographies }) => (
          <>
            {geographies.map((geo) => {
              const stateName = geo.properties.VARNAME_1;
              return (
                <Geography
                  onClick={() => onProvinceClick(stateName)}
                  key={geo.rsmKey}
                  className='theState theCountry'
                  geography={geo}
                  style={{
                    hover: {
                      fill: '#FF331F',
                    },
                  }}
                />
              );
            })}

            {geographies.map((geo) => {
              const provinceCenter = geoCentroid(geo);
              let colorFill = 'black';
              let customPlacement = [15.77209, 53.65369];

              return (
                <Marker
                  key={geo.rsmKey}
                  coordinates={
                    geo.properties.VARNAME_1 === 'Zachodniopomorskie'
                      ? customPlacement
                      : provinceCenter
                  }
                  className='theMarkers'
                >
                  <text
                    style={{
                      fill: colorFill,
                      strokeWidth: 0,
                      fontSize: 10, // Adjust font size if needed
                    }}
                    textAnchor='middle'
                  >
                    {geo.properties.VARNAME_1}
                  </text>
                </Marker>
              );
            })}
          </>
        )}
      </Geographies>
    </ComposableMap>
  );
};

export default Map;
