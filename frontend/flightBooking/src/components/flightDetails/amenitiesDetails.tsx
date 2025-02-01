import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { Amenity } from "../PropsFlight";


interface AmenityGroup {
  type: string;
  amenities: Amenity[];
}

const AmenitiesDetails = ({ type, amenities }: AmenityGroup) => {
  return (
  
    <Box mb={2}>
      <Typography variant="overline" sx={{ fontWeight: "bold" }}>{type.toUpperCase()}</Typography>
      <List dense>
        {amenities.map((amenity, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={<Typography variant="body2">• {amenity.description}</Typography>}
              secondary={
                <Typography variant="caption">
                  {amenity.isChargeable ? "Chargeable" : "Not chargeable"}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AmenitiesDetails;
