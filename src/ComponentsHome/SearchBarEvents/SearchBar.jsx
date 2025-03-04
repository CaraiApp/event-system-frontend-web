import React, { useRef, useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Autocomplete } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ setEvents }) => {
  const [eventSuggestions, setEventSuggestions] = useState([]);

  const nameRef = useRef("");
  const areaRef = useRef("");

  // Fetch suggestions dynamically for event names
  const handleInputChange = async (value) => {
    if (!value) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/events/search/getEventBySearch?name=${value}`
      );
      const suggestions = response.data.data.map((event) => event.name);
      setEventSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching event suggestions:", error);
    }
  };

  // Handle search functionality
  const searchHandler = async (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const area = areaRef.current.value;

    // if (!name ) {
    //   return alert("Please fill in both fields to search!");
    // }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/events/search/getEventBySearch?name=${name}&area=${area}`
      );
      setEvents(response.data.data);
    } catch (error) {
      console.error("Error searching events:", error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#2A2A35",
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        component="form"
        onSubmit={searchHandler}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 3,
          width: "100%",
          maxWidth: "900px",
        }}
      >
        {/* Event Type Field */}
        <Box sx={{ width: "100%", maxWidth: "250px" }}>
          <Typography
            sx={{ color: "#fff", mb: 1, fontSize: "14px", fontWeight: "bold" }}
          >
           Evento

          </Typography>
          <Autocomplete
            freeSolo
            options={eventSuggestions}
            onInputChange={(e, value) => handleInputChange(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Nombre"
                variant="outlined"
                inputRef={nameRef}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 1,
                }}
              />
            )}
          />
        </Box>

        {/* Area Field */}
        <Box sx={{ width: "100%", maxWidth: "300px" }}>
          <Typography
            sx={{ color: "#fff", mb: 1, fontSize: "14px", fontWeight: "bold" }}
          >
            Lugar
          </Typography>
          <TextField
            placeholder="Lugar"
            variant="outlined"
            inputRef={areaRef}
            sx={{
              backgroundColor: "#fff",
              borderRadius: 1,
              width: "100%",
            }}
          />
        </Box>

{/* Search Button */}
<Button
  type="submit"
  variant="contained"
  startIcon={<SearchIcon />}
  sx={{
    background: "linear-gradient(to right, #FFD700, #FF8C00)",
    color: "black",
    fontWeight: "bold",
    marginTop: 3, // Ensures spacing between the fields and button
    maxWidth: "150px",
    borderRadius: "50px",
    "&:hover": { background: "linear-gradient(to right, #FF8C00, #FFD700)" },
  }}
>
Buscar evento

</Button>
</Box>
</Box>
  );
};

export default SearchBar;
