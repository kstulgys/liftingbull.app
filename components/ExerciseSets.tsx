import { Stack, Box, Text, Accordion, AccordionItem, AccordionHeader, AccordionPanel, AccordionIcon } from '@chakra-ui/core'
import { calculateOneRepMax, getPlatesOnBar, getWorksetWeight } from '../utils'
import { useStore } from '../utils/store'

export function ExerciseSets({ exercise }) {
  const { oneRepMaxProps, units, plates } = useStore((store) => store)
  const currentPlates = units === 'kg' ? plates.kg : plates.lbs
  const oneRM = oneRepMaxProps.find((item) => item.shortName === exercise.shortName)
  const { weightKg, weightLbs } = oneRM
  const oneRMWeight = calculateOneRepMax({ weightKg, weightLbs, units, rpe: oneRM.rpe, reps: oneRM.reps })
  const barbellWeight = units === 'kg' ? 20 : 44

  return (
    <Accordion allowToggle defaultIndex={[999]} allowMultiple>
      <WarmupSets exercise={exercise} oneRM={oneRMWeight} currentPlates={currentPlates} barbellWeight={barbellWeight} />
      <WorkSets exercise={exercise} oneRM={oneRMWeight} currentPlates={currentPlates} barbellWeight={barbellWeight} />
    </Accordion>
  )
}

function WorkSets({ exercise, oneRM, currentPlates, barbellWeight }) {
  return (
    <AccordionItem fontWeight="bold" borderColor="gray.900">
      <AccordionHeader fontWeight="bold" px="2">
        <Box flex="1" textAlign="left">
          Work sets
        </Box>
        <AccordionIcon />
      </AccordionHeader>
      <AccordionPanel pb={4} fontSize="lg" p="2">
        <Stack>
          {exercise.sets.map(({ rpe, reps, id }, idx) => {
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
      </AccordionPanel>
    </AccordionItem>
  )
}

function WarmupSets({ exercise, oneRM, currentPlates, barbellWeight }) {
  const { warmupSetsProps } = useStore((store) => store)
  const workSet = exercise.sets[0]
  const weight = workSet && getWorksetWeight(workSet.rpe, workSet.reps, oneRM)

  return (
    <AccordionItem fontWeight="bold" _expanded={{ borderColor: 'gray.900' }} borderColor="gray.900">
      <AccordionHeader fontWeight="bold" px="2">
        <Box flex="1" textAlign="left">
          Warmup sets
        </Box>
        <AccordionIcon />
      </AccordionHeader>
      <AccordionPanel pb={4} fontSize="lg" p="2">
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
      </AccordionPanel>
    </AccordionItem>
  )
}
