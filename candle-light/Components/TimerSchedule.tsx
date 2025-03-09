import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { Checkbox, FormControlLabel, Slider, Switch } from "@mui/material"
import Accordion from "@mui/material/Accordion"
import AccordionActions from "@mui/material/AccordionActions"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import React, { useEffect, useState } from "react"

import { sendToContentScript } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import { log } from "~shared/helper"

const TimerSchedule = () => {
  const storage = new Storage()

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

  const [tempTimerEnabled, setTempTimerEnabled] = useState(false)
  const [tempTimeRange, setTempTimeRange] = useState([18, 6])
  const [tempActiveDays, setTempActiveDays] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ])

  useEffect(() => {
    const initState = async () => {
      const storedTimer = await storage.get("timerEnabled")
      const storedTimeRange = await storage.get("timeRange")
      const storedDays = await storage.get("activeDays")

      const parsedTimer = storedTimer === "true"
      const parsedTimeRange = storedTimeRange
        ? JSON.parse(storedTimeRange)
        : [18, 6]
      const parsedDays = storedDays
        ? JSON.parse(storedDays)
        : [false, false, false, false, false, false, false]

      setTimerEnabled(parsedTimer)
      setTimeRange(parsedTimeRange)
      setActiveDays(parsedDays)

      setTempTimerEnabled(parsedTimer)
      setTempTimeRange(parsedTimeRange)
      setTempActiveDays(parsedDays)
    }

    initState()
  }, [])

  const handleTimeRangeChange = (event, newValue) => {
    setTempTimeRange(newValue)
  }

  const handleDayToggle = (index) => {
    const updatedDays = [...tempActiveDays]
    updatedDays[index] = !updatedDays[index]
    setTempActiveDays(updatedDays)
  }

  const handleTimerToggle = () => {
    setTempTimerEnabled(!tempTimerEnabled)
  }

  const handleSave = async () => {
    setTimerEnabled(tempTimerEnabled)
    setTimeRange(tempTimeRange)
    setActiveDays(tempActiveDays)

    await storage.set("timerEnabled", tempTimerEnabled.toString())
    await storage.set("timeRange", JSON.stringify(tempTimeRange))
    await storage.set("activeDays", JSON.stringify(tempActiveDays))

    await sendToContentScript({
      name: "setSchedule",
      body: {
        timerEnabled: tempTimerEnabled,
        timeRange: tempTimeRange,
        activeDays: tempActiveDays
      }
    })
  }

  const handleCancel = () => {
    setTempTimerEnabled(timerEnabled)
    setTempTimeRange(timeRange)
    setTempActiveDays(activeDays)
  }

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header">
          <Typography component="span">Schedule Filter Activation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={1}
            mb={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={tempTimerEnabled}
                  onChange={handleTimerToggle}
                />
              }
              label="Enable Scheduler"
            />
          </Stack>

          {tempTimerEnabled && (
            <>
              <Typography>Day Time For Filter (24 Hours)</Typography>
              <Slider
                value={tempTimeRange}
                onChange={handleTimeRangeChange}
                valueLabelDisplay="auto"
                min={0}
                max={24}
                step={1}
              />
              <Typography>Days Schedule Is Active</Typography>
              <Stack
                direction="row"
                spacing={1}
                justifyContent={"center"}
                alignItems={"center"}
                flexWrap={"wrap"}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day, index) => (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          checked={tempActiveDays[index]}
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
          <Stack
            display={"flex"}
            justifyContent={"center"}
            alignContent={"center"}
            direction="row"
            spacing={2}
            mt={2}>
            {/* <Button variant="contained" color="primary" onClick={handleSave}> */}
            <Button variant="contained" color="primary">
              Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default TimerSchedule
