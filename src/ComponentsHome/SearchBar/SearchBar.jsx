// import React, { useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { Box, TextField, Button, Typography, Autocomplete } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";

// const SearchBar = () => {
//   const nameRef = useRef("");
//   const areaRef = useRef("");
//   const maxGuestSizeRef = useRef(0);
//   const navigate = useNavigate();

//   const searchHandler = (e) => {
//     e.preventDefault();
//     const name = nameRef.current.value;
//     const area = areaRef.current.value;
//     const maxGuestSize = maxGuestSizeRef.current.value;

//     if (name === "" || area === "" || maxGuestSize === "") {
//       return alert("All fields are required!!");
//     }

//     navigate(
//       `/events/search?name=${name}&area=${area}&maxGuestSize=${maxGuestSize}`
//     );
//   };

//   // Example options for autocomplete (you can replace these with dynamic data)
//   const eventTypes = ["Wedding", "Birthday", "Corporate", "Conference"];
//   const areas = ["Downtown", "Suburb", "Beach", "Mountain"];

//   return (
//     <Box
//       sx={{
//         backgroundColor: "#2A2A35",
//         py: 4,
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//       }}
//     >
//       <Typography
//         variant="h6"
//         sx={{
//           color: "white",
//           mb: 3,
//           textAlign: "center",
//           fontWeight: "bold",
//           fontSize: "20px",
//         }}
//       >
//         Are You Looking For A Perfect Venue Near You To Organize Event? We Got You.
//       </Typography>

//       <Box
//         component="form"
//         onSubmit={searchHandler}
//         sx={{
//           display: "flex",
//           flexWrap: "wrap",
//           justifyContent: "center",
//           gap: 3,
//           width: "100%",
//           maxWidth: "900px",
//         }}
//       >
//         {/* Event Type Field */}
//         <Box sx={{ width: "100%", maxWidth: "250px" }}>
//           <Typography
//             sx={{ color: "#fff", mb: 1, fontSize: "14px", fontWeight: "bold" }}
//           >
//             Event Type
//           </Typography>
//           <Autocomplete
//             freeSolo
//             options={eventTypes}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 // label="Event Type"
//                 placeholder="Event Type"

//                 variant="outlined"
//                 inputRef={nameRef}
//                 sx={{
//                   backgroundColor: "#fff",
//                   borderRadius: 1,
//                 }}
//               />
//             )}
//           />
//         </Box>

//         {/* Area Field */}
//         <Box sx={{ width: "100%", maxWidth: "300px" }}>
//           <Typography
//             sx={{ color: "#fff", mb: 1, fontSize: "14px", fontWeight: "bold" }}
//           >
//             Area
//           </Typography>
//           <Autocomplete
//             freeSolo
//             options={areas}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 placeholder="Area"

//                 variant="outlined"
//                 inputRef={areaRef}
//                 sx={{
//                   backgroundColor: "#fff",
//                   borderRadius: 1,
//                 }}
//               />
//             )}
//           />
//         </Box>

//         {/* Max Guests Field */}
//         <Box sx={{ width: "100%", maxWidth: "300px" }}>
//           <Typography
//             sx={{ color: "#fff", mb: 1, fontSize: "14px", fontWeight: "bold" }}
//           >
//             Guest Size
//           </Typography>
//           <TextField
//             type="number"
//             // label="Max Guests"
//             placeholder="Guest Size"
//             variant="outlined"
//             inputRef={maxGuestSizeRef}
//             sx={{
//               backgroundColor: "#fff",
//               borderRadius: 1,
//               width: "100%",
//             }}
//           />
//         </Box>
        

//         {/* Search Button */}
//         <Button
//           type="submit"
//           variant="contained"
//           startIcon={<SearchIcon />}
//           sx={{
//             backgroundColor: "yellow",
//             color: "black",
//             fontWeight: 'bold',
//             flex: "1 1 100%",
//             maxWidth: "150px",
//             "&:hover": { backgroundColor: "yellow" },
//           }}
//         >
//           Search Event
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default SearchBar;
import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Typography, Autocomplete, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = () => {
  const navigate = useNavigate();

  // Navigate to the event page when the user clicks on the main Box
  const handleNavigate = () => {
    navigate("/events"); // Replace `/events` with your actual event page route
  };

  return (
    <Box
      sx={{
        backgroundColor: "#2A2A35",
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer", // Makes the Box clickable
      }}
      onClick={handleNavigate} // Triggers navigation on click
    >
      <Box
        component="div" // Changed from "form" to "div" since we're not handling a form submission
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 3,
          width: "100%",
          maxWidth: "900px",
          pointerEvents: "none", // Prevents interaction with inner elements
        }}
      >
        {/* Event Type Field */}
        <Box sx={{ width: "100%", maxWidth: "250px" }}>
          <Typography
            sx={{ color: "#fff", mb: 1, fontSize: "14px", fontWeight: "bold" }}
          >
            Tipo de evento

          </Typography>
          <Autocomplete
            freeSolo
            options={[]}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Tipo de evento"
                variant="outlined"
                value="Static Event Name" // Static value
                InputProps={{
                  ...params.InputProps,
                  readOnly: true, // Makes the field non-editable
                }}
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
            value="" // Static value
            InputProps={{
              readOnly: true, // Makes the field non-editable
            }}
            sx={{
              backgroundColor: "#fff",
              borderRadius: 1,
              width: "100%",
            }}
          />
        </Box>
      </Box>

      {/* Search Button */}
      <Button
        variant="contained"
        startIcon={<SearchIcon />}
        sx={{
          background: "linear-gradient(to right, #FFD700, #FF8C00)",
          color: "black",
          fontWeight: "bold",
          marginTop: 3,
          maxWidth: "150px",
          borderRadius: "50px",
          pointerEvents: "none", // Prevents interaction with the button
          "&:hover": { background: "linear-gradient(to right, #FF8C00, #FFD700)" },
        }}
      >
       Buscar evento

      </Button>
    </Box>
  );
};

export default SearchBar;
