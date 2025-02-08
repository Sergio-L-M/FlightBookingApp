import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { Amenity } from "../PropsFlight";

interface AmenityGroup {
  type: string;
  amenities: Amenity[];
}

const AmenitiesDetails = ({ type, amenities }: AmenityGroup) => {
  return (
    <Box mb={2} data-testid="amenities-box">
      <Typography variant="overline" sx={{ fontWeight: "bold" }} data-testid="amenities-type">
        {type.toUpperCase()}
      </Typography>
      <List dense data-testid="amenities-list">
        {amenities.map((amenity, index) => (
          <ListItem key={index} data-testid={`amenity-item-${index}`}>
            <ListItemText
              primary={
                <Typography variant="body2" data-testid={`amenity-desc-${index}`}>
                  • {amenity.description}
                </Typography>
              }
              secondary={
                <Typography variant="caption" data-testid={`amenity-charge-${index}`}>
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
