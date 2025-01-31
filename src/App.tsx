import { useEffect, useState, ChangeEvent } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";
import "./styles.css";

import {
  ScrollView,
  View,
  Flex,
  Heading,
  Button,
  Divider,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Input,
  SelectField,
  ThemeProvider,
  Theme,
} from "@aws-amplify/ui-react";

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

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { signOut } = useAuthenticator();
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

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    const today = new Date();
    //console.log(today.getFullYear());
    //console.log((new Date(yearcompl)).getFullYear());
    if (today.getFullYear() - new Date(yearcompl).getFullYear() < -6.01) {
      setRecent(true);
    } else {
      setRecent(false);
    }
    console.log(recent);

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

  return (
    <main>
      
      
      <Flex>
      <Heading width="50vw" level={5}>
        Hydraulic Modeling Group Sewer Software
      </Heading>
        <Button onClick={signOut} width={120}>
          Sign out
        </Button>
        <Button onClick={createTodo}>+ new</Button>
        <Button
          role="link"
          onClick={() => openInNewTab("https://plainenglish.io")}
        >
          Map
        </Button>
      </Flex>
      <Divider orientation="horizontal" />
      < br/>
      <Flex direction={"row"}>
        <Input
          type="text"
          value={name}
          placeholder="Project"
          onChange={handleName}
          size="small"
        />
        <Input
          type="text"
          value={customer}
          placeholder="Customer"
          onChange={handleCustomer}
          size="small"
        />
        <Input
          type="text"
          value={location}
          placeholder="Location"
          onChange={handleLocation}
          size="small"
        />
        <Input
          type="date"
          value={yearcompl}
          placeholder="Completion"
          onChange={handleYearcompl}
          size="small"
        />
        <SelectField
          label=""
          placeholder=""
          value={software}
          onChange={(e) => setSoftware(e.target.value)}
          width="150%"
        >
          <option value="infoworksicm">InfoWorks ICM</option>
          <option value="infoworkscs">InfoWorks CS</option>
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
          width="50%"
        />
        <Input
          type="number"
          value={ps}
          placeholder="PS"
          onChange={handlePs}
          size="small"
          width="50%"
        />
        <Input type="number" value={lat} onChange={handleLat} />
        <Input type="number" value={lng} onChange={handleLng} />
      </Flex>
      <View
        as="div"
        ariaLabel="View example"
        backgroundColor="var(--amplify-colors-white)"
        borderRadius="6px"
        border="1px solid var(--amplify-colors-black)"
        // boxShadow="3px 3px 5px 6px var(--amplify-colors-neutral-60)"
        color="var(--amplify-colors-blue-60)"
        height="45rem"
        // maxWidth="100%"
        padding="1rem"
        width="100%"
      >
        <ScrollView>
        <ThemeProvider theme={theme} colorMode="light">
          <Table caption="" highlightOnHover={true} variation="striped">
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
                <TableRow onClick={() => deleteTodo(todo.id)} key={todo.id}>
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
      </View>
    


    </main>
  );
}

export default App;
