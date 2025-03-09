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

import { COLOR, OPACITY } from "~shared/defaults"
import { log } from "~shared/helper"

const TimerSchedule = () => {
  const [timerEnabled, setTimerEnabled] = useState(false)
  const [timeRange, setTimeRange] = useState([18, 6])
  const [activeDays, setActiveDays] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ])

  const storage = new Storage()

  useEffect(() => {
    const initState = async () => {
      const storedTimer = await storage.get("timerEnabled")
      const storedTimeRange = await storage.get("timeRange")
      const storedDays = await storage.get("activeDays")

      setTimerEnabled(storedTimer === "true")
      setTimeRange(storedTimeRange ? JSON.parse(storedTimeRange) : [18, 6])
      setActiveDays(
        storedDays
          ? JSON.parse(storedDays)
          : [false, false, false, false, false, false, false]
      )
    }
    initState()
  }, [])

  const handleTimeRangeChange = async (event, newValue) => {
    setTimeRange(newValue)
  }

  const handleDayToggle = async (index) => {
    const updatedDays = [...activeDays]
    updatedDays[index] = !updatedDays[index]
    setActiveDays(updatedDays)
  }

  const handleTimerToggle = async () => {
    setTimerEnabled(!timerEnabled)
  }

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography>Schedule Filter Activation</Typography>
        <FormControlLabel
          control={
            <Checkbox checked={timerEnabled} onChange={handleTimerToggle} />
          }
          label="Enable Timer"
        />
      </Stack>

      {timerEnabled && (
        <>
          <Typography>Day Time For Filter (24 Hours)</Typography>
          <Slider
            value={timeRange}
            onChange={handleTimeRangeChange}
            valueLabelDisplay="auto"
            min={0}
            max={24}
            step={1}
          />
          <Typography>Days Schedule Is Active</Typography>
          <Stack direction="row" spacing={1} flexWrap={"wrap"}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={activeDays[index]}
                      onChange={() => handleDayToggle(index)}
                    />
                  }
                  label={day}
                />
              )
            )}
          </Stack>
        </>
      )}
    </>
  )
}

export default TimerSchedule
