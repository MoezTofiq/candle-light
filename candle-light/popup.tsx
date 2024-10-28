import GradientIcon from "@mui/icons-material/Gradient"
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew"
import { CssBaseline, Divider, Input, Slider } from "@mui/material"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import { MuiColorInput } from "mui-color-input"
import React from "react"

import { sendToContentScript } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import { COLOR, OPACITY } from "~shared/defaults"

const darkTheme = createTheme({
  palette: {
    mode: "dark"
  }
})

const storage = new Storage()

// TODO : check extension on firefox browser -> found bug : decreasing the tint and loading another tab reverts to the original color (fire fox mv3 only)
// TODO : add extension to firefox

// TOsDO : check extension on firefox for android browser

// TODO : add default confirmation through modal

// TODO : link about me page (need to create first)
// TODO : link other projects page (need to create first)
// TODO : link report a bug page (need to create first)
// TODO : link donation page (need to create first)
// TODO : link candle light homepage/ description page (need to create first)

// TODO : create / add icon for the extension
// TODO : updated read me for git repo
// TODO : updated read me for firefox installation

// TODO : add to the name : candleLight blue light filter
// TODO : add extension to edge (think about it, the account is blocked again)
// TODO : add extension to chrome
// TODO : add extension to opera
// TODO : add extension to safari (if people ask for it)

function IndexPopup() {
  const [value, setValue] = React.useState(0)
  const [color, setColor] = React.useState(COLOR)
  const [power, setPower] = React.useState(true)

  React.useEffect(() => {
    const initState = async () => {
      const color = await storage.get("color")
      const opacity = await storage.get("opacity")
      const power = await storage.get("power")
      console.log("init : ", `${color}, ${opacity}, ${power}`)
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
    await sendToContentScript({
      name: "setOpacity",
      body: { opacity: `${(newValue as number) / 100}` }
    })
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
    await sendToContentScript({
      name: "setOpacity",
      body: { opacity: `${number / 100}` }
    })
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
    await sendToContentScript({
      name: "setColor",
      body: { color: newValue }
    })
  }

  const handleDefault = async () => {
    setColor("orange")
    setValue(30)
    await sendToContentScript({
      name: "setDefault",
      body: { color: "orange", opacity: 0.3 }
    })
  }

  const handlePower = async () => {
    await sendToContentScript({
      name: "setPower",
      body: { power: !power, opacity: `${value / 100}` }
    })
    setPower(!power)
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Card>
        <CardContent>
          <Stack
            spacing={1}
            direction="column"
            useFlexGap
            sx={{
              flexWrap: "wrap",
              width: "370px",
              height: "auto",
              padding: 2
            }}>
            <CssBaseline />

            <Stack
              direction="row"
              spacing={3}
              width={"100%"}
              justifyContent={"space-between"}>
              <Box>
                <Button variant="text" fullWidth>
                  Candle Light
                </Button>
              </Box>
              <Box>
                <IconButton
                  onClick={handlePower}
                  sx={{ color: power ? color : "" }}>
                  <PowerSettingsNewIcon />
                </IconButton>
              </Box>
            </Stack>
            {/* <Box>
              <Button fullWidth variant="outlined">
                Donate
              </Button>
            </Box> */}
            <Divider />

            <Stack
              display={"flex"}
              justifyContent={"center"}
              alignContent={"center"}
              direction="column"
              spacing={3}>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignContent={"center"}
                flexDirection={"column"}>
                <Typography textAlign={"center"}>Tint Color</Typography>
                <MuiColorInput
                  isAlphaHidden
                  format="rgb"
                  value={color}
                  onChange={handleChange}
                />
              </Box>

              <Box>
                <Typography textAlign={"center"}>Tint opacity</Typography>
                <Stack direction="row" spacing={3}>
                  <GradientIcon sx={{ color: color }} />
                  <Slider
                    value={typeof value === "number" ? value : 0}
                    onChange={handleSliderChange}
                    step={5}
                    min={0}
                    max={100}
                    marks
                    aria-labelledby="input-slider"
                    sx={{ color: color }}
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
            </Stack>

            <Box>
              <Button variant="outlined" fullWidth onClick={handleDefault}>
                reset to default
              </Button>
            </Box>

            <Divider />

            {/* <Stack direction="row" spacing={3}>
              <Box>
                <Button variant="outlined">About me</Button>
              </Box>
              <Box>
                <Button variant="outlined">other projects</Button>
              </Box>
              <Box>
                <Button variant="outlined">report a bug</Button>
              </Box>
            </Stack> */}
          </Stack>
        </CardContent>
      </Card>
    </ThemeProvider>
  )
}

export default IndexPopup
