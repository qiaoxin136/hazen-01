import { useEffect, useState, ChangeEvent, useCallback } from "react";
import type { Schema } from "../amplify/data/resource";
import { DeckGL } from "@deck.gl/react";
import { PickingInfo } from "@deck.gl/core";
//import { MVTLayer } from "@deck.gl/geo-layers";
import { GeoJsonLayer } from "@deck.gl/layers";
import { MapView } from "@aws-amplify/ui-react-geo";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";
import "./styles.css";
import "@aws-amplify/ui-react/styles.css";

import {
  ScrollView,
  //View,
  Flex,
  Button,
  //Divider,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Input,
  SelectField,
  ThemeProvider,
  Theme,
  Tabs,
} from "@aws-amplify/ui-react";

import { Marker } from "react-map-gl";

import axios, { AxiosResponse } from "axios";
import type { Feature, Geometry } from "geojson";

type BlockProperties = {
  person: string;
  description: string;
  date: string;
  report: string;
};

export type DataType = Feature<Geometry, BlockProperties>;

const client = generateClient<Schema>();

const theme: Theme = {
  name: "table-theme",
  tokens: {
    components: {
      table: {
        row: {
          hover: {
            backgroundColor: { value: "{colors.blue.20}" },
          },

          striped: {
            backgroundColor: { value: "{colors.orange.10}" },
          },
        },

        header: {
          color: { value: "{colors.blue.80}" },
          fontSize: { value: "{fontSizes.x3}" },
          borderColor: { value: "{colors.blue.20}" },
        },

        data: {
          fontWeight: { value: "{fontWeights.semibold}" },
        },
      },
    },
  },
};

const INITIAL_VIEW_STATE: any = {
  //longitude: 139.7674681227469,
  longitude: -96.20321,
  //latitude: 35.68111419325676,
  latitude: 37.00068,
  zoom: 4,
  bearing: 0,
  pitch: 0,
};

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { signOut } = useAuthenticator();
  const [viewport, setViewport] = useState(INITIAL_VIEW_STATE);
  const [name, setName] = useState("");
  const [customer, setCustomer] = useState("");
  const [lat, setLat] = useState(39.5);
  const [lng, setLng] = useState(-78.5);
  const [location, setLocation] = useState("");
  const [yearcompl, setYearcoml] = useState("");
  const [mile, setMile] = useState(0);
  const [ps, setPs] = useState(0);
  const [software, setSoftware] = useState("");
  const [recent, setRecent] = useState(true);
  const [data, setData] = useState<DataType>();
  const [tab, setTab] = useState("1");
  const layers: any = [];

  const getPlacesData = async () => {
    try {
      const url =
        "https://b7yekehed7.execute-api.us-east-1.amazonaws.com/test/getData";
      const response: AxiosResponse = await axios.get(url);
      //console.log(response.data);

      return response.data;

      return null;
    } catch (error) {
      console.log(error);
    }
  };

  function handleData() {
    getPlacesData().then((array) => {
      setData(array);
      console.log(data);
    });

    //console.log(data);
  }

  useEffect(() => {
    handleData();
  }, []);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    //const today = new Date();

    setRecent(true);

    //console.log(recent);

    client.models.Todo.create({
      name: name,
      customer: customer,
      location: location,
      yearcompl: yearcompl,
      software: software,
      mile: mile,
      ps: ps,
      lat: lat,
      lng: lng,
      recent: recent,
    });
    setName("");
    setCustomer("");
    setLocation("");
    setYearcoml("");
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  const handleName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleCustomer = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomer(e.target.value);
  };

  const handleLocation = (e: ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const handleYearcompl = (e: ChangeEvent<HTMLInputElement>) => {
    setYearcoml(e.target.value);
  };

  const handleLat = (e: ChangeEvent<HTMLInputElement>) => {
    setLat(parseFloat(e.target.value));
  };

  const handleLng = (e: ChangeEvent<HTMLInputElement>) => {
    setLng(parseFloat(e.target.value));
  };
  const handleMile = (e: ChangeEvent<HTMLInputElement>) => {
    setMile(parseFloat(e.target.value));
  };

  const handlePs = (e: ChangeEvent<HTMLInputElement>) => {
    setPs(Math.floor(parseFloat(e.target.value)));
  };

  const openInNewTab = (url: any) => {
    window.open(url, "_blank", "noreferrer");
  };
  const onClick = useCallback((info: PickingInfo) => {
    setLng(Object.values(info)[8][0]);
    setLat(Object.values(info)[8][1]);
  }, []);



  let layer25 = new GeoJsonLayer({
    id: "datasource",
    data: data,
    extruded: true,
    filled: true,
    getElevation: 30,
    getFillColor: (f: any) =>
      f.properties.software === "infoworksicm"
        ? [63, 255, 0, 255]
        : f.properties.software === "infoworkscs"
        ? [63, 255, 0, 255]
        : f.properties.software === "pcswmm"
        ? [220, 20, 60, 255]
        : f.properties.software === "mike"
        ? [255, 105, 180, 255]
        :f.properties.software === "infoswmm"
        ? [250, 160, 160, 255]
        :[222, 49, 99, 255],
    // getIconAngle: 0,
    // getIconColor: [0, 0, 0, 255],
    // getIconPixelOffset: [0, 0],
    // getIconSize: 1,
    getLineColor: [0, 0, 0, 255],
    getLineWidth: 1,
    getPointRadius: 5,
    // getText: (f: any) => f.properties.Id,
    getTextAlignmentBaseline: "center",
    getTextAnchor: "middle",

    getTextSize: 8,

    lineWidthMinPixels: 1,
    lineWidthScale: 1,
    lineWidthUnits: "meters",

    pointRadiusMinPixels: 2,
    pointRadiusScale: 1,
    pointRadiusUnits: "pixels",
    pointType: "circle+text",
    stroked: true,

    autoHighlight: true,

    pickable: true,
  });

  layers.push(layer25);

  return (
    <main>
      <h1>Hydraulic Modeling Group Software Tracking</h1>
      <br />
      <br />
      <br />
      <Flex>
        <Button onClick={signOut} width={120}>
          Sign out
        </Button>
        <Button onClick={createTodo} backgroundColor={"azure"} color={"red"}>
          + new
        </Button>
        <Button
          role="link"
          onClick={() =>
            openInNewTab(
              "https://showhazenproject.d3gxxduu8baji9.amplifyapp.com/"
            )
          }
        >
          Map
        </Button>
      </Flex>
      <br />

      <Flex direction={"column"}>
        <Flex direction={"row"} width={"70%"}>
          <Input
            type="text"
            value={name}
            placeholder="Project"
            onChange={handleName}
            size="small"
            width="50%"
          />
          <Input
            type="text"
            value={customer}
            placeholder="Customer"
            onChange={handleCustomer}
            size="small"
            width="50%"
          />
          <Input
            type="text"
            value={location}
            placeholder="Location"
            onChange={handleLocation}
            size="small"
            width="50%"
          />
          <Input
            type="date"
            value={yearcompl}
            placeholder="Completion"
            onChange={handleYearcompl}
            size="small"
            width="50%"
          />
          <SelectField
            label=""
            placeholder=""
            value={software}
            onChange={(e) => setSoftware(e.target.value)}
            width="80%"
          >
            <option value="infoworkscs">InfoWorks CS</option>
            <option value="infoworksicm">InfoWorks ICM</option>
            <option value="pcswmm">PCSWMM</option>
            <option value="mike">MIKE(Urban)</option>
            <option value="infoswmm">InfoSWMM</option>
            <option value="infosewer">InfoSewer</option>
            <option value="xpswmm">XPSWMM</option>
            <option value="sewergems">SewerGEMS</option>
            <option value="watergems">WaterGEMS</option>
            <option value="h2osewer">H2OMap Sewer</option>
            <option value="infowater">InfoWater</option>
            <option value="aquatwin">AquaTwin</option>
          </SelectField>
          <Input
            type="number"
            value={mile}
            placeholder="Mile"
            onChange={handleMile}
            size="small"
            width="20%"
          />
          <Input
            type="number"
            value={ps}
            placeholder="PS"
            onChange={handlePs}
            //size="small"
            width="20%"
          />
          <Input type="number" value={lat} onChange={handleLat} width="50%" />
          <Input type="number" value={lng} onChange={handleLng} width="50%" />
        </Flex>
        {/* <Divider orientation="horizontal" /> */}
        <Tabs
          value={tab}
          onValueChange={(tab) => setTab(tab)}
          style={{width:"70%"}}
          items={[
            {
              label: "Project Table",
              value: "1",
              content: (
                <>
                  <ScrollView
                    as="div"
                    ariaLabel="View example"
                    backgroundColor="var(--amplify-colors-white)"
                    borderRadius="6px"
                    border="1px solid var(--amplify-colors-black)"
                    boxShadow="3px 3px 5px 6px var(--amplify-colors-neutral-60)"
                    color="var(--amplify-colors-blue-60)"
                    // height="45rem"
                    // maxWidth="100%"
                    padding="1rem"
                    // width="100%"
                    // width="2400px"
                    // height={"2400px"}
                    // maxHeight={"2400px"}
                    // maxWidth="2400px"
                  >
                    <ThemeProvider theme={theme} colorMode="light">
                      <Table
                        caption=""
                        highlightOnHover={false}
                        variation="striped"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell as="th">Project</TableCell>
                            <TableCell as="th">Customer</TableCell>
                            <TableCell as="th">Location</TableCell>
                            <TableCell as="th">Completion</TableCell>
                            <TableCell as="th">Software</TableCell>
                            <TableCell as="th">Miles</TableCell>
                            <TableCell as="th">PS</TableCell>
                            <TableCell as="th">Latitude</TableCell>
                            <TableCell as="th">Longitude</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {todos.map((todo) => (
                            <TableRow
                              onClick={() => deleteTodo(todo.id)}
                              key={todo.yearcompl}
                            >
                              <TableCell>{todo.name}</TableCell>
                              <TableCell>{todo.customer}</TableCell>
                              <TableCell>{todo.location}</TableCell>
                              <TableCell>{todo.yearcompl}</TableCell>
                              <TableCell>{todo.software}</TableCell>
                              <TableCell>{todo.mile}</TableCell>
                              <TableCell>{todo.ps}</TableCell>
                              <TableCell>{todo.lat}</TableCell>
                              <TableCell>{todo.lng}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ThemeProvider>
                  </ScrollView>
                </>
              ),
            },
            {
              label: "Project Map",
              value: "2",
              content: (
                <>
                  <ScrollView
                    // as="div"
                    // ariaLabel="View example"
                    // backgroundColor="var(--amplify-colors-white)"
                    // borderRadius="6px"
                    // border="1px solid var(--amplify-colors-black)"
                    // boxShadow="3px 3px 5px 6px var(--amplify-colors-neutral-60)"
                    // color="var(--amplify-colors-blue-60)"
                    // // height="45rem"
                    // // maxWidth="100%"
                    // padding="1rem"
                  >
                    <DeckGL
                      initialViewState={INITIAL_VIEW_STATE}
                      controller
                      layers={layers}
                      onClick={onClick}
                      onViewStateChange={({ viewState }) =>
                        setViewport(viewState)
                      }
                      style={{
                        // height: "100%",
                        // width: "100%",
                        top: "35%",
                         left: "50px", 
                      }}
                    >
                      
                      <MapView
                        {...viewport}
                        initialViewState={INITIAL_VIEW_STATE}
                        style={{
                          // position: "absolute",
                          zIndex: -1,
                          // height: "100%",
                          // width: "100%",
                          // left: "30%", 
                        }}
                        attributionControl={false}
                        
                      >
                        <Marker latitude={lat} longitude={lng}></Marker>
                      </MapView>
                  
                    </DeckGL>
                  </ScrollView>
                </>
              ),
            },
          ]}
        />
      </Flex>
    </main>
  );
}

export default App;
