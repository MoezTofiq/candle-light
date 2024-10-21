import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"

function IndexPopup() {
  return (
    <Stack
      spacing={1}
      direction="column"
      useFlexGap
      sx={{ flexWrap: "wrap", width: "750px" }}>
      <Stack direction="row" spacing={3}>
        <Box>donate button</Box>
        <Box> logo button</Box>
        <Box>
          <IconButton>
            <PowerSettingsNewIcon />
          </IconButton>
        </Box>
      </Stack>

      <Stack direction="row" spacing={3}>
        <Box> tint color choose</Box>
        <Box> tint opacity</Box>
      </Stack>

      <Stack direction="row" spacing={3}>
        <Box>about me</Box>
        <Box>other projects</Box>
        <Box>report a bug</Box>
      </Stack>
    </Stack>
  )
}

export default IndexPopup
