import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
  AccordionIcon,
  Box,
  Stack,
  Text,
  Switch,
  FormLabel,
  Editable,
  EditableInput,
  EditablePreview,
  Spinner,
} from '@chakra-ui/core'
import { useState } from 'react'
import { calculateOneRepMax, getKgAndLbs, getRepsList, getRepsNumbers, getRpeList, getWeightNumbers, getWeightPercents } from '../utils'
import { useStore } from '../utils/store'
import { useAuth } from '../utils/useAuth'
import { Button, Select } from './lib'
import { v4 as uuid } from 'uuid'

const defaultPlates = { kg: [25, 20, 15, 10, 5, 2.5, 1.25, 0.5, 0.25], lbs: [45, 35, 25, 10, 5, 2.5] }

export function DrawerItemList() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <Accordion defaultIndex={[999]} allowToggle>
      <OneRepMaxSettings />
      <WarmupSettings />
      <PlatesSettings />
      <UnitsSettings />
      {/* <VariantsSettings /> */}
      {/* <WorkoutSettings /> */}
    </Accordion>
  )
}

function AcordionItemWrapper({ children, title }) {
  return (
    <AccordionItem borderColor="gray.900">
      <AccordionHeader px="2">
        <Box flex="1" textAlign="left" fontSize="2xl" fontWeight="bold" color="teal.300">
          {title}
        </Box>
        <AccordionIcon />
      </AccordionHeader>
      <AccordionPanel mt="3" p="2">
        {children}
      </AccordionPanel>
    </AccordionItem>
  )
}

function OneRepMaxSettings() {
  const { oneRepMaxProps, units, settingsRef } = useStore((store) => store)

  const addNewExercise = () => {
    const isDefaultNameAdded = oneRepMaxProps.some((item) => item.shortName === 'XX')
    const { weightKg, weightLbs } = getKgAndLbs(units, 200)
    if (isDefaultNameAdded) return window.alert('Name already exist')
    const newOneRepMaxProps = [...oneRepMaxProps, { id: uuid(), shortName: 'XX', rpe: 10, reps: 5, weightKg, weightLbs }]
    settingsRef.set({ oneRepMaxProps: newOneRepMaxProps }, { merge: true })
  }

  return (
    <AcordionItemWrapper title="One Rep Max">
      <Stack isInline fontWeight="bold" mb="2">
        <Box flex="0.6">
          <Text>NAME</Text>
        </Box>
        <Box flex="1">
          <Text textAlign="center">RPE</Text>
        </Box>
        <Box flex="1">
          <Text textAlign="center">REPS</Text>
        </Box>
        <Box flex="1">
          <Text textAlign="center">WEIGHT</Text>
        </Box>
        <Box flex="0.6">
          <Text textAlign="end">1RM</Text>
        </Box>
      </Stack>
      <Stack spacing="4" shouldWrapChildren>
        {oneRepMaxProps.map((props) => {
          return <OneRepMaxItem key={props.id} {...props} />
        })}
      </Stack>
      <Button mt="4" onClick={addNewExercise}>
        Add Exercise
      </Button>
    </AcordionItemWrapper>
  )
}

function OneRepMaxItem(props) {
  const { shortName, id, rpe, reps, weightKg, weightLbs } = props
  const { currentWorkoutProps, units, oneRepMaxProps: oneRepMaxPropsState, settingsRef } = useStore((store) => store)

  const weight = units === 'kg' ? weightKg : weightLbs
  const oneRMWeight = calculateOneRepMax({ weightKg, weightLbs, units, rpe, reps })

  const updateOneRepMaxProp = (prop, data) => {
    const oneRepMaxProps = [...oneRepMaxPropsState]
    oneRepMaxProps.find((element) => element.id == id)[prop] = +data
    settingsRef.set({ oneRepMaxProps }, { merge: true })
  }

  const updateWeightProp = (weight) => {
    const { weightKg, weightLbs } = getKgAndLbs(units, weight)
    const oneRepMaxProps = [...oneRepMaxPropsState]
    oneRepMaxProps.find((element) => element.id == id)['weightKg'] = weightKg
    oneRepMaxProps.find((element) => element.id == id)['weightLbs'] = weightLbs
    settingsRef.set({ oneRepMaxProps }, { merge: true })
  }

  const updateNameProp = (value) => {
    const nameExist = oneRepMaxPropsState.some((item) => item.shortName === value)
    if (nameExist) return window.alert('Name already exist')
    const oneRepMaxProps = [...oneRepMaxPropsState]
    const newCurrentWorkoutProps = [...currentWorkoutProps]
    oneRepMaxProps.find((element) => element.shortName == shortName)['shortName'] = value
    newCurrentWorkoutProps.find((element) => element.shortName == shortName)['shortName'] = value
    settingsRef.set({ oneRepMaxProps, currentWorkoutProps: newCurrentWorkoutProps }, { merge: true })
  }

  const removeExercise = () => {
    if (oneRepMaxPropsState.length === 1) return
    const oneRepMaxProps = oneRepMaxPropsState.filter((item) => item.shortName !== shortName)
    const newCurrentWorkoutProps = currentWorkoutProps.filter((item) => item.shortName !== shortName)
    settingsRef.set({ oneRepMaxProps, currentWorkoutProps: newCurrentWorkoutProps }, { merge: true })
  }

  return (
    <Stack key={id} isInline alignItems="center" spacing="1" fontWeight="bold" fontSize="lg">
      <Box flex="0.5">
        <Editable placeholder="XXX" defaultValue={shortName} onSubmit={updateNameProp}>
          <EditablePreview />
          <EditableInput height="8" />
        </Editable>
      </Box>
      <Box flex="0.9">
        <Select value={rpe} onChange={(e) => updateOneRepMaxProp('rpe', +e.target.value)}>
          {getRpeList().map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </Select>
      </Box>
      <Box flex="0.8">
        <Select value={reps} onChange={(e) => updateOneRepMaxProp('reps', +e.target.value)}>
          {getRepsList().map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </Select>
      </Box>
      <Box flex="1">
        <Select value={weight} onChange={(e) => updateWeightProp(+e.target.value)}>
          {getWeightNumbers(units).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </Select>
      </Box>
      <Box
        flex="0.5"
        onDoubleClick={() => {
          if (oneRepMaxPropsState.length === 1) return
          window.confirm('Are you sure you want to delete this exercise? All the data related to this exercise will be deleted.') && removeExercise()
        }}
      >
        <Text textAlign="end">{oneRMWeight}</Text>
      </Box>
    </Stack>
  )
}

function UnitsSettings() {
  const { settingsRef, units } = useStore((store) => store)
  const [isLoading, setLoading] = useState(false)

  const updateUnits = () => {
    setLoading(true)
    settingsRef.set({ units: units === 'kg' ? 'lbs' : 'kg' }, { merge: true }).then(() => setLoading(false))
  }

  return (
    <AcordionItemWrapper title="Units">
      <Stack isInline alignItems="center" height="10">
        <FormLabel htmlFor="units" textTransform="capitalize" width="10" fontWeight="bold">
          {units}
        </FormLabel>
        <Box>{isLoading ? <Spinner size="sm" /> : <Switch isChecked={units === 'kg'} size="lg" id="units" onChange={updateUnits} />}</Box>
      </Stack>
    </AcordionItemWrapper>
  )
}

function PlatesSettings() {
  const { plates, settingsRef } = useStore((store) => store)

  const updatePlates = (units: string, plate: number) => {
    const newPlates = plates[units].includes(plate) ? plates[units].filter((pl) => pl !== plate) : [...plates[units], plate]
    settingsRef.set({ plates: { ...plates, [units]: newPlates.sort((a, b) => b - a) } }, { merge: true })
  }

  return (
    <AcordionItemWrapper title="Available plates">
      <Stack spacing="4">
        <Box ml="1">
          <Text fontWeight="black">KG</Text>
        </Box>
        <Stack isInline flexWrap="wrap" spacing="0">
          {defaultPlates?.kg.map((plate) => (
            <Box key={plate}>
              <ButtonPlate onClick={() => updatePlates('kg', plate)} isActive={plates?.kg.includes(plate)}>
                {plate}
              </ButtonPlate>
            </Box>
          ))}
        </Stack>
        <Box>
          <Text fontWeight="black">LBS</Text>
        </Box>
        <Stack isInline flexWrap="wrap" spacing="0">
          {defaultPlates?.lbs.map((plate) => (
            <Box key={plate}>
              <ButtonPlate onClick={() => updatePlates('lbs', plate)} isActive={plates?.lbs.includes(plate)}>
                {plate}
              </ButtonPlate>
            </Box>
          ))}
        </Stack>
      </Stack>
    </AcordionItemWrapper>
  )
}

function WarmupSettings() {
  const { settingsRef, warmupSetsProps } = useStore((store) => store)

  const addWarmupSet = () => {
    settingsRef.set({ warmupSetsProps: [...warmupSetsProps, { id: uuid(), pct: 0.55, reps: 8 }] }, { merge: true })
  }

  return (
    <AcordionItemWrapper title="Warmup sets">
      <Stack>
        <Stack isInline fontWeight="bold">
          <Box flex="0.2">
            <Text>SET</Text>
          </Box>
          <Box flex="1">
            <Text textAlign="center">PERCENT</Text>
          </Box>
          <Box flex="1">
            <Text textAlign="center">REPS</Text>
          </Box>
          <Box flex="0.2" />
        </Stack>
        <Stack shouldWrapChildren>
          {warmupSetsProps.map((props, idx) => (
            <WarmupSetItem key={props.id} {...props} idx={idx} />
          ))}
        </Stack>

        <Box>
          <Button
            bg="gray.900"
            color="gray.100"
            size="lg"
            width="full"
            _hover={{
              bg: 'gray.700',
            }}
            onClick={addWarmupSet}
          >
            Add
          </Button>
        </Box>
      </Stack>
    </AcordionItemWrapper>
  )
}

function WarmupSetItem({ pct, reps, id, idx }) {
  const { settingsRef, warmupSetsProps: warmupSetsPropsState } = useStore((store) => store)

  const isRemoveDisabled = warmupSetsPropsState.length <= 3

  const updateSetProp = (prop, data) => {
    const warmupSetsProps = [...warmupSetsPropsState]
    warmupSetsProps.find((element) => element.id == id)[prop] = +data
    settingsRef.set({ warmupSetsProps }, { merge: true })
  }

  const removeWarmupSet = () => {
    if (isRemoveDisabled) return
    const updatedSetsProps = warmupSetsPropsState.filter((item) => item.id !== id)
    settingsRef.set({ warmupSetsProps: updatedSetsProps }, { merge: true })
  }

  return (
    <Stack key={id} isInline alignItems="center">
      <Box flex="0.2">
        <Text fontSize="lg">{idx + 1}.</Text>
      </Box>
      <Box flex="1">
        <Box>
          <Select size="lg" defaultValue={pct} onChange={(e) => updateSetProp('pct', +e.target.value)}>
            {getWeightPercents().map((num) => (
              <option key={num} value={num}>
                {Math.round(num * 100)}
              </option>
            ))}
          </Select>
        </Box>
      </Box>
      <Box flex="1">
        <Box>
          <Select size="lg" defaultValue={reps} onChange={(e) => updateSetProp('reps', +e.target.value)}>
            {getRepsNumbers().map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </Select>
        </Box>
      </Box>
      <Box flex="0.2">
        <Button isDisabled={isRemoveDisabled} onClick={removeWarmupSet} size="sm" p="1" fontSize="sm">
          x
        </Button>
      </Box>
    </Stack>
  )
}

function ButtonPlate({ onClick, isActive, children }) {
  return (
    <Button
      mr="3"
      mb="3"
      variant="ghost"
      onClick={onClick}
      bg={isActive ? 'teal.300' : 'gray.900'}
      color={isActive ? 'gray.900' : 'teal.300'}
      border={isActive ? 'none' : '5px solid'}
      borderColor="teal.300"
      width="16"
      height="16"
      size="lg"
      rounded="full"
      fontWeight="black"
      _hover={{
        color: isActive ? 'gray.900' : 'teal.300',
      }}
    >
      {children}
    </Button>
  )
}
