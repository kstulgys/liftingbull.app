import { Stack, Box, Text, Accordion, AccordionItem, AccordionHeader, AccordionPanel, AccordionIcon } from '@chakra-ui/core'
import { calculateOneRepMax, getPlatesOnBar, getWorksetWeight } from '../utils'
import { useStore } from '../utils/store'

export function ExerciseSets() {
  const { oneRepMaxProps, currentWorkoutProps, units, plates } = useStore((store) => store)
  const currentPlates = units === 'kg' ? plates.kg : plates.lbs
  const { weightKg, weightLbs, rpe: oneRMrpe, reps: oneRMreps } = oneRepMaxProps.find((item) => item.shortName === currentWorkoutProps.shortName)
  const oneRMWeight = calculateOneRepMax({ weightKg, weightLbs, units, rpe: oneRMrpe, reps: oneRMreps })
  const barbellWeight = units === 'kg' ? 20 : 44

  return (
    <Accordion allowToggle defaultIndex={[999]} allowMultiple>
      <WarmupSets oneRM={oneRMWeight} currentPlates={currentPlates} barbellWeight={barbellWeight} />
      <WorkSets oneRM={oneRMWeight} currentPlates={currentPlates} barbellWeight={barbellWeight} />
    </Accordion>
  )
}

function WorkSets({ oneRM, currentPlates, barbellWeight }) {
  const { currentWorkoutProps } = useStore((store) => store)

  return (
    <SetsWrapper title="Work sets">
      <Stack>
        {currentWorkoutProps.sets.map(({ rpe, reps, id }, idx) => {
          const worksetWeight = getWorksetWeight(rpe, reps, oneRM)

          return (
            <Stack key={id} isInline>
              <Box flex="0.15">
                <Text>{idx + 1}.</Text>
              </Box>
              <Box flex="0.3">
                <Text>{worksetWeight}</Text>
              </Box>
              <Box flex="1">
                <Text textAlign="center">{getPlatesOnBar(worksetWeight, barbellWeight, currentPlates)}</Text>
              </Box>
              <Box flex="0.15">
                <Text textAlign="right">{reps}</Text>
              </Box>
            </Stack>
          )
        })}
      </Stack>
    </SetsWrapper>
  )
}

function WarmupSets({ oneRM, currentPlates, barbellWeight }) {
  const { warmupSetsProps, currentWorkoutProps } = useStore((store) => store)
  const workSet = currentWorkoutProps.sets[0]
  const weight = workSet && getWorksetWeight(workSet.rpe, workSet.reps, oneRM)

  return (
    <SetsWrapper title="Warmup sets">
      <Stack>
        {weight &&
          warmupSetsProps?.map(({ pct, reps, id }, idx) => {
            const warmupWeight = Math.round(weight * pct)
            return (
              <Stack key={id} isInline>
                <Box flex="0.15">
                  <Text>{idx + 1}.</Text>
                </Box>
                <Box flex="0.6">
                  <Text>
                    {Math.round(pct * 100)}% ({warmupWeight})
                  </Text>
                </Box>
                <Box flex="1">
                  <Text textAlign="center">{getPlatesOnBar(warmupWeight, barbellWeight, currentPlates)}</Text>
                </Box>
                <Box flex="0.15">
                  <Text textAlign="right">{reps}</Text>
                </Box>
              </Stack>
            )
          })}
      </Stack>
    </SetsWrapper>
  )
}

function SetsWrapper({ title, children }) {
  return (
    <AccordionItem fontWeight="bold" borderColor="gray.900">
      <AccordionHeader fontWeight="bold" px="2">
        <Box flex="1" textTransform="uppercase">
          {title}
        </Box>
        <AccordionIcon />
      </AccordionHeader>
      <AccordionPanel pb={4} fontSize="lg" p="2">
        {children}
      </AccordionPanel>
    </AccordionItem>
  )
}
