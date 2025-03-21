import GradientIcon from "@mui/icons-material/Gradient"
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew"
import {
  Checkbox,
  CssBaseline,
  Divider,
  FormControlLabel,
  Input,
  Slider
} from "@mui/material"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import { MuiColorInput } from "mui-color-input"
import React, { useEffect, useState } from "react"

import { sendToContentScript } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import TimerSchedule from "~Components/TimerSchedule"
import { COLOR, OPACITY } from "~shared/defaults"
import { log } from "~shared/helper"

const darkTheme = createTheme({
  palette: {
    mode: "dark"
  }
})

const storage = new Storage()

// TODO : check extension on firefox for android browser

// TODO : add default confirmation through modal

// TODO : link about me page (need to create first)
// TODO : link other projects page (need to create first)
// TODO : link report a bug page (need to create first)
// TODO : link donation page (need to create first)
// TODO : link candle light homepage/ description page (need to create first)

// TODO : create / add icon for the extension
// TODO : updated read me for git repo

// TODO : add to the name : candleLight blue light filter
// TODO : add extension to edge
// TODO : add extension to opera
// TODO : add extension to chrome
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

      log("init : ", `${color}, ${opacity}, ${power}`)
      setPower(power === "true" || power ? true : false)
      setValue(Number(opacity) * 100)
      setColor(color)
    }
    initState()
  }, [])

  const sendNewValues = async (
    color: string,
    power: boolean,
    opacity: string | number
  ) => {
    await sendToContentScript({
      name: "setAll",
      body: { opacity: opacity, color: color, power: power }
    })
  }

  const handleSliderChange = async (
    event: Event,
    newValue: number | number[]
  ) => {
    setValue(newValue as number)
    sendNewValues(color, power, `${(newValue as number) / 100}`)
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
    sendNewValues(color, power, `${number / 100}`)
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
    sendNewValues(newValue, power, `${value / 100}`)
  }

  const handleDefault = async () => {
    setColor(COLOR)
    setValue(30)
    sendNewValues(COLOR, power, OPACITY)
  }

  const handlePower = async () => {
    sendNewValues(color, !power, `${value / 100}`)
    setPower(!power)
  }

  const handlePromotionClick = (value: string) => {
    switch (value) {
      case "feedback":
        console.log("feedback clicked", process.env.PLASMO_PUBLIC_FEEDBACK_LINK)
        chrome.tabs.create({
          url: process.env.PLASMO_PUBLIC_FEEDBACK_LINK
        })
        break
      case "tools":
        console.log("tools clicked", process.env.PLASMO_PUBLIC_DEV_LINK)
        chrome.tabs.create({
          url: process.env.PLASMO_PUBLIC_DEV_LINK
        })
        break

      default:
        console.error("handlePromotionClick -> switch case not handled")
        break
    }
  }

  const getComplementaryColor = (rgb) => {
    // Extract RGB values from "rgb(x, y, z)"
    const match = rgb.match(/\d+/g)
    if (!match) return "black" // Default if parsing fails

    let [r, g, b] = match.map(Number)

    // Invert the colors
    r = 255 - r
    g = 255 - g
    b = 255 - b

    return `rgb(${r}, ${g}, ${b})`
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
                  sx={{
                    backgroundColor: power ? "#333333" : "transparent", // Dark gray when active
                    color: power ? "#FFA500" : "inherit", // Orange when active
                    "&:hover": {
                      backgroundColor: power
                        ? "#444444"
                        : "rgba(255, 165, 0, 0.2)" // Slightly lighter on hover
                    },
                    borderRadius: "50%",
                    transition: "background-color 0.3s ease, color 0.3s ease"
                  }}>
                  <PowerSettingsNewIcon />
                </IconButton>
              </Box>
            </Stack>
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
                  <GradientIcon color="primary" />
                  <Slider
                    value={typeof value === "number" ? value : 0}
                    onChange={handleSliderChange}
                    step={5}
                    min={0}
                    max={100}
                    marks
                    aria-labelledby="input-slider"
                    sx={{
                      color: "#FFA500", // Orange track & thumb
                      "& .MuiSlider-thumb": {
                        backgroundColor: "#FFA500"
                      },
                      "& .MuiSlider-rail": {
                        backgroundColor: "#555555" // Gray rail for contrast
                      }
                    }}
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

            <Stack direction="row" spacing={3}>
              {/* <Box>
                <Button variant="outlined">About me</Button>
              </Box> */}
              <Box>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handlePromotionClick("feedback")}>
                  give feedback
                </Button>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handlePromotionClick("tools")}>
                  Other Tools
                </Button>
              </Box>
              {/* <Box>
                <Button variant="outlined">report a bug</Button>
              </Box> */}
            </Stack>
            <Divider />
            <TimerSchedule />
          </Stack>
        </CardContent>
      </Card>
    </ThemeProvider>
  )
}

export default IndexPopup
