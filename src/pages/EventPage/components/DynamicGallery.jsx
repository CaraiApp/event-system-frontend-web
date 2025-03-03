import React from "react";
import { Box, Grid, Typography, Modal, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";

const GalleryContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(2),
}));

const ImageWrapper = styled(Box)({
  position: "relative",
  cursor: "pointer",
  overflow: "hidden",
  borderRadius: "8px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  "&:hover img": {
    transform: "scale(1.1)",
    transition: "transform 0.3s ease",
  },
});

const Image = styled("img")({
  width: "100%",
  height: "auto",
  display: "block",
});

const ModalImage = styled("img")({
  maxWidth: "90%",
  maxHeight: "90%",
});

const DynamicGallery = ({ gallery = [] }) => {
  const [selectedImage, setSelectedImage] = React.useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <GalleryContainer>
      <Typography variant="h4" gutterBottom sx={{fontWeight: 'bold', marginTop: 4}}>
      Galería de eventos

      </Typography>
      {gallery.length === 0 ? (
        <Typography>No hay imágenes disponibles
.</Typography>
      ) : (
        <Grid container spacing={2}>
          {gallery.map((image, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <ImageWrapper onClick={() => handleImageClick(image)}>
                <Image
                  src={
                    typeof image === "string"
                      ? image
                      : image // Handles binary files
                  }
                  alt={`Gallery Image ${index + 1}`}
                />
              </ImageWrapper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal for Image Preview */}
      <Modal open={!!selectedImage} onClose={handleCloseModal}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            position: "relative",
          }}
        >
          <ModalImage
            src={
              typeof selectedImage === "string"
                ? selectedImage
                : selectedImage
            }
            alt="Selected Gallery Image"
          />
          <IconButton
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "white",
            }}
            onClick={handleCloseModal}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Modal>
    </GalleryContainer>
  );
};

export default DynamicGallery;
