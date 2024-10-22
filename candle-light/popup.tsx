import GradientIcon from "@mui/icons-material/Gradient"
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew"
import { CssBaseline, Input, Slider } from "@mui/material"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Link from "@mui/material/Link"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { MuiColorInput } from "mui-color-input"
import React from "react"

import { Storage } from "@plasmohq/storage"

const storage = new Storage()

// TODO : add default confirmation
// TODO : link color to primary color for theme
// TODO : Link external link buttons

// TODO : add donation link
// TODO : check the error : Uncaught (in promise) Error: This request exceeds the MAX_WRITE_OPERATIONS_PER_MINUTE quota.

function IndexPopup() {
  const [value, setValue] = React.useState(0)
  const [color, setColor] = React.useState("#ffffff")
  const [power, setPower] = React.useState(true)

  React.useEffect(() => {
    const initState = async () => {
      const color = await storage.get("color")
      const opacity = await storage.get("opacity")
      const power = await storage.get("power")
      console.log("init : ", color, opacity, power)
      setPower(power === "true" || power ? true : false)
      setValue(Number(opacity) * 100)
      setColor(color)
    }
    initState()
  }, [])

  const handleSliderChange = async (
    event: Event,
    newValue: number | number[]
  ) => {
    setValue(newValue as number)
    await storage.set("opacity", `${(newValue as number) / 100}`)
  }

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let number: number = 0
    if (event.target.value === "") {
      number = 0
    } else {
      number = Number(event.target.value)
      number = number > 100 ? 100 : number
      number = number < 0 ? 0 : number
    }

    setValue(number)
    await storage.set("opacity", `${number / 100}`)
  }

  const handleBlur = () => {
    if (value < 0) {
      setValue(0)
    } else if (value > 1) {
      setValue(100)
    }
  }

  const handleChange = async (newValue) => {
    setColor(newValue)
    await storage.set("color", `${newValue}`)
  }

  const handleDefault = async () => {
    await storage.set("color", `orange`)
    await storage.set("opacity", `0.3`)
    setColor("orange")
    setValue(30)
  }

  const handlePower = async () => {
    await storage.set("power", !power)
    setPower(!power)
  }

  return (
    <Stack
      spacing={1}
      direction="column"
      useFlexGap
      sx={{ flexWrap: "wrap", width: "370px", height: "570px" }}>
      <CssBaseline />
      <Stack direction="row" spacing={3}>
        <Box>
          <Button>Donate</Button>
        </Box>
        <Box>
          <Button>logo</Button>
        </Box>
        <Box>
          <IconButton onClick={handlePower} sx={{ color: power ? color : "" }}>
            <PowerSettingsNewIcon />
          </IconButton>
        </Box>
      </Stack>

      <Box>
        <Typography>Tint Color</Typography>
        <MuiColorInput
          isAlphaHidden
          format="rgb"
          value={color}
          onChange={handleChange}
        />
      </Box>

      <Box>
        <Button fullWidth onClick={handleDefault}>
          reset to default
        </Button>
      </Box>

      <Box>
        <Typography>Tint opacity</Typography>
        <Stack direction="row" spacing={3}>
          <GradientIcon sx={{ color: color }} />
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
          <Button>report a bug</Button>
        </Box>
      </Stack>
    </Stack>
  )
}

export default IndexPopup
