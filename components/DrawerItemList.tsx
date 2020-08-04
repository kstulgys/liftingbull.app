import {
  Button,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
  AccordionIcon,
  Box,
  Stack,
  Text,
  Select,
  Switch,
  FormLabel,
  useDisclosure,
  Input,
  Editable,
  EditableInput,
  EditablePreview,
} from '@chakra-ui/core'
import { useEffect, useState } from 'react'
import {
  calcOneRepMaxKg,
  calcOneRepMaxLbs,
  convertToKg,
  convertToLbs,
  getKgAndLbs,
  getRepsList,
  getRepsNumbers,
  getRpeList,
  getWeightNumbers,
  getWeightPercents,
} from '../utils'
import { db } from '../utils/firebase'
import { useStore } from '../utils/store'
import { useAuth } from '../utils/useAuth'

const defaultPlates = { kg: [25, 20, 15, 10, 5, 2.5, 1.25, 0.5, 0.25], lbs: [45, 35, 25, 10, 5, 2.5] }

export function DrawerItemList() {
  return (
    <Accordion defaultIndex={[999]} allowToggle>
      <OneRepMaxSettings />
      <VariantsSettings />
      <WorkoutSettings />
      <WarmupSettings />
      <UnitsSettings />
      <PlatesSettings />
    </Accordion>
  )
}

function OneRepMaxSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    if (!user) return
    return db.collection('settings').onSnapshot((snap) => {
      snap.forEach((doc) => {
        setSettings({ ...doc.data() })
      })
    })
  }, [user])

  if (!user) return null

  const addNewExercise = () => {
    const { weightKg, weightLbs } = getKgAndLbs(settings.units, 200)

    db.collection('settings')
      .doc(user.uid)
      .set(
        {
          oneRepMaxProps: [...settings.oneRepMaxProps, { id: settings.oneRepMaxProps.length + 1, shortName: 'XX', rpe: 10, reps: 5, weightKg, weightLbs }],
        },
        { merge: true }
      )
  }

  return (
    <AccordionItem borderColor="gray.900">
      <AccordionHeader>
        <Box flex="1" textAlign="left" fontSize="2xl" fontWeight="bold" color="teal.300">
          One Rep Max
        </Box>
        <AccordionIcon />
      </AccordionHeader>
      <AccordionPanel mt="3">
        <Stack isInline fontWeight="bold" mb="2" fontSize="sm">
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

        {settings?.oneRepMaxProps?.map(({ shortName, id, rpe, reps, weightKg, weightLbs }) => {
          const props = { shortName, id, rpe, reps, weightKg, weightLbs }
          return <OneRepMaxItem key={id} {...props} settings={settings} />
        })}

        <Button
          mt="4"
          width="full"
          onClick={addNewExercise}
          size="lg"
          rounded="full"
          fontSize="xl"
          border="4px solid"
          borderColor="cyan.300"
          fontWeight="bold"
          variant="ghost"
          color="cyan.300"
          _hover={{
            bg: 'cyan.300',
            color: 'gray.900',
          }}
        >
          Add Exercise
        </Button>
      </AccordionPanel>
    </AccordionItem>
  )
}

function OneRepMaxItem(props) {
  const { shortName, id, rpe, reps, weightKg, weightLbs, settings } = props
  const { user } = useAuth()

  const weight = settings.units === 'kg' ? weightKg : weightLbs
  const calculateOneRepMax = settings.units === 'kg' ? calcOneRepMaxKg : calcOneRepMaxLbs

  const updateOneRepMaxProp = (prop, data) => {
    const settingsRef = db.collection('settings').doc(user.uid)
    const oneRepMaxProps = [...settings.oneRepMaxProps]
    oneRepMaxProps.find((element) => element.id == id)[prop] = +data
    settingsRef.set({ oneRepMaxProps }, { merge: true })
  }

  const updateWeightProp = (weight) => {
    const { weightKg, weightLbs } = getKgAndLbs(settings.units, weight)
    const settingsRef = db.collection('settings').doc(user.uid)
    const oneRepMaxProps = [...settings.oneRepMaxProps]
    oneRepMaxProps.find((element) => element.id == id)['weightKg'] = weightKg
    oneRepMaxProps.find((element) => element.id == id)['weightLbs'] = weightLbs
    settingsRef.set({ oneRepMaxProps }, { merge: true })
  }

  const updateNameProp = (value) => {
    const settingsRef = db.collection('settings').doc(user.uid)
    const oneRepMaxProps = [...settings.oneRepMaxProps]
    oneRepMaxProps.find((element) => element.id == id)['shortName'] = value
    settingsRef.set({ oneRepMaxProps }, { merge: true })
  }
  const removeExercise = () => {
    const settingsRef = db.collection('settings').doc(user.uid)
    const oneRepMaxProps = settings.oneRepMaxProps.filter((item) => item.id !== id)
    settingsRef.set({ oneRepMaxProps }, { merge: true })
  }

  return (
    <Stack key={id} isInline alignItems="center" spacing="1" mt="1" fontWeight="bold">
      <Box flex="0.6">
        <Editable placeholder="XXX" defaultValue={shortName} onSubmit={updateNameProp}>
          <EditablePreview />
          <EditableInput height="8" />
        </Editable>
      </Box>
      <Box flex="1">
        <Select
          style={{
            textAlignLast: 'center',
          }}
          backgroundColor="gray.900"
          borderColor="gray.900"
          fontWeight="bold"
          _hover={{
            borderColor: 'gray.900',
          }}
          defaultValue={rpe}
          onChange={(e) => updateOneRepMaxProp('rpe', +e.target.value)}
        >
          {getRpeList().map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </Select>
      </Box>
      <Box flex="1">
        <Select
          style={{
            textAlignLast: 'center',
          }}
          backgroundColor="gray.900"
          borderColor="gray.900"
          fontWeight="bold"
          _hover={{
            borderColor: 'gray.900',
          }}
          defaultValue={reps}
          onChange={(e) => updateOneRepMaxProp('reps', +e.target.value)}
        >
          {getRepsList().map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </Select>
      </Box>
      <Box flex="1">
        <Select
          style={{
            textAlignLast: 'center',
          }}
          backgroundColor="gray.900"
          borderColor="gray.900"
          fontWeight="bold"
          _hover={{
            borderColor: 'gray.900',
          }}
          defaultValue={weight}
          onChange={(e) => updateWeightProp(+e.target.value)}
        >
          {getWeightNumbers().map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </Select>
      </Box>
      <Box
        flex="0.6"
        onDoubleClick={() => {
          if (window.confirm('Are you sure you want to delete this exercise?')) removeExercise()
        }}
      >
        <Text textAlign="end">{calculateOneRepMax(rpe, reps, weight)}</Text>
      </Box>
    </Stack>
  )
}

function UnitsSettings() {
  const { units } = useStore((store) => store)
  const { updateUnits } = useStore((store) => store.actions)

  return (
    <AccordionItem borderColor="gray.900">
      <AccordionHeader>
        <Box flex="1" textAlign="left" fontSize="2xl" fontWeight="bold">
          Units
        </Box>
        <AccordionIcon />
      </AccordionHeader>
      <AccordionPanel pb={4} mt="3">
        <Stack isInline align="center">
          <FormLabel htmlFor="units" textTransform="capitalize" width="10" fontWeight="bold">
            {units}
          </FormLabel>
          <Switch isChecked={units === 'kg'} size="lg" id="units" onChange={updateUnits} />
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  )
}

function WorkoutSettings() {
  return (
    <AccordionItem isDisabled borderColor="gray.900">
      <AccordionHeader>
        <Box flex="1" textAlign="left" fontSize="2xl" fontWeight="bold">
          Workout program
        </Box>
        <AccordionIcon />
      </AccordionHeader>
      <AccordionPanel pb={4}>
        <Text>Add your workout program</Text>
        <Text>Coming soon...</Text>
      </AccordionPanel>
    </AccordionItem>
  )
}

function VariantsSettings() {
  return (
    <AccordionItem isDisabled borderColor="gray.900">
      <AccordionHeader>
        <Box flex="1" textAlign="left" fontSize="2xl" fontWeight="bold">
          Variants
        </Box>
        <AccordionIcon />
      </AccordionHeader>
      <AccordionPanel pb={4}>
        <Text>Add other exercises (variants)</Text>
        <Text>Coming soon...</Text>
      </AccordionPanel>
    </AccordionItem>
  )
}

function PlatesSettings() {
  const { plates } = useStore((store) => store)
  const { updatePlates } = useStore((store) => store.actions)
  return (
    <AccordionItem borderColor="gray.900">
      <AccordionHeader>
        <Box flex="1" textAlign="left" fontSize="2xl" fontWeight="bold">
          Available plates
        </Box>
        <AccordionIcon />
      </AccordionHeader>
      <AccordionPanel mt="3">
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
      </AccordionPanel>
    </AccordionItem>
  )
}

function WarmupSettings() {
  const { warmupSetsProps } = useStore((store) => store)
  const { updateWarmupSet, addWarmupSet, removeWarmupSet } = useStore((store) => store.actions)

  return (
    <AccordionItem borderColor="gray.900">
      <AccordionHeader>
        <Box flex="1" textAlign="left" fontSize="2xl" fontWeight="bold">
          <Text>Warmup sets</Text>
        </Box>
        <AccordionIcon />
      </AccordionHeader>
      <AccordionPanel mt="3">
        <Stack>
          <Stack isInline fontWeight="bold" fontSize="sm">
            <Box flex="0.3">
              <Text>SET</Text>
            </Box>
            <Box flex="1">
              <Text textAlign="center">PERCENT</Text>
            </Box>
            <Box flex="1">
              <Text textAlign="center">REPS</Text>
            </Box>
            <Box flex="0.3" />
          </Stack>
          {warmupSetsProps?.map(({ percent, reps, id }, idx) => {
            return (
              <Stack key={id} isInline alignItems="center">
                <Box flex="0.2">
                  <Text fontSize="lg">{idx + 1}.</Text>
                </Box>
                <Box flex="1">
                  <Box>
                    <Select size="lg" defaultValue={percent} onChange={(e) => updateWarmupSet(id, 'percent', e.target.value)}>
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
                    <Select size="lg" defaultValue={reps} onChange={(e) => updateWarmupSet(id, 'reps', e.target.value)}>
                      {getRepsNumbers().map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </Select>
                  </Box>
                </Box>
                <Box flex="0.2">
                  <Button
                    size="lg"
                    width="full"
                    bg="gray.900"
                    color="gray.100"
                    _hover={{
                      bg: 'gray.700',
                    }}
                    onClick={() => removeWarmupSet(id)}
                  >
                    x
                  </Button>
                </Box>
              </Stack>
            )
          })}

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
      </AccordionPanel>
    </AccordionItem>
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
