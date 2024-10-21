import GradientIcon from "@mui/icons-material/Gradient"
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew"
import { Input, Slider } from "@mui/material"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Link from "@mui/material/Link"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import React from "react"

function IndexPopup() {
  const [value, setValue] = React.useState(30)

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value === "" ? 0 : Number(event.target.value))
  }

  const handleBlur = () => {
    if (value < 0) {
      setValue(0)
    } else if (value > 1) {
      setValue(100)
    }
  }

  return (
    <Stack
      spacing={1}
      direction="column"
      useFlexGap
      sx={{ flexWrap: "wrap", width: "750px" }}>
      <Stack direction="row" spacing={3}>
        <Box>
          <Button>Donate</Button>
        </Box>
        <Box>
          <Button>logo</Button>
        </Box>
        <Box>
          <IconButton>
            <PowerSettingsNewIcon />
          </IconButton>
        </Box>
      </Stack>

      <Box> tint color choose</Box>

      <Box>
        <Typography>Tint opacity</Typography>
        <Stack direction="row" spacing={3}>
          <GradientIcon />
          <Slider
            value={typeof value === "number" ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
          <Input
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 10,
              min: 0,
              max: 100,
              type: "number",
              "aria-labelledby": "input-slider"
            }}
          />
        </Stack>
      </Box>

      <Stack direction="row" spacing={3}>
        <Box>
          <Button>About me</Button>
        </Box>
        <Box>
          <Button>other projects</Button>
        </Box>
        <Box>
          <Button>repot a bug</Button>
        </Box>
      </Stack>
    </Stack>
  )
}

export default IndexPopup
